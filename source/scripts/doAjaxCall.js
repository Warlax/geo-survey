function getQuestion(callback, questionId) {
$.ajax({
      type: "POST",
      url: "../post/get_question.php",  //address of the php code
      data: "questionId="+questionId, // parameter to pass onto the php code.
      success: function(resp){
        // we have the response
        if(resp.indexOf("<!")) resp = resp.substring(0,resp.indexOf("<!"));
		
        callback(JSON.parse(resp)); //callback function is called to handle the resp text.
        return 1;
        },
      error: function(e){
        callback(0); //callback function need to be able to handle error also.
        return 0;
      }
    });
}
 
function getAnswers(callback, questionId) {
$.ajax({
      type: "POST",
      url: "../post/get_answers.php",  //address of the php code
      data: "questionId="+questionId, // parameter to pass onto the php code.
      success: function(resp){
        // we have the response
        if(resp.indexOf("<!") >0){
	 			resp = resp.substring(0,resp.indexOf("<!"));
		}

        callback(JSON.parse(resp)); //callback function is called to handle the resp text.
        return 1;
        },
      error: function(e){
        callback(0); //callback function need to be able to handle error also.
        return 0;
      }
    });
}

//Do a search for all question that has the subject match any of the keyword
function doSubjectSearch(callback, queryString,page,pageSize) {
$.ajax({
      type: "POST",
      url: "../post/doSubjectSearch.php",  //address of the php code
      data: {"queryString":queryString,
	     "page":page,
	     "pageSize":pageSize}, // parameter to pass onto the php code.
      success: function(resp){
        // we have the response
        if(resp.indexOf("<!") >0){
	 			resp = resp.substring(0,resp.indexOf("<!"));
		}

        callback(JSON.parse(resp)); //callback function is called to handle the resp text.
        return 1;
        },
      error: function(e){
        callback(0); //callback function need to be able to handle error also.
        return 0;
      }
    });
}

//Do a search for all question that has the category match any of the keyword
function doCategorySearch(callback, queryString,page,pageSize) {
$.ajax({
      type: "POST",
      url: "../post/doCategorySearch.php",  //address of the php code
      data: {"queryString":queryString,
	     "page":page,
	     "pageSize":pageSize}, // parameter to pass onto the php code.
      success: function(resp){
        // we have the response
        if(resp.indexOf("<!") >0){
	 			resp = resp.substring(0,resp.indexOf("<!"));
		}

        callback(JSON.parse(resp)); //callback function is called to handle the resp text.
        return 1;
        },
      error: function(e){
        callback(0); //callback function need to be able to handle error also.
        return 0;
      }
    });
}

//List all available category in the db.
function listCategory(callback) {
$.ajax({
      type: "POST",
      url: "../post/listCategory.php",  //address of the php code
      data: "", // parameter to pass onto the php code.
      success: function(resp){
        // we have the response
        if(resp.indexOf("<!") >0){
	 			resp = resp.substring(0,resp.indexOf("<!"));
		}

        callback(JSON.parse(resp)); //callback function is called to handle the resp text.
        return 1;
        },
      error: function(e){
        callback(0); //callback function need to be able to handle error also.
        return 0;
      }
    });
}
