// @flow
import { useTranslation, withTranslation } from "react-i18next";
import Icon from "@conveyal/woonerf/components/icon";
import uniq from "lodash/uniq";
import { PureComponent } from "react";

import type { AccountProfile, ActiveListingDetail, NeighborhoodImageMetadata } from "../types";
import getCraigslistSearchLink from "../utils/craigslist-search-link";
import getGoogleDirectionsLink from "../utils/google-directions-link";
import getGoogleSearchLink from "../utils/google-search-link";
import getGoSection8SearchLink from "../utils/gosection8-search-link";
import getHotpadsSearchLink from "../utils/hotpads-search-link";
import getNeighborhoodImage from "../utils/neighborhood-images";
import getZillowSearchLink from "../utils/zillow-search-link";
import PolygonIcon from "../icons/polygon-icon";

import NeighborhoodListInfo from "./neighborhood-list-info";
import RouteSegments from "./route-segments";

type Props = {
  estMaxRent: Number,
  handleAuthChange: any,
  listing: ActiveListingDetail,
  neighborhood: any,
  setFavorite: any,
  userProfile: AccountProfile,
};
class NeighborhoodDetails extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      isFavorite:
        props.userProfile && props.neighborhood && props.userProfile.favorites
          ? props.userProfile.favorites.indexOf(props.neighborhood.properties.id) !== -1
          : false,
    };

    this.neighborhoodTrip = this.neighborhoodTrip.bind(this);
    this.neighborhoodStats = this.neighborhoodStats.bind(this);
    this.neighborhoodImage = this.neighborhoodImage.bind(this);
    this.neighborhoodImages = this.neighborhoodImages.bind(this);
    this.neighborhoodLinks = this.neighborhoodLinks.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userProfile && nextProps.neighborhood && nextProps.userProfile.favorites) {
      const isFavorite =
        nextProps.userProfile.favorites.indexOf(nextProps.neighborhood.properties.id) !== -1;
      this.setState({ isFavorite });
    }
  }

  neighborhoodTrip(props) {
    const { hasVehicle, listing, neighborhood, origin, userProfile, t } = props;
    // Look up the currently selected user profile destination from the origin
    const originLabel = origin ? origin.label || "" : "";
    const currentDestination = userProfile.destinations.find((d) =>
      originLabel.endsWith(d.location.label)
    );
    const bestJourney = listing
      ? listing.segments && listing.segments.length
        ? listing.segments[0]
        : null
      : neighborhood.segments && neighborhood.segments.length
      ? neighborhood.segments[0]
      : null;
    const tripTime = listing ? listing.time : neighborhood.time;

    // lat,lon strings for Google Directions link from neighborhood to current destination
    const destinationCoordinateString = origin.position.lat + "," + origin.position.lon;
    const originCoordinateString = listing
      ? listing.lat + "," + listing.lon
      : neighborhood.geometry.coordinates[1] + "," + neighborhood.geometry.coordinates[0];

    return (
      <div className="neighborhood-details__trip">
        {bestJourney && (
          <span className="neighborhood-details__route">
            <strong>{t("NeighborhoodDetails.TravelTime")}: </strong>
            {tripTime} {t("Units.Mins")}
            <br />
            <strong>{t("NeighborhoodDetails.FromOrigin")}: </strong>
            {currentDestination && t("TripPurpose." + currentDestination.purpose).toLowerCase()}
            <br />
            <strong>{t("NeighborhoodDetails.ModeSummary")}: </strong>
            <ModesList segments={bestJourney} />
          </span>
        )}
        {!bestJourney && !hasVehicle && (
          <span className="neighborhood-details__route">{t("Systems.TripsEmpty")}</span>
        )}
        <a
          className="neighborhood-details__directions"
          href={getGoogleDirectionsLink(
            originCoordinateString,
            destinationCoordinateString,
            hasVehicle
          )}
          target="_blank"
          rel="noreferrer"
        >
          {t("NeighborhoodDetails.DirectionsLink")}
        </a>
      </div>
    );
  }

  neighborhoodStats(props) {
    const { userProfile, estMaxRent } = props;
    const { t, i18n } = useTranslation();
    const rooms = userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms;
    const maxSubsidy = estMaxRent || "–––";

    return (
      <div className="neighborhood-details__rent">
        <div>
          <div className="neighborhood-details__rent-label">{t("NeighborhoodDetails.MaxRent")}</div>
          <div className="neighborhood-details__rent-rooms">
            {rooms}
            {t("NeighborhoodDetails.BedroomAbbr")}
          </div>
        </div>
        <div className="neighborhood-details__rent-value">
          ${maxSubsidy.toLocaleString(i18n.language)}
        </div>
      </div>
    );
  }

  neighborhoodImage(props) {
    const image: NeighborhoodImageMetadata = getNeighborhoodImage(props.nprops, props.imageField);
    if (!image) {
      return null;
    }

    return (
      <a
        className="neighborhood-details__image"
        target="_blank"
        title={image.attribution}
        href={image.imageLink}
        rel="noreferrer"
      >
        <img alt={image.description} src={image.thumbnail} />
      </a>
    );
  }

  neighborhoodImages(props) {
    const nprops = props.neighborhood.properties;
    const NeighborhoodImage = this.neighborhoodImage;

    // Use street picture if any of the other three images are missing
    const showStreet =
      !nprops.open_space_or_landmark_thumbnail ||
      !nprops.school_thumbnail ||
      !nprops.town_square_thumbnail;

    return (
      <div className="neighborhood-details__images">
        {nprops.open_space_or_landmark_thumbnail && (
          <NeighborhoodImage imageField="open_space_or_landmark" nprops={nprops} />
        )}
        {nprops.school_thumbnail && <NeighborhoodImage imageField="school" nprops={nprops} />}
        {nprops.town_square_thumbnail && (
          <NeighborhoodImage imageField="town_square" nprops={nprops} />
        )}
        {showStreet && nprops.street_thumbnail && (
          <NeighborhoodImage imageField="street" nprops={nprops} />
        )}
      </div>
    );
  }

  /* eslint-disable complexity */
  neighborhoodLinks(props) {
    const { neighborhood, userProfile, estMaxRent } = props;
    const { t, i18n } = useTranslation();
    const rooms = userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms;

    return (
      <>
        <h6 className="neighborhood-details__link-heading">
          {t("NeighborhoodDetails.MainSearchToolsSearch")}: {rooms}{" "}
          {t("NeighborhoodDetails.BedroomAbbr")} ($
          {userProfile.hasVoucher
            ? estMaxRent.toLocaleString(i18n.language)
            : userProfile.nonVoucherBudget
            ? userProfile.nonVoucherBudget.toLocaleString(i18n.language)
            : estMaxRent.toLocaleString(i18n.language)}{" "}
          {t("NeighborhoodDetails.MaxRentSearch")})
        </h6>
        <div className="neighborhood-details__links">
          <a
            className="neighborhood-details__link"
            href={getZillowSearchLink(
              neighborhood.properties.id,
              userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms,
              userProfile.hasVoucher ? estMaxRent : userProfile.nonVoucherBudget
            )}
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.ZillowSearchLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href={getCraigslistSearchLink(
              neighborhood.properties.id,
              userProfile.hasVoucher
                ? userProfile.voucherRooms
                : userProfile.nonVoucherRooms
                ? userProfile.nonVoucherRooms
                : 0,
              userProfile.hasVoucher ? estMaxRent : userProfile.nonVoucherBudget
            )}
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.CraigslistSearchLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href={getHotpadsSearchLink(
              neighborhood.properties.id,
              userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms,
              userProfile.hasVoucher ? estMaxRent : userProfile.nonVoucherBudget
            )}
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.HotpadsSearchLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href={getGoSection8SearchLink(
              neighborhood.properties.id,
              userProfile.hasVoucher ? userProfile.voucherRooms : userProfile.nonVoucherRooms,
              userProfile.hasVoucher
                ? estMaxRent
                : userProfile.nonVoucherBudget
                ? userProfile.nonVoucherBudget
                : estMaxRent
            )}
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.GoSection8SearchLink")}
          </a>
        </div>
        <h6 className="neighborhood-details__link-heading">
          {t("NeighborhoodDetails.MoreSearchToolsLinksHeading")}
        </h6>
        <div className="neighborhood-details__links">
          <a
            className="neighborhood-details__link"
            href="https://www.metrohousingboston.org/apartment-listings/"
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.MetroHousingLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href="https://www.bostonhousing.org/en/Apartment-Listing.aspx?btype=8,7,6,5,4,3,2,1"
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.BHAApartmentsLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href="https://www.apartments.com/"
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.ApartmentsDotComLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href="https://eeclead.force.com/EEC_ChildCareSearch"
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.ChildCareSearchLink")}
          </a>
          <a
            className="neighborhood-details__link"
            href="http://bha.cvrapps.com/"
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.RentEstimatorLink")}
          </a>
        </div>
        <h6 className="neighborhood-details__link-heading">
          {t("NeighborhoodDetails.AboutNeighborhoodLinksHeading")}
        </h6>
        <div className="neighborhood-details__links">
          {neighborhood.properties.town_link && (
            <a
              className="neighborhood-details__link"
              href={neighborhood.properties.town_link}
              target="_blank"
              rel="noreferrer"
            >
              {t("NeighborhoodDetails.WebsiteLink")}
            </a>
          )}
          {neighborhood.properties.wikipedia_link && (
            <a
              className="neighborhood-details__link"
              href={neighborhood.properties.wikipedia_link}
              target="_blank"
              rel="noreferrer"
            >
              {t("NeighborhoodDetails.WikipediaLink")}
            </a>
          )}
          <a
            className="neighborhood-details__link"
            href={getGoogleSearchLink(neighborhood.properties.id)}
            target="_blank"
            rel="noreferrer"
          >
            {t("NeighborhoodDetails.GoogleSearchLink")}
          </a>
        </div>
      </>
    );
  }

  render() {
    const {
      handleAuthChange,
      estMaxRent,
      listing,
      neighborhood,
      origin,
      setFavorite,
      userProfile,
      t,
    } = this.props;
    const isFavorite = this.state.isFavorite;
    const hasVehicle = userProfile ? userProfile.hasVehicle : false;
    const NeighborhoodStats = this.neighborhoodStats;
    const NeighborhoodImages = this.neighborhoodImages;
    const NeighborhoodLinks = this.neighborhoodLinks;
    const NeighborhoodTrip = this.neighborhoodTrip;

    if (!neighborhood || !userProfile) {
      return null;
    }

    // Look up the currently selected user profile destination from the origin
    const { id, town } = neighborhood.properties;
    const description = neighborhood.properties.town_website_description;

    return (
      <div className="neighborhood-details">
        <div className="neighborhood-details__section">
          <header className="neighborhood-details__header">
            <Icon
              className="neighborhood-details__star"
              type={isFavorite ? "star" : "star-o"}
              onClick={(e) => setFavorite(id, userProfile, handleAuthChange)}
            />
            <div className="neighborhood-details__name">
              <div className="neighborhood-details__title">
                {town} &ndash; {id}
              </div>
            </div>
            <PolygonIcon className="neighborhood-details__marker" />
          </header>
        </div>
        <div className="neighborhood-details__section">
          <NeighborhoodTrip
            hasVehicle={hasVehicle}
            listing={listing}
            neighborhood={neighborhood}
            origin={origin}
            t={t}
            userProfile={userProfile}
          />
          {!hasVehicle && (
            <RouteSegments
              hasVehicle={hasVehicle}
              routeSegments={listing ? listing.segments : neighborhood.segments}
              travelTime={listing ? listing.time : neighborhood.time}
            />
          )}
        </div>
        <div className="neighborhood-details__section">
          <NeighborhoodStats estMaxRent={estMaxRent} userProfile={userProfile} />
        </div>
        <div className="neighborhood-details__section">
          <NeighborhoodListInfo neighborhood={neighborhood} width={140} />
        </div>
        <div className="neighborhood-details__section">
          <NeighborhoodLinks
            estMaxRent={estMaxRent}
            hasVehicle={hasVehicle}
            neighborhood={neighborhood}
            origin={origin}
            userProfile={userProfile}
          />
        </div>
        <div className="neighborhood-details__section">
          <NeighborhoodImages neighborhood={neighborhood} />
          <div className="neighborhood-details__desc">{description}</div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(NeighborhoodDetails);

// Builds list of unqiue transit modes used in a trip
const ModesList = ({ segments }) => {
  const { t } = useTranslation();

  return segments && segments.length ? (
    <>{uniq(segments.map((s) => t(`TransportationMethod.${s.type}`))).join("/")}</>
  ) : (
    t("NeighborhoodDetails.DriveMode")
  );
};
