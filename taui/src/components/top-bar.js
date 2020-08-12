// @flow
import {Component} from 'react'
import message from '@conveyal/woonerf/message'
import Loader from 'react-loader-spinner'

import AmenityButton from './amenity-button'
import getBHAListings from '../utils/bha-data-extraction'
import getListings from '../utils/listings'

const childcare = '../../assets/img/icons/childcare.png'
const park = '../../assets/img/icons/park.png'
const grocery = '../../assets/img/icons/grocery.png'
const school = '../../assets/img/icons/school.png'
const convenience = '../../assets/img/icons/convenience.png'
const health = '../../assets/img/icons/health.png'
const library = '../../assets/img/icons/library.png'
const community = '../../assets/img/icons/community.png'
const worship = '../../assets/img/icons/worship.png'

type Props = {
    activeNeighborhood: any,
    amenities: any,
    clickedNeighborhood: any,
    updateMapAmenities: any => void,
    listingsLoading: boolean,
    showBHAListings: boolean,
    showRealtorListings: boolean,
    userProfile: AccountProfile,
    neighborhood: any
}

type State = {
    amenitiesData: object[],
    amenityTypes: string[],
    shownAmenities: object[],
}

const amenityColors = {
  'school': '#FFA800',
  'health': '#F05B5B',
  'childcare': '#E9658D',
  'park': '#48B265',
  'grocery': '#4D97CA',
  'library': '#BA77BB',
  'convenience': '#28B3B0',
  'community': '#864000',
  'worship': '#515151'
}

const amenityTypes = ['school', 'convenience', 'health', 'community', 'park', 'childcare', 'library', 'grocery', 'worship']

