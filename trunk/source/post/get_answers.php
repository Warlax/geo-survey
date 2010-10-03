<?php

#Be sure to include the config file for all the params. 

#require_once 'db_config.inc.php';
require_once 'post.php';
$questionId = $_POST['questionId'];
#------------------------------------------------------#
#Start Sql statement, no where yet.

$sql = "Select questionId, questionDesc from Question ";

#if no questionId provided or questionId <1 , generate random question.using Rand() function. 
if($questionId < 1 || !$questionId)
{
  return 0; 
}

#if question id is provided, include a where. 
else{
 
     $sql .= "where questionId = $questionId";
}
$sql .= ";";
$result = runSQL($sql);
$row = mysql_fetch_row($result);
$questionDesc = $row[1];
$questionId   = $row[0];

#------------------------------------------------------#
#Now get the answer for the question.

$mysql = "Select * from Answer where questionId = $questionId";
$myresult = runSQl($mysql);
$ret   = array();
$ret[questionId]=$questionId;
$ret[questionDesc]=$questionDesc;
$ret[answers] = array();
while ($myrow = mysql_fetch_array($myresult,MYSQL_ASSOC))
{
 	 $sql = " Select s.*,u.* from userAnswer a
         	JOIN user u ON
 		 	a.userId = u.userId 
		 	JOIN Answer s ON
		 	s.answerId = a.answerId
			where a.answerId = $myrow[answerId]";

    $result = runSQL($sql);
	$arr = array();
	$arr_res = array();
	while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
	        $arr_res[] = $row;
	}
	$arr["answerId"]=$myrow[answerId];
	$arr["answerDesc"]=$myrow[answerDesc];
	$arr["list"]= $arr_res;
	array_push($ret[answers], $arr);

}



header("Expires: Mon, 24 Jul 2008 05:00:00 GMT" );
header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header("Cache-Control: no-cache, must-revalidate" );
header("Pragma: no-cache" );



echo json_encode($ret);

?>
