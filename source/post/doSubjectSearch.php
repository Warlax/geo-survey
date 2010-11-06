<?php

#Be sure to include the config file for all the params. 

#require_once 'db_config.inc.php';
require_once 'post.php';
$queryString = $_POST['queryString'];
$page        = $_POST['page'];
$pageSize    = $_POST['pageSize'];

$from = (($page-1)*$pageSize) +1;
$to   = $pageSize*$page;
#------------------------------------------------------#
#Start Sql statement, no where yet.
$sql = "Select count(*) from Question where questionDesc like '%$queryString%' ";

$res = runSQL($sql);
$value = array();
$value[page]= $page;
$value[from]= $from;
$value[to]= $to;
$value[pageSize]=$pageSize;

$pages = mysql_fetch_row($res);
$value[pages]= ceil( $pages[0]/$pageSize);
$sql = "Select questionId, questionDesc from Question where questionDesc like '%$queryString%' ";
	$sql .= " Limit $from,$to ";

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

$value[result]=$result;
echo json_encode($value);

?>
