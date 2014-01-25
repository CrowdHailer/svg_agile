var svgAgile = {
	MIN_DELAY: 60,
	init: function (id) {
		console.log('starting');
		this.containerId = id;
		this.hammertime = Hammer(document).on('touch', this.touchHandler);
	},
	touchHandler: function (evt) {
		var node = svgAgile.getContainingGroup(evt.target, svgAgile.containerId);
		svgAgile.activeNode = node;
		if (node) {
			svgAgile.activity('on');
		}
	},
	activity: function (option) {
		//correct for misspelt option and loop through handlers
		if (option != 'on' && option != 'off') return;
		this.hammertime[option]('dragstart', this.dragstart);
		this.hammertime[option]('drag', this.drag);
		this.hammertime[option]('transformstart', this.transformstart);
		this.hammertime[option]('transform', this.transform);
		this.hammertime[option]('release', this.release);
	},
	dragstart: function (evt) {
		//Turn off high detail groups at this point
		svgAgile.lastTimeStamp = evt.gesture.timeStamp;
		
		svgAgile.scale = svgAgile.activeNode.ownerSVGElement.getScreenCTM().inverse().a
		svgAgile.anchor = svgAgile.activeNode.transform.baseVal.getItem(0);
	},
	transformstart: function (evt) {
		svgAgile.lastTimeStamp = evt.gesture.timeStamp;
		svgAgile.anchor = svgAgile.activeNode.transform.baseVal.getItem(0);
	},
	transform: function (evt) {
		svgAgile.zoom(evt);
	},
	drag: function (evt) {
		var G = evt.gesture;
		if (G.timeStamp - svgAgile.lastTimeStamp < svgAgile.MIN_DELAY) return;
		svgAgile.lastTimeStamp = G.timeStamp;
		//Else from here
		
		var scale = svgAgile.scale;
		var dx = G.deltaX;
		var dy = G.deltaY;
		
		var newMatrix = svgAgile.anchor.matrix.translate(scale*dx,scale*dy);
		
		var newTransform = svgAgile.activeNode.ownerSVGElement.createSVGTransform();
		
		newTransform.setMatrix(newMatrix);
		
		svgAgile.activeNode.transform.baseVal.initialize(newTransform);
		
		console.log(newMatrix);
	},
	zoom: function (evt) {
		var G = evt.gesture;
		if (G.timeStamp - svgAgile.lastTimeStamp < svgAgile.MIN_DELAY) return;
		svgAgile.lastTimeStamp = G.timeStamp;
		
		var scale = G.scale;
		var owner = svgAgile.activeNode.ownerSVGElement;
		var point = owner.createSVGPoint();
		
		point.x = G.center.pageX;
		point.y = G.center.pageY;
		
		var CTM = owner.getScreenCTM();
		point = point.matrixTransform(CTM.inverse());
		
		var newMatrix = svgAgile.anchor.matrix.translate((1-scale)*point.x,(1-scale)*point.y).scale(scale);
		var newTransform = owner.createSVGTransform();
		
		newTransform.setMatrix(newMatrix);
		
		svgAgile.activeNode.transform.baseVal.initialize(newTransform);
	},
	release: function (evt) {
		svgAgile.activity('off');
	},
	getContainingGroup: function (node, containerId) {
		while (node) {
			if (node.id == containerId) return node;
			node = node.parentNode;
		}
	},
	dropAnchor: function (target) {
		svgAgile.anchor = target.transform.baseVal.getItem(0)
	},
	plugins: {}
};