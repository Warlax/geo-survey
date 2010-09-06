// Creates a google maps object in the html element with the given id.
// The map will be centered at center_lat, center_lng and start with the
// given initial zoom
// This function returns the google maps object that can then be used, for example
// to add markers to it.
function createGoogleMap(elementId, center_lat, center_lng, initial_zoom)
{
	var latlng = new google.maps.LatLng(center_lat, center_lng);
	var options = 
	{
		zoom: initial_zoom,
	    center: latlng,
	    mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var map = new google.maps.Map(document.getElementById(elementId), options);
	return map
}

// Add a marker to the given map.
// The marker's location is given by latitude and longitude.
// The title appears if you hover your mouse over the marker.
function addMarker(map, latitude, longitude, title)
{
	var latlng = new google.maps.LatLng(latitude, longitude)
	var marker = new google.maps.Marker({position: latlng, map: map, title: title})
}