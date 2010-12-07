
// Hides the map legend
function hideMapLegend()
{
	var legendElement = document.getElementById('map_legend');
	legendElement.style.display = "none";
	
	var showLegendElement = document.getElementById('show_legend')
	showLegendElement.value = 'false'
	
	// Add the show/hide link:
	var toggleLegendElement = document.getElementById('toggle_legend_link')
	toggleLegendElement.setAttribute('href', '#')
	toggleLegendElement.setAttribute('onClick', 'showMapLegend()')
	toggleLegendElement.innerHTML = '(Show map legend)'
}

// Shows the map legend
function showMapLegend()
{
	var id = 'map_legend'
	var legendElement = document.getElementById(id);
	
	if (document.getElementById) { // DOM3 = IE5, NS6
			legendElement.style.display = 'block';
		}
		else {
			if (document.layers) { // Netscape 4
				document.id.display = 'block';
			}
			else { // IE 4
				document.all.id.style.display = 'block';
			}
		}
	
	var showLegendElement = document.getElementById('show_legend')
	showLegendElement.value = 'true'
	
	// Add the show/hide link:
	var toggleLegendElement = document.getElementById('toggle_legend_link')
	toggleLegendElement.setAttribute('href', '#')
	toggleLegendElement.setAttribute('onClick', 'hideMapLegend()')
	toggleLegendElement.innerHTML = '(Hide map legend)'
}

function getAnswerColor(colorId)
{
	var colors =  {0:[255, 13, 9],
				   1:[6, 21, 255],
				   2:[28, 255, 51],
				   3:[230, 248, 75],
				   4:[109, 105, 175],
				   5:[248, 155, 42],
				   6:[237, 10, 143],
				   7:[156, 156, 156],
				   8:[236, 236, 236],
				   9:[169, 129, 89]}
				
    return colors[colorId]
}

function RGBtoHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(N) {
 if (N==null) return "00";
 N=parseInt(N); if (N==0 || isNaN(N)) return "00";
 N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
 return "0123456789ABCDEF".charAt((N-N%16)/16)
      + "0123456789ABCDEF".charAt(N%16);
}

// Updates the map legend by linking an answer text to each color
// The question parameter is a string
// The answers object is a dictionary:
//
// {1:"answer1 text", 2:"answer2 text", ...}
function updateMapLegend(question, answers)
{
	// Remember if we were hiding or showing the map:
	var showLegendElement = document.getElementById('show_legend')
	var showLegend = showLegendElement.value
	
	// Remove all map legend elements from its div
	var legendElementWrapper = document.getElementById('map_legend_wrapper')
	if (legendElementWrapper.hasChildNodes())
	{
	    while(legendElementWrapper.childNodes.length >= 1)
	    {
	        legendElementWrapper.removeChild(legendElementWrapper.firstChild);       
	    }
	}
	
	var legendElement = document.createElement('div')
	legendElement.setAttribute('id', 'map_legend')
	legendElementWrapper.appendChild(legendElement)
	
	// Add the question to the top of the legend:
	var heading = document.createElement('h4')
	heading.innerHTML = 'Showing map for question: "' + question + '"'
	legendElement.appendChild(heading)
	
	// Add a list to contain the legend entries:
	var list = document.createElement('ul')
	list.setAttribute('id', 'map_legend_list')
	legendElement.appendChild(list)
	
	// Iterate through the answers dictionary and add one child element to the list:
	var keys = [];
    for(var key in answers)
    {
        keys.push(key);
    }
	keys = keys.sort();
	
	for(var key in keys)
	{
		var value = answers[key]
		var listItem = document.createElement('li')
		var answerColorArray = getAnswerColor(key)
		var answerHTMLColor = '#' + RGBtoHex(answerColorArray[0], answerColorArray[1], answerColorArray[2])
		listItem.innerHTML = value.fontcolor(answerHTMLColor)
		list.appendChild(listItem)
	}
	
	// Add the hidden input field and store within it the current legend visibility boolean:
	showLegendElement = document.createElement('input')
	showLegendElement.setAttribute('id', 'show_legend')
	showLegendElement.setAttribute('type', 'hidden')
	showLegendElement.setAttribute('value', showLegend)
	legendElement.appendChild(showLegendElement)
		
	// Add the show/hide link:
	var toggleLegendElement = document.createElement('a')
	toggleLegendElement.setAttribute('href', '#')
	toggleLegendElement.setAttribute('id', 'toggle_legend_link')
	if(showLegend == 'true')
	{
		toggleLegendElement.setAttribute('onClick', 'hideMapLegend()')
		toggleLegendElement.innerHTML = '(Hide map legend)'
	}
	else
	{
		toggleLegendElement.setAttribute('onClick', 'showMapLegend()')
		toggleLegendElement.innerHTML = '(Show map legend)'
	}
	legendElementWrapper = document.getElementById('map_legend_wrapper')
	legendElementWrapper.appendChild(toggleLegendElement)

	// Toggle the visibility according to show/hide:
	if(showLegend == 'true')
	{
		showMapLegend()
	}
	else
	{
		hideMapLegend()
	}
}

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
//
// The question parameter is a string of the question description
function showMap(elementId, centerLat, centerLng, answerList, question)
{
	var map_placeholder = document.getElementById(elementId)
	if (map_placeholder.hasChildNodes())
	{
	    while(map_placeholder.childNodes.length >= 1)
	    {
	        map_placeholder.removeChild(map_placeholder.firstChild);       
	    }
	}

	var h = document.height * 0.5
	height = (h) | 0
	
	map_placeholder.style.width = '100%'
	map_placeholder.style.height = height + 'px'
    
    var map = createGoogleMap(elementId, centerLat, centerLng, 100)
    var bounds = new google.maps.LatLngBounds(); //new


    if(answerList == null)
    {
        addMarker(map, centerLat, centerLng);
        
    }//end if
    else
    { //show all previous answers to the map
    
		// the {int:string} associative array to hold the answerId and answer to be used to update the map legend:
		legend = {}
    
        for(var x = 0; x < answerList.length; x++)//go through each answer
        {
            var answer = answerList[x];
            var locations = answer["locations"];

			legend[x] = answer["answerDesc"]
        
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

		// Update the legend:
		updateMapLegend(question, legend)

    }//end else
    
	//var notification = document.createElement('p')
	//notification.innerHTML = 'new map!'
	//map_placeholder.appendChild(notification)
	//*/
}		