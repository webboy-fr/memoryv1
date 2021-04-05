<?
require "class_score.php";
$score = new Score();
$score->save($_POST['pseudo'], $_POST['time'], $_POST['level']);
