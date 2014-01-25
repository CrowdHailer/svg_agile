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