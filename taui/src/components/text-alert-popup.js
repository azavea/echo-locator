import React from 'react';  
// import '../sass/style.css';  
const request = require('request')

class Popup extends React.PureComponent<Props> {  

  constructor (props) {
  	super(props)
  	this.addUserPreference = this.addUserPreference.bind(this, props.userProfile, props.id, props.setFavoriteAndToggle)
  	this.removeUserPreference = this.removeUserPreference.bind(this, props.userProfile, props.id, props.setFavoriteAndToggle)
  	console.log(this.props.userProfile)
  }

  addUserPreference(userProfile, neighborhood, setFavoriteAndToggle) {
  	setFavoriteAndToggle()
  	const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/add-text-preference'
  	const selector = document.getElementById('frequency')
  	const frequency = selector.options[selector.selectedIndex].value
  	const phone = document.getElementsByName("phone")[0].value
  	const json = {
  		"userProfile":userProfile.key,
  		"neighborhood":neighborhood,
  		"phone":phone,
  		"frequency":frequency
  	}

  	request.post({url:url, json:json}, function(err, res, body) {
  		if (err) {
  			console.log(err)
  		}
  	});
  }

  removeUserPreference(userProfile, neighborhood, setFavoriteAndToggle) {
  	console.log(userProfile)
  	setFavoriteAndToggle()
  	const url = 'https://akk8p5k8o0.execute-api.us-east-1.amazonaws.com/staging/remove-text-preference'
  	const json = {
  		"userProfile":userProfile.key,
  		"neighborhood":neighborhood
  	}

  	request.post({url:url, json:json}, function(err, res, body) {
  		if (err) {
  			console.log(err)
  		}
  		console.log("HERE")
  	})
  }

  render() {  
  	if (this.props.optIn) {
  		return (  
			<div className='popup' onClick={(e) => {e.stopPropagation()}}>  
				<div className='popup_inner'>  
					<p>Opt in for text messages here!</p> 
					<form>
						<label>
							Phone Number:
							<input type="text" name="phone" />
						</label><br />
						<select id='frequency'>
							<option value="instantaneous">Instantaneous</option>
							<option value="daily">Daily</option>
							<option value="weekly">Weekly</option>
						</select>
					</form> 
					<button className='btn' onClick={this.props.closePopup}>Cancel</button>
					<button className='btn' onClick={this.props.setFavoriteAndToggle}>No Text Alerts</button>
					<button className='btn' onClick={this.addUserPreference}>Opt In</button>  
				</div>  
			</div>  
		);  
  	}
  	else {
  		return (  
			<div className='popup'>  
				<div className='popup_inner'>  
					<p>Unsaving this neighborhood will cause you to opt out of text alerts!</p> 
					<button className='btn' onClick={this.props.closePopup}>Cancel</button>
					<button className='btn' onClick={this.removeUserPreference}>Confirm</button>
				</div>  
			</div>  
		);  
  	}
  }  
}  

export default Popup;