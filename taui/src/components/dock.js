// @flow
import Storage from '@aws-amplify/storage'
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import remove from 'lodash/remove'
import ReactTooltip from 'react-tooltip'
import {PureComponent, createRef} from 'react'

import {ANONYMOUS_USERNAME, SIDEBAR_PAGE_SIZE} from '../constants'
import type {AccountProfile} from '../types'

import NeighborhoodDetails from './neighborhood-details'
import RouteCard from './route-card'

const toolTipImg = '../../assets/tooltip_icon.png'

type Props = {
  activeListing: any,
  activeNeighborhood: string,
  activeNetworkIndex: number,
  changeUserProfile: (any) => void,
  children: any,
  detailNeighborhood: any,
  endingOffset: number,
  haveAnotherPage: boolean,
  isLoading: boolean,
  listingsLoading: boolean,
  neighborhoodCount: number,
  neighborhoodPage: any[],
  neighborhoodRoutes: any,
  origin: any,
  page: number,
  showBHAListings: boolean,
  showDetails: boolean,
  showFavorites: boolean,
  showRealtorListings: boolean,
  userProfile: AccountProfile
}

/**
 * Sidebar content.
 */
export default class Dock extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.backFromDetails = this.backFromDetails.bind(this)
    this.goPreviousPage = this.goPreviousPage.bind(this)
    this.goNextPage = this.goNextPage.bind(this)
    this.goToDetails = this.goToDetails.bind(this)
    this.buttonRow = this.buttonRow.bind(this)
    this.neighborhoodsList = this.neighborhoodsList.bind(this)
    this.neighborhoodSection = this.neighborhoodSection.bind(this)
    this.setFavorite = this.setFavorite.bind(this)
    this.setShowFavorites = this.setShowFavorites.bind(this)
    this.sidebar = createRef()

    this.state = {
      componentError: props.componentError,
      showTextPopup: false
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.page !== prevProps.page || this.props.showDetails !== prevProps.showDetails || this.props.showBHAListings !== prevProps.showBHAListings || this.props.showRealtorListings !== prevProps.showRealtorListings || this.props.listingsLoading !== prevProps.listingsLoading) {
      this.sidebar.current.scrollTop = 0
    }
  }

  backFromDetails (e) {
    e.stopPropagation()
    this.props.setShowDetails(false)
    this.props.setShowBHAListings(false)
    this.props.setShowRealtorListings(false)
    this.props.setListingsLoading(false)
    this.props.setActiveNeighborhood()
  }

  goPreviousPage (e) {
    e.stopPropagation()
    const page = this.props.page
    if (page >= 1) {
      this.props.setPage(page - 1)
    } else {
      console.warn('Cannot move back from page ' + page)
      this.props.setPage(0)
    }
    this.props.setActiveNeighborhood()
  }

  goNextPage (e) {
    e.stopPropagation()
    this.props.setPage(this.props.page + 1)
    this.props.setActiveNeighborhood()
  }

  goToDetails (e, neighborhood) {
    // Do not go to details if user clicked a link (for chart tooltip links)
    if (e.target.tagName.toLowerCase() === 'a') {
      return
    }
    e.stopPropagation()
    this.props.setActiveNeighborhood(neighborhood.properties.id)
    this.props.setShowDetails(true)
  }

  // save/unsave neighborhood to/from user profile favorites list
  setFavorite (neighborhoodId: string, profile: AccountProfile, changeUserProfile) {
    const favorites = profile.favorites || []

    const isProfileFavorite = favorites.indexOf(neighborhoodId) !== -1
    const favorite = !isProfileFavorite
    if (favorite) {
      // add to favorites
      if (isProfileFavorite) {
        console.warn('already a profile favorite')
      } else {
        favorites.push(neighborhoodId)
      }
    } else {
      // remove from favorites
      if (!isProfileFavorite) {
        console.warn('not a profile favorite to remove')
      } else {
        remove(favorites, f => f === neighborhoodId)
      }
    }
    profile.favorites = favorites
    const isAnonymous = !profile || profile.key === ANONYMOUS_USERNAME

    if (!isAnonymous) {
      Storage.put(profile.key, JSON.stringify(profile))
        .then(result => {
          changeUserProfile(profile)
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      // Do not attempt to write anonymous profile to S3
      changeUserProfile(profile)
    }
  }

  // Toggle between showing all and showing favorites, if not already in the new state
  setShowFavorites (show: boolean) {
    if (show !== this.props.showFavorites) {
      this.props.setPage(0)
      this.props.setShowFavorites(show)
    }
  }

  // Render list pagination buttons, or button to return to list from details
  buttonRow (props) {
    const {
      haveAnotherPage,
      page
    } = props

    const goPreviousPage = this.goPreviousPage
    const goNextPage = this.goNextPage

    return (
      <nav className='map-sidebar__pagination'>
        {page > 0 && <button
          className='map-sidebar__pagination-button'
          onClick={goPreviousPage}>{message('Dock.GoPreviousPage')}
        </button>}
        {haveAnotherPage && <button
          className='map-sidebar__pagination-button map-sidebar__pagination-button--strong'
          onClick={goNextPage}>{message('Dock.GoNextPage')}
        </button>}
      </nav>)
  }

  // Render list of neighborhoods
  neighborhoodsList (props) {
    const {
      activeNeighborhood,
      changeUserProfile,
      neighborhoods,
      setActiveNeighborhood,
      origin,
      setFavorite,
      userProfile
    } = props
    const goToDetails = this.goToDetails

    if (!neighborhoods || !neighborhoods.length) {
      return <div className='map-sidebar__no-results'>{message('Dock.NoResults')}</div>
    }

    return (
      neighborhoods.map((neighborhood, index) => {
        var town = neighborhood.properties.town.split(' ')
        var split = town.length === 1
        town = split ? town[0] : town[0] + ' (' + town[2] + ')'
        return (
          <RouteCard
            activeNeighborhood={activeNeighborhood}
            goToDetails={(e) => goToDetails(e, neighborhood)}
            index={index}
            isFavorite={userProfile.favorites &&
            userProfile.favorites.indexOf(neighborhood.properties.id) !== -1}
            key={`${index}-route-card`}
            neighborhood={neighborhood}
            origin={origin}
            setActiveNeighborhood={setActiveNeighborhood}
            setFavorite={(e) => setFavorite(neighborhood.properties.id,
              userProfile, changeUserProfile)}
            title={town + ', ' + neighborhood.properties.id}
            userProfile={userProfile} />
        )
      })
    )
  }

  neighborhoodSection (props) {
    const {
      endingOffset,
      neighborhoods,
      totalNeighborhoodCount,
      origin,
      startingOffset,
      showFavorites
    } = props
    const setShowFavorites = this.setShowFavorites
    const NeighborhoodsList = this.neighborhoodsList
    const showAllClass = `map-sidebar__neighborhoods-action ${!showFavorites ? 'map-sidebar__neighborhoods-action--on' : ''}`
    const showSavedClass = `map-sidebar__neighborhoods-action ${showFavorites ? 'map-sidebar__neighborhoods-action--on' : ''}`
    const whyNeighborhoodTooltip = message('Tooltips.WhyNeighborhoods')

    return (
      <>
        <header className='map-sidebar__neighborhoods-header'>
          <h2 className='map-sidebar__neighborhoods-heading'>
            {showFavorites && <>
              {message('Dock.Favorites')}
              &nbsp;
              {endingOffset > 0 && `(${startingOffset + 1}–${endingOffset} of ${totalNeighborhoodCount})`}
            </>}
            {!showFavorites && <>
              {message('Dock.Recommendations')}
              &nbsp;
              {endingOffset > 0 && `(${startingOffset + 1}–${endingOffset} of ${totalNeighborhoodCount})`}
            </>}
          </h2>
          <img src={toolTipImg} data-tip={whyNeighborhoodTooltip} style={{width: '4%'}} />
          <ReactTooltip
            className='map-sidebar__tooltip'
          />
          <div className='map-sidebar__neighborhoods-actions'>
            <button
              onClick={(e) => setShowFavorites(false)}
              disabled={!showFavorites}
              className={showAllClass}>
              {message('Dock.ShowAllButton')}
            </button>
            &nbsp;|&nbsp;
            <button
              className={showSavedClass}
              disabled={showFavorites}
              onClick={(e) => setShowFavorites(true)}>
              {message('Dock.ShowSavedButton')}
            </button>
          </div>
        </header>
        <NeighborhoodsList {...props}
          neighborhoods={neighborhoods}
          startingOffset={startingOffset}
          origin={origin} />
      </>)
  }

  render () {
    const {
      changeUserProfile,
      children,
      detailNeighborhood,
      endingOffset,
      haveAnotherPage,
      isLoading,
      neighborhoodCount,
      neighborhoodPage,
      origin,
      page,
      showDetails,
      showBHAListings,
      showRealtorListings,
      listingsLoading,
      showFavorites,
      userProfile,
      setShowBHAListings,
      setShowRealtorListings,
      setListingsLoading,
      setDataListings,
      setBHAListings,
      activeListing,
      listingTravelTime
    } = this.props
    const {componentError} = this.state
    const ButtonRow = this.buttonRow
    const NeighborhoodSection = this.neighborhoodSection
    const setFavorite = this.setFavorite
    const backFromDetails = this.backFromDetails

    const startingOffset = page * SIDEBAR_PAGE_SIZE

    return <div className='map-sidebar' ref={this.sidebar}>
      {componentError &&
        <p className='map-sidebar__error'>
          <Icon type='exclamation-triangle' />
          {componentError.info}
        </p>}
      {children}

      {!isLoading && !showDetails &&
        <NeighborhoodSection
          {...this.props}
          changeUserProfile={changeUserProfile}
          neighborhoods={neighborhoodPage}
          totalNeighborhoodCount={neighborhoodCount}
          endingOffset={endingOffset}
          origin={origin}
          setFavorite={setFavorite}
          showFavorites={showFavorites}
          startingOffset={startingOffset}
          userProfile={userProfile}
        />}
      {!isLoading && showDetails && <>
        <nav className='map-sidebar__details-navigation'>
          <button
            className='map-sidebar__navigation-button'
            onClick={backFromDetails}
          >
            <Icon type='chevron-circle-left' className='map-sidebar__navigation-chevron-button' />
            {showFavorites
              ? message('Dock.GoBackToFavorites')
              : message('Dock.GoBackToRecommendations')}
          </button>
        </nav>
        <NeighborhoodDetails
          changeUserProfile={changeUserProfile}
          activeListing={activeListing}
          listingTravelTime={listingTravelTime}
          neighborhood={detailNeighborhood}
          origin={origin}
          setShowBHAListings={setShowBHAListings}
          setShowRealtorListings={setShowRealtorListings}
          setListingsLoading={setListingsLoading}
          setDataListings={setDataListings}
          setBHAListings={setBHAListings}
          showBHAListings={showBHAListings}
          showRealtorListings={showRealtorListings}
          listingsLoading={listingsLoading}
          setFavorite={setFavorite}
          userProfile={userProfile} />
      </>}
      {!isLoading && !showDetails &&
        <ButtonRow {...this.props}
          haveAnotherPage={haveAnotherPage} page={page}
        />}

      <div className='map-sidebar__footer'>
        <a
          href='https://www.mysurveygizmo.com/s3/5088311/ECHOLocator-Feedback-tool'
          target='_blank'
          className='map-sidebar__feedback'
        >
          {message('Dock.FeedbackLink')}
        </a>
        <a
          href='https://www.azavea.com'
          target='_blank'
          className='map-sidebar__attribution'
        >
          {message('Dock.SiteBy')}
        </a>
      </div>
    </div>
  }
}
