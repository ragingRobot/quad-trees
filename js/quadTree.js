var Rectangle = function(_x,_y,_width,_height){
	this.x = _x;
	this.y = _y;
	this.width = _width;
	this.height = _height;
	
}

var Quad = function(_level, _bounds){
	////////////////////////////////////////////////////////////////////////////
	//
	///////////////////////////////////////////////////////////////////////////
	this.MAX_OBJECTS = 30;
  	this.MAX_LEVELS = 30;
  	this.objects = [];
  	this.nodes = [];
    this.level = _level;
    this.bounds = _bounds;
}

Quad.prototype.split = function(){
	////////////////////////////////////////////////////////////////////////////
	//	
	////////////////////////////////////////////////////////////////////////////
	var subWidth = this.bounds.width / 2;
    var subHeight = this.bounds.height / 2;
    var x = this.bounds.x;
    var y = this.bounds.y;
 
    this.nodes[0] = new Quad(this.level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
    this.nodes[1] = new Quad(this.level+1, new Rectangle(x, y, subWidth, subHeight));
    this.nodes[2] = new Quad(this.level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
    this.nodes[3] = new Quad(this.level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
 
}

Quad.prototype.clear = function(){
	////////////////////////////////////////////////////////////////////////////
	//
	///////////////////////////////////////////////////////////////////////////
	this.objects = [];
 
    for ( var i = 0 ; i < this.nodes.length ; i++) {
     if (this.nodes[i] != null) {
       this.nodes[i].clear();
       this.nodes[i] = null;
     }
    }
}
////////////////////////////////////////////////////////////////////////////////////////need to convert
Quad.prototype.getIndex = function(_rect){
	////////////////////////////////////////////////////////////////////////////
	//
	///////////////////////////////////////////////////////////////////////////
	var index = -1;
    var verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
    var horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);
 
   // Object can completely fit within the top quadrants
   var topQuadrant = (_rect.y < horizontalMidpoint && _rect.y + _rect.height < horizontalMidpoint);
   // Object can completely fit within the bottom quadrants
   var bottomQuadrant = (_rect.y > horizontalMidpoint);
 
   // Object can completely fit within the left quadrants
   if (_rect.x < verticalMidpoint && _rect.x + _rect.width < verticalMidpoint) {
      if (topQuadrant) {
        index = 1;
      }
      else if (bottomQuadrant) {
        index = 2;
      }
    }
    // Object can completely fit within the right quadrants
    else if (_rect.x > verticalMidpoint) {
     if (topQuadrant) {
       index = 0;
     }
     else if (bottomQuadrant) {
       index = 3;
     }
   }
 
   return index;
}

Quad.prototype.insert = function(_rect){
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	 if (this.nodes[0] != null) {
	     var index = this.getIndex(_rect);
	 
	     if (index != -1) {
	       this.nodes[index].insert(_rect);
	       return;
	     }
  	}	
 
   this.objects.push(_rect);
 
   if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
      if (this.nodes[0] == null) { 
         this.split(); 
      }
 
     var i = 0;
     while (i < this.objects.length) {
       var index = this.getIndex(this.objects[i]);
       if (index != -1) {
         this.nodes[index].insert(this.objects.shift(i));
       }
       else {
         i++;
       }
     }
   }
}

Quad.prototype.retrieve = function(_returnObjects, _rect)
{
	////////////////////////////////////////////////////////////////////////////
	//
	////////////////////////////////////////////////////////////////////////////
	var index = this.getIndex(_rect);
    if (index != -1 && this.nodes[0] != null) {
     	this.nodes[index].retrieve(_returnObjects, _rect);
    }
 
    _returnObjects = _returnObjects.concat(this.objects);
 
    return _returnObjects;
}