import {Component} from 'react'

import Amenity from './amenity'

const childcare = '../../assets/img/icons/childcare.png'
const park = '../../assets/img/icons/park.png'
const grocery = '../../assets/img/icons/grocery.png'
const school = '../../assets/img/icons/school.png'
const playground = '../../assets/img/icons/playground.png'
const medical = '../../assets/img/icons/medical.png'
const library = '../../assets/img/icons/library.png'

type State = {
    amenities: string[],
}

const amenityColors = {
    'school': '#FFA000',
    'medical': '#F27660',
    'childcare': '#E9658D',
    'park': '#48B265',
    'grocery': '#4D97CA',
    'playground': '#28B3B0',
    'library': '#7F9DA5',
}

// Class that handles Amenity functionality
export default class Amenities extends Component<Props, State> {
    constructor(props) {
        super(props)
        // Final amenities list: School, Park, Playground, Childcare, Library, Medical, Grocery
        this.state = {
            amenities: ['School', 'Park', 'Playground', 'Childcare', 'Library', 'Medical', 'Grocery']
        }
    }
    

    getNeighborhoodAmenityLocations(amenity) {
        // TODO
    }

    render(){
        return (
            <div>
                <p style={{fontWeight: 'bold'}}>Features</p>
                <div className={'amenities-box'}>
                    <Amenity
                        name={this.state.amenities[0]} // School
                        color={amenityColors['school']}
                        image={school}
                    />
                    <Amenity
                        name={this.state.amenities[1]} // Park
                        color={amenityColors['park']}
                        image={park}
                    />
                    <Amenity 
                        name={this.state.amenities[2]} // Playground
                        color={amenityColors['playground']}
                        image={playground}
                    />
                    <Amenity 
                        name={this.state.amenities[3]} // Childcare
                        color={amenityColors['childcare']}
                        image={childcare}
                    />
                    <Amenity 
                        name={this.state.amenities[4]} // Library
                        color={amenityColors['library']}
                        image={library}
                    />
                    <Amenity 
                        name={this.state.amenities[5]} // Medical
                        color={amenityColors['medical']}
                        image={medical}
                    />
                    <Amenity 
                        name={this.state.amenities[6]} // Grocery
                        color={amenityColors['grocery']}
                        image={grocery}
                    />
                </div>
            </div>
            
        )
    }
}
