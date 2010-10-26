/***********************************************************
This script contains callback functions used by the geolocation.js script.
Do not call these functions, they get called for you.
Instead, substitute or extend their implementation to do something you want.
***********************************************************/

// Called by geolocation.js as soon as getLocation() starts getting the location.
// This courtesy function call is provided to the callback as an event hook for when the process of fetching the
// location has begun; once it's over, the callbackReportLocation() function will be invoked.
function callbackGettingLocation()
{
	// add a temporary element to notify the user we are getting the location.
	var ni = document.getElementById('status')
	ni.innerHTML = '<p><font color=\'blue\'>Getting Location...</font></p>'
	/*
	var ni = document.getElementById('status')
	var newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'getting')
	newdiv.innerHTML = '<p><font color=\'blue\'>Getting Location...</font></p>';
	ni.appendChild(newdiv);
	//*/
}

// Called by geolocation.js when the location was determined successfully.
//
// latitude and longitude are in decimal degrees.
// accuracy is in meters
function callbackReportLocation(latitude, longitude, accuracy)
{
	// first, remove the element added by callbackGettingLocation...
	var ni = document.getElementById('status')
	ni.innerHTML = ''
	/*
	var ni = document.getElementById('status')
	var toRemove = document.getElementById('getting')
	ni.removeChild(toRemove)
	//*/
	
	// show the map:
	showMap('map', latitude, longitude, null)
	
	// populate the hidden latitude/longitude inputs of the form:
	var latElement = document.getElementById('latitude')
	var lngElement = document.getElementById('longitude')
	latElement.value = latitude
	lngElement.value = longitude
	
	// TODO -- get gender and age from user via popup
	// TODO -- validation and verification of age, zip, and gender
	var age = 26
	var gender = "Male"
	var zip = 90210
	
	// populate the hidden latitude/longitude inputs of the form:
	var genElement = document.getElementById('gender')
	var ageElement = document.getElementById('age')
	var zipElement = document.getElementById('zip')
	genElement.value = gender
	ageElement.value = age
	zipElement.value = zip
	
	// get a random question from the database:
	getRandomQuestion()
}

//Called by geolocation.js in response when there was a problem determining the geolocation
function callbackReportError(errorCode, errorText, errorDetails)
{
	var ni = document.getElementById('status')
	ni.innerHTML = '<font color=\'red\'>' + errorText + '</font><br/>Error Code: ' + errorCode

	/*
	// first, remove the element added by callbackGettingLocation...
	var ni = document.getElementById('status')
	var toRemove = document.getElementById('getting')
	ni.removeChild(toRemove)
	
	// then, add a new element telling the user about the error
	var newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'location')
	newdiv.innerHTML = '<font color=\'red\'>' + errorText + '</font><b><i>' + errorDetails + '</i></b><br/>Error Code: ' + errorCode
	ni.appendChild(newdiv);
	//*/
}

