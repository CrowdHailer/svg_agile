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
		this.hammertime[option]('release', this.release);
	},
	dragstart: function (evt) {
		//Turn off high detail groups at this point
		svgAgile.lastTimeStamp = evt.gesture.timeStamp;
		
		svgAgile.scale = svgAgile.activeNode.ownerSVGElement.getScreenCTM().inverse().a
		svgAgile.anchor = svgAgile.activeNode.transform.baseVal.getItem(0)
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
		
		var newMatrix = avgAgile.anchor.matrix.translate((1-scale)*point.x,(1-scale)*point.y).scale(scale);
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
svgAgile.plugins.swishly = {
	init: function (dataLabel) {
		svgAgile.swishlyDataLabel = dataLabel;
		svgAgile.hammertime.on('hold', this.holdHandler);
	},
	holdHandler: function (evt) {
		var dataValue = svgAgile.plugins.swishly.getData(evt.target, svgAgile.swishlyDataLabel);
		if (dataValue) {
			console.log('holding with data value ', dataValue);
			svgAgile.activity('off');
			svgAgile.plugins.swishly.activity('on');
		}
	},
	activity: function (option) {
		svgAgile.hammertime[option]('dragstart', this.dragstart);
		svgAgile.hammertime[option]('dragend', this.dragend);
		svgAgile.hammertime[option]('release', this.release);
	},
	dragstart: function (evt){
		console.log('swishly started');
	},
	dragend: function (evt) {
		console.log('swishly selected', evt.gesture.direction)
	},
	release: function (evt) {
		svgAgile.plugins.swishly.activity('off');
	},
	getData: function (element, label) {
		//Update to include parent data.
		return element.getAttribute('data-' + label);
	}
};
svgAgile.plugins.tapManager = {
	init: function (callbacks) {
		svgAgile.hammertime.on('tap', this.tapHandler);
		
		if(!callbacks['DEFAULT']) callbacks['DEFAULT'] = this.TAP_DEFAULT;
		if(!callbacks['FIRST']) callbacks['FIRST'] = this.TAP_FIRST;
		if(!callbacks['LAST']) callbacks['LAST'] = this.TAP_LAST;

		this.callbacks = callbacks;
	},
	tapHandler: function (evt) {
		var callbacks = svgAgile.plugins.tapManager.callbacks 
		var callback = callbacks[evt.target.id] || callbacks['DEFAULT']; //check for call back or again run DEFAUT
		
		callbacks['FIRST'](evt);
		callback(evt);
		callbacks['LAST'](evt);
		//console.log(Object.keys(evt.target)); SUPER USEFUL LINE REMEMBER
	},
	TAP_DEFAULT: function (evt) {},
	TAP_FIRST: function (evt) {},
	TAP_LAST: function (evt) {}
};
var tapFunctions = {
	// id: function (evt) {}
	'home-button': function (evt) {
		console.log('Clicked Home Button');
	},
	'goTo-button': function (evt) {
		console.log('Clicked go-to button');
	},
	DEFAULT: function (evt) {
		console.log('Default tap response');
	},
	FIRST: function (evt) {
		console.log('always print this');
	},
	LAST: function (evt) {
		console.log("and finally");
	}
};

svgAgile.init('manoeuvrable-svg');
svgAgile.plugins.mouseWheel.init();
svgAgile.plugins.swishly.init('station');
svgAgile.plugins.tapManager.init(tapFunctions);
