// @flow
import Icon from "@conveyal/woonerf/components/icon";
import { withTranslation } from "react-i18next";
import remove from "lodash/remove";
import { PureComponent, createRef } from "react";

import { ANONYMOUS_USERNAME, SIDEBAR_PAGE_SIZE } from "../constants";
import type { AccountProfile, ActiveListingDetail } from "../types";

import NeighborhoodDetails from "./neighborhood-details";
import RouteCard from "./route-card";

type Props = {
  activeNeighborhood: string,
  activeNetworkIndex: number,
  children: any,
  detailListing: ActiveListingDetail,
  detailNeighborhood: any,
  endingOffset: number,
  estMaxRent: number,
  handleAuthChange: (any) => void,
  haveAnotherPage: boolean,
  isLoading: boolean,
  neighborhoodCount: number,
  neighborhoodPage: any[],
  neighborhoodRoutes: any,
  origin: any,
  page: number,
  setBHAListings: (Function) => void,
  setRealtorListings: (Function) => void,
  showDetails: boolean,
  showFavorites: boolean,
  userProfile: AccountProfile,
};

/**
 * Sidebar content.
 */
class Dock extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.backFromDetails = this.backFromDetails.bind(this);
    this.goPreviousPage = this.goPreviousPage.bind(this);
    this.goNextPage = this.goNextPage.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
    this.buttonRow = this.buttonRow.bind(this);
    this.neighborhoodsList = this.neighborhoodsList.bind(this);
    this.neighborhoodSection = this.neighborhoodSection.bind(this);
    this.setFavorite = this.setFavorite.bind(this);
    this.setShowFavorites = this.setShowFavorites.bind(this);
    this.sidebar = createRef();

    this.state = {
      componentError: props.componentError,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.page !== prevProps.page || this.props.showDetails !== prevProps.showDetails) {
      this.sidebar.current.scrollTop = 0;
    }
  }

  backFromDetails(e) {
    e.stopPropagation();
    this.props.setShowDetails(false);
    this.props.setActiveNeighborhood();
    this.props.setBHAListings({ data: [] });
    this.props.setRealtorListings({ data: [] });
  }

  goPreviousPage(e) {
    e.stopPropagation();
    const page = this.props.page;
    if (page >= 1) {
      this.props.setPage(page - 1);
    } else {
      console.warn("Cannot move back from page " + page);
      this.props.setPage(0);
    }
    this.props.setActiveNeighborhood();
  }

  goNextPage(e) {
    e.stopPropagation();
    this.props.setPage(this.props.page + 1);
    this.props.setActiveNeighborhood();
  }

  goToDetails(e, neighborhood) {
    // Do not go to details if user clicked a link (for chart tooltip links)
    if (e.target.tagName.toLowerCase() === "a") {
      return;
    }
    e.stopPropagation();
    this.props.setActiveNeighborhood(neighborhood.properties.id);
    this.props.setShowDetails(true);
  }

  // save/unsave neighborhood to/from user profile favorites list
  setFavorite(neighborhoodId: string, profile: AccountProfile, handleAuthChange) {
    const favorites = profile.favorites ? [...profile.favorites] : [];

    const isProfileFavorite = favorites.indexOf(neighborhoodId) !== -1;
    const favorite = !isProfileFavorite;
    if (favorite) {
      // add to favorites
      if (isProfileFavorite) {
        console.warn("already a profile favorite");
      } else {
        favorites.push(neighborhoodId);
      }
    } else {
      // remove from favorites
      if (!isProfileFavorite) {
        console.warn("not a profile favorite to remove");
      } else {
        remove(favorites, (f) => f === neighborhoodId);
      }
    }

    // Save updated profile
    const updatedProfile = { ...profile, favorites };
    if (profile.voucherNumber === ANONYMOUS_USERNAME) {
      // Despite the name, this saves the profile to local storage in anonymous mode.
      this.props.handleAuthChange(updatedProfile);
    } else {
      // Save to API
      this.props
        .saveProfile(updatedProfile, this.props.authToken)
        .then((newProfile) => {
          this.props.setProfile(newProfile);
        })
        .catch((err) => {
          console.error("Error saving user profile", err);
        });
    }
  }

  // Toggle between showing all and showing favorites, if not already in the new state
  setShowFavorites(show: boolean) {
    if (show !== this.props.showFavorites) {
      this.props.setPage(0);
      this.props.setShowFavorites(show);
    }
  }

  // Render list pagination buttons, or button to return to list from details
  buttonRow(props) {
    const {
      haveAnotherPage,
      page,
      t, // buttonRow is being passed the parent component props, so we already have t available
    } = props;

    const goPreviousPage = this.goPreviousPage;
    const goNextPage = this.goNextPage;

    return (
      <nav className="map-sidebar__pagination">
        {page > 0 && (
          <button className="map-sidebar__pagination-button" onClick={goPreviousPage}>
            {t("Dock.GoPreviousPage")}
          </button>
        )}
        {haveAnotherPage && (
          <button
            className="map-sidebar__pagination-button map-sidebar__pagination-button--strong"
            onClick={goNextPage}
          >
            {t("Dock.GoNextPage")}
          </button>
        )}
      </nav>
    );
  }

  // Render list of neighborhoods
  neighborhoodsList(props) {
    const {
      activeNeighborhood,
      handleAuthChange,
      neighborhoods,
      setActiveNeighborhood,
      origin,
      setFavorite,
      userProfile,
      t,
    } = props;
    const goToDetails = this.goToDetails;

    if (!neighborhoods || !neighborhoods.length) {
      return <div className="map-sidebar__no-results">{t("Dock.NoResults")}</div>;
    }

    return neighborhoods.map((neighborhood, index) => (
      <RouteCard
        activeNeighborhood={activeNeighborhood}
        goToDetails={(e) => goToDetails(e, neighborhood)}
        index={index}
        isFavorite={
          userProfile.favorites && userProfile.favorites.indexOf(neighborhood.properties.id) !== -1
        }
        key={`${index}-route-card`}
        neighborhood={neighborhood}
        origin={origin}
        setActiveNeighborhood={setActiveNeighborhood}
        setFavorite={(e) => setFavorite(neighborhood.properties.id, userProfile, handleAuthChange)}
        title={neighborhood.properties.town + ": " + neighborhood.properties.id}
        userProfile={userProfile}
      />
    ));
  }

  neighborhoodSection(props) {
    const {
      endingOffset,
      neighborhoods,
      totalNeighborhoodCount,
      origin,
      startingOffset,
      showFavorites,
      t, // This is passed the parent component props so we have it already
    } = props;
    const setShowFavorites = this.setShowFavorites;
    const NeighborhoodsList = this.neighborhoodsList;
    const showAllClass = `map-sidebar__neighborhoods-action ${
      !showFavorites ? "map-sidebar__neighborhoods-action--on" : ""
    }`;
    const showSavedClass = `map-sidebar__neighborhoods-action ${
      showFavorites ? "map-sidebar__neighborhoods-action--on" : ""
    }`;

    return (
      <>
        <header className="map-sidebar__neighborhoods-header">
          <h2 className="map-sidebar__neighborhoods-heading">
            {showFavorites && (
              <>
                {t("Dock.Favorites")}
                &nbsp;
                {endingOffset > 0 &&
                  `(${startingOffset + 1}–${endingOffset} / ${totalNeighborhoodCount})`}
              </>
            )}
            {!showFavorites && (
              <>
                {t("Dock.Recommendations")}
                &nbsp;
                {endingOffset > 0 &&
                  `(${startingOffset + 1}–${endingOffset} / ${totalNeighborhoodCount})`}
              </>
            )}
          </h2>
          <div className="map-sidebar__neighborhoods-actions">
            <button
              onClick={(e) => setShowFavorites(false)}
              disabled={!showFavorites}
              className={showAllClass}
            >
              {t("Dock.ShowAllButton")}
            </button>
            &nbsp;|&nbsp;
            <button
              className={showSavedClass}
              disabled={showFavorites}
              onClick={(e) => setShowFavorites(true)}
            >
              {t("Dock.ShowSavedButton")}
            </button>
          </div>
        </header>
        <NeighborhoodsList
          {...props}
          neighborhoods={neighborhoods}
          startingOffset={startingOffset}
          origin={origin}
        />
      </>
    );
  }

  render() {
    const {
      handleAuthChange,
      children,
      detailListing,
      detailNeighborhood,
      endingOffset,
      estMaxRent,
      haveAnotherPage,
      isLoading,
      neighborhoodCount,
      neighborhoodPage,
      origin,
      page,
      showDetails,
      showFavorites,
      userProfile,
      t,
    } = this.props;
    const { componentError } = this.state;
    const ButtonRow = this.buttonRow;
    const NeighborhoodSection = this.neighborhoodSection;
    const setFavorite = this.setFavorite;
    const backFromDetails = this.backFromDetails;

    const startingOffset = page * SIDEBAR_PAGE_SIZE;

    return (
      <div className="map-sidebar" ref={this.sidebar}>
        {componentError && (
          <p className="map-sidebar__error">
            <Icon type="exclamation-triangle" />
            {componentError.info}
          </p>
        )}
        {children}
        {!isLoading && !showDetails && (
          <NeighborhoodSection
            {...this.props}
            handleAuthChange={handleAuthChange}
            neighborhoods={neighborhoodPage}
            totalNeighborhoodCount={neighborhoodCount}
            endingOffset={endingOffset}
            origin={origin}
            setFavorite={setFavorite}
            showFavorites={showFavorites}
            startingOffset={startingOffset}
            userProfile={userProfile}
          />
        )}
        {!isLoading && showDetails && (
          <>
            <nav className="map-sidebar__details-navigation">
              <button className="map-sidebar__navigation-button" onClick={backFromDetails}>
                <Icon type="chevron-circle-left" />
                {showFavorites ? t("Dock.GoBackToFavorites") : t("Dock.GoBackToRecommendations")}
              </button>
            </nav>
            <NeighborhoodDetails
              handleAuthChange={handleAuthChange}
              listing={detailListing}
              estMaxRent={estMaxRent}
              neighborhood={detailNeighborhood}
              origin={origin}
              setFavorite={setFavorite}
              userProfile={userProfile}
            />
          </>
        )}
        {!isLoading && !showDetails && (
          <ButtonRow {...this.props} haveAnotherPage={haveAnotherPage} page={page} />
        )}
        <div className="map-sidebar__footer">
          <a
            href="https://www.mysurveygizmo.com/s3/5088311/ECHOLocator-Feedback-tool"
            target="_blank"
            className="map-sidebar__feedback"
            rel="noreferrer"
          >
            <Icon type="comment-o" className="map-sidebar__feedback-icon" />
            {t("Dock.FeedbackLink")}
          </a>
          <a
            href="https://www.azavea.com"
            target="_blank"
            className="map-sidebar__attribution"
            rel="noreferrer"
          >
            {t("Dock.SiteBy")}
          </a>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Dock);
