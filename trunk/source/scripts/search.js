// Initiates a question search based on the text in the text field input element
// with the id of "searchField" by changing the window.location (e.g. browser address)
// to the question.html page with the search query passed as the single parameter:
function startSearch()
{
	var searchField = document.getElementById("searchField")
	var query = searchField.value
	
	// get the current address the browser is on:
	var currentLocation = document.URL
	// remove everything after the last /:
	currentLocation = currentLocation.substring(0, currentLocation.lastIndexOf("/"));
	// add the question.html suffix:
	window.location = currentLocation + "/search.html?search=" + query + "&page=0&pageSize=20"
}

// Returns the URL params from the URL (? followed by name=value&... pairs)
function getParams() 
{
	var idx = document.URL.indexOf('?');
	var tempParams = new Object();
	if (idx != -1) 
	{
		var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i=0; i<pairs.length; i++) 
		{
			nameVal = pairs[i].split('=');
			tempParams[nameVal[0]] = nameVal[1];
		}
	}
	return tempParams;
}

// Sets up the page to display the question passed in the question object.
// page is a parameter telling us the number of the page of the results we are currently on, page numbers start at 0
// pageSize is a parameter telling us how many entries are on each page
// pages tells us how many total pages there are (total number of questions / pageSize)
// The result object is a list of:
// -- questionId
// -- questionDesc
var callback_searchResults = function seachResultsCallback(result, page, pageSize, pages)
{
	// Clear the content div:
	var contentDiv = document.getElementById('content')
	if (contentDiv.hasChildNodes())
	{
	    while(contentDiv.childNodes.length >= 1)
	    {
	        contentDiv.removeChild(contentDiv.firstChild);       
	    }
	}
	
	// Create and add an unordered list to the content div:
	var unorderedList = document.createElement('ul')
	unorderedList.setAttribute('id', 'search_results_list')
	contentDiv.appendChild(unorderedList)	
	
	// Create and add one list item per question in the result set:
	for(i = 0; i < result.length; i++)
	{
		var question = result[i]
		var questionId = question.questionId
		var questionDesc = question.questionDesc
		
		var listItem = document.createElement('li')
		listItem.setAttribute('class', 'search_results_entry')
		listItem.innerHTML = '<a href="question.html?questionId=' + questionId + '">' + questionDesc + '</a>'
		unorderedList.appendChild(listItem)
	}
	
	//TODO -- add pagination links...
}

// Actually performs the search based on the parameters in the URL.
function performSearch()
{
	var params = getParams();
	var query = params["search"]
	var page = params["page"]
	var pageSize = params["pageSize"]
	
	//TODO -- really perform a search according to the said query, offset, and amount...
	var fake = [{"questionId":0, "questionDesc":"Question1"},{"questionId":1, "questionDesc":"Question2"}]
	callback_searchResults(fake)
}