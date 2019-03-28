// @flow
import Storage from '@aws-amplify/storage'
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import filter from 'lodash/filter'
import remove from 'lodash/remove'
import {PureComponent} from 'react'

import {ANONYMOUS_USERNAME, SIDEBAR_PAGE_SIZE, NETWORK_COLORS} from '../constants'
import type {AccountProfile, PointFeature} from '../types'
import getActiveNeighborhood from '../utils/get-active-neighborhood'

import NeighborhoodDetails from './neighborhood-details'
import NeighborhoodListInfo from './neighborhood-list-info'
import RouteCard from './route-card'
import RouteSegments from './route-segments'

type Props = {
  activeNetworkIndex: number,
  isLoading: boolean,
  neighborhoodRoutes: any,
  neighborhoods: Array<PointFeature>,
  showSpinner: boolean,
  travelTimes: number[]
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
    this.showAll = this.showAll.bind(this)

    this.state = {
      componentError: props.componentError,
      page: 0,
      showAll: true
    }
  }

  backFromDetails (e) {
    e.stopPropagation()
    this.props.setShowDetails(false)
  }

  goPreviousPage (e) {
    e.stopPropagation()
    const page = this.state.page
    if (page >= 1) {
      this.setState({page: page - 1})
    } else {
      console.warn('Cannot move back from page ' + page)
      this.setState({page: 0})
    }
  }

  goNextPage (e) {
    e.stopPropagation()
    const page = this.state.page
    this.setState({page: page + 1})
  }

  goToDetails (e, neighborhood) {
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
  showAll (show: boolean) {
    if (show !== this.state.showAll) {
      this.setState({page: 0, showAll: show})
    }
  }

  // Render list pagination buttons, or button to return to list from details
  buttonRow (props) {
    const {
      haveAnotherPage,
      page,
      showDetails
    } = props

    const backFromDetails = this.backFromDetails
    const goPreviousPage = this.goPreviousPage
    const goNextPage = this.goNextPage

    return (
      <div className='account-profile__destination_row'>
        {showDetails && <button
          className='account-profile__button account-profile__button--secondary account-profile__destination_narrow_field'
          onClick={backFromDetails}>{message('Dock.GoBackFromDetails')}
        </button>}
        {!showDetails && page > 0 && <button
          className='account-profile__button account-profile__button--secondary account-profile__destination_narrow_field'
          onClick={goPreviousPage}>{message('Dock.GoPreviousPage')}
        </button>}
        {!showDetails && haveAnotherPage && <button
          className='account-profile__button account-profile__button--secondary account-profile__destination_narrow_field'
          onClick={goNextPage}>{message('Dock.GoNextPage')}
        </button>}
      </div>)
  }

  // Render list of neighborhoods
  neighborhoodsList (props) {
    const {
      activeNetworkIndex,
      changeUserProfile,
      hasVehicle,
      neighborhoods,
      setActiveNeighborhood,
      setFavorite,
      startingOffset,
      userProfile
    } = props
    const goToDetails = this.goToDetails
    const neighborhoodPage = neighborhoods && neighborhoods.length ? neighborhoods.slice(
      startingOffset, SIDEBAR_PAGE_SIZE + startingOffset) : []

    if (!neighborhoodPage || !neighborhoodPage.length) {
      return <div className='Card'>{message('Dock.NoResults')}</div>
    }

    return (
      neighborhoodPage.map((neighborhood, index) =>
        <RouteCard
          cardColor={neighborhood.active ? 'green' : NETWORK_COLORS[activeNetworkIndex]}
          goToDetails={(e) => goToDetails(e, neighborhood)}
          index={index}
          isFavorite={userProfile.favorites.indexOf(neighborhood.properties.id) !== -1}
          key={`${index}-route-card`}
          neighborhood={neighborhood}
          setActiveNeighborhood={setActiveNeighborhood}
          setFavorite={(e) => setFavorite(neighborhood.properties.id,
            userProfile, changeUserProfile)}
          title={neighborhood.properties.town + ': ' + neighborhood.properties.id}
          userProfile={userProfile}>
          <RouteSegments
            hasVehicle={hasVehicle}
            routeSegments={neighborhood.segments}
            travelTime={neighborhood.time}
          />
          <NeighborhoodListInfo
            neighborhood={neighborhood}
          />
        </RouteCard>
      )
    )
  }

  neighborhoodSection (props) {
    const {
      endingOffset,
      neighborhoods,
      startingOffset,
      showAll
    } = props
    const setShowAll = this.showAll
    const NeighborhoodsList = this.neighborhoodsList
    const showAllClass = `map-sidebar__neighborhoods-action ${showAll ? 'map-sidebar__neighborhoods-action--on' : ''}`
    const showSavedClass = `map-sidebar__neighborhoods-action ${!showAll ? 'map-sidebar__neighborhoods-action--on' : ''}`

    return (
      <>
        <header className='map-sidebar__neighborhoods-header'>
          <h2 className='map-sidebar__neighborhoods-heading'>
            {showAll ? message('Dock.Recommendations') : message('Dock.Favorites')}
            &nbsp;
            {startingOffset + 1}&ndash;{endingOffset}
          </h2>
          <div className='map-sidebar__neighborhoods-actions'>
            <button
              onClick={(e) => setShowAll(true)}
              disabled={showAll}
              className={showAllClass}>
              {message('Dock.ShowAllButton')}
            </button>
            &nbsp;|&nbsp;
            <button
              className={showSavedClass}
              disabled={!showAll}
              onClick={(e) => setShowAll(false)}>
              {message('Dock.ShowSavedButton')}
            </button>
          </div>
        </header>
        <NeighborhoodsList {...props}
          neighborhoods={neighborhoods}
          startingOffset={startingOffset} />
      </>)
  }

  render () {
    const {
      activeNeighborhood,
      changeUserProfile,
      children,
      isLoading,
      neighborhoodsSortedWithRoutes,
      origin,
      showDetails,
      userProfile
    } = this.props
    const {componentError, page, showAll} = this.state
    const ButtonRow = this.buttonRow
    const NeighborhoodSection = this.neighborhoodSection
    const setFavorite = this.setFavorite

    const startingOffset = page * SIDEBAR_PAGE_SIZE

    const neighborhoods = showAll
      ? neighborhoodsSortedWithRoutes
      : filter(neighborhoodsSortedWithRoutes,
        n => userProfile.favorites.indexOf(n.properties.id) !== -1)

    const haveAnotherPage = neighborhoods &&
      (neighborhoods.length > startingOffset + SIDEBAR_PAGE_SIZE)

    const endingOffset = haveAnotherPage
      ? startingOffset + SIDEBAR_PAGE_SIZE
      : neighborhoods.length

    const detailNeighborhood = getActiveNeighborhood(neighborhoodsSortedWithRoutes,
      activeNeighborhood)

    return <div className='map-sidebar'>
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
          hasVehicle={userProfile ? userProfile.hasVehicle : false}
          neighborhoods={neighborhoods}
          endingOffset={endingOffset}
          setFavorite={setFavorite}
          showAll={showAll}
          startingOffset={startingOffset}
          userProfile={userProfile}
        />}
      {!isLoading && showDetails &&
        <NeighborhoodDetails
          changeUserProfile={changeUserProfile}
          neighborhood={detailNeighborhood}
          origin={origin}
          setFavorite={setFavorite}
          userProfile={userProfile} />
      }
      <ButtonRow {...this.props}
        haveAnotherPage={haveAnotherPage} page={page} />
      <div className='map-sidebar__attribution'>
        site by <a href='https://www.azavea.com' target='_blank'>Azavea</a>
      </div>
    </div>
  }
}
