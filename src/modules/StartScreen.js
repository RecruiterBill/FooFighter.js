
;(function( FooFighter ){

"use strict";

function StartScreen ( gameState, group ) {
    this.gameState = gameState;
    this.game = gameState.game;
    this.group = group;
    this.styles = {
        title: {
            font: "72px KenPixel",
            fill: "#ffff00",
            align: "center"
        },
        start: {
            font: "32px KenPixel",
            fill: "#ffff00",
            align: "center"
        }
    };
    this.title = 'FooFighter.js';
    this.bindEvents();
}

var proto = StartScreen.prototype;


proto.bindEvents = function(){
    var vent = this.gameState.vent;

    vent.on('create', this.create.bind(this));
    vent.on('update', this.checkStart.bind(this));
    vent.on('start', this.hideScreen.bind(this));
    return this;
};


proto.create = function(){
    var vent = this.gameState.vent;

    this.titleText = this.game.add.bitmapText(
        this.game.world.centerX, this.game.world.centerY - 300,
        this.title,
        this.styles.title
    );
    this.titleText.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.group.add(this.titleText);

    this.startText = this.game.add.bitmapText(
        this.game.world.centerX, this.game.world.centerY - 200,
        'Press \'S\' To Start Game',
        this.styles.start
    );
    this.startText.anchor = {
        x: 0.5,
        y: 0.5
    };

    this.group.add(this.startText);
    return this;
};


proto.checkStart = function(){
    var kb = this.gameState.keyboard,
        vent = this.gameState.vent;

    if ( this.gameState.hasStarted ) {
        return false;
    }

    if ( kb.isDown(83) ) {
        vent.emit('start');
        this.gameState.hasStarted = true;
    }
};


proto.hideScreen = function(){
    this.startText.visible = false;
    this.titleText.visible = false;
};


FooFighter.StartScreen = StartScreen;

})(FooFighter);