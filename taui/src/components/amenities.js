import {Component} from 'react'

import Amenity from './amenity'

type State = {
    amenities: string[],
}

// Class that handles Amenity functionality
export default class Amenities extends Component<Props, State> {
    constructor(props) {
        super(props)
    }

    state = {
        amenities: ['School', 'Park']
    }

    getNeighborhoodAmenityLocations(amenity) {
        // TODO
    }

    render(){
        console.log(this.state)
        return (
            <div className={'ameities-box'}>
                <Amenity
                    name={this.state.amenities[0]}
                    color={'red'}
                />
                <Amenity
                    name={this.state.amenities[1]}
                    color={'blue'}
                />
            </div>
        )
    }
}
