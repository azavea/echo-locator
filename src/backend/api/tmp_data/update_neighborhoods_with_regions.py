# Script created with Gemini 10-10-25
import csv

from api.models import Neighborhood
from django.db import transaction

CSV_FILE_PATH = "./api/tmp_data/old-data-town-to-regions.csv"


def update():
    """Reads a CSV and updates Neighborhood instances based on the 'town' field."""

    # Use transaction.atomic to ensure the entire operation is treated as one unit.
    # If any update fails, all previous updates in this script will be rolled back.
    with transaction.atomic():
        try:
            with open(CSV_FILE_PATH, "r") as csvfile:
                # Use DictReader for easy column name access
                reader = csv.DictReader(csvfile)

                update_count = 0

                for row in reader:
                    town_name = row["town"]
                    region = row["region"]

                    # 1. Use filter() to find all instances matching the town_name.
                    # This handles the non-unique nature of the 'town' field.
                    # 2. Use update() to perform a single, efficient database query
                    # that sets the region value for ALL matching records.
                    count = Neighborhood.objects.filter(town=town_name).update(region=region)

                    update_count += count

                    if count > 0:
                        print(
                            f"Updated {count} instances for town: {town_name} with value: {region}"
                        )

                print(f"✅ All updates complete. Total instances updated: {update_count}")

        except FileNotFoundError:
            print(f"❌ Error: CSV file not found at {CSV_FILE_PATH}")
            # The transaction will automatically be rolled back on error
            raise  # Re-raise the exception to stop the process
        except KeyError as e:
            print(
                f"❌ Error: Missing required column in CSV: {e}. Check your CSV headers ('town', 'region')."
            )
            raise
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}")
            raise


# Call the function to run the logic
# update_model_instances_by_town()
