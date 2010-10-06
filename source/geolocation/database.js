//Warning: do not call this directly.
// Called by the create question function once the question has been added the database...
var callback_createQuestion = function questionCreated(response)
{
	// check for error:
	if(response == 0)
	{
		// Give a status:
		var statusElement = document.getElementById('status')
		statusElement.innerHTML = '<font color=\"#ff0000\">There was an error submitting this question</font>'
		return
	}
	
	// Give a status:
	var statusElement = document.getElementById('status')
	statusElement.innerHTML = '<font color=\"#00ff00\">...your question was created successfully</font>'
	
	// clean up old question entries...
	var questionDescElement = document.getElementById('questionDesc')
	questionDescElement.value = ''
	var answerListElement = document.getElementById('answerList')
	if (answerListElement.hasChildNodes())
	{
	    while (answerListElement.childNodes.length >= 1)
	    {
	        answerListElement.removeChild(answerListElement.firstChild);       
	    } 
	}
	
	// add list items again:
	for (i=1; i <= 10; i++)
	{
		var child = document.createElement('li')
		child.innerHTML = i + ".&nbsp;<input id=\"answer_" + i + "\" type=\"text\"/>"
		answerListElement.appendChild(child)
	}
}


//Warning: do not call this directly.
// Called by the create question button to create a question and add it to the database.
function createQuestion()
{
	var questionDesc = document.getElementById('questionDesc').value
	var answers = []

	for(i = 1; i <= 10; i++)
	{
		var element = document.getElementById('answer_' + i)
		var value = element.value
		if(value != '')
		{
			answers.push(value)
		}
	}	
	
	// Validation, question field and at least 2 answers must be provided...
	var error = ''
	if(questionDesc == '')
	{
		error += '<li>You must provide a question.</li>'
	}
	if(answers.length < 2)
	{
		error += '<li>You must provide at least 2 answers.</li>'
	}
	
	if(error != '')
	{
		// Give a status:
		var statusElement = document.getElementById('status')
		statusElement.innerHTML = '<font color=\"#ff0000\">Errors:<ul>' + error + '</ul>Question not created.</font>'
		return
	}
	
	// Give a status:
	var statusElement = document.getElementById('status')
	statusElement.innerHTML = '<font color=\"#0000ff\">Submitting new question...</font>'
	
	var object = {"questionDesc":questionDesc, "answers":answers}
	// TODO make the ajax call to store this in the database
	// the response can be anything other than 0.  0 means error.

	$.ajax({
	      type: "POST",
	      url: "../post/create_question.php",  //address of the php code
	      data: object ,   // parameter to pass onto the php code. 
	      success: function(resp){ 
	          // we have the response
	          if(resp.indexOf('<!') != -1)
  			  {
	              resp = resp.substring(0,resp.indexOf('<!'));
			  }
	          alert(resp)
                  callback_createQuestion(JSON.parse(resp)); //callback function is called to handle the resp text. 
                  return 1; 
	        },
	      error: function(e){
	        callback_createQuestion(0); //callback function need to be able to handle error also. 
	        return 0;
	      }
	    });
	
	
	//TODO -- this is a temporary call of the callback, remove this:
	//var response = 1	
	//callback_createQuestion(response)
}

// Warning: do not call this yourself.
// Removes the page elements of the current question.
function removeCurrentQuestion()
{
	// Clear the status:
	var statusElement = document.getElementById('status')
	statusElement.innerHTML = ''

	var questionElement = document.getElementById("question")
	questionElement.innerHTML = ''
	var questionIdElement = document.getElementById("questionId")
	questionIdElement.value = -1
	var form = document.getElementById("answer_form")
	
	var toRemove = []
	toRemove.push(document.getElementById('answer list'))
	toRemove.push(document.getElementById('submit button'))
	toRemove.push(document.getElementById('skip link'))

	for (var index in toRemove)
	{
		elementToRemove = toRemove[index]
		form.removeChild(elementToRemove)
	}
}

