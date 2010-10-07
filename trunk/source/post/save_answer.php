<?php

$dbhost= "mysql5.000webhost.com";
$username="a4202280_hive";
$password="comp595";
$database="a4202280_hive";

$questionId= $_POST['questionId'];
$answerId= $_POST['answerId'];
$latitude= $_POST['latitude'];
$longitude= $_POST['longitude'];
$age= $_POST['age'];
$gender= $_POST['gender'];

$con = mysql_connect($dbhost,$username,$password);
  if (!$con)
     {
        die('Could not connect: ' . mysql_error());
     }
  else
     {            
        @mysql_select_db($database) or die( "Unable to select database");
      
       $saveuserquery = "INSERT INTO user VALUES ('','','','$longitude','$latitude','','$age','$gender','','','','')";
       mysql_query($saveuserquery);
       $userId= mysql_insert_id();           


       $saveuserquestionquery = "INSERT INTO userQuestion VALUES ('$userId','$questionId')";
       mysql_query($saveuserquestionquery);

       $saveuseranswerquery = "INSERT INTO userAnswer VALUES ('$answerId','$userId')";
       mysql_query($saveuseranswerquery);


       

$ret = array();
$ret[userId]   = $userId;


echo json_encode($ret);

      }

?>
