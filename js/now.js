console.log('now.js loaded');

Hammer.plugins.fakeMultitouch();
Hammer.plugins.showTouches();

console.log('Hammer Plugins Loaded');

var svgAgile = {
	MIN_DELAY: 60,
	init: function (idList) {
		console.log('Initialize Agile');
		
		var groups = {};
		
		var i = 0;
		while (item = idList[i++]) {
			var element = document.getElementById(item);
			if (!element) continue;
			
			var owner = element.ownerSVGElement;
			if (!owner) continue;

			groups[item] = element;
		}
		console.log(groups);
		
		var options = {};
		var hammerTouch = Hammer(groups['manoeuvrable-svg'], options).on('touch', svgAgile.touchHandler);
		
		var hammerDragstart = Hammer(groups['manoeuvrable-svg'], options).on('dragstart', svgAgile.dragstartHandler);
		var hammerDrag = Hammer(groups['manoeuvrable-svg'], options).on('drag', svgAgile.dragHandler);
	},
	touchHandler: function (evt) {
		svgAgile.move = evt.currentTarget;
	},
	dragstartHandler: function (evt) {
		if	(svgAgile.move) {
			svgAgile.lastEvent = evt.gesture.timeStamp;
			svgAgile.scale = svgAgile.move.ownerSVGElement.getScreenCTM().inverse().a;
			console.log(svgAgile.scale);
			
			svgAgile.anchor = svgAgile.move.transform.baseVal.getItem(0).matrix;
		}
	},
	dragHandler: function (evt) {
		var G = evt.gesture;
		if (G.timeStamp - svgAgile.lastEvent > svgAgile.MIN_DELAY && (svgAgile.move)) {
			
			var dx = G.deltaX;
			var dy = G.deltaY;
			var scale = svgAgile.scale;
			
			var liveGroup = svgAgile.move;
			
			liveGroup.transform.baseVal.getItem(0).setMatrix(svgAgile.anchor.translate(scale*dx, scale*dy));
		}
	}
};

svgAgile.init(['manoeuvrable-svg', 'home-button', 'zzsp']);