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
	var ni = document.getElementById('handle')
	var newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'getting')
	newdiv.innerHTML = '<p><font color=\'blue\'>Getting Location...</font></p>';
	ni.appendChild(newdiv);
}

// Called by geolocation.js when the location was determined successfully.
//
// latitude and longitude are in decimal degrees.
// accuracy is in meters
function callbackReportLocation(latitude, longitude, accuracy)
{
	var ni = document.getElementById('handle')
	var toRemove = document.getElementById('getting')
	ni.removeChild(toRemove)
	
	var newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'location')
	newdiv.innerHTML = '<p><font color=\'green\'>Location: ' + latitude + ', ' + longitude + ' @ ' + accuracy +'</font></p>';
	ni.appendChild(newdiv);
}

//Called by geolocation.js in response when there was a problem determining the geolocation
function callbackReportError(errorCode, errorText)
{
	var ni = document.getElementById('handle')
	var toRemove = document.getElementById('getting')
	ni.removeChild(toRemove)
	
	var newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'location')
	newdiv.innerHTML = '<p><font color=\'red\'>Error(' + errorCode + '): ' + errorText + '</font></p>';
	ni.appendChild(newdiv);
}

