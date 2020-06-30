import {Component} from 'react'

type Props = {
    name: string,
    image: string, // image url
    color: string,
}

export default class Amenity extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {clicked: false, hovered: false, defaultColor: '#9AA0A6'}
        this.handleHover = this.handleHover.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    

    handleHover() {
        this.setState({hovered: !this.state.hovered})
    }

    handleClick() {
        this.setState({clicked: !this.state.clicked})
    }

    render() {
        // setting up styles for button
        var bgColor = '';
        if (this.state.clicked) {
            if (this.state.hovered) {
                bgColor = this.state.defaultColor;
            }
            else {
                bgColor = this.props.color;
            }
        }
        else {
            if (this.state.hovered) {
                bgColor = this.props.color;
            }
            else {
                bgColor = this.state.defaultColor;
            }
        }
        var buttonStyle = {backgroundColor: bgColor, color:'white', padding: '0% 20%', width: '110%', height: '110%', fontSize:'80%'}

        return (
            <div className={'amenities-amenity'} onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
                <button style={buttonStyle} onClick={this.handleClick}>
                    <img src={this.props.image} alt=''></img>
                    {this.props.name}
                </button>
            </div>
        )
        
    }
}