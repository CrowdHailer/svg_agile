function tMatrix (input) {
	this.values = input || [1,0,0,1,0,0];
	return this;
};
tMatrix.prototype = {
	toString: function () {
		return this.values.join(' ');
	},
	pageString: function() {
		return "matrix(!)".replace("!", this.toString());
	},
	translate: function (dx, dy) {
		var newValues = this.values.slice(0);
		newValues[4] += dx;
		newValues[5] += dy;
		return new tMatrix(newValues);
	},
	scale: function (scale, center) {
		//Unrolled loop for optimisation
		var newValues = this.values.slice(0);
		
		newValues[0] *= scale;
		newValues[1] *= scale;
		newValues[2] *= scale;
		newValues[3] *= scale;
		newValues[4] *= scale;
		newValues[5] *= scale;
		newValues[4] += (1-scale)*center.x;
		newValues[5] += (1-scale)*center.y;
		
		return new tMatrix(newValues);
	}
};
