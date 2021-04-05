<?
require "class_score.php";
$scoreObj = new Score();
$cntScore = $scoreObj->count();


$facile = $scoreObj->findAll('facile');
$moyen = $scoreObj->findAll('moyen');
$difficile = $scoreObj->findAll('difficile');

?>

<html>
<title>Memory - O'Clock</title>

<link rel="icon" type="image/jpg" href="/favicon-16x16-default.png" />

<!--Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous">
</script>

<!-- Animate -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

<!-- Memory -->
<link href="style.css" rel="stylesheet">
<script type="text/javascript" src="game.js"></script>

<body>
    <div class="container">
        <header>
            <h1>Jeu de Memory - mode arcade</h1>
            <h2>Test technique pour O'Clock</h2>
        </header>



        <div class="row">


            <div class="col-lg-4">
                <div id="scores" class="bg-white p-5">                    
                    <? if($cntScore == 0) { ?>
                    <p>Aucun score a afficher pour l'instant</p>
                    <? } else { ?>
                    <h4 class="text-center">Tableau des scores</h4>
                    <p>Seuls les trois 3 meilleurs scores sont affichés</p>
                    <h5>Niveau Difficile</h5>
                    <table class="table table-striped w-100">
                        <tr>
                            <th>Pseudo</th>
                            <th>Temps</th>
                        </tr>
                        <? foreach($difficile as $score){ ?>
                        <tr>
                            <td><?=$score->pseudo?></td>
                            <td><?=$score->time?> sec</td>
                        </tr>
                        <? } ?>
                    </table>



                    <h5>Niveau Moyen</h5>
                    <table class="table table-striped w-100">
                        <tr>
                            <th>Pseudo</th>
                            <th>Temps</th>
                        </tr>
                        <? foreach($moyen as $score){ ?>
                        <tr>
                            <td><?=$score->pseudo?></td>
                            <td><?=$score->time?> sec</td>
                        </tr>
                        <? } ?>
                    </table>

                    <h5>Niveau Facile</h5>
                    <table class="table table-striped w-100">
                        <tr>
                            <th>Pseudo</th>
                            <th>Temps</th>
                        </tr>
                        <? foreach($facile as $score){ ?>
                        <tr>
                            <td><?=$score->pseudo?></td>
                            <td><?=$score->time?> sec</td>
                        </tr>
                        <? } ?>
                    </table>


                    <? } ?>
                </div>

            </div>


            <div class="col-lg-8">


                <section>
                    <div class="bg-white p-5">
                        <div class="row">
                            <div class="col">
                                <h6>Choix de la difficulté : <span id="levelDisplay"></span></h6>
                                <select class="form-select" id="level" class="me-3">
                                    <option value="facile">Facile</option>
                                    <option value="moyen">Moyen</option>
                                    <option value="difficile">Difficle</option>
                                </select>
                            </div>
                            <div class="col">
                                <div class="d-grid gap-2">
                                    <button type="button" class="btn btn-primary" id="start">Démarrer !</button>
                                    <button type="button" class="btn btn-danger d-none" id="restart">Relancer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main>
                    <div class="bg-white p-5 text-center">
                        <img src="memory.jpg" id="imgPresentation" class="w-50 ms-auto me-auto" />
                        <table id="game" class="ms-auto me-auto mt-3">
                        </table>
                    </div>
                </main>

                <div class="modal" tabindex="-1" id="modal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Bravo, vous avez gagné !</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <form method="post" action="save.php">
                            <div class="modal-body">
                                <p>
                                    Vous avez terminé le jeu en <b><span id="time"></span> secondes</b>.
                                    Pour enregistrer votre score, saisissez votre pseudo :
                                </p>
                                <h4>Enregistrer votre score</h4>                                
                                <input class="form-control" type="text" name="pseudo">
                                <input type="hidden" name="time" id="inputTime">
                                <input type="hidden" name="level" id="inputLevel">                                
                            </div>
                            <div class="modal-footer">                                
                                <input type="button" class="mt-3 btn btn-danger" data-bs-dismiss="modal" value="Quitter" />
                                <input type="submit" class="mt-3 btn btn-primary" value="Enregistrer" />
                            </div>
                            </form>
                        </div>
                    </div>
                </div>


            </div>
        </div>







    </div>

</body>

</html>