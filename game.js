window.addEventListener('DOMContentLoaded', () => {
    
    //La classe Grid permet de gérer la grille de jeu dans son ensemble
    class Grid {

        
        //Liste des cartes disponibles
        fruits = ['pomme', 'banane', 'orange', 'citronVert', 'cranberry', 'abricot', 'citron', 'fraise',
            'pommeVerte', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise',
            'mangue', 'mirabelles'
        ]; 


        cases = []; //Tableau recevant tous les objets "case"        
        firstCard = null; //Mémorise la première carte
        secondCard = null; //Mémorise la premirèe carte
        removeCardTime = 500 //Timer pour ralentir les animations
        progressBar; //Element progress bar du DOM
        #level = ''; //Level (en privée)

        

        #gridSize = 0; //Taille de la grille (ex : 6*6, 2*2). Calculé automatiquement en fonction du niveau
        #nbrCase = 0; //Nombre total de case
        #timer = 0;
        timerInterval;

       


        constructor(){
            this.#level = document.getElementById('level').value;
            document.getElementById('levelDisplay').innerHTML = this.#level;            
            document.getElementById('inputLevel').value = this.#level;            
            let maxFruits = this.getNbrFruits();
            this.fruits = this.fruits.slice(0, maxFruits);
            document.getElementById('level').style.display = 'none'
            document.getElementById('imgPresentation').style.display = 'none'

        }

        //Getter du champ privé #gridSize
        get nbrCase() {
            return this.fruits.length * 2;
        }

        //Getter du champ privé #gridSize
        get gridSize() {
            let grid = Math.sqrt(this.nbrCase);
            if(Number.isInteger(grid) == false){
                console.error('Probleme sur le nombre de carte')
                grid = 0
            } 
            return grid;            
        }

        
        //Permet de déterminer le nombre de fruits a afficher en fonction du noiveau choisi
        getNbrFruits = () => {            
            if(this.#level == 'facile') return 2;
            if(this.#level == 'moyen') return 8;
            if(this.#level == 'difficile') return 18;

        }




        //On construit un tableau dynamiquement suivant le nombre de fuits disponible
        generateGrid = () => {
            let table = document.getElementById('game');

            for (let row = 0; row < this.gridSize; row++) { //Lignes
                let tr = document.createElement('tr'); //On créé une ligne dans le tableau

                for (let col = 0; col < this.gridSize; col++) { //Colonnes
                    let td = document.createElement('td'); //On crée une cellule dans la ligne

                    //Sauvegarde de l'id d'une carte dans le DOM (seulement l'id)
                    td.id = `${row}${col}`;
                    

                    //Mise en place de l'écouteur du click
                    td.addEventListener('click', (e, elem) => {

                        
                        //CARTE DEJA RETOURNEE
                        let card = this.findCase(td.id);
                        if(card.visible){
                            console.error('impossible de clicker sur une carte déjà retorunée');
                            return
                        } 
                        
                        
                        //CHOIX PREMIERE CARTE
                        if (this.firstCard == null) {                            
                            //On charge la première carte clickée dans la proporiété firstcard
                            this.firstCard = card;   
                            this.firstCard.visible = true;   
                            return                         
                        }


                        //CHOIX DEUXIEME CARTE
                        if (this.secondCard == null) {   

                            if (td.id == this.firstCard.id) { //L'user clic sur la même carte
                                console.error('IMPOSSIBLE'); //TODO 
                            } else { //L'user clic sur une autre carte

                                //On charge la deuxième carte clickée dans la proporiété seconCard
                                this.secondCard = card;
                                this.secondCard.visible = true;

                                //On regarde si les deux cartes ont le même nom   
                                if (this.firstCard.fruit == this.secondCard.fruit) {                                  
                                    //Ok paire trouvée !

                                    this.firstCard = null;
                                    this.secondCard = null;                              
                                    

                                    //Met a jour progress bar
                                    this.progress();

                                    //Vérifie victoire
                                    if(this.win()){     
                                        //Ok, toutes les cartes sont visible, l'user a gagné
                                        clearInterval(this.timerInterval); //On stop le timer
                                        document.getElementById('time').innerText = this.#timer; //On mets à jour les élément duformulaire HTML
                                        document.getElementById('inputTime').value = this.#timer;
                                        
                                        //On affiche une modal Bootsrap pour enregistrer le score
                                        let myModal = new bootstrap.Modal(document.getElementById('modal'), {
                                            keyboard: false
                                        })
                                        myModal.show()

                                    }

                                } else {
                                    //Perdu, c'est pas les même carte !
                                    //On remet tout à zéro (firstCard et secondCard)
                                    setTimeout(() => {                                                        
                                        this.secondCard.visible = false;                                        
                                        this.firstCard.visible = false
                                        this.firstCard = null;
                                        this.secondCard = null;
                                    }, this.removeCardTime); //Et on laisse 500ms pour pas que ça coup net
                                    
                                }
                            }
                        }
                    })
                    tr.appendChild(td); //On rajoute chaque cellule à la ligne
                    let caseGrid = new Case(row, col); //On instancie un nouvel objet Case avec les coordonnées
                    this.cases.push(caseGrid); //On rajoute l'objet case au tableu de cases
                }
                table.appendChild(tr); //ON ajoute toute la ligne au tableau
            }



            //Mise en place du chrono            
            let caption = document.createElement('caption');            
            caption.innerText = this.#timer;
            caption.classList.add('fs-5');
            table.appendChild(caption);
            this.timerInterval = setInterval(() => {                
                this.#timer++;
                caption.innerText = `Temps : ${this.#timer} secondes`;
            }, 1000)


            //Mise en place de la progressbar            
            let progress = document.createElement('div')
            progress.classList.add('progress', 'ms-auto', 'me-auto');
            progress.style.width = table.offsetWidth;
            this.progressBar = document.createElement('div');
            this.progressBar.classList.add('progress-bar', 'fs-5');
            this.progressBar.setAttribute('role', 'progressbar')
            this.progressBar.style.width = '0%';
            this.progressBar.innerText = '0%';
            progress.appendChild(this.progressBar);
            table.after(progress);

        }

        positionFruit = () => {
            for (let caseGrid of this.cases) {       

                //Sélectionne un fruit aléatoire et qui n'a pas déja été positionné 2 fois
                let randomFruit = this.getRandomAndFreeFruit()

                //Cale les données sur l'objet en cours
                caseGrid.fruit = this.fruits[randomFruit];
                caseGrid.imgPosition = 0 - 100 * (randomFruit); //permet de générer le position-y du sprite en fonction de l'index du fruit (i = 2 -> position = -200px)
                caseGrid.visible = false;                
                document.getElementById(caseGrid.id).style.backgroundPositionY = `${caseGrid.imgPosition}px`;                
            }
        }

        //Génère un tableau aléatoire en mettant 2 occurence de chaque fruits à chaque fois
        getRandomAndFreeFruit = () => {
                let randomFruit = 0;
                let selectedFruit = '';
                let occu = 0;

                do { //TODO FAIRE DE LA RECUSRION PLUTOT ?
                    randomFruit = Math.floor(Math.random() * this.fruits.length);
                    selectedFruit = this.fruits[randomFruit];
                    occu = this.checkNbrOccurence(selectedFruit);
                } while (occu > 1)

                return randomFruit
        }

        //Trouve le nombre de fois qu'un fruit est présent dans le tableau
        checkNbrOccurence = (fruit = '') => {
            let cnt = 0;
            for (let caseGrid of this.cases) {
                if (caseGrid.fruit == fruit) {
                    cnt++;
                }
            }
            return cnt;
        }

        //Retourne une case (objet) en fonction de l'id stockée dans le DOM
        findCase = (id = '') => {           
            return this.cases.find(caseGrid => caseGrid.id == id)
        }

        //Regarde si toutes les cartes sont a visible. Si c'est le cas, on retourne true
        win = () => {
            return this.cases.every((caseGrid) => caseGrid.visible === true)            
        }

        //Permet de mettre à jour la progressbar
        progress = () => {
            let result = this.cases.filter((caseGrid) => caseGrid.visible === true);
            let goodCards = result.length;
            let percent = Math.ceil(100*(goodCards / this.nbrCase)) + '%';            
            this.progressBar.style.width = percent;
            this.progressBar.innerText = percent;
        }


    }


    //La classe Case gère seulement les cases (sans les problématiques liées à la grille)
    class Case {

        id = '' //On identifie une case via un id généré lors de la création de la grille (ligne/col -> i/j)
        fruit = ''; //Le nom FR du fruit
        imgPosition = 0; //PositionY pour le sprite
        #visible = false;



        constructor(x, y) {
            this.id = `${x}${y}`;
        }

        //Getter pour la propriété privé visible
        get visible() {
            return this.#visible
        }

        //Setter pour la propriété privé visible (gère l'animation )
        set visible(visible) {            
            this.#visible = visible            

            if(visible){
                document.getElementById(this.id).style.backgroundImage = "url('/cards.png')"; //On met à jour le background-img
                document.getElementById(this.id).classList.add('animate__animated', 'animate__flipInY'); //On rajoute les classe Animate pour plus de plus (affiche recto)
            } else {
                document.getElementById(this.id).classList.remove('animate__animated', 'animate__flipInY'); //On enleve les classes animate (affiche verso)
                document.getElementById(this.id).style.backgroundImage = "url()";
            }
            
        }

    }


    //Script de lancement hors classe
    document.getElementById('start').addEventListener('click',function() { //Quand on clic sur le bouton
        this.style.display = 'none';
        document.getElementById('restart').classList.remove('d-none');
        let grid = new Grid() //On lance la génération de la grille via l'instanciation d'un objet Grid (pourrait etre en static vue qu'on a qu'une seule grille (pas eu le temps de refactor))
        grid.generateGrid(); //On génére la grille vide
        grid.positionFruit(); //On positionne aléatoirement les fruits à l'intérieur
    })

    document.getElementById('restart').addEventListener('click',function() { //Pas eu le temps, permet de recharger une nouvelle partie
        location.reload(); // #bourrin :)
    })    

    /**
     * Merci d'avoir lu jusqu'au bout !
     * Julien 
     */

})