// Class that handles Amenity functionality
export default class TopBar extends Component<Props, State> {
  constructor (props) {
    super(props)
    // Final amenities list: School, Park, Childcare, Library, Health, Grocery, Convenience, Community, Worship
    this.state = {
      amenitiesData: this.getNeighborhoodAmenities(),
      visibleAmenities: {
        'school': false,
        'convenience': false,
        'health': false,
        'community': false,
        'park': false,
        'childcare': false,
        'library': false,
        'grocery': false,
        'worship': false},
      listingsLoading: false
    }
    this.updateShownAmenities = this.updateShownAmenities.bind(this)
    this.getVisibleAmenities = this.getVisibleAmenities.bind(this)
    this.resetVisibleAmenities = this.resetVisibleAmenities.bind(this)

    this.displayBHAListings = this.displayBHAListings.bind(this)
    this.displayRealtorListings = this.displayRealtorListings.bind(this)
    this.hideBHAListings = this.hideBHAListings.bind(this)
    this.hideRealtorListings = this.hideRealtorListings.bind(this)
    this.listingsButton = this.listingsButton.bind(this)
    this.hideListingsButton = this.hideListingsButton.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeNeighborhood) {
      this.setState({amenitiesData: this.getNeighborhoodAmenities()})
    }
  }

  async displayBHAListings (e) {
    const hasVoucher = this.props.userProfile.hasVoucher
    const budget = this.props.userProfile.budget
    const rooms = this.props.userProfile.rooms
    const maxSubsidy = this.props.neighborhood.properties['max_rent_' + rooms + 'br']

    this.props.setListingsLoading(true)

    // param: (zip, budget, rooms)
    await getBHAListings(this.props.neighborhood.properties.zipcode, hasVoucher ? maxSubsidy : budget, this.props.userProfile.rooms).then(data => {
      this.props.setBHAListings(data)
    })
    this.props.setShowBHAListings(true)
    this.props.setListingsLoading(false)
  }

  async displayRealtorListings (e) {
    const hasVoucher = this.props.userProfile.hasVoucher
    const budget = this.props.userProfile.budget
    const rooms = this.props.userProfile.rooms
    const maxSubsidy = this.props.neighborhood.properties['max_rent_' + rooms + 'br']

    this.props.setListingsLoading(true)

    await getListings(this.props.neighborhood.properties.zipcode, hasVoucher ? maxSubsidy : budget, this.props.userProfile.rooms).then(data => {
      this.props.setDataListings(data)
    })

    this.props.setShowRealtorListings(true)
    this.props.setListingsLoading(false)
  }

  hideBHAListings (e) {
    this.props.setShowBHAListings(false)
  }

  hideRealtorListings (e) {
    this.props.setShowRealtorListings(false)
  }

  listingsButton (props) {
    const { message, handleClick } = props

    return (
      <button
        className='top-bar__button'
        onClick={handleClick}>{ message }
      </button>
    )
  }

  hideListingsButton (props) {
    const { message, handleClick } = props

    return (
      <button
        className='top-bar__button-highlighted'
        onClick={handleClick}> { message }
      </button>
    )
  }


  // get amenity -> [amenities] for zipcode this.props.activeNeighborhood
  getNeighborhoodAmenities () {
    var neighZip = this.props.activeNeighborhood
    var amenitiesForNeigh = {}
    if (neighZip) {
      var dataByZipcode = this.props.amenities['data'][neighZip]
      for (var d in dataByZipcode) {
        const dataPoint = dataByZipcode[d]
        const tipo = dataPoint.properties.type
        if (tipo in amenitiesForNeigh) {
          amenitiesForNeigh[tipo].push(dataPoint)
        } else {
          amenitiesForNeigh[tipo] = [dataPoint]
        }
      }
    }

    for (var a in amenityTypes) {
      a = amenityTypes[a]
      if (a in amenitiesForNeigh) {
        continue
      }
      amenitiesForNeigh[a] = []
    }

    return amenitiesForNeigh
  }

  resetVisibleAmenities () {
    this.setState({visibleAmenities: {
      'school': false,
      'convenience': false,
      'health': false,
      'community': false,
      'park': false,
      'childcare': false,
      'library': false,
      'grocery': false,
      'worship': false}
    })
  }

  updateShownAmenities (amenity: string, show: boolean) {
    if (amenity === '') {
      // different neighborhood clicked
      this.props.updateMapAmenities([])
      this.resetVisibleAmenities()
    } else {
      // within same active neighborhood
      this.setState(prevState => {
        const visibleAmenities = Object.assign({}, prevState.visibleAmenities)
        visibleAmenities[amenity] = show
        return { visibleAmenities }
      })

      var stateCopy = JSON.parse(JSON.stringify(this.state))
      stateCopy.visibleAmenities[amenity] = show
      this.props.updateMapAmenities(this.getVisibleAmenities(stateCopy.visibleAmenities))
    }
  }

  // get dictionary {amenity: [datapoints]} where amenity is visible
  getVisibleAmenities (visibleAmenities) {
    var amenities = []
    for (var a in visibleAmenities) {
      // if amenity clicked
      if (this.state.amenitiesData && visibleAmenities[a]) {
        amenities.push(this.state.amenitiesData[a])
      }
    }
    return amenities
  }

  render () {
    const {
      listingsLoading,
      showBHAListings,
      showRealtorListings,
      userProfile,
      neighborhood
    } = this.props
    const ListingsButton = this.listingsButton
    const HideListingsButton = this.hideListingsButton
    // TODO: when click on map amenities bar goes away bug
    if (!this.props.clickedNeighborhood) {
      return null
    }
    return (
      <div className='top-bar'>
        <div className='top-bar__bar'>
          <div className='top-bar__heading'>Apartments: </div>
          {showBHAListings
            ? <HideListingsButton
              message={message('NeighborhoodDetails.HideBHAApartments')}
              handleClick={this.hideBHAListings} />
            : <ListingsButton
              message={message('NeighborhoodDetails.ShowBHAApartments')}
              handleClick={this.displayBHAListings} />}
          {showRealtorListings
            ? <HideListingsButton
              message={message('NeighborhoodDetails.HideRealtorApartments')}
              handleClick={this.hideRealtorListings} />
            : <ListingsButton
              message={message('NeighborhoodDetails.ShowRealtorApartments')}
              handleClick={this.displayRealtorListings} />}
          <div style={{ display: 'inline-block' }}>
            <Loader
              visible={listingsLoading}
              type='Oval'
              color='#000000'
              height={20}
              width={20}
            />
          </div>
        </div>
        <div className={'top-bar__bar'}>
          <div className='top-bar__heading'>Neighborhood Amenities: </div>
          <AmenityButton
            name={amenityTypes[0]} // School
            color={amenityColors['school']}
            image={school}
            data={this.state.amenitiesData['school']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[1]} // Convenience
            color={amenityColors['convenience']}
            image={convenience}
            data={this.state.amenitiesData['convenience']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[2]} // Health
            color={amenityColors['health']}
            image={health}
            data={this.state.amenitiesData['health']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[3]} // Community
            color={amenityColors['community']}
            image={community}
            data={this.state.amenitiesData['community']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[4]} // Park
            color={amenityColors['park']}
            image={park}
            data={this.state.amenitiesData['park']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[5]} // Childcare
            color={amenityColors['childcare']}
            image={childcare}
            data={this.state.amenitiesData['childcare']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[6]} // Library
            color={amenityColors['library']}
            image={library}
            data={this.state.amenitiesData['library']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[7]} // Grocery
            color={amenityColors['grocery']}
            image={grocery}
            data={this.state.amenitiesData['grocery']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
          <AmenityButton
            name={amenityTypes[8]} // Worship
            color={amenityColors['worship']}
            image={worship}
            data={this.state.amenitiesData['worship']}
            updateAmenityVisibility={this.updateShownAmenities}
            activeNeighborhood={this.props.activeNeighborhood}
          />
        </div>
      </div>
    )
  }
}
