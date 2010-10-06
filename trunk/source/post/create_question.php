<?php

//require_once 'db_config.inc.php';
require_once 'post.php';
$dbhost= "mysql5.000webhost.com";
$username="a4202280_hive";
$password="comp595";
$database="a4202280_hive";

$questionDesc= $_POST['questionDesc'];
$answers= $_POST['answers'];

$con = mysql_connect($dbhost,$username,$password);
  if (!$con)
     {
        die('Could not connect: ' . mysql_error());
     }
  else
     {
      

           
            @mysql_select_db($database) or die( "Unable to select database");
            $savequestionquery = "INSERT INTO Question VALUES ('','$questionDesc')";
            mysql_query($savequestionquery);
            $questionId = mysql_insert_id();     


         $answersCount = count($answers);
         if ($answersCount > 0)      
         {
               
         foreach ($answers as $answer)
         {
               
             if (chop($answer) != "")
             {
              $saveanswerquery = "INSERT INTO Answer VALUES ('','$questionId','$answer')";
              mysql_query($saveanswerquery);
              $answerId = mysql_insert_id();              

              }
           }
         }

$ret = array();
$ret[questionId]   = $questionId;
$ret[questionDesc] = $questionDesc;
$ret[answersCount] = $answersCount;

echo json_encode($ret);

      }

?>
