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
	window.location = currentLocation + "/search.html?search=" + query + "&page=1&pageSize=20"
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
// query is the original query used
// page is a parameter telling us the number of the page of the results we are currently on, page numbers start at 1
// pageSize is a parameter telling us how many entries are on each page
// pages tells us how many total pages there are (total number of questions / pageSize)
// The result object is a list of:
// -- questionId
// -- questionDesc
var callback_searchResults = function seachResultsCallback(result, query, page, pageSize, pages)
{
	// handle error:
	if(result == 0)
	{
		//TODO -- handle error better
		return
	}
	
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
	
	// Add pagination links:
	// First, add a div:
	var paginationDiv = document.createElement('div')
	paginationDiv.setAttribute('id', 'pagination')
	contentDiv.appendChild(paginationDiv)
	
	// Next, add the 5 elements like this: first page -- prev page -- current page / total pages -- next page -- last page

	if(page - 1 > 0)
	{
		var firstPageLink = document.createElement('a')
		firstPageLink.setAttribute('class', 'paginationLink')
		firstPageLink.href = 'search.html?search=' + query + '&page=1&pageSize=' + pageSize
		firstPageLink.innerHTML = 'First page'
		paginationDiv.appendChild(firstPageLink)

		var prevPageLink = document.createElement('a')
		prevPageLink.setAttribute('class', 'paginationLink')
		prevPageLink.href = 'search.html?search=' + query + '&page=' + (page - 1) + '&pageSize=' + pageSize
		prevPageLink.innerHTML = 'Previous page'
		paginationDiv.appendChild(prevPageLink)
	}
	
	var curPageLink = document.createElement('a')
	curPageLink.setAttribute('class', 'paginationLink')
	curPageLink.href = 'search.html?search=' + query + '&page=' + page + '&pageSize=' + pageSize
	curPageLink.innerHTML = 'Page ' + page + '/' + pages
	paginationDiv.appendChild(curPageLink)

	if(page + 1 <= pages)
	{
		var nextPageLink = document.createElement('a')
		nextPageLink.setAttribute('class', 'paginationLink')
		nextPageLink.href = 'search.html?search=' + query + '&page=' + (page + 1) + '&pageSize=' + pageSize
		nextPageLink.innerHTML = 'Next page'
		paginationDiv.appendChild(nextPageLink)

		var lastPageLink = document.createElement('a')
		lastPageLink.setAttribute('class', 'paginationLink')
		nextPageLink.href = 'search.html?search=' + query + '&page=' + pages + '&pageSize=' + pageSize
		nextPageLink.innerHTML = 'Last page'
		paginationDiv.appendChild(lastPageLink)
	}
}

// Actually performs the search based on the parameters in the URL.
function performSearch()
{
	var params = getParams();
	var query = params["search"]
	var page = parseInt(params["page"])
	var pageSize = parseInt(params["pageSize"])
	
	var object = {}
	
	$.ajax({
	      type: "POST",
	      url: "../post/doSubjectSearch.php",  //address of the php code
	      data: object, // parameter to pass onto the php code. 
	      success: function(resp){ 
          // we have the response
          if(resp.indexOf('<!') != -1)
          {
              resp = resp.substring(0,resp.indexOf('<!'));
	      }

          doSubjectSearch(callback_searchResults, query, page, pageSize)

          return 1; 
        },
	    error: function(e)
	    {
		    callback_searchResults(0, 0, 0, 0); //callback function need to be able to handle error also. 
		    return 0;
        }
	    });
}

// Displays the question:
// Reports a JSON object containing a question to the web page, it contains:
// the question ID, the question itself, and a list of all possible answers as answerID, answer text pairs.
// the IDs will be used to store the question and answer in the database.
var displayQuestion_callback = function callbackDisplayQuestion(questionObject)
{
	// check for error:
	if(questionObject == 0)
	{
		// TODO -- do something
		return
	}
	
	var contentDiv = document.getElementById("content")
	
	// sample: {"questionId":"id", "question":"what is blah blah", "answers":[{"answerId":1, "answerDesc":"it is a"}, {"answerId":2, "answerDesc":"it is b"}]}
	var questionId = questionObject["questionId"]
	var questionText = questionObject["questionDesc"]
	var answerList = questionObject["answers"]
	
	var questionElement = document.createElement("question")
	questionElement.innerHTML = questionText
	contentDiv.appendChild(questionElement)
	
	// Create a Google map:
	showMap('map', 0, 0, answerList, questionText)
		
	var unorderedList = document.createElement('ul')
	unorderedList.setAttribute('id', 'answer list')
	for (var answer in answerList)
	{
		var answerId = answerList[answer].answerId
		var answerDesc = answerList[answer].answerDesc
		var listItem = document.createElement('li');
		listItem.innerHTML = answerDesc
		unorderedList.appendChild(listItem);
	}
	contentDiv.appendChild(unorderedList)
}

// Fetches a question to display:
function displayQuestion()
{
	var params = getParams();
	var questionId = parseInt(params["questionId"])
	getAnswers(displayQuestion_callback, questionId)
}