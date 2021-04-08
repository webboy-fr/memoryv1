<?
//Ce fichier recoit le form qui sert à enregistrer un score

require "class_score.php"; //On appel la classe score
$score = new Score(); //On l'instancie dans un objet

//FILTERINPUTVAR :X

$score->save($_POST['pseudo'], $_POST['time'], $_POST['level']); //On exécute la méthode save