// Warning: do not call this yourself.
// This function is called by the submitAnswer function once a user answer was submitted successfully to the server.
// The response parameter is a JSON object like this:
// {"questionId":questionId, "question":questionDesc, "answers":[{"answerId":answerId, 
//                                                                "answerDesc":answerDesc, 
//                                                                "locations":[{"latitude":latitude, 
//                                                                              "longitude":longitude}
//                                                                            ... ]}
//                                                                ... ]}
//
// Example:
// {"questionId":questionId, "question":questionDesc, "answers":[{"answerId":0, "answerDesc":"Yes", "locations":[{"latitude":50, "longitude":50}, {"latitude":51, "longitude":51}]},
//                                                                           {"answerId":1, "answerDesc":"No", "locations":[{"latitude":52, "longitude":52}, {"latitude":53, "longitude":53}]},
//                                                                           {"answerId":2, "answerDesc":"What's a burrito?", "locations":[{"latitude":54, "longitude":54}, {"latitude":55, "longitude":55}]}]}
var callback_submitAnswer = function reportAnswerSubmitted(response)
{
	// check for error:
	if(response == 0)
	{
		// Give a status:
		var statusElement = document.getElementById('status')
		statusElement.innerHTML = '<font color=\"#ff0000\">There was an error submitting this answer, try again later</font>'
		return
	}
	
	// Give a status:
	var statusElement = document.getElementById('status')
	statusElement.innerHTML = '<font color=\"#00ff00\">...your answer was submitted successfully.</font>'

	var mapParams = {}	
	var questionDesc = response["question"]
	var answers = response["answers"]

	// get the geolocation from the page, we'll use this to center the map:
	var latElement = document.getElementById('latitude')
	var lngElement = document.getElementById('longitude')
	var latitude = latElement.value
	var longitude = lngElement.value
	
	// show/update the map:
	showMap('map', latitude, longitude, answers)
	
	// TODO -- optional: show a pie chart alongside the map...
	
	// remove the old question:
	removeCurrentQuestion()
	
	// get a new question:
	getRandomQuestion()
}

// reads the different fields of our form, validates everything, and submits the user response to
// be stored in the database.
function submitAnswer()
{
	// collect answer:
	var qDcElement = document.getElementById('question')
	var latElement = document.getElementById('latitude')
	var lngElement = document.getElementById('longitude')
	var genElement = document.getElementById('gender')
	var ageElement = document.getElementById('age')
	var qIdElement = document.getElementById('questionId')
	var answerList = document.getElementById('answer list')
	
	var questionDesc = qDcElement.innerHTML
	var latitude = latElement.value
	var longitude = lngElement.value
	var gender = genElement.value
	var age = ageElement.value
	var questionId = qIdElement.value
	var listItems = answerList.childNodes
	var answerId = null
	var answerDesc = null
	
	for (var index in listItems)
	{
		var listItem = listItems[index]
		// the list item can have multiple children, but we are only interested in its 'radio' item:
		for(var listItemChildIndex in listItem.childNodes)
		{
			var listItemChild = listItem.childNodes[listItemChildIndex]
			if(listItemChild.type == "radio")
			{
				var radio = listItemChild
				if(radio.checked)
				{
					answerId = radio.id
					break
				}
			}
		}
		
		if(answerId != null)
		{
			// now let's look for the answer description from the label element:
			for(var listItemChildIndex in listItem.childNodes)
			{
				var listItemChild = listItem.childNodes[listItemChildIndex]
				if(listItemChild.tagName == "LABEL")
				{
					var label = listItemChild
					answerDesc = label.innerHTML
				}
			}
			break
		}
	}
	
	// make sure something was checked:
	if(answerId == null)
	{
		// Give a status:
		var statusElement = document.getElementById('status')
		statusElement.innerHTML = '<font color=\"#ff0000\">You must select an answer!</font>'
		return
	}
	else
	{
		// Give a status:
		var statusElement = document.getElementById('status')
		statusElement.innerHTML = '<font color=\"#0000ff\">Submitting your answer...</font>'

		// create the JSON object:
		var object = {"questionId":questionId, "answerId":answerId, "latitude":latitude, 
		              "longitude":longitude, "age":age, "gender":gender}
		// TODO make the ajax call to store this in the database
		// the response object needs to be a JSON object as defined in the reportAnswerSubmitted function
		
		$.ajax({
		      type: "POST",
		      url: "../post/save_answer.php",  //address of the php code
		      data: object, // parameter to pass onto the php code. 
		      success: function(resp){ 
	          // we have the response
	              if(resp.indexOf('<!') != -1)
  	         	  {
	              resp = resp.substring(0,resp.indexOf('<!'));
			  }
	            alert(resp)
                    callback_submitAnswer(JSON.parse(resp)); //callback function is called to handle the resp text. 
                    return 1; 
		        },
		    error: function(e){
		    callback_submitAnswer(0); //callback function need to be able to handle error also. 
		    return 0;
		      }
		    });
		
		
		//TODO -- this is a temporary call of the callback, remove this:
		var response = {"questionId":questionId, "question":questionDesc, "answers":[{"answerId":0, "answerDesc":"Yes", "locations":[{"latitude":50, "longitude":50}, {"latitude":51, "longitude":51}]},
		                                                                             {"answerId":1, "answerDesc":"No", "locations":[{"latitude":52, "longitude":52}, {"latitude":53, "longitude":53}]},
		                                                                             {"answerId":2, "answerDesc":"What's a burrito?", "locations":[{"latitude":54, "longitude":54}, {"latitude":55, "longitude":55}]}]}
		callback_submitAnswer(response)
	}
}

