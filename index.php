<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Jeu Snake - Canvas</title>
        <meta name="description" content="Jeu Snake réalisé avec canvas HTML" />
        <meta name="keywords" content="snake, jeu, game, canvas, html, js, javascript" />
        <link href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/assets/css/style.css">
    </head>
    <body>
        <div class="game-container">
            <header class="header">
                <h1 class="title">Snake</h1>
                <p class="score">Score : <span id="scoreValue">0</span></p>
            </header>
            <canvas class="game-canvas" id="game" width="320" height="320"></canvas>
            <div class="menu" id="menu">
                <h2 class="title">Jeu Snake</h2>
                <button class="btn btn-new-game" id="buttonStartGame">Jouer</button>
            </div>
            <div class="game-over" id="gameOver">
                <h2 class="title">Game Over</h2>
                <p class="text">Appuyer sur la touche <span>espace</span> pour rejouer</p>
            </div>
        </div>
        <script src="/assets/js/jquery-3.5.1.min.js"></script>
        <script src="/assets/js/game.js"></script>
    </body>
</html>