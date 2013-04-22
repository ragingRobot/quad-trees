var tileSheet;
var particle = function(){
	this.width = 69;
	this.height = 68;
	this.yoffset = 0;
	this.speedx = 0;
	this.speedy = 0;
	this.dead = false;
	this.x = Math.random() * $("body").width();
	this.y = Math.random() * $("body").height() - 28;
}

particle.prototype = new Rectangle();
particle.prototype.update = function(){
	
	this.speedx += -2 + Math.random() * 4;
	this.speedy += -2 + Math.random() * 4;
	
	this.x += this.speedx;
	this.y += this.speedy;
	
	this.speedx = this.speedx * .02;
	this.speedy = this.speedy * .02;
}
particle.prototype.hit = function(hitBy){
	
}
particle.prototype.destroy = function(){
	this.dead = true;
}
var Cell = function(){
	this.hitCount = 0;
	this.xoffset = 0;
	this.life = 4;
	this.x = Math.random() * $("body").width();
	this.y = Math.random() * ($("body").height()/2) + ($("body").height()/2) - 28;
}

Cell.prototype = new particle();

Cell.prototype.hit = function(hitBy){
	
	if(hitBy instanceof Germ){	
		this.hitCount ++;
		if(this.hitCount > 10){
			this.hitCount = 0;
			this.life --;
			this.yoffset += 70;
			if(this.life <= 0){
				this.destroy();
			}
		}
		
	}
	
		if(this.x > hitBy.x){
			this.x +=2;
		}
		
		if(this.x < hitBy.x){
			this.x -=2;
		}
		
		
		if(this.y > hitBy.y){
			this.y +=2;
		}
		
		if(this.y < hitBy.y){
			this.y -=2;
		}
	
}

var Germ = function(){
	this.xoffset = 103;
	this.hitCount = 0;
	this.life = 4;
	this.x = Math.random() * $("body").width();
	this.y = Math.random() * ($("body").height()/2) - 28;
}

Germ.prototype = new particle();
Germ.prototype.hit = function(hitBy){
	
	if(hitBy instanceof Cell){	
		this.hitCount ++;
		if(this.hitCount > 5){
			this.hitCount = 0;
			this.life --;
			this.yoffset += 70;
			if(this.life <= 0){
				this.destroy();
			}
		}
		
	}
		if(this.x > hitBy.x){
			this.x +=2;
		}
		
		if(this.x < hitBy.x){
			this.x -=2;
		}
		
		
		if(this.y > hitBy.y){
			this.y +=2;
		}
		
		if(this.y < hitBy.y){
			this.y -=2;
		}
	
}
var game = function(){
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	this.canvas = null;
	this.objects = [];
	this.setupCanvas();
	this.createObjects(10, 20);
	this.mouseDown = false;
	this.lockedToMouse = null;
	this.mouseDownInfo = null;
	this.quad = new Quad(0, new Rectangle(0,0,$("body").width(),$("body").height()));
	 // requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback, element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    
    this.gameloop();
    var thisgame = this;
    $("canvas").bind("mousemove",function(event){
    	thisgame.checkMouseCollision(event.pageX,event.pageY);
    });
    
    $("canvas").bind("touchmove",function(event){
    	thisgame.checkMouseCollision(event.touches[0].pageX,event.touches[0].pageY);
    });
    
    
    $("canvas").bind("mousedown touchstart",function(event){
    	thisgame.mouseDown = true;
    });
    
    $("canvas").bind("mouseup touchend",function(event){
    	thisgame.mouseDown = false;
    	thisgame.lockedToMouse = null;
		thisgame.mouseDownInfo = null;
    });
    
}

game.prototype.setupCanvas = function(){
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	this.canvas = document.getElementById('quadTreeTest');
	
	if(this.canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = $("body").width();
			this.canvas.height = $("body").height() - 28;

			$(window).resize(this.pageResize.bind(this));
	} else {
			// canvas-unsupported code here
	}
	
}

game.prototype.pageResize = function(){
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	this.canvas.width = $("body").width();
	this.canvas.height = $("body").height();
	this.quad = new Quad(0, new Rectangle(0,0,$("body").width(),$("body").height()));
}


game.prototype.createObjects = function(numCells, numGerms){
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	for( var i =0; i< numCells ; i ++){
		this.objects.push(new Cell());
	}
	
	for( var g =0; g< numGerms ; g ++){
		this.objects.push(new Germ());
	}
}


game.prototype.gameloop = function(){
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	this.quad.clear();
	this.canvas.width = this.canvas.width;
	
	for( var i = 0; i < this.objects.length ; i ++){
		if(this.objects[i].dead == false){
    		this.quad.insert(this.objects[i]);
    		this.objects[i].update();
    	}
	}
	
	var returnObjects;
    for( var k = 0; k < this.objects.length ; k ++){
    	if(this.objects[k].dead == false){
	    	returnObjects = [];
	  		returnObjects = this.quad.retrieve(returnObjects, this.objects[k]);
	  		
	  		for(var j=0; j< returnObjects.length ;j++){
	  		
	  			if(this.objects[k] === returnObjects[j]){
	  				
	  			}else{
		  			if(this.rectOverlap(returnObjects[j], this.objects[k] )){
		  				returnObjects[j].hit(this.objects[k]);
		  				this.objects[k].hit(returnObjects[j]);
		  				
		  			}
	  			}
	  		}
  
    	
			this.ctx.drawImage(tileSheet, this.objects[k].xoffset, this.objects[k].yoffset, this.objects[k].width	, this.objects[k].height, this.objects[k].x, this.objects[k].y, this.objects[k].width	, this.objects[k].height);
		}
	}
	
	requestAnimFrame(this.gameloop.bind(this));
	
	


}

game.prototype.checkMouseCollision = function(mouseX, mouseY){
	
	this.quad.clear();
	
	
	for( var i = 0; i < this.objects.length ; i ++){
		if( this.objects[i].dead == false){
    		this.quad.insert(this.objects[i]);
    		this.objects[i].update();
    	}
	}
	
	var returnObjects;
    
    	returnObjects = [];
    	var mouseBox = new Rectangle(mouseX - 20, mouseY - 20 , 40 , 40);
  		returnObjects = this.quad.retrieve(returnObjects, mouseBox);
  		
  		for(var j=0; j< returnObjects.length ;j++){
  		
  			
	  			if(this.rectOverlap(returnObjects[j], mouseBox )){
	  				
	  				if(this.mouseDown && this.lockedToMouse == null){
	  					this.lockToMouse(returnObjects[j], mouseBox );
	  				}else{
	  					returnObjects[j].hit(mouseBox);
	  				}
	  				
	  			}
  			
  		}
  		
  		if(this.lockedToMouse!= null){
  			this.lockedToMouse.speedx -=  (this.lockedToMouse.speedx - (this.lockedToMouse.x - mouseX)) * .2;
  			this.lockedToMouse.speedy -= (this.lockedToMouse.speedy - (this.lockedToMouse.y - mouseY)) * .2;
  		}
  
}


game.prototype.checkMouseCollision = function(mouseX, mouseY){
	
	this.quad.clear();
	
	
	for( var i = 0; i < this.objects.length ; i ++){
    	this.quad.insert(this.objects[i]);
    	this.objects[i].update();
	}
	
	var returnObjects;
    
    	returnObjects = [];
    	var mouseBox = new Rectangle(mouseX - 20, mouseY - 20 , 40 , 40);
  		returnObjects = this.quad.retrieve(returnObjects, mouseBox);
  		
  		for(var j=0; j< returnObjects.length ;j++){
  		
  			
	  			if(this.rectOverlap(returnObjects[j], mouseBox )){
	  				
	  				if(this.mouseDown && this.lockedToMouse == null){
	  					this.lockToMouse(returnObjects[j], mouseBox );
	  				}else{
	  					returnObjects[j].hit(mouseBox);
	  				}
	  				
	  			}
  			
  		}
  		
  		if(this.lockedToMouse!= null){
  			this.lockedToMouse.speedx -=  this.lockedToMouse.x - mouseX;
  			this.lockedToMouse.speedy -= this.lockedToMouse.y - mouseY;
  		}
  
}

game.prototype.lockToMouse = function(objectToLock, mouseInfo){
	
	this.lockedToMouse = objectToLock;
	this.mouseDownInfo = mouseInfo;
}

game.prototype.rectOverlap = function (rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x ||
           rectB.x + rectB.width < rectA.x ||
           rectA.y + rectA.height < rectB.y ||
           rectB.y + rectB.height < rectA.y);
}


$(document).ready(function(){
	tileSheet = new Image();
		tileSheet.src = 'img/cells.png';
		tileSheet.onload = function() {
			var myGame = new  game();
		}
		
});