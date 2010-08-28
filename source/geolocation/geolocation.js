/****************************************************************
This script provides the geolocation service via its getLocation()
function.  It is HTML5 based.
****************************************************************/

// This function calls the geolocation backend service and asks for the current geolocation.
// If everything works out, the callbackReportLocation() will be called.  If there was an error,
// the callbackReportError() function will be called.
function getLocation()
{
	callbackGettingLocation()
	if (navigator.geolocation) 
	{
		navigator.geolocation.getCurrentPosition(success, error) 
	}
	else
	{
		alert("I'm sorry, but geolocation services are not supported by your browser.");
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
	if(err.code == 1)
	{
		errText = 'permission denied by user'
	}
	else if(err.code == 2)
	{
		errText = 'position unavailable'
	}
	else if(err.code == 3)
	{
		errText = 'timed out'
	}
	else if(err.code == 0)
	{
		errText = 'unknown error'
	}
	callbackReportError(err.code, errText)
}
