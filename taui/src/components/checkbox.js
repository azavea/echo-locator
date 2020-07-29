import React, { Component } from 'react'

class Checkbox extends Component {
  state = {
    isChecked: false
  }

  toggleCheckboxChange = () => {
    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked
      }
    ))

    this.props.handleCheckboxChange(this.state.isChecked)
  }

  render () {
    const { label } = this.props
    const { isChecked } = this.state

    return (
      <div className='account-profile__text-alerts__checkbox'>
        <label>
          <input
            type='checkbox'
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />

          <p>{label}</p>
        </label>
      </div>
    )
  }
}

export default Checkbox
