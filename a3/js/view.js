/***
 * Scaffolded by Jingjie (Vincent) Zheng on June 24, 2015.
 */

'use strict';

/**
 * A function that creates and returns the spaceship model.
 */

function createViewModule() {
  var SpaceshipView = function(model, canvas) {
    /**
     * Obtain the SpaceshipView itself.
     */
    var self = this;

    /**
     * Maintain the model.
     */
    this.model = model;

    /**
     * Maintain the canvas and its context.
     */
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.moving = false;
    this.powerUp = false;
    /**
     * Update the canvas. 
     * You should be able to do this trivially by first clearing the canvas, then call the rootNode's 
     * renderAll() with the context.
     */
    this.update = function() {
      //TODO
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.model.fireNode.changeFireStatus(this.moving);
      this.model.rootNode.renderAll(this.context);
    };

    /**
     * You should add the view as a listener to each node in the scene graph, so that the view can get 
     * updated when the model is changed.
     */
    this.model.rootNode.addListener(this);
    //TODO
    this.model.spaceshipNode.addListener(this);
    this.model.headNode.addListener(this);
    this.model.tailNode.addListener(this);
    this.model.fireNode.addListener(this);
    

    /**
     * Handle mousedown events.
     * You should perform a hit detection here by calling the model's performHitDetection().
     */ 
    canvas.addEventListener('mousedown', function(e) {
      //TODO
    });

    /**
     * Handle mousemove events.
     */ 
    canvas.addEventListener('mousemove', function(e) {
      //TODO
    });


    /**
     * Handle mouseup events.
     */ 
    canvas.addEventListener('mouseup', function(e) {
      //TODO
    });

    /**
     * Handle keydown events.
     */
    var SPACE = 32
    var LEFT = 37
    var UP = 38
    var RIGHT = 39
    var DOWN = 40
    var ROTATEDEGREE = 0.05
    var ROTATEBOUND = 0.78
    var currentDegree = 0;

    var map = [];
    map[SPACE] = false;
    map[LEFT] = false;
    map[UP] = false;
    map[RIGHT] = false;
    map[DOWN] = false;
    
    document.addEventListener('keydown', function(e) {
        //TODO
        console.log("hit");
        map[e.keyCode] = e.type == 'keydown';
        var speed = self.powerUp ? 2 : 4; 
        if (map[UP]) {
            self.moving = true;
            self.model.spaceshipNode.translate(0, -speed);
            if(currentDegree > 0) self.model.spaceshipNode.rotate(-ROTATEDEGREE, 0, 50);
            else if(currentDegree < 0) self.model.spaceshipNode.rotate(ROTATEDEGREE, 0, 50);
            console.log("up");
        }
        if (map[DOWN]) {
            self.moving = true;
            self.model.spaceshipNode.translate(0, speed);
        }
        if (map[LEFT]) {
            if (!map[RIGHT]) {
                currentDegree = currentDegree + ROTATEDEGREE;
                if (currentDegree < ROTATEBOUND) {
                    self.model.tailNode.rotate(ROTATEDEGREE, 0, 50);
                }
                else {
                    currentDegree = currentDegree - ROTATEDEGREE;
                }
            }
        }
        if (map[RIGHT]) {
            if (!map[LEFT]) {
                currentDegree = currentDegree - ROTATEDEGREE;
                if (currentDegree > -ROTATEBOUND) {
                    self.model.tailNode.rotate(-ROTATEDEGREE, 0, 50);
                }
                else {
                    currentDegree = currentDegree + ROTATEDEGREE;
                }
            }
        }
    });

    /**
     * Handle keyup events.
     */ 
    document.addEventListener('keyup', function(e) {
        //TODO
        map[e.keyCode] = e.type == 'keydown';
        if ((!map[UP]) && (!map[DOWN])) {
            self.moving = false;
            self.update();
        }
        if ((e.keyCode == SPACE) && (!this.powerUp)) {
            self.model.spaceshipNode.scale(2, 2);
            this.powerUp = true;
            setTimeout(function() {
                self.model.spaceshipNode.scale(0.5, 0.5);
                this.powerUp = false;
            },5000);
        }
        console.log(e.keyCode);
    });

    /**
     * Update the view when first created.
     */
    this.update();
  };

  return {
    SpaceshipView: SpaceshipView
  };
}