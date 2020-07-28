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
    clickedNeighborhood: any,
    amenities: any,
    updateMapAmenities: any => void,
}

type State = {
    amenityTypes: string[],
    amenityData: object[],
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
    'worship': '#515151',
}

// Class that handles Amenity functionality
export default class AmenitiesBar extends Component<Props, State> {
    constructor(props) {
        super(props)
        // Final amenities list: School, Park, Childcare, Library, Health, Grocery, Convenience, Community, Worship
        this.state = {
            amenityTypes: ['school', 'convenience', 'health', 'community', 'park', 'childcare', 'library', 'grocery',  'worship'],
            amenitiesData: this.getNeighborhoodAmenities(),
            shownAmenities: {'school': false, 'convenience': false, 'health': false, 'community': false, 
                            'park': false, 'childcare': false, 'library': false, 'grocery': false,  'worship': false},
        }
        this.updateShownAmenities = this.updateShownAmenities.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.clickedNeighborhood) {
            this.setState({amenitiesData: this.getNeighborhoodAmenities()});
        }
    }
    
    // get amenity -> [amenities] for zipcode this.props.activeNeighborhood
    getNeighborhoodAmenities() {
        if (!this.props.clickedNeighborhood) {
            return {}
        }
        var neigh_zip = this.props.activeNeighborhood
        var amenities_for_neigh = {}
        if (neigh_zip) {
            var data_by_zipcode = this.props.amenities['data'][neigh_zip]
            for (var d in data_by_zipcode) {
                let dataPoint = data_by_zipcode[d]
                let tipo = dataPoint.properties.type
                if (tipo in amenities_for_neigh) {
                    amenities_for_neigh[tipo].push(dataPoint)
                }
                else {
                    amenities_for_neigh[tipo] = [dataPoint]
                }
            }
        }

        for (var a in this.state.amenityTypes) {
            a = this.state.amenityTypes[a]
            if (a in amenities_for_neigh) {
                continue;
            }
            amenities_for_neigh[a] = []
        }

        return amenities_for_neigh
    }

    updateShownAmenities(amenity: string, show: boolean) {
        this.setState(prevState => {
        let shownAmenities = Object.assign({}, prevState.shownAmenities);
        shownAmenities[amenity] = show;      
        return { shownAmenities };
        })
    }

    render(){
        if (!this.props.clickedNeighborhood){
            return null
        }
        return (
            <div className={'amenities-all'}>
                <p style={{fontWeight: 'bold'}}>Neighborhood Amenities</p>
                <div className={'amenities-box'}>
                    <AmenityButton
                        name={this.state.amenityTypes[0]} // School
                        color={amenityColors['school']}
                        image={school}
                        data={this.state.amenitiesData['school']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton
                        name={this.state.amenityTypes[1]} // Convenience
                        color={amenityColors['convenience']}
                        image={convenience}
                        data={this.state.amenitiesData['convenience']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[2]} // Health
                        color={amenityColors['health']}
                        image={health}
                        data={this.state.amenitiesData['health']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[3]} // Community
                        color={amenityColors['community']}
                        image={community}
                        data={this.state.amenitiesData['community']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[4]} // Park
                        color={amenityColors['park']}
                        image={park}
                        data={this.state.amenitiesData['park']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[5]} // Childcare
                        color={amenityColors['childcare']}
                        image={childcare}
                        data={this.state.amenitiesData['childcare']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[6]} // Library
                        color={amenityColors['library']}
                        image={library}
                        data={this.state.amenitiesData['library']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[7]} // Grocery
                        color={amenityColors['grocery']}
                        image={grocery}
                        data={this.state.amenitiesData['grocery']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                    <AmenityButton 
                        name={this.state.amenityTypes[8]} // Worship
                        color={amenityColors['worship']}
                        image={worship}
                        data={this.state.amenitiesData['worship']}
                        updateAmenityVisibility={this.updateShownAmenities}
                    />
                </div>
            </div>
            
        )
    }
}
