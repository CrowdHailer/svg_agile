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