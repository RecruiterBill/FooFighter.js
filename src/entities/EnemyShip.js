/**
 * EnemyShip.js
 *
 * FooFighter.js — EnemyShip entity
 *
 * This class represents the display entity and data structure for an
 * enemy ship unit. This unit fires towards the player while moving along
 * the Y-axis.
 */

;(function( FooFighter ){

function EnemyShip ( gameState, group ) {
    this.gameState = gameState;
    this.game = gameState.game;
    this.group = group;
    this.sprite = null;
    this.velocityRange = {
        min: 50,
        max: 250
    };
    this.laserVelocity = 300;
    this.lastFired = null;
    this.fireTimer = 5000;
    this.refs = {
        checkFireLaser: null,
        adjustAngle: null
    };
}

var proto = EnemyShip.prototype;


proto.create = function(){
    var game = this.game,
        minVelocity = this.velocityRange.min,
        maxVelocity = this.velocityRange.max,
        randInRange = FooFighter.Util.randInRange;

    this.sprite = this.group.create(
        game.world.width * Math.random(),
        -20,
        'sprites',
        'enemyShip.png'
    );
    this.sprite.anchor = {
        x: 0.5,
        y: 0.5
    };
    this.sprite.outOfBoundsKill = true;
    this.sprite.body.velocity.y = randInRange(minVelocity, maxVelocity);
    this.bindEvents();
};


proto.bindEvents = function(){
    var vent = this.gameState.vent;

    this.refs.checkFireLaser = this.checkFireLaser.bind(this);
    this.refs.adjustAngle = this.adjustAngle.bind(this);
    vent.on('update', function(){
        this.refs.checkFireLaser();
        this.refs.adjustAngle();
    }.bind(this));
    vent.on('game-over', function(){
        vent.off('update', this.refs.checkFireLaser);
        vent.off('update', this.refs.adjustAngle);
    }.bind(this));
    this.sprite.events.onKilled.add(function(){
        vent.off('update', this.refs.checkFireLaser);
        vent.off('update', this.refs.adjustAngle);
    }.bind(this));

    // game.time.events.loop(1000, this.adjustAngle, this);
};


proto.checkFireLaser = function(){
    var currTime = new Date().getTime();

    if ( currTime - this.lastFired >= this.fireTimer ) {
        this.fireLaser();
        this.lastFired = currTime;
    }
};


proto.fireLaser = function(){
    var group = this.gameState.groups.enemyLasers,
        game = this.game,
        player = this.gameState.entities.player.sprite,
        velocity = this.laserVelocity,
        angle,
        pos,
        laser;

    pos = {
        x: this.sprite.body.x + this.sprite.body.width/2,
        y:this.sprite.body.y + this.sprite.height + 20
    };

    laser = group.getFirstExists(false);

    if ( !laser ) {
        laser = group.create(
            pos.x,
            pos.y,
            'sprites',
            'laserRed.png'
        );
        laser.anchor = {
            x: 0,
            y: 0
        };
        laser.outOfBoundsKill = true;
    } else {
        laser.revive().reset(pos.x, pos.y);
    }

    angle = Math.atan2(
        (player.y - laser.y),
        (player.x - laser.x)
    );
    laser.angle = Phaser.Math.radToDeg(angle) + 90;
    game.physics.moveToXY(laser, player.x, player.y, velocity);
};


proto.adjustAngle = function(){
    var player = this.gameState.entities.player.sprite,
        game = this.game,
        tween,
        angle;

    angle = Math.atan2(
        (player.y - this.sprite.y),
        (player.x - this.sprite.x)
    );
    tween = game.add.tween(this.sprite);
    tween.to(
        { angle: Phaser.Math.radToDeg(angle) - 90 },
        500,
        Phaser.Easing.Bounce.Out,
        true
    );
};


FooFighter.EnemyShip = EnemyShip;

})(FooFighter);
