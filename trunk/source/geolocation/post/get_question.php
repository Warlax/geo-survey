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
    $sql .= "order by Rand() limit 1";
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
$sql = " Select * from Answer where questionId = $questionId ";

$result = runSQL($sql);

$arr = array();
while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
	$arr[]=$row;

}

$ret = array();
$ret[questionId]   = $questionId;
$ret[questionDesc] = $questionDesc;
$ret[answers]       = $arr;


header("Expires: Mon, 24 Jul 2008 05:00:00 GMT" );
header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header("Cache-Control: no-cache, must-revalidate" );
header("Pragma: no-cache" );



echo json_encode($ret);

?>
