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

Hammer.plugins.fakeMultitouch();
Hammer.plugins.showTouches();

svgAgile.init('manoeuvrable-svg');
svgAgile.plugins.mouseWheel.init();
svgAgile.plugins.swishly.init('station');
svgAgile.plugins.tapManager.init(tapFunctions);