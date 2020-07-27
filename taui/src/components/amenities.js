import {Component} from 'react'

import Amenity from './amenity'

const childcare = '../../assets/img/icons/childcare.png'
const park = '../../assets/img/icons/park.png'
const grocery = '../../assets/img/icons/grocery.png'
const school = '../../assets/img/icons/school.png'
const convenience = '../../assets/img/icons/convenience.png'
const health = '../../assets/img/icons/health.png'
const library = '../../assets/img/icons/library.png'
const community = '../../assets/img/icons/community.png'
const worship = '../../assets/img/icons/worship.png'

type State = {
    amenities: string[],
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
export default class Amenities extends Component<Props, State> {
    constructor(props) {
        super(props)
        // Final amenities list: School, Park, Childcare, Library, Health, Grocery, Convenience, Community, Worship
        this.state = {
            amenities: ['School', 'Convenience', 'Health', 'Community', 'Park', 'Childcare', 'Library', 'Grocery',  'Worship']
        }
    }
    

    getNeighborhoodAmenityLocations(amenity) {
        // TODO
    }

    render(){
        return (
            <div className={'amenities-all'}>
                <p style={{fontWeight: 'bold'}}>Neighborhood Amenities</p>
                <div className={'amenities-box'}>
                    <Amenity
                        name={this.state.amenities[0]} // School
                        color={amenityColors['school']}
                        image={school}
                    />
                    <Amenity
                        name={this.state.amenities[1]} // Convenience
                        color={amenityColors['convenience']}
                        image={convenience}
                    />
                    <Amenity 
                        name={this.state.amenities[2]} // Health
                        color={amenityColors['health']}
                        image={health}
                    />
                    <Amenity 
                        name={this.state.amenities[3]} // Community
                        color={amenityColors['community']}
                        image={community}
                    />
                    <Amenity 
                        name={this.state.amenities[4]} // Park
                        color={amenityColors['park']}
                        image={park}
                    />
                    <Amenity 
                        name={this.state.amenities[5]} // Childcare
                        color={amenityColors['childcare']}
                        image={childcare}
                    />
                    <Amenity 
                        name={this.state.amenities[6]} // Library
                        color={amenityColors['library']}
                        image={library}
                    />
                    <Amenity 
                        name={this.state.amenities[7]} // Grocery
                        color={amenityColors['grocery']}
                        image={grocery}
                    />
                    <Amenity 
                        name={this.state.amenities[8]} // Worship
                        color={amenityColors['worship']}
                        image={worship}
                    />
                </div>
            </div>
            
        )
    }
}
