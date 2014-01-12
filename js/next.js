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
		//Turn off high detail groups at this point
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

//MouseWheel plugin
svgAgile.plugins.tapManager = {
	init: function (callbacks) {
		svgAgile.hammertime.on('tap', this.tapHandler);
		
		if(!callbacks['DEFAULT']) callbacks['DEFAULT'] = this.TAP_DEFAULT;
		if(!callbacks['FIRST']) callbacks['FIRST'] = this.TAP_FIRST;
		if(!callbacks['FINALLY']) callbacks['FINALLY'] = this.TAP_FINALLY;

		this.callbacks = callbacks;
	},
	tapHandler: function (evt) {
		var id = evt.target.id || 'DEFAULT'; //get id of element
		var callbacks = svgAgile.plugins.tapManager.callbacks 
		var callback = callbacks[id] || callbacks['DEFAULT']; //check for call back or again run DEFAUT
		callbacks['FIRST'](evt);
		callback(evt);
		callbacks['FINALLY'](evt);
		//console.log(Object.keys(evt.target)); SUPER USEFUL LINE REMEMBER
	},
	TAP_DEFAULT: function (evt) {},
	TAP_FIRST: function (evt) {},
	TAP_FINALLY: function (evt) {}
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
	}
};

svgAgile.init('manoeuvrable-svg');
svgAgile.plugins.swishly.init('station');
svgAgile.plugins.tapManager.init(tapFunctions);
