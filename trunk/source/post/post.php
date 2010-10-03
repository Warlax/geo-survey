<?php

#require_once 'db_config.inc.php';


#---------------------------------------------------------------------------#
function runSQL($rsql) {

$connect = mysql_connect("localhost","root","root") or die ("Error: could not connect to database". mysql_error());

$db = mysql_select_db("a4202280_hive",$connect) or die( mysql_error());
$result = mysql_query($rsql) or die (mysql_error());
return $result;
mysql_close($connect);
}
#---------------------------------------------------------------------------#
function countRec($tn, $wh) {
	$sql = "";
	$result = runSQL($sql);
	while ($row = mysql_fetch_array($result)) {
		return $row[0];
	}
}



#--------------------------------------------------------------------------#
function get_where($filter)
{
$where = " where 0=0 ";
if (is_array($filter)) {
	for ($i=0;$i<count($filter);$i++){
		switch($filter[$i]['data']['type']){
			case 'string' : $qs .= " AND ".$filter[$i]['field']." LIKE '%".$filter[$i]['data']['value']."%'"; Break;
			case 'list' : 
				if (strstr($filter[$i]['data']['value'],',')){
					$fi = explode(',',$filter[$i]['data']['value']);
					for ($q=0;$q<count($fi);$q++){
						$fi[$q] = "'".$fi[$q]."'";
					}
					$filter[$i]['data']['value'] = implode(',',$fi);
					$qs .= " AND ".$filter[$i]['field']." IN (".$filter[$i]['data']['value'].")"; 
				}else{
					$qs .= " AND ".$filter[$i]['field']." = '".$filter[$i]['data']['value']."'"; 
				}
			Break;
			case 'boolean' : $qs .= " AND ".$filter[$i]['field']." = ".($filter[$i]['data']['value']); Break;
			case 'numeric' : 
				switch ($filter[$i]['data']['comparison']) {
					case 'ne' : $qs .= " AND ".$filter[$i]['field']." != ".$filter[$i]['data']['value']; Break;
					case 'eq' : $qs .= " AND ".$filter[$i]['field']." = ".$filter[$i]['data']['value']; Break;
					case 'lt' : $qs .= " AND ".$filter[$i]['field']." < ".$filter[$i]['data']['value']; Break;
					case 'gt' : $qs .= " AND ".$filter[$i]['field']." > ".$filter[$i]['data']['value']; Break;
				}
			Break;
			case 'date' : 
				switch ($filter[$i]['data']['comparison']) {
					case 'ne' : $qs .= " AND ".$filter[$i]['field']." != '".date('Y-m-d',strtotime($filter[$i]['data']['value']))."'"; Break;
					case 'eq' : $qs .= " AND ".$filter[$i]['field']." = '".date('Y-m-d',strtotime($filter[$i]['data']['value']))."'"; Break;
					case 'lt' : $qs .= " AND ".$filter[$i]['field']." < '".date('Y-m-d',strtotime($filter[$i]['data']['value']))."'"; Break;
					case 'gt' : $qs .= " AND ".$filter[$i]['field']." > '".date('Y-m-d',strtotime($filter[$i]['data']['value']))."'"; Break;
				}
			Break;
		}
	}	
	$where .= $qs;
}
return $where;
}

?>