// Reports a JSON object containing a question to the web page, it contains:
// the question ID, the question itself, and a list of all possible answers as answerID, answer text pairs.
// the IDs will be used to store the question and answer in the database.
var callback_getRandomQuestion = function reportRandomQuestion(questionObject)
{
	// check for error:
	if(questionObject == 0)
	{
		//TODO -- handle error...
		return
	}
	
	// sample: {"questionId":"id", "question":"what is blah blah", "answers":[{"answerId":1, "answerDesc":"it is a"}, {"answerId":2, "answerDesc":"it is b"}]}
	var questionId = questionObject["questionId"]
	var questionText = questionObject["question"]
	var answerList = questionObject["answers"]
	
	var questionElement = document.getElementById("question")
	questionElement.innerHTML = questionText
	
	var questionIdElement = document.getElementById("questionId")
	questionIdElement.value = questionId
	
	var form = document.getElementById("answer_form")
	var unorderedList = document.createElement('ul')
	unorderedList.setAttribute('id', 'answer list')
	for (var answer in answerList)
	{
		var answerId = answerList[answer].answerId
		var answerDesc = answerList[answer].answerDesc
		
		var listItem = document.createElement('li');
		var labelFor = document.createElement('label')
		labelFor.setAttribute('for', answerId)
		labelFor.innerHTML = answerDesc
		var option = document.createElement('input')
		option.setAttribute('id', answerId)
		option.setAttribute('type', 'radio')
		option.setAttribute('name', 'answer')
		option.setAttribute('value', answerId)
		listItem.appendChild(option)
		listItem.appendChild(labelFor)
		unorderedList.appendChild(listItem);
	}
	form.appendChild(unorderedList)

	var submitButton = document.createElement('input')
	submitButton.setAttribute('id', 'submit button')
	submitButton.setAttribute('type', 'submit')
	submitButton.setAttribute('value', 'submit')
	
	var onClickString = 'submitAnswer()'
	submitButton.setAttribute('onClick', onClickString)
	form.appendChild(submitButton)
	
	var skipLink = document.createElement('a')
	skipLink.setAttribute('id', 'skip link')
	skipLink.setAttribute('href', '#')
	skipLink.setAttribute('onClick', 'removeCurrentQuestion(); getRandomQuestion()')
	skipLink.innerHTML = 'skip this question'
	form.appendChild(skipLink)
}

// The function will initiate a database query to return a JSON object containing a question so it can be displayed to the user.
// When done, it will call reportRandomQuestion with the JSON object.
function getRandomQuestion()
{
	$.ajax({
	      type: "POST",
	      url: "../post/get_question.php",  //address of the php code
	      data: "questionId=0", // parameter to pass onto the php code. 
	      success: function(resp){ 
	          // we have the response
	          if(resp.indexOf('<!') != -1)
  			  {
	              resp = resp.substring(0,resp.indexOf('<!'));
			  }
	          alert(resp)
              callback_getRandomQuestion(JSON.parse(resp)); //callback function is called to handle the resp text. 
              return 1; 
	      },
	      error: function(e){
	          callback_getRandomQuestion(0); //callback function need to be able to handle error also. 
	          return 0;
	      }
	    });
}
