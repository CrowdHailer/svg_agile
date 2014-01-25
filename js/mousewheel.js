svgAgile.plugins.mouseWheel = {
	EventUtil: {
		addHandler: function (element, type, handler) {
			if (element.addEventListener) {
					element.addEventListener(type, handler, false);
			} else if (element.attachEvent) {
					element.attachEvent("on" + type, handler);
			} else {
					element["on" + type] = handler;
			}
		},
		getEvent: function(event) {
			return event ? event : window.event;
		},
		getWheelDelta: function (event) {
			if (event.wheelDelta) {
				return event.wheelDelta;
			} else {
				return -event.detail * 40;
			}
		}
	},
	handleMouseWheel: function (evt) {
		var self = svgAgile.plugins.mouseWheel;
		evt = self.EventUtil.getEvent(evt);
		
		var node = svgAgile.getContainingGroup(evt.target,svgAgile.containerId);
		if (node) {
			var delta = self.EventUtil.getWheelDelta(evt);
			var scale = Math.pow(2,delta/720);
			
			var owner = node.ownerSVGElement;
			var point = owner.createSVGPoint();
			
			point.x = evt.pageX;
			point.y = evt.pageY;
			
			var CTM = owner.getScreenCTM();
			point = point.matrixTransform(CTM.inverse());
			
			var newMatrix = svgAgile.anchor.matrix.translate((1-scale)*point.x,(1-scale)*point.y).scale(scale);
			var newTransform = owner.createSVGTransform();
			
			newTransform.setMatrix(newMatrix);
		
			svgAgile.activeNode.transform.baseVal.initialize(newTransform);
			
			svgAgile.dropAnchor(node);
			//PLACEHOLDER FOR ZOOM ACTION
			console.log('Zooming at scale ', scale)
			//var zoomAt = svgAgile.getViewboxCoords(evt.pageX, evt.pageY);
			
			//svgAgile.zoomgroup.transMatrix = svgAgile.zoomIt(scale, zoomAt);
			//svgAgile.zoomgroup = false;
		}
	},
	init: function () {
		var self = svgAgile.plugins.mouseWheel;
		self.EventUtil.addHandler(document, "mousewheel", this.handleMouseWheel);
		self.EventUtil.addHandler(document, "DOMMouseScroll", this.handleMouseWheel);

	}
};