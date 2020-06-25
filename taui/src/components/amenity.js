import {Component} from 'react'

type Props = {
    name: string,
    image?: string, // image url
    color: string,
}

export default class Amenity extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'amenities-amenity'}>
                <button style={{color:this.props.color}}>
                    {this.props.name}
                </button>
            </div>
        )
        
    }
}