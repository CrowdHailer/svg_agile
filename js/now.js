Hammer.plugins.fakeMultitouch();
Hammer.plugins.showTouches();

function agileEntity (element) {
	this.element = element;
	this.anchor = element.transform.baseVal.getItem(0); //condense and simply transform list. save as svgtransform object
	this.MIN_DELAY = 60;
	// add home property;
};
agileEntity.prototype = {
	isSVG: function() {
		return this.element.ownerSVGElement && true;
	},
	agileReady: function(evt) {
		this.lastTimeStamp = evt.gesture.timeStamp;
		
		this.scale = this.element.ownerSVGElement.getScreenCTM().inverse().a;
		
		this.update(); //updates anchor position

	},
	drag: function (evt) {
		var G = evt.gesture;
		if (G.timeStamp - this.lastTimeStamp < this.MIN_DELAY) return;
		
		this.lastTimeStamp = G.timeStamp;
		var scale = this.scale;
		
		var dx = G.deltaX;
		var dy = G.deltaY;
		
		var newMatrix = this.anchor.matrix.translate(scale*dx,scale*dy);

		var newTransform = this.element.ownerSVGElement.createSVGTransform();

		newTransform.setMatrix(newMatrix);
		
		this.element.transform.baseVal.initialize(newTransform);
	},
	zoom: function (evt) {
		var G = evt.gesture;
		
		if (G.timeStamp - this.lastTimeStamp < this.MIN_DELAY) return;
		this.lastTimeStamp = G.timeStamp;
		
		var scale = G.scale;
		
		var owner = this.element.ownerSVGElement;
		var point = owner.createSVGPoint();
		point.x = G.center.pageX;
		point.y = G.center.pageY;
		
		var CTM = owner.getScreenCTM();
		//console.log('first', point);
		
		point = point.matrixTransform(CTM.inverse());
		
		//console.log(point);
		
		var newMatrix = this.anchor.matrix.scale(scale);
		var newTransform = owner.createSVGTransform();
		
		newTransform.setMatrix(newMatrix);
		
		this.element.transform.baseVal.initialize(newTransform);
		
	},
	update: function () {
		this.anchor = this.element.transform.baseVal.getItem(0)
	},
	undo: function () {
	
	},
	

}

var svgAgile = {
	plugins: {},
	init: function (idList) {
		var agileEntities = {};
		
		var i = 0;
		while (item = idList[i++]) {
			var element = document.getElementById(item);
			if (!element) continue;
			
			var owner = element.ownerSVGElement;
			if (!owner) continue;

			agileEntities[item] = new agileEntity(element);
		}
		
		this.agileEntities = agileEntities;
		console.log('elements found with ids', Object.keys(agileEntities));
		
		var options = {};
		this.hammertime = Hammer(document, options).on('touch', svgAgile.touchHandler);
	},
	touchHandler: function (evt) {
		var agileGroup = svgAgile.getContainingAgileEntity(evt.target);
		
		if (!agileGroup) return;
		svgAgile.live = agileGroup;

		var hammertime = svgAgile.hammertime;
		hammertime.on('dragstart transformstart', svgAgile.panStart);
		hammertime.on('hold', svgAgile.holdHandler);
		hammertime.on('drag', svgAgile.dragHandler);
		hammertime.on('transform', svgAgile.zoomIt);
		hammertime.on('release', svgAgile.closeAction);
		hammertime.on('tap', svgAgile.tapTest);
	},

	panStart: function (evt) {
		svgAgile.live.agileReady(evt);
	},
	holdHandler: function (evt) {
		console.log('hold');
		
		var hammertime = svgAgile.hammertime;
		
		hammertime.off('dragstart transformstart', svgAgile.panStart);
		hammertime.off('drag', svgAgile.dragHandler);
		
		hammertime.on('dragend', svgAgile.loadUp);
	},
	loadUp: function (evt) {
		console.log('loading');
	},
	closeAction: function (evt) {
		console.log('closing');
		var hammertime = svgAgile.hammertime;
		hammertime.off('dragend', svgAgile.loadUp);
		svgAgile.live = false;
	},
	dragHandler: function (evt) {
		svgAgile.live.drag(evt)
	},
	tapTest: function (evt) {
		console.log(evt.target.getAttribute('class'));

	},
	zoomIt: function (evt) {
		svgAgile.live.zoom(evt)
	},
	getContainingAgileEntity: function (node) {
		while(node) {
			var agileEntity = svgAgile.agileEntities[node.id];
			if (agileEntity) return agileEntity;
			node = node.parentNode;
		}
		return false;
	}

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
		var delta = self.EventUtil.getWheelDelta(evt);
		var k = Math.pow(2,delta/720);
		
		var agileGroup = svgAgile.getContainingAgileEntity(evt.target);
		console.log(agileGroup);
		//svgManoeuvre.startMatrix = svgManoeuvre.transMatrix.slice(0);
		//svgManoeuvre.zoomPage(k, evt.pageX, evt.pageY);
		console.log(k);
	},
	init: function () {
		var self = svgAgile.plugins.mouseWheel;
		self.EventUtil.addHandler(document, "mousewheel", this.handleMouseWheel);
		self.EventUtil.addHandler(document, "DOMMouseScroll", this.handleMouseWheel);

	}
};


svgAgile.init(['manoeuvrable-svg', 'home-button', 'zzsp']);
svgAgile.plugins.mouseWheel.init();