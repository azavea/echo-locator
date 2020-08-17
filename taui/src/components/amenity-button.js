// @flow
import {Component} from 'react'

type Props = {
    activeNeighborhood: string,
    clickedNeighborhood: any,
    color: string,
    data: any,
    image: string, // image url
    name: string,
    updateAmenityVisibility: (object[]) => void,
}

export default class AmenityButton extends Component<Props> {
  constructor (props) {
    super(props)
    this.state = {clicked: false, hovered: false, defaultColor: '#9AA0A6'}
    this.handleHover = this.handleHover.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.activeNeighborhood !== nextProps.activeNeighborhood) {
      this.setState({clicked: false})
      this.props.updateAmenityVisibility('', false)
    }
  }

  handleHover () {
    this.setState({hovered: !this.state.hovered})
  }

  handleClick () {
    this.setState({clicked: !this.state.clicked})
    this.props.updateAmenityVisibility(this.props.name, !this.state.clicked)
  }

  render () {
    // setting up styles for button
    var bgColor = ''
    if (this.state.clicked) {
      bgColor = this.props.color
    } else {
      bgColor = this.state.defaultColor
    }
    var name = this.props.name[0].toUpperCase() + this.props.name.slice(1, this.props.name.length)
    return (
      <button className='top-bar__button-amenities' style={{backgroundColor: bgColor}} onClick={this.handleClick} onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
        <img className='top-bar__icon' src={this.props.image} alt='' />
        {name}
      </button>
    )
  }
}
