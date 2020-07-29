// @flow
import {Component} from 'react'

import AmenityButton from './amenity-button'

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
export default class AmenitiesBar extends Component<Props, State> {
  constructor (props) {
    super(props)
    // Final amenities list: School, Park, Childcare, Library, Health, Grocery, Convenience, Community, Worship
    this.state = {
      amenitiesData: this.getNeighborhoodAmenities(),
      visibleAmenities: {'school': false,
        'convenience': false,
        'health': false,
        'community': false,
        'park': false,
        'childcare': false,
        'library': false,
        'grocery': false,
        'worship': false}
    }
    this.updateShownAmenities = this.updateShownAmenities.bind(this)
    this.getVisibleAmenities = this.getVisibleAmenities.bind(this)
    this.resetVisibleAmenities = this.resetVisibleAmenities.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeNeighborhood) {
      this.setState({amenitiesData: this.getNeighborhoodAmenities()});
    }
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
        }
        else {
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
    this.setState({visibleAmenities: {'school': false, 'convenience': false, 'health': false, 'community': false, 
      'park': false, 'childcare': false, 'library': false, 'grocery': false,  'worship': false}})
  }

  updateShownAmenities (amenity: string, show: boolean) {
    if (amenity === '') {
      // different neighborhood clicked
      this.props.updateMapAmenities([])
      this.resetVisibleAmenities()
    }
    else {
      // within same active neighborhood
      this.setState(prevState => {
        const visibleAmenities = Object.assign({}, prevState.visibleAmenities);
        visibleAmenities[amenity] = show
        return { visibleAmenities }
      })

      var stateCopy = JSON.parse(JSON.stringify(this.state))
      stateCopy.visibleAmenities[amenity] = show
      this.props.updateMapAmenities(this.getVisibleAmenities(stateCopy.visibleAmenities));
    }
  }

  // get dictionary {amenity: [datapoints]} where amenity is visible
  getVisibleAmenities (visibleAmenities) {
    var amenities = [];
    for (var a in visibleAmenities) {
      // if amenity clicked
      if (this.state.amenitiesData && visibleAmenities[a]) {
        amenities.push(this.state.amenitiesData[a])
      }
    }
    return amenities
  }

  render () {
    // TODO: when click on map amenities bar goes away bug
    if (!this.props.clickedNeighborhood) {
      return null
    }
    return (
      <div className={'amenities-all'}>
        <p style={{fontWeight: 'bold'}}>Neighborhood Amenities</p>
        <div className={'amenities-box'}>
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
