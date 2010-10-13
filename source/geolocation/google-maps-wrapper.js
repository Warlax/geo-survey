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
function addMarker(map, latitude, longitude, iconId)
{

    if(iconId != null)//if null then only make user location marker
    {
        var image = 'http://hivemap.comuf.com/icons/'+iconId+'.png';
  
        var latlng = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({position: latlng,
                                                  map: map,
                                                 icon: image });
    }
    else
    {
        var latlng = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({position: latlng,
                                                  map: map,
                                                  title: 'You Are Here!' });
    }
    
}

// This function takes in an array of google.maps.LatLng objects
// and returns a single google.maps.LatLng object that's the center
// of all the objects passed in the array.
function averageLatLng(latLngArray)
{
	var lat = 0
	var lng = 0
	var counter = 0
	for(latLng in latLngArray)
	{
		lat += latLng.lat
		lng += latLng.lng
		counter++
	}
	
	return new google.maps.LatLng(lat/counter, lng/counter)
}

// This function takes a google map object and an array of google.maps.LatLng objects.
// It will add a marker at each location in the locations array and center the map
// at the average location
function populateGoogleMap(map, locations)
{
	for(location in locations)
	{
		addMarker(map, location.lat, location.lng)
	}
	
	var center = averageLatLng(locations)
	map.setCenter(center)
}

// This function can show a new map (or update an existing map) on the page.
// It will create/update the map in the document element specified by the elementId parameter.
// The map will be centered at centerLat, centerLng
// Answer markers will be added to the map according to the answerList:
// If the answerList is null or empty, no markers will be added (other than possibly: one for the user's location)
// Also, if the list is empty, it could be useful to add some sort of text to the marker or to the bottom of the map
// such as "you are here"
// the answerList parameter is a list of dictionaries, each one representing a single answer.
// each of these dictionaries has the following three name/value pairs:
// -- answerId, an integer id for the answer
// -- answerDesc, a text string describing the question, i.e. "Do you like burritos?"
// -- locations, a list of dictionaries, one per geolocation of a person that answered using this answer, each having 2 name/value pairs:
// -- -- latitude, a float describing the latitude of the position
// -- -- longitude, a float describing the longitude of the position
function showMap(elementId, centerLat, centerLng, answerList)
{
	//TODO -- replace this code:
	var map_placeholder = document.getElementById(elementId)
	if (map_placeholder.hasChildNodes())
	{
	    while(map_placeholder.childNodes.length >= 1)
	    {
	        map_placeholder.removeChild(map_placeholder.firstChild);       
	    }
	}
	
	width = (document.width * 0.9) | 0
	height = (document.height * 0.5) | 0
	
	map_placeholder.style.width =  width + 'px'
	map_placeholder.style.height = height + 'px'
    
    var map = createGoogleMap(elementId, centerLat, centerLng, 100)
    var bounds = new google.maps.LatLngBounds(); //new


    if(answerList == null)
    {
        addMarker(map, centerLat, centerLng);
        
    }//end if
    else
    { //show all previous answers to the map
    
    
        for(var x = 0; x < answerList.length; x++)//go through each answer
        {
            var answer = answerList[x];
            var locations = answer["locations"];
        
            for(var i = 0; i < locations.length; i++)
            {
                var location = locations[i];
                var lat = location["latitude"];
                var lng = location["longitude"]; 
                var latlng = new google.maps.LatLng(lat, lng);
                addMarker(map, lat, lng, x);
                bounds.extend(latlng); //new
                map.fitBounds(bounds); //new
            //    if (map.getZoom() > 100) {map.setZoom(100);} // if not the first marker would not fit //new
            } 
        }
    }//end else
    
	//var notification = document.createElement('p')
	//notification.innerHTML = 'new map!'
	//map_placeholder.appendChild(notification)
	//*/
}		