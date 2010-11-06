<?php

#Be sure to include the config file for all the params. 

#require_once 'db_config.inc.php';
require_once 'post.php';
$queryString = $_POST['queryString'];

#------------------------------------------------------#
#Start Sql statement, no where yet.

$sql = "Select q.questionId, q.questionDesc from Question q
	JOIN questionCat qc ON
	q.questionId = qc.questionID
	JOIN category c ON
	qc.categoryId = c.categoryId where categoryDesc like '%$queryString%' ";


$res = runSQL($sql);
$result = array();
while($row =  mysql_fetch_array($res,MYSQL_ASSOC))
{
	$result[] = $row;
}

header("Expires: Mon, 24 Jul 2008 05:00:00 GMT" );
header("Last-Modified: " . gmdate( "D, d M Y H:i:s" ) . "GMT" );
header("Cache-Control: no-cache, must-revalidate" );
header("Pragma: no-cache" );



echo json_encode($result);

?>
