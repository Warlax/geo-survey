function getQuestion(callback, questionId) {
$.ajax({
      type: "POST",
      url: "/post/get_question.php",  //address of the php code
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
      url: "/post/get_answers.php",  //address of the php code
      data: "questionId="+questionId, // parameter to pass onto the php code.
      success: function(resp){
        // we have the response
        if(resp.indexOf("<!") >0){
				alert(resp);
	 			resp = resp.substring(0,resp.indexOf("<!"));
		}
      // alert(resp);
        callback(JSON.parse(resp)); //callback function is called to handle the resp text.
        return 1;
        },
      error: function(e){
        callback(0); //callback function need to be able to handle error also.
        return 0;
      }
    });
}
