import json
import random
import string

import boto3
from django.contrib.auth.models import Group, User
from django.contrib.gis.geos import Point
from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import Destination, UserProfile


# keys we should use to migrate users
class ProfileKeys:
    CAR = "hasVehicle"
    COMMUTE = "importanceAccessibility"
    DES = "destinations"
    EMAIL = "clientEmail"
    NAME = "headOfHousehold"
    RAIL = "useCommuterRail"
    ROOM = "rooms"
    SAFETY = "importanceViolentCrime"
    SCHOOL = "importanceSchools"
    VOUCHER = "voucherNumber"


class DestinationKeys:
    LOC = "location"
    PRIMARY = "primary"
    PURPOSE = "purpose"


class LocationKeys:
    POSITION = "position"


class PositionKeys:
    LON = "lon"
    LAT = "lat"


class Command(BaseCommand):
    help = "Migrate housing seeker data from S3"

    USER_GROUP = "HouseSeeker"
    S3_OBJ_TIMESTAMP_KEY = "LastModified"
    PROFILE_AWS_REGION = "_us-east-1"

    skipped_duped_user_key_s3 = list()
    skipped_duped_user_emails_key_s3 = list()
    skipped_user_record_key_s3 = list()
    skipped_user_profile_key_s3 = list()
    skipped_user_destination_key_s3 = list()
    skipped_some_user_destination_key_s3 = list()

    added_users = 0
    duped_user_emails = 0
    added_profiles = 0
    added_destinations = 0

    # if the email is duped, record the newer voucher number
    same_email_newer_voucher_keys = list()

    def add_arguments(self, parser):
        # Create a group of arguments explicitly labeled as required,
        # because by default named arguments are considered optional.
        group = parser.add_argument_group("required arguments")
        group.add_argument(
            "-b", "--bucket", required=True, help="S3 bucket to read housing seeker profile from"
        )
        group.add_argument(
            "-p",
            "--prefix",
            required=True,
            help="S3 prefix under the bucket that stores housing seeker profile",
        )
        group.add_argument(
            "-vkts",
            "--voucher_keys_to_skip",
            required=False,
            nargs="+",
            help="Space separated list of double-quoted " "voucher numbers.",
            default=list(),
        )

    def s3(self):
        return boto3.resource("s3")

    def client(self):
        return boto3.client("s3")

    def list_s3_object_keys(self, bucket, prefix):
        s3 = self.s3()
        s3_bucket = s3.Bucket(bucket)
        return s3_bucket.objects.filter(Prefix=prefix)

    def get_s3_object_metadata(self, bucket, key):
        client = self.client()
        return client.head_object(Bucket=bucket, Key=key)

    # User profile is a dupe if one of the following is true:
    # 1. the voucher is in the provided list to skip
    # 2. the voucher already exists in the DB
    # 3. the is a newer version of the voucher on S3
    def get_profile_keys_to_skip(self, bucket, keys, voucher_keys_to_skip):
        original_profiles = set()
        db_vouchers = UserProfile.objects.values_list("voucher_number", flat=True)
        db_voucher_keys = [f"public/{voucher}" for voucher in db_vouchers]
        duped_profile_keys = list(set(voucher_keys_to_skip + db_voucher_keys))

        for key in keys:
            if key in duped_profile_keys:
                self.stdout.write(f"Skipping {key} because it is a duplicate. \n")
                continue

            # if the region keywork is not in the key name
            # this profile should be an original one
            if self.PROFILE_AWS_REGION not in key:
                original_profiles.add(key)
                continue

            # if the stripped key is in the original profile name set
            # it means that this profile was added again at a later time
            # thus, need to see which one we should use
            original_key = key.split(self.PROFILE_AWS_REGION)[0]
            if original_key in original_profiles:
                original_key_metadata = self.get_s3_object_metadata(bucket, original_key)
                new_key_metadate = self.get_s3_object_metadata(bucket, key)
                # the newer s3 object should be used
                # the older one should be skipped
                if (
                    original_key_metadata[self.S3_OBJ_TIMESTAMP_KEY]
                    > new_key_metadate[self.S3_OBJ_TIMESTAMP_KEY]
                ):
                    duped_profile_keys.append(key)
                else:
                    duped_profile_keys.append(original_key)

        return duped_profile_keys

    def read_profile_dict_from_s3(self, bucket, key):
        profile_obj = self.s3().Object(bucket, key)
        profile_content = profile_obj.get()["Body"].read().decode("utf-8")
        return json.loads(profile_content)

    def create_random_string(self, length=10):
        chars = string.ascii_uppercase + string.digits
        return "".join(random.choice(chars) for _ in range(length))

    def is_key_val_nonempty(self, profile, field):
        if field not in profile:
            return False
        if isinstance(profile[field], (str, list)):
            return len(profile[field]) > 0
        if isinstance(profile[field], (int, float, bool)):
            return True
        return False

    def get_first_last_names(self, profile):
        # base case: `clientEmail` is the ultimate fallback
        first_name = profile[ProfileKeys.EMAIL]
        last_name = profile[ProfileKeys.EMAIL]

        # if `headOfHousehold` exists and not empty, use this name
        if self.is_key_val_nonempty(profile, ProfileKeys.NAME):
            names = profile[ProfileKeys.NAME].strip().split(" ")
            if len(names) == 1:
                # use the only word as the names
                first_name = profile[ProfileKeys.NAME]
                last_name = profile[ProfileKeys.NAME]
            else:
                # use the first word as first name; rest as last name
                first_name = names[0]
                last_name = "".join(names[1:])

        return first_name, last_name

    # Priority levels are consistent throughout all profile data
    # The range is from 1 to 4 with increasing importance
    def decode_priority(self, priority):
        if priority == 1 or priority == "1":
            return UserProfile.Priorities.NOT_IMPORTANT
        elif priority == 2 or priority == "2":
            return UserProfile.Priorities.SOMEWHAT_IMPORTANT
        elif priority == 3 or priority == "3":
            return UserProfile.Priorities.IMPORTANT
        else:
            return UserProfile.Priorities.VERY_IMPORTANT

    # Among user profiles with emails
    # no profile has both fields True
    def decode_travel_mode(self, use_commuter_rail, has_vehicle):
        if has_vehicle is True and use_commuter_rail is False:
            return UserProfile.TravelMode.CAR

        if has_vehicle is False and use_commuter_rail is True:
            return UserProfile.TravelMode.BUS_TRAIN_EXPRESS

        return UserProfile.TravelMode.BUS_TRAIN

    def save_user_record(self, bucket, key, profile):
        user = None
        has_email = self.is_key_val_nonempty(profile, ProfileKeys.EMAIL)

        # only email field is really used to migrate user records
        # headOfHousehold is used for names, but email is the final
        # fallback if headOfHousehold is empty
        if has_email:
            first_name, last_name = self.get_first_last_names(profile)
            last_modified_at = self.get_s3_object_metadata(bucket, key)[self.S3_OBJ_TIMESTAMP_KEY]
            password = self.create_random_string()
            email = profile[ProfileKeys.EMAIL]

            # if the email exists, but the user profile to be inserted is newer:
            # update and return the user record
            existing_user = None
            try:
                existing_user = User.objects.get(email=email)
            except User.DoesNotExist:
                existing_user = None
            if existing_user:
                self.stdout.write(f"Found existing user {email}.")
                if existing_user.date_joined < last_modified_at:
                    self.same_email_newer_voucher_keys.append(key)
                    self.stdout.write("User record to be inserted is newer, updating...\n")
                    existing_user.password = password
                    existing_user.first_name = first_name
                    existing_user.last_name = last_name
                    existing_user.date_joined = last_modified_at
                    existing_user.save()
                    user = User.objects.get(email=email)
                else:
                    self.stdout.write("User record to be inserted is older, no action needed...\n")
                    self.skipped_duped_user_emails_key_s3.append(
                        {"key": key, "reason": "EMAIL DUPED."}
                    )
                    self.duped_user_emails += 1
            else:
                user = User.objects.create_user(
                    password=password,
                    is_superuser=False,
                    username=email,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    is_staff=False,
                    is_active=True,
                    date_joined=last_modified_at,
                )
                group = Group.objects.get(name=self.USER_GROUP)
                user.groups.add(group)
                user.save()
                self.added_users += 1
        else:
            reason = "NO EMAIL"
            self.stdout.write(f"{reason}. Skipping user profile with key: {key}.\n")
            self.skipped_user_record_key_s3.append({"key": key, "reason": reason})

        return user

    # Only migrate user profile when all required fields are valid
    def save_user_profile(self, user, profile, key):
        user_profile = None
        reason = ""

        has_voucher = self.is_key_val_nonempty(profile, ProfileKeys.VOUCHER)
        has_rooms = self.is_key_val_nonempty(profile, ProfileKeys.ROOM)
        has_priorities = (
            self.is_key_val_nonempty(profile, ProfileKeys.COMMUTE)
            and self.is_key_val_nonempty(profile, ProfileKeys.SAFETY)
            and self.is_key_val_nonempty(profile, ProfileKeys.SCHOOL)
        )
        has_modes = self.is_key_val_nonempty(profile, ProfileKeys.CAR) and self.is_key_val_nonempty(
            profile, ProfileKeys.RAIL
        )

        if not has_voucher:
            reason += "NO VOUCHER; "
        if not has_rooms:
            reason += "NO ROOMS; "
        if not has_priorities:
            reason += "NO PRIORITIES; "
        if not has_modes:
            reason += "NO MODE; "

        if has_voucher and has_rooms and has_priorities and has_modes:
            voucher_number = profile[ProfileKeys.VOUCHER]
            voucher_bedrooms = profile[ProfileKeys.ROOM]
            travel_mode = self.decode_travel_mode(
                profile[ProfileKeys.RAIL], profile[ProfileKeys.CAR]
            )
            commute_priority = self.decode_priority(profile[ProfileKeys.COMMUTE])
            public_safety_priority = self.decode_priority(profile[ProfileKeys.SAFETY])
            school_quality_priority = self.decode_priority(profile[ProfileKeys.SCHOOL])

            if key in self.same_email_newer_voucher_keys:
                self.stdout.write("User profile to be inserted is newer, updating...\n")
                existing_profile = UserProfile.objects.get(user=user)
                existing_profile.full_name = f"{user.first_name} {user.last_name}"
                existing_profile.has_voucher = has_voucher
                existing_profile.voucher_bedrooms = voucher_bedrooms
                existing_profile.travel_mode = travel_mode
                existing_profile.commute_priority = commute_priority
                existing_profile.public_safety_priority = public_safety_priority
                existing_profile.school_quality_priority = school_quality_priority
                existing_profile.save()
                user_profile = UserProfile.objects.get(user=user)
            else:
                user_profile = UserProfile(
                    user=user,
                    full_name=f"{user.first_name} {user.last_name}",
                    has_voucher=has_voucher,
                    voucher_number=voucher_number,
                    voucher_bedrooms=voucher_bedrooms,
                    travel_mode=travel_mode,
                    commute_priority=commute_priority,
                    public_safety_priority=public_safety_priority,
                    school_quality_priority=school_quality_priority,
                )
                user_profile.save()
                self.added_profiles += 1
        else:
            self.skipped_user_profile_key_s3.append({"key": key, "reason": reason})
            self.stdout.write(f"{reason}. Skipping user profile with key: {key}.\n")

        return user_profile

    def has_location_fields(self, destination):
        reason = ""
        if DestinationKeys.LOC not in destination:
            reason += "NO LOCATION; "
            return False, reason
        loc = destination[DestinationKeys.LOC]
        if LocationKeys.POSITION not in loc:
            reason += "NO POSITION; "
            return False, reason
        pos = loc[LocationKeys.POSITION]
        if PositionKeys.LAT not in pos or PositionKeys.LON not in pos:
            reason += "NO FULL COORDINATE PAIR; "
            return False, reason

        return True, reason

    def decode_purpose(self, purpose):
        if purpose.lower() == "friends":
            return Destination.TripPurpose.FRIENDS
        if purpose.lower() == "work":
            return Destination.TripPurpose.WORK
        if purpose.lower() == "doctor":
            return Destination.TripPurpose.DOCTOR
        if purpose.lower() == "day care":
            return Destination.TripPurpose.DAYCARE
        if purpose.lower() == "family":
            return Destination.TripPurpose.FAMILY
        if purpose.lower() == "worship":
            return Destination.TripPurpose.WORSHIP

        return Destination.TripPurpose.OTHER

    def save_destination(self, user_profile, des):
        destination = None
        reason = ""

        has_location, has_loc_reason = self.has_location_fields(des)
        has_purpose = self.is_key_val_nonempty(des, DestinationKeys.PURPOSE)
        has_primary = self.is_key_val_nonempty(des, DestinationKeys.PRIMARY)

        if not has_location:
            reason += has_loc_reason
        if not has_purpose:
            reason += "NO PURPOSE; "
        if not has_primary:
            reason += "NO PRIMARY; "

        # when any of the required field is empty
        # don't attach the corresponding destination to user profile
        if has_location and has_purpose and has_primary:
            lat = des[DestinationKeys.LOC][LocationKeys.POSITION][PositionKeys.LAT]
            lon = des[DestinationKeys.LOC][LocationKeys.POSITION][PositionKeys.LON]
            purpose = self.decode_purpose(des[DestinationKeys.PURPOSE])

            destination = Destination(
                profile=user_profile,
                location=Point(x=lat, y=lon),
                purpose=purpose,
                primary_destination=des[DestinationKeys.PRIMARY],
            )
            destination.save()

        return destination, reason

    def save_user_profile_destinations(self, profile, user_profile, key):
        destinations = list()
        has_destinations = self.is_key_val_nonempty(profile, ProfileKeys.DES)
        # when destinations field is empty
        # don't attach any destination to user profile
        if not has_destinations:
            reason = "NO DESTINATION"
            self.skipped_user_destination_key_s3.append({"key": key, "reason": reason})
            self.stdout.write(f"{reason}. Skip adding destinations for: {key}.\n")
            return destinations

        if key in self.same_email_newer_voucher_keys:
            self.stdout.write(
                "User destinations to be inserted are newer, deleting previous ones...\n"
            )
            Destination.objects.filter(profile=user_profile).delete()

        for des in profile[ProfileKeys.DES]:
            destination, des_reason = self.save_destination(user_profile, des)

            if destination is not None:
                destinations.append(destination)
                self.added_destinations += 1
            else:
                self.skipped_some_user_destination_key_s3.append(
                    {"key": key, "reason": f"{des_reason} in {str(des)}"}
                )
                self.stdout.write(
                    f"{des_reason}. Skip adding one destination for: {key} in {str(des)}.\n"
                )

        return destinations

    def create_user_related_records(self, profile_dict, bucket, key):
        with transaction.atomic():
            user = self.save_user_record(bucket, key, profile_dict)
            if user is None:
                return None

            profile = self.save_user_profile(user, profile_dict, key)
            if profile is None:
                return None

            destinations = self.save_user_profile_destinations(profile_dict, profile, key)
            if len(destinations) == 0:
                return None

    def handle(self, *args, **options):
        bucket = options["bucket"]
        prefix = options["prefix"]
        vouchers_to_skip = options["voucher_keys_to_skip"]
        filtered_vouchers_to_skip = [v for v in vouchers_to_skip if len(v) != 0]

        profile_keys = [summary.key for summary in self.list_s3_object_keys(bucket, prefix)]
        profile_keys_to_skip = self.get_profile_keys_to_skip(
            bucket, profile_keys, filtered_vouchers_to_skip
        )

        for key in profile_keys:
            if key not in profile_keys_to_skip:
                profile_dict = self.read_profile_dict_from_s3(bucket, key)
                self.create_user_related_records(profile_dict, bucket, key)
            else:
                reason = "DUPLICATED PROFILE"
                self.skipped_duped_user_key_s3.append({"key": key, "reason": reason})
                self.stdout.write(f"{reason}. Skipping user with key: {key}.\n")

        self.stdout.write(
            f"""
        ---------------------------------------------
        Summary:
        - User records added: {self.added_users}
        - User email duplicated (not added): {self.duped_user_emails}
        - User profiles added: {self.added_profiles}
        - User destinations added: {self.added_destinations}

        The following profiles were skipped due to difference reasons
        - Skipped inserting user records, reason: DUPLICATES.
        {self.skipped_duped_user_key_s3}

        - Skipped inserting user records, reason: EMAIL EXISTED.
        {self.skipped_duped_user_emails_key_s3}

        - Skipped inserting user records, reason: NO EMAIL
        {self.skipped_user_record_key_s3}

        - Skipped inserting user profiles, reason: INVALID PROFILE FIELDS
        {self.skipped_user_profile_key_s3}

        - Skipped inserting ANY user profile destination, reason: EMPTY DESTINATIONS FIELD
        {self.skipped_user_destination_key_s3}

        - Skipped inserting SOME user profile destinations, reason: INVALID DESTINATION FIELDS
        {self.skipped_some_user_destination_key_s3}
        ---------------------------------------------
        """
        )
