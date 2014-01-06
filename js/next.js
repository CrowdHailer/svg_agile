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
		this.hammertime[option]('dragend', this.dragend);
		this.hammertime[option]('release', this.release);
	},
	dragstart: function (evt) {
		console.log('Dragging with svgAgile');
		svgAgile.lastTimeStamp = evt.gesture.timeStamp;
		
		svgAgile.scale = svgAgile.activeNode.ownerSVGElement.getScreenCTM().inverse().a
		
	},
	drag: function (evt) {
		var G = evt.gesture;
		if (G.timeStamp - svgAgile.lastTimeStamp < svgAgile.MIN_DELAY) return;
		svgAgile.lastTimeStamp = G.timeStamp;
		//Else from here
		
		console.log(G.timeStamp);
		
	},
	release: function (evt) {
		console.log(this);
		svgAgile.activity('off');
	},
	getContainingGroup: function (node, containerId) {
		while (node) {
			if (node.id == containerId) return node;
			node = node.parentNode;
		}
	},
	plugins: {}
};
svgAgile.plugins.swishly = {
	init: function () {
		svgAgile.hammertime.on('hold', this.holdHandler);
	},
	holdHandler: function (evt) {
		var element = evt.target;
		var dataName = 'station'
		var dataValue = element.getAttribute('data-' + dataName);
		if (dataValue) {
			console.log('holding');
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
	}
};

svgAgile.init('manoeuvrable-svg');
svgAgile.plugins.swishly.init();
