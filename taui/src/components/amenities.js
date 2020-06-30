import {Component} from 'react'

import Amenity from './amenity'

import childcare from '../img/icons/childcare.png'
import park from '../img/icons/park.png'
import grocery from '../img/icons/grocery.png'
import school from '../img/icons/school.png'
import playground from '../img/icons/playground.png'
import medical from '../img/icons/medical.png'
import library from '../img/icons/library.png'

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
