/**
 * app.js
 *
 * FooFighter.js — Primary Game Controller
 *
 * Purpose of this module is to initialize the game assets,
 * build game environment and entities, and emit Phaser events
 * (via Shout object).
 */

;(function( FooFighter, Phaser ){

'use strict';

var gameConfig = {
        canvas: {
            width: 1440,
            height: 900
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
        background  = game.add.group(),
        backGroup   = game.add.group(),
        frontGroup  = game.add.group(),
        asteroids   = game.add.group(),
        lasers      = game.add.group(),
        hudGroup    = game.add.group();

    // Keep group references so we can maintain a proper display index
    gameState.groups = {
        background: background,
        backGroup: backGroup,
        frontGroup: frontGroup,
        hudGroup: hudGroup,
        asteroids: asteroids,
        lasers: lasers
    };

    game.load.bitmapFont('KenPixel', 'assets/fonts/kenpixel.png', 'assets/fonts/kenpixel.fnt');

    // Grab keyboard references for keydown events
    gameState.cursors = game.input.keyboard.createCursorKeys();
    gameState.keyboard = game.input.keyboard;

    // Primary spritesheet -- atlas generated by Texture Packer
    game.load.atlasJSONHash(
        'sprites',
        'assets/img/space-sheet.png',
        'assets/json/space-sheet.json'
    );

    // Set scale mode to strech to browser window, but preserve aspect ratio
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.stage.scale.setShowAll();
    game.stage.scale.refresh();

    // Create discrete game objects/entities
    gameState.gameEngine = new FooFighter.GameEngine(gameState);
    entities.starField = new FooFighter.StarField(gameState, backGroup);
    entities.player = new FooFighter.Player(gameState, frontGroup);
    entities.score = new FooFighter.Score(gameState, hudGroup);
}


/**
 * Initialize game state (data, canvas, etc)
 * @return {void}
 */
function create(){
    // This is only going to fire once
    gameState.vent.emit('create');

}

function update(){
    // If we haven't kicked off game start yet, do so the first time
    if ( !gameConfig.hasStarted ) {
        gameState.vent.emit('start');
        gameConfig.hasStarted = true;
    }
    // This is the primary game loop event
    gameState.vent.emit('update');
}


})(FooFighter, Phaser);
