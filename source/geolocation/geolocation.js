/****************************************************************
This script provides the geolocation service via its getLocation()
function.  It is HTML5 based.
****************************************************************/

// This function calls the geolocation backend service and asks for the current geolocation.
// If everything works out, the callbackReportLocation() will be called.  If there was an error,
// the callbackReportError() function will be called.
function getLocation()
{
	if(Modernizr.geolocation)
	{
		callbackGettingLocation()
		if (navigator.geolocation) 
		{
			navigator.geolocation.getCurrentPosition(success, error) 
		}
		else
		{
			callbackReportError(4, "geolocation services are not supported by this browser.");
		}  
	}
	else
	{
		callbackReportError(5, "geolocation services are not supported by the browser due to lack of support of HTML 5.");
	}  
}

// CAUTION: do not call this function, it gets called internally
function success(p)
{
	var lat = p.coords.latitude;
	var lng = p.coords.longitude;
	var acc = p.coords.accuracy;
	callbackReportLocation(lat, lng, acc)
}

// CAUTION: do not call this function, it gets called internally
function error(err)
{
	var errText = 'unknown error'
	var errDetails = ''
	if(err.code == 1)
	{
		errText = "You have denied permission to use your browser's geolocation functionality."
		errDetails = "<br/>You cannot answer questions on GeoHive without permitting geolocation.<br/>Click <a href=\"geolocation.html\">here</a> to see why and how we use your location."
	}
	else if(err.code == 2)
	{
		errText = "This browser does not support HTML5 location aware services." 
		errDetails = "We are sorry, but you cannot use GeoHive.<br/>" +
		"To see which browsers support geolocation, click <a href=\"geolocation.html\">here</a>"
	}
	else if(err.code == 3)
	{
		errText = "We're sorry, it is taking too long to get your location from your browser."
		errDetails = "Please try reloading the page."
	}
	else if(err.code == 0)
	{
		errText = "Ouch, we've just experienced an unknown error!<br/>"
		errDetails = "Please try reloading the page."
	}
	callbackReportError(err.code, errText, errDetails)
}
