/**
 * app.js
 *
 * FooFighter.js — Primary Game Controller
 *
 * Purpose of this module is to initialize the game assets,
 * build game environment and entities, and emit Phaser events
 * (via Shout object).
 */

(function(){

'use strict';

var gameConfig = {
        canvas: {
            width: 800,
            height: 600
        },
        hasStarted: false
},
    game = new Phaser.Game(
        gameConfig.canvas.width,
        gameConfig.canvas.height,
        Phaser.AUTO,
        'main',
        {
            preload: preload,
            create: create,
            update: update
        }
    ),
    gameState = FooFighter._gs = new FooFighter.GameState(game);


/**
 * Preload game assets (spritesheets, atlas data, individuals images)
 * @return {void}
 */
function preload(){
    var entities    = gameState.entities,
        backGroup   = game.add.group(),
        frontGroup  = game.add.group(),
        asteroids   = game.add.group(),
        lasers      = game.add.group(),
        hudGroup    = game.add.group();

    gameState.groups = {
        backGroup: backGroup,
        frontGroup: frontGroup,
        hudGroup: hudGroup,
        asteroids: asteroids,
        lasers: lasers
    };

    gameState.cursors = game.input.keyboard.createCursorKeys();
    gameState.keyboard = game.input.keyboard;

    // Primary spritesheet -- atlas generated by Texture Packer
    game.load.atlasJSONHash(
        'sprites',
        'assets/img/space-sheet.png',
        'assets/json/space-sheet.json'
    );

    gameState.gameAI = new FooFighter.GameAI(gameState);
    entities.starsBackground = new FooFighter.StarsBackground(gameState, backGroup);
    entities.player = new FooFighter.Player(gameState, frontGroup);
    entities.score = new FooFighter.Score(gameState, hudGroup);
}


/**
 * Initialize game state (data, canvas, etc)
 * @return {void}
 */
function create(){
    gameState.vent.emit('create');

}

function update(){
    if ( !gameConfig.hasStarted ) {
        gameState.vent.emit('start');
        gameConfig.hasStarted = true;
    }
    gameState.vent.emit('update');
}


})();
