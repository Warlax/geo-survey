// Warning: do not call this yourself.
// This function is called by the submitAnswer function once a user answer was submitted successfully to the server.
// The response parameter is a JSON object like this:
// {"questionId":questionId, "question":questionDesc, "answers":[{"answerId":answerId, 
//                                                                "answerDesc":answerDesc, 
//                                                                "locations":[{"latitude":latitude, 
//                                                                              "longitude":longitude}
//                                                                            ... ]}
//                                                                ... ]}
var callback_submitAnswer = function reportAnswerSubmitted(response)
{
	var mapParams = {}	
	var questionDesc = response["question"]
	var answers = response["locations"]

	// get the geolocation from the page, we'll use this to center the map:
	var latElement = document.getElementById('latitude')
	var lngElement = document.getElementById('longitude')
	var latitude = latElement.value
	var longitude = lngElement.value
	
	// show/update the map:
	showMap('map', latitude, longitude, answers)
	
	// TODO -- optional: show a pie chart alongside the map...
	
	// remove the old question:
	var questionElement = document.getElementById("question")
	questionElement.innerHTML = ''
	var questionIdElement = document.getElementById("questionId")
	questionIdElement.value = -1
	var form = document.getElementById("answer_form")
	
	var toRemove1 = document.getElementById('answer list')
	var toRemove2 = document.getElementById('submit button')
	
	form.removeChild(toRemove1)
	form.removeChild(toRemove2)
	
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
			break
		}
	}
	
	// make sure something was checked:
	if(answerId == null)
	{
		// TODO
	}
	else
	{
		// create the JSON object:
		var object = {"questionId":questionId, "answerId":answerId, "latitude":latitude, 
		              "longitude":longitude, "age":age, "gender":gender}
		// TODO make the ajax call to store this in the database
		// the response object needs to be a JSON object as defined in the reportAnswerSubmitted function
		/*
		$.ajax({
		      type: "POST",
		      url: "/post.php",  //address of the php code
		      data: "otherParams", // parameter to pass onto the php code. 
		      success: function(callback_submitAnswer){ 
		        // we have the response
		        callback_submitAnswer(resp); //callback function is called to handle the resp text. 
		        return 1; 
		        },
		      error: function(e){
		        callback(0); //callback function need to be able to handle error also. 
		        return 0;
		      }
		    });
		//*/
		
		//TODO -- this is a temporary call of the callback, remove this:
		var response = {"questionId":questionId, "question":questionDesc ,"answerId":answerId, "locations":[{"latitude":100, "longitude":100}, {"latitude":101, "longitude":101}]}
		callback_submitAnswer(response)
	}
}

// Reports a JSON object containing a question to the web page, it contains:
// the question ID, the question itself, and a list of all possible answers as answerID, answer text pairs.
// the IDs will be used to store the question and answer in the database.
var callback_getRandomQuestion = function reportRandomQuestion(questionObject)
{
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
}

// The function will initiate a database query to return a JSON object containing a question so it can be displayed to the user.
// When done, it will call reportRandomQuestion with the JSON object.
function getRandomQuestion()
{
	// sample: {"questionId":"id", "question":"what is blah blah", "answers":[{"answerId":1, "answerDesc":"it is a"}, {"answerId":2, "answerDesc":"it is b"}]}
	// TODO -- replace this fake question, with real database stuff
	var ret = {"questionId":3, 
	           "question":"Do you like burritos?",
	           "answers":[{"answerId":0, "answerDesc":"Yes"},
	                      {"answerId":1, "answerDesc":"No"},
	                      {"answerId":2, "answerDesc":"What's a burrito?"}]}
	
	// TODO make the ajax call to get this from the database
	/*
	$.ajax({
	      type: "POST",
	      url: "/post.php",  //address of the php code
	      data: "otherParams", // parameter to pass onto the php code. 
	      success: function(callback_getRandomQuestion){ 
	        // we have the response
	        callback_getRandomQuestion(resp); //callback function is called to handle the resp text. 
	        return 1; 
	        },
	      error: function(e){
	        callback(0); //callback function need to be able to handle error also. 
	        return 0;
	      }
	    });
	//*/
	
	callback_getRandomQuestion(ret)
}
