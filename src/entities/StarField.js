/**
 * StarField.js
 *
 * FooFighter.js — StarField entity
 *
 * This class represents the display object that renders the moving
 * starfield background in the game world.
 */

;(function( FooFighter ){

'use strict';

function StarField ( gameState, group ) {
    this.gameState = gameState;
    this.group = group;
    // Background
    this.gameState.game.load.image(
        'background',
        'assets/img/background.png'
    );
    this.gameState.game.load.image(
        'speedLine',
        'assets/img/speedLine.png'
    );
    // Star tile
    this.gameState.game.load.image(
        'starBackground',
        'assets/img/starBackground.png'
    );
    this.config = {
        field: {
            lineSpeed: 1000,
            starSpeed: 500,
            lineOpacity: 0.11,
            starOpacity: 0.3,
            lineThrottle: 100,
            starThrottle: 10
        }
    };
    this.shouldAddStar = true;
    this.shouldAddSpeedLine = true;
    this.bindEvents();
}

var proto = StarField.prototype;


proto.bindEvents = function(){
    var vent = this.gameState.vent;
    vent.on('create', this.create.bind(this));
    vent.on('update', this.moveField.bind(this));
    vent.on('update', this.addSpeedLine.bind(this));
    vent.on('update', this.addStar.bind(this));
    return this;
};


proto.create = function(){
    var gs = this.gameState,
        game = gs.game,
        stars,
        tile;


    // Add the solid background sprite entity
    // this.gameState.groups.background.add(
    //     game.add.tileSprite(
    //         0, 0, game.world.width, game.world.height, 'background'
    //     )
    // );
    // Commenting this out for now, kind of like the darker game world

    // In another group, use our star tile png to create
    // the starfield background
    stars = this.group;
    for (var x = -8; x < 8; x++) {
        for (var y = -6; y < 6; y++) {
            tile = stars.create(x*254, y*256, 'starBackground');
            tile.alpha = 0.35;
        }
    };
    return this;
};


proto.moveField = function(){
    var stars = this.group;

    // This is a bit of a hack, we're just moving the background
    // group along the Y axis and starting over when we go too far
    stars.y = stars.y > 768 ? 0 : stars.y;
    stars.y += 6.0;

    return this;
};


proto.addSpeedLine = function(){
    var throttleVal = this.config.field.lineThrottle,
        field = this.config.field,
        game = this.gameState.game,
        gameState = this.gameState,
        line;

    if ( this.shouldAddSpeedLine ) {
        line = game.add.sprite(
            game.world.width * Math.random(),
            -100,
            'speedLine'
        );
        line.alpha = field.lineOpacity;
        line.events.onOutOfBounds.add(line.kill, line);
        line.body.velocity.y = field.lineSpeed;
        this.shouldAddSpeedLine = false;
        setTimeout(function(){
            this.shouldAddSpeedLine = true;
        }.bind(this), throttleVal);
    }

    return line;
};


proto.addStar = function(){
    var throttleVal = this.config.field.starThrottle,
        field = this.config.field,
        game = this.gameState.game,
        gameState = this.gameState,
        star;

    if ( this.shouldAddStar ) {
        star = game.add.sprite(
            game.world.width * Math.random(),
            0,
            'sprites',
            'Background/starSmall.png'
        );
        star.alpha = field.starOpacity;
        star.events.onOutOfBounds.add(star.kill, star);
        star.body.velocity.y = field.starSpeed;
        this.shouldAddStar = false;
        setTimeout(function(){
            this.shouldAddStar = true;
        }.bind(this), throttleVal);
    }

    return star;
};


FooFighter.StarField = StarField;

})(FooFighter);
