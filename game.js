window.addEventListener('DOMContentLoaded', () => {
    

    class Grid {

        

        fruits = ['pomme', 'banane', 'orange', 'citronVert', 'cranberry', 'abricot', 'citron', 'fraise',
            'pommeVerte', 'peche', 'raisin', 'pasteque', 'prune', 'poire', 'cerise', 'framboise',
            'mangue', 'mirabelles'
        ];


        cases = []; //Tableau recevant tous les objets "case"        
        firstCard = null; //Mémorise la premirèe carte
        secondCard = null; //Mémorise la premirèe carte
        removeCardTime = 500
        progressBar;
        #level = '';

        //currentFruit;

        #gridSize = 0;
        #nbrCase = 0;
        #timer = 0;
        timerInterval;

        get nbrCase() {
            return this.fruits.length * 2;
        }


        constructor(){
            this.#level = document.getElementById('level').value;
            document.getElementById('levelDisplay').innerHTML = this.#level;            
            document.getElementById('inputLevel').value = this.#level;            
            let maxFruits = this.getNbrFruits();
            this.fruits = this.fruits.slice(0, maxFruits);
            document.getElementById('level').style.display = 'none'
            document.getElementById('imgPresentation').style.display = 'none'

        }

        get gridSize() {
            let grid = Math.sqrt(this.nbrCase);
            if(Number.isInteger(grid) == false){
                console.error('Probleme sur le nombre de carte')
                grid = 0
            } 
            return grid;            
        }

        

        getNbrFruits = () => {
            //maxFruits = 18;
            if(this.#level == 'facile') return 2;
            if(this.#level == 'moyen') return 8;
            if(this.#level == 'difficile') return 18;

        }




        //On construit un tableau dynamiquement suivant le nombre de fuits disponible
        generateGrid = () => {
            let table = document.getElementById('game');
            for (let row = 0; row < this.gridSize; row++) {
                let tr = document.createElement('tr');

                for (let col = 0; col < this.gridSize; col++) {
                    let td = document.createElement('td');

                    //Sauvegarde de l'id d'une carte dans le DOM (seulement l'id)
                    td.id = `${row}${col}`;
                    

                    //Mise en place de l'écouteur du click
                    td.addEventListener('click', (e, elem) => {

                        //TODO FAIRE METHODE SEPAREES
                        //CARTE DEJA RETOURNEE
                        let card = this.findCase(td.id);
                        if(card.visible){
                            console.error('impossible de clicker sur une carte déjà retrounée');
                            return
                        } 
                        
                        //TODO FAIRE METHODE SEPAREES
                        //PREMIERE CARTE
                        if (this.firstCard == null) {                            
                            //On charge la première carte clickée dans la proporiété firstcard
                            this.firstCard = card;   
                            this.firstCard.visible = true;   
                            return                         
                        }


                        //TODO FAIRE METHODE SEPAREES
                        //DEUXIEME CARTE
                        if (this.secondCard == null) {   

                            if (td.id == this.firstCard.id) { //L'user clic sur la même carte
                                console.error('IMPOSSIBLE'); //TODO
                            } else { //L'user clic sur une autre carte

                                //On charge la deuxième carte clickée dans la proporiété seconCard
                                this.secondCard = card;
                                this.secondCard.visible = true;

                                if (this.firstCard.fruit == this.secondCard.fruit) {                                    

                                    this.firstCard = null;
                                    this.secondCard = null;                              
                                    

                                    //Met a jour progress bar
                                    this.progress();

                                    //Vérifie victoire
                                    if(this.win()){     
                                        clearInterval(this.timerInterval);
                                        document.getElementById('time').innerText = this.#timer;
                                        document.getElementById('inputTime').value = this.#timer;
                                        //document.getElementById('score').style.display = "block";

                                        let myModal = new bootstrap.Modal(document.getElementById('modal'), {
                                            keyboard: false
                                          })
                                          myModal.show()

                                    }

                                } else {
                                    setTimeout(() => {                                                        
                                        this.secondCard.visible = false;                                        
                                        this.firstCard.visible = false
                                        this.firstCard = null;
                                        this.secondCard = null;
                                    }, this.removeCardTime);
                                    
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
            //TODO METHODE A PART
            let caption = document.createElement('caption');            
            caption.innerText = this.#timer;
            caption.classList.add('fs-5');
            table.appendChild(caption);
            this.timerInterval = setInterval(() => {                
                this.#timer++;
                caption.innerText = `Temps : ${this.#timer} secondes`;
            }, 1000)


            //Mise en place de la progressbar
            //TODO METHODE A PART
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
                caseGrid.imgPosition = 0 - 100 * (randomFruit); //TODO Méthode spécialisées
                caseGrid.visible = false;                
                document.getElementById(caseGrid.id).style.backgroundPositionY = `${caseGrid.imgPosition}px`;                
            }
        }

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

        checkNbrOccurence = (fruit = '') => {
            let cnt = 0;
            for (let caseGrid of this.cases) {
                if (caseGrid.fruit == fruit) {
                    cnt++;
                }
            }
            return cnt;
        }


        findCase = (id = '') => {           
            return this.cases.find(caseGrid => caseGrid.id == id)
        }

        win = () => {
            return this.cases.every((caseGrid) => caseGrid.visible === true)            
        }

        progress = () => {
            let result = this.cases.filter((caseGrid) => caseGrid.visible === true);
            let goodCards = result.length;
            let percent = Math.ceil(100*(goodCards / this.nbrCase)) + '%';            
            this.progressBar.style.width = percent;
            this.progressBar.innerText = percent;
        }


    }


    class Case {

        id = ''
        fruit = '';
        imgPosition = 0;
        #visible = false;



        constructor(x, y) {
            this.id = `${x}${y}`;
        }

        get visible() {
            return this.#visible
        }

        set visible(visible) {            
            this.#visible = visible            
            //document.getElementById(this.id).style.backgroundImage = (visible) ? "url('/cards.png')" : "url()"; //Mettre url en propriétés            

            if(visible){
                document.getElementById(this.id).style.backgroundImage = "url('/cards.png')";
                document.getElementById(this.id).classList.add('animate__animated', 'animate__flipInY');
            } else {
                document.getElementById(this.id).classList.remove('animate__animated', 'animate__flipInY');
                //document.getElementById(this.id).classList.add('animate__flipOutY');
                document.getElementById(this.id).style.backgroundImage = "url()";                
            }
            
        }

    }

    document.getElementById('start').addEventListener('click',function() {
        this.style.display = 'none';
        document.getElementById('restart').classList.remove('d-none');
        let grid = new Grid() //Mettre en static
        grid.generateGrid();
        grid.positionFruit();    
    })

    document.getElementById('restart').addEventListener('click',function() {
        location.reload();
    })    

})