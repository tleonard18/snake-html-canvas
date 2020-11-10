$(document).ready(function(){
    let game = new Game();

    $('#buttonStartGame').on('click', function(){
        game.startGame();
    });

    $(document).on('keydown', function(e){
        if(game.screenGameOver.css('display') === "block"){ // Si c'est actuellement l'écran Game Over
            if(e.keyCode === 32){ // Barre d'espace
                game.startGame();
            }
        }else if(game.canvas.css('display') === "block"){ // Sinon si c'est l'écran de jeu
            game.snakeChangeDirection(e.keyCode);
        }
    });
});

function Game() {
    let self = this;

    /*** Canvas ***/
    this.canvas = $("#game");
    this.context = self.canvas[0].getContext("2d");

    /*** Écrans - Éléments HTML ***/
    this.screenMenu = $("#menu");
    this.screenGameOver = $("#gameOver");

    /*** Bouton - Élément HTML ***/
    this.buttonNewGame = $('#buttonStartGame');

    /*** Score - Élément HTML ***/
    this.scoreValue = $("#scoreValue");

    /*** Sons ***/
    this.audioEat = new Audio('/assets/sounds/eat.mp3'); // Son du serpent en train de manger
    this.audioGame = new Audio('/assets/sounds/game.mp3'); // Son pendant une partie
    this.audioGameOver = new Audio('/assets/sounds/game-over.mp3'); // Son partie perdue

    /*** Propriétés ***/
    this.score = 0; // Score du joueur
    this.wall = 1; // Mur activé / désactivé (0 / 1)
    this.food = {x: 0, y: 0}; // Position de la nourriture
    this.snake = []; // Serpent - Tableau comprenant la liste de chaque point du serpent
    this.snake_speed = 50; // Vitesse du serpent (150 = lent / 100 = normal / 50 = rapide)
    this.snake_direction = 1; // Direction du serpent ( 0 - HAUT / 1 - DROITE / 2 - BAS / 3 - GAUCHE)
    this.snake_next_direction = 1; // Prochaine direction du serpent ( 0 - HAUT / 1 - DROITE / 2 - BAS / 3 - GAUCHE)

    this.gameTimeout = null;

    /*** Fonctions ***/

    // Démarrage du jeu
    this.startGame = function(){
        self.showScreen('game');

        // Initalisation du serpent
        self.initSnake();

        // Initialise la direction du serpent vers la droite
        self.snake_next_direction = 1;

        // Initialise le score du joueur
        self.score = 0;
        self.updateScore();

        // Ajoute le bloc de nourriture
        self.addFood();

        // Lance la boucle du jeu
        self.gameLoop();
    }

    // Initalisation du serpent
    this.initSnake = function(){
        self.snake = [];
        for(let i = 4; i >= 0; i--){
            self.snake.push({x: i, y: 15});
        }
    }

    // Affichage d'un écran
    this.showScreen = function(screen){
        switch(screen){
            case 'game':
                // Gestion de l'audio
                self.audioGameOver.pause();
                self.audioGameOver.currentTime = 0;
                self.audioGame.currentTime = 0;
                self.audioGame.loop = true;
                self.audioGame.play();

                // Gestion de l'affichage
                this.canvas.show();
                this.screenMenu.hide();
                this.screenGameOver.hide();
                break;
            case 'menu':
                this.canvas.hide();
                this.screenMenu.show();
                this.screenGameOver.hide();
                break;
            case 'gameover':
                // Arrêt de la boucle
                clearTimeout(self.gameTimeout);

                // Gestion de l'audio
                self.audioGame.pause();
                self.audioGameOver.currentTime = 0;
                self.audioGameOver.loop = true;
                self.audioGameOver.play();

                // Gestion de l'affichage
                this.canvas.hide();
                this.screenMenu.hide();
                this.screenGameOver.show();
                break;
        }
    }

    // Dessiner un point sur le canvas
    this.drawDot = function(x, y){
        self.context.fillStyle = "#a1c55c"; // Couleur du point à ajouter (couleur du serpent)
        self.context.fillRect(x * 10, y * 10, 10, 10);
    }

    // Dessiner le point de nourriture sur le canvas
    this.drawFood = function(x, y){
        self.context.fillStyle = "#ff3232"; // Couleur de la nourriture
        self.context.fillRect(x * 10, y * 10, 10, 10);
    }

    // Change la direction du serpent
    this.snakeChangeDirection = function(key){
        if(key === 38 && self.snake_direction !== 2){ // Si flèche du haut et direction != BAS
            self.snake_next_direction = 0; // Prochaine direction du serpent = HAUT
        }else if(key === 39 && self.snake_direction !== 3){ // Si flèche droite et direction != GAUCHE
            self.snake_next_direction = 1; // Prochaine direction du serpent = DROITE
        }else if(key === 40 && self.snake_direction !== 0){ // Si flèche du bas et direction != HAUT
            self.snake_next_direction = 2; // Prochaine direction du serpent = BAS
        }else if(key === 37 && self.snake_direction !== 1){ // Si flèche du gauche et direction != DROITE
            self.snake_next_direction = 3; // Prochaine direction du serpent = GAUCHE
        }
    }

    // Fonction d'initialisation de la nourriture avec des coordonnées aléatoires
    this.addFood = function(){
        self.food.x = Math.floor(Math.random() * ((self.canvas[0].width / 10) - 1)); // Coordonnées aléatoire en x
        self.food.y = Math.floor(Math.random() * ((self.canvas[0].height / 10) - 1)); // Coordonnées aléatoire en y

        for(let i=0; i < self.snake.length; i++){
            if(self.isSameCoordinates(self.food.x, self.food.y, self.snake[i].x, self.snake[i].y)){ // Si les coordonnées créées correspondent déjà au corps du serpent
                self.addFood(); // On relance cette même fonction
            }
        }
    }

    // Fonction vérifiant si les coordonnées d'un point A correspondent aux coordonnées d'un point B
    this.isSameCoordinates = function(x, y, x2, y2){
        return (x === x2 && y === y2);
    }

    this.gameLoop = function(){
        let _x = self.snake[0].x;
        let _y = self.snake[0].y;

        self.snake_direction = self.snake_next_direction;

        switch(self.snake_direction){
            case 0: // HAUT
                _y--;
                break;
            case 1: // DROITE
                _x++;
                break;
            case 2: // BAS
                _y++;
                break;
            case 3: // GAUCHE
                _x--;
                break;
        }

        self.snake.pop();
        self.snake.unshift({x: _x, y: _y});

        if(self.wall === 1){ // Si les murs sont activés
            if(self.snake[0].x < 0 || self.snake[0].x === (self.canvas[0].width / 10) || self.snake[0].y < 0 || self.snake[0].y === (self.canvas[0].height / 10)){ // Vérifier si le serpent heurte un mur
                self.showScreen('gameover') // Game Over
                return;
            }
        }else{ // Sinon si les murs sont désactivés, faire réapparaitre le serpent du côté opposé
            for(let i = 0, x = self.snake.length; i < x; i++){
                if(self.snake[i].x < 0){
                    self.snake[i].x = self.snake[i].x + (self.canvas[0].width / 10);
                }else if(self.snake[i].x === self.canvas[0].width / 10){
                    self.snake[i].x = self.snake[i].x - (self.canvas[0].width / 10);
                }else if(self.snake[i].y < 0){
                    self.snake[i].y = self.snake[i].y + (self.canvas[0].height / 10);
                }else if(self.snake[i].y === self.canvas[0].height / 10){
                    self.snake[i].y = self.snake[i].y - (self.canvas[0].height / 10);
                }
            }
        }

        // Vérifier si le serpent est en collision avec lui même
        for(let i = 1; i < self.snake.length; i++){
            if(self.snake[0].x === self.snake[i].x && self.snake[0].y === self.snake[i].y){ // Si oui
                self.showScreen('gameover') // Game Over
                return;
            }
        }

        // Vérifier si le serpent mange la nourriture
        if(self.isSameCoordinates(self.snake[0].x, self.snake[0].y, self.food.x, self.food.y)){
            self.snake[self.snake.length] = {x: self.snake[0].x, y: self.snake[0].y}; // Ajoute un bloc à la taille du serpent
            self.score += 1; // Ajoute 1 au score du joueur
            self.updateScore(); // Affiche le nouveau score dans le DOM
            self.audioEat.play(); // Joue le son spécifique "Mange"
            self.addFood(); // Ajoute un nouveau bloc de nourriture
        }

        // Reset l'affichage du canvas
        self.context.beginPath();
        self.context.fillStyle = '#000000';
        self.context.fillRect(0, 0, self.canvas[0].width, self.canvas[0].height);

        // Dessine chaque point du corps du serpent
        for(let i = 0; i < self.snake.length; i++){
            self.drawDot(self.snake[i].x, self.snake[i].y);
        }

        // Dessine le point de nourriture
        self.drawFood(self.food.x, self.food.y);

        // Appel la boucle du jeu toutes les x millisecondes (vitesse du serpent)
        self.gameTimeout = setTimeout(self.gameLoop, self.snake_speed);
    }

    // Mise à jour du score dans le DOM
    this.updateScore = function(){
        self.scoreValue.html(self.score);
    }
}