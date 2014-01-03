function agileGroup (elementId) {
	this.elementId = elementId;
	this.agileElement = document.getElementById(elementId)
	
	this.parentSVG = this.findParentSVG() //requires agile element
	
	this.transMatrix = this.toTransformMatrix(this.getTransform());
	//find viewbox in master
};

agileGroup.prototype = {
	findParentSVG: function () {
		var node = this.agileElement.parentNode;
		while (node) {
			if (node.tagName.toLowerCase() === "svg"){
				return node;
			}
			node = node.parentNode;
		}
		return false;
	},
	getTransform: function () {
		return this.agileElement.getAttribute("transform");
	},
	toTransformMatrix: function (string) {
		//doesnt deal well with any misformatted string or translation etc
		try{
		var transString = string.split('(')[1].split(')')[0];
		return new tMatrix(transString.split(' '));
		}
		catch (err) {
			return new tMatrix([1,0,0,1,0,0]);
		}
	},
	setTransform: function (tMatrix) {
		this.agileElement.setAttributeNS(null, "transform", tMatrix.pageString());
	}
};

var svgAgile = {
	MIN_EVENT_DELAY: 60,
	//dragEnabled: true,
	//transformEnabled: true,
	moveGroup: false,
	plugins: {},
	init: function (transformGroupId) {
		this.agileGroup = new agileGroup(transformGroupId);
		var svgElement = this.agileGroup.parentSVG;
		this.svgElement = svgElement;
		//this.dragElement = false;
		var options = {
			drag_min_distance: 20,
			drag_block_horizontal: true,
			drag_block_vertical: true,
			correct_for_drag_min_distance: false,
		};
		var hammerDrag = Hammer(svgElement, options).on('drag', svgAgile.dragHandler);
		var hammerTouch = Hammer(svgElement, options).on('touch', svgAgile.touchHandler);
		var hammerDragstart = Hammer(svgElement, options).on('dragstart', svgAgile.dragstartHandler);
		var hammerDragend = Hammer(svgElement, options).on('dragend', svgAgile.dragendHandler);
		var hammerRelease = Hammer(svgElement, options).on('release', svgAgile.releaseHandler);
		var hammerHold = Hammer(svgElement, options).on('hold', svgAgile.holdHandler);
		
		var hammerTransform = Hammer(svgElement, options).on('transform', svgAgile.transformHandler);
		var hammerTransformstart = Hammer(svgElement, options).on('transformstart', svgAgile.transformstartHandler);
		var hammerTransformend = Hammer(svgElement, options).on('transformend', svgAgile.transformendHandler);
	},
	
	touchHandler: function (evt) {
		svgAgile.moveGroup = svgAgile.agileGroup;
		//svgAgile.draglastX = 0;
		//svgAgile.draglastY = 0;
	},
	dragstartHandler: function (evt) {
		if	(svgAgile.moveGroup) {
			svgAgile.lastEvent = evt.gesture.timeStamp;
			svgAgile.scale = svgAgile.getScale();
		}
	},
	dragHandler: function (evt) {
		if (evt.gesture.timeStamp - svgAgile.lastEvent > svgAgile.MIN_EVENT_DELAY && (svgAgile.moveGroup)) {
			svgAgile.lastEvent = evt.gesture.timeStamp
			
			var dx = evt.gesture.deltaX;
			var dy = evt.gesture.deltaY;
			var scale = svgAgile.scale;

			svgAgile.dragIt(scale*dx, scale*dy);
		}
	},
	dragendHandler: function (evt) {
		if (svgAgile.moveGroup) {
			var dx = evt.gesture.deltaX;
			var dy = evt.gesture.deltaY;
			var scale = svgAgile.scale;

			svgAgile.moveGroup.transMatrix = svgAgile.dragIt(scale*dx, scale*dy);
			
			//svgAgile.draglastX = dx;
			//svgAgile.draglastY = dy;
		}
	},
	transformstartHandler: function (evt) {
		if	(svgAgile.moveGroup) {
			svgAgile.lastEvent = evt.gesture.timeStamp;
		}
	},
	transformHandler: function(evt) {
		if (evt.gesture.timeStamp - svgAgile.lastEvent > svgAgile.MIN_EVENT_DELAY && (svgAgile.moveGroup)) {
			svgAgile.lastEvent = evt.gesture.timeStamp
			
			var scale = evt.gesture.scale;
			var zoomAt = svgAgile.getViewboxCoords(evt.gesture.center.pageX, evt.gesture.center.pageY);
			console.log(evt.gesture.scale);
			svgAgile.zoomIt(scale, zoomAt);
		}
	},
	transformendHandler: function (evt) {
		if (svgAgile.moveGroup) {
			var scale = evt.gesture.scale;
			var zoomAt = svgAgile.getViewboxCoords(evt.gesture.center.pageX, evt.gesture.center.pageY);
			
			svgAgile.moveGroup.transMatrix = svgAgile.zoomIt(scale, zoomAt);
		}
	},
	holdHandler: function (evt) {
		svgAgile.moveGroup = false;
	},
	dragIt: function (dx, dy) {
		var liveGroup = svgAgile.moveGroup;
		var newMatrix = liveGroup.transMatrix.translate(dx, dy);
		liveGroup.setTransform(newMatrix);
		return newMatrix;
	},
	zoomIt: function (scale, center) {
		var liveGroup = svgAgile.moveGroup;
		var newMatrix = liveGroup.transMatrix.scale(scale, center);
		liveGroup.setTransform(newMatrix);
		return newMatrix;
	},
	
	getViewboxCoords: function (pageX, pageY) {
		var point = this.svgElement.createSVGPoint();
		point.x = pageX;
		point.y = pageY;
		return svgAgile.coordinateTransform(point, svgAgile.svgElement);
	},
	coordinateTransform: function(screenPoint, someSvgObject) {
		var CTM = someSvgObject.getScreenCTM();
		return screenPoint.matrixTransform( CTM.inverse() );
	},
	getViewbox: function (svgElement) {
		return this.svgElement.getAttribute('viewBox').split(' ');
	},
	getScale: function () {
		return svgAgile.svgElement.getScreenCTM().inverse().a;
	},
};