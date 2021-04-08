<?

//On récupère les variable d'environnement stockées à part et non versionné
require_once 'env.php';

class Score {


    private $db; //Ce champ permettra de stocker la connexion à la DB

    public function __construct(){
        //On se connecte à la DB
        try {
            $this->db = new PDO("mysql:host=".DB_HOST."; dbname=".DB_NAME.";", DB_USER, DB_PASSWORD);
        } catch (PDOException $e) {
            echo "Erreur!: " . $e->getMessage() . "<br/>"; //Si ça marche pas, on affiche un message d'erreur
            die(); //Puis on stop le script
        }
    }

    /**
     * On récupère le nombre de score enregistré pour savoir si il faut afficher le tableau de scores ou pas
     * 
     * @return Integer
     */
    public function count(){
        $query = $this->db->query("SELECT COUNT(*) AS nbrScore FROM score"); //On exécute la requete SQL
        $cnt = $query->fetch(PDO::FETCH_OBJ); //On récupère le résultat
        return $cnt->nbrScore; //On retourne la bonne valeur
    }


    /**
     * Permet de récupérer les cores par niveau
     * 
     * @return Array[Object]
     */
    public function findAll($level = ''){
        $query = $this->db->prepare("SELECT * FROM score WHERE level = :level ORDER BY time ASC LIMIT 3"); //On prépare la requete SQL

        $query->execute(array(        
        ':level' => $level
        )); //On l'exécute en liant les champs dynamiques


        return $query->fetchAll(PDO::FETCH_OBJ); //On retourne un tableau de résultats sous formes d'objets
    }

    /**
     * Permet d'enregistrer un score
     * 
     * @return void
     */
    public function save($pseudo = '', $time = 0, $level = ''){

        $query = $this->db->prepare("INSERT INTO score (pseudo, time, level) VALUES (:pseudo, :time, :level)"); //On prépare l'insertion d'un nouveau champ en DB


        $query->execute(array(
        ':pseudo' => $pseudo,
        ':time' => $time,
        ':level' => $level
        )); //On exécute la requete en liant les champs dynamiques

        header('Location: /'); //On renvoit vers la page d'accueil en modifiant les headers HTTP

    }



}
