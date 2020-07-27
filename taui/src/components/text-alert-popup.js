import React from 'react'
import onClickOutside from 'react-onclickoutside'

// import '../sass/style.css';
const request = require('request')
const axios = require('axios')

class Popup extends React.PureComponent {
  constructor (props) {
    super(props)
    this.addUserPreference = this.addUserPreference.bind(this, props.userProfile, props.id, props.city, props.setFavoriteAndToggle)
    this.removeUserPreference = this.removeUserPreference.bind(this, props.userProfile, props.id, props.setFavoriteAndToggle)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.handleFrequencyChange = this.handleFrequencyChange.bind(this)
    this.validatePhone = this.validatePhone.bind(this)
    this.state = {
      selectedOption: 'no',
      frequency: 'daily',
      error: false
    }
  }

  componentDidMount () {
    const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/get-user-phone'
    const json = {
      'user': this.props.userProfile.key
    }
    axios.post(url, json)
      .then(response => JSON.parse(response.data.body))
      .then(result => this.setState({
        phoneNumber: result
      }))
      .catch(err => {
        console.log(err)
        this.setState({
          phoneNumber: undefined
        })
      })
  }

  handleClickOutside = () => {
    this.props.closePopup()
  }

  validatePhone (number) {
    // If the length is not right
    if (number.length !== 10) {
      return false
    }

    // If any character is not a number
    for (var i = 0; i < number.length; i++) {
      if (!(number[i] >= '0' && number[i] <= '9')) {
        return false
      }
    }
    return true
  }

  addUserPreference (userProfile, neighborhood, city, setFavoriteAndToggle) {
    const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/add-text-preference'
    const frequency = this.state.frequency
    const phone = document.getElementsByName('phone')[0].value
    if (this.validatePhone(phone)) {
      var countryPhone
      if (phone.charAt(0) === '+') {
        countryPhone = phone
      } else {
        countryPhone = '+1' + phone
      }
      const json = {
        'userProfile': userProfile.key,
        'neighborhood': neighborhood,
        'phone': countryPhone,
        'frequency': frequency,
        'budget': userProfile.budget,
        'rooms': userProfile.rooms,
        'city': city
      }
      request.post({url: url, json: json}, function (err, res, body) {
        if (err) {
          console.log(err)
        }
      })
      setFavoriteAndToggle()
    } else {
      this.setState({
        error: true
      })
    }
  }

  removeUserPreference (userProfile, neighborhood, setFavoriteAndToggle) {
    setFavoriteAndToggle()
    const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/remove-text-preference'
    const json = {
      'userProfile': userProfile.key,
      'neighborhood': neighborhood
    }
    request.post({url: url, json: json}, function (err, res, body) {
      if (err) {
        console.log(err)
      }
    })
  }

  handleOptionChange (e) {
    this.setState({
      selectedOption: e.target.value
    })
  }

  handleFrequencyChange (e) {
    this.setState({
      frequency: e.target.value
    })
  }

  render () {
    if (this.props.optIn && this.state.selectedOption === 'yes') {
      let phoneClassName = 'phone-input'
      let sizeClass = 'popup_inner large'
      if (this.state.error) {
        phoneClassName += ' phone-input-error'
        sizeClass = 'popup_inner extra-large'
      }
      return (
        <div className={sizeClass}>
          <h1>Text Alerts</h1>
          <h2>Do you want to be texted about new apartments in {this.props.city} {this.props.id}?</h2>
          <p>You'll only receive texts for apartments within your budget.</p>
          <label className='radio-btn'>
            <input type='radio' value='yes' checked={this.state.selectedOption === 'yes'} onChange={this.handleOptionChange} /><p>Yes</p>
          </label>
          <label className='radio-btn'>
            <input type='radio' value='no' checked={this.state.selectedOption === 'no'} onChange={this.handleOptionChange} /><p>No</p>
          </label>
          <form>
            <label>
              <h2>Please enter your phone number:</h2>
              {this.state.phoneNumber &&
                <input type='text' name='phone' className='phone-input-read-only' value={this.state.phoneNumber.substring(2, this.state.phoneNumber.length)} readOnly />
              }
              {!this.state.phoneNumber &&
                <input type='text' name='phone' className={phoneClassName} />
              }
              {this.state.error &&
                <p className='error-message'>Enter as xxxxxxxxxx</p>
              }
            </label><br />
            <label>
              <h2>How often would you like to receive texts about new apartments?</h2>
            </label>
            <label className='radio-btn'>
              <input type='radio' value='daily' checked={this.state.frequency === 'daily'} onChange={this.handleFrequencyChange} /><p>Once a day</p>
            </label>
            <label className='radio-btn'>
              <input type='radio' value='weekly' checked={this.state.frequency === 'weekly'} onChange={this.handleFrequencyChange} /><p>Once a week</p>
            </label>
          </form>
          <p>You can edit your text preferences at any time within <a href='/profile' className='link'>your profile</a>.</p>
          <div className='btn-wrapper'>
            <button className='btn' onClick={this.addUserPreference}>Save this neighborhood with text alerts</button>
          </div>
        </div>
      )
    } else if (this.props.optIn && this.state.selectedOption === 'no') {
      return (
        <div className='popup_inner small'>
          <h1>Text Alerts</h1>
          <h2>Do you want to be texted about new apartments in {this.props.city} {this.props.id}?</h2>
          <p>You'll only receive texts for apartments within your budget.</p>
          <label className='radio-btn'>
            <input type='radio' value='yes' checked={this.state.selectedOption === 'yes'} onChange={this.handleOptionChange} /><p>Yes</p>
          </label>
          <label className='radio-btn'>
            <input type='radio' value='no' checked={this.state.selectedOption === 'no'} onChange={this.handleOptionChange} /><p>No</p>
          </label>
          <br />
          <p>You can edit your text preferences at any time within <a href='/profile' className='link'>your profile</a>.</p>
          <div className='btn-wrapper'>
            <button className='btn' onClick={this.props.setFavoriteAndToggle}>Save this neighborhood without text alerts</button>
          </div>
        </div>
      )
    } else if (!this.props.optIn && !this.state.showConfirmation) {
      return (
        <div className='popup_inner small'>
          <h1>Text Alerts</h1>
          <p>Unsaving {this.props.city} will cause you to stop receiving texts about new apartments in {this.props.city} if you have opted in. Would you still like to unsave this neighborhood?</p>
          <div className='btn-wrapper'>
            <button className='btn' onClick={this.props.closePopup}>No, keep this neighborhood saved</button>
            <button className='btn' onClick={this.removeUserPreference}>Yes, unsave this neighborhood</button>
          </div>
        </div>
      )
    }
  }
}

export default onClickOutside(Popup)
