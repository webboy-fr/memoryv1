<?


require_once 'env.php';

class Score {


    private $db;

    public function __construct(){
        try {
            $this->db = new PDO("mysql:host=".DB_HOST."; dbname=".DB_NAME.";", DB_USER, DB_PASSWORD);
        } catch (PDOException $e) {
            echo "Erreur!: " . $e->getMessage() . "<br/>";
            die();
        }
    }


    public function count(){
        $query = $this->db->query("SELECT COUNT(*) AS nbrScore FROM score");
        $cnt = $query->fetch(PDO::FETCH_OBJ);
        return $cnt->nbrScore;
    }

    public function findAll($level = ''){
        $query = $this->db->prepare("SELECT * FROM score WHERE level = :level ORDER BY time ASC LIMIT 3");

        $query->execute(array(        
        ':level' => $level
        ));


        return $query->fetchAll(PDO::FETCH_OBJ);
    }


    public function save($pseudo = '', $time = 0, $level = ''){

        $query = $this->db->prepare("INSERT INTO score (pseudo, time, level) VALUES (:pseudo, :time, :level)");


        $query->execute(array(
        ':pseudo' => $pseudo,
        ':time' => $time,
        ':level' => $level
        ));

        header('Location: /');

    }



}
