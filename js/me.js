var svgAgile = {
	MIN_EVENT_DELAY: 60,
	plugins: {},
	init: function (idList) {
		var i = 0;
		var elementId = idList[i];
		while (elementId) {
			var element = document.getElementById(elementId);
			console.log(element);
			ifList[++i];
		}
			
		
	},
};
alert('what');

Hammer.plugins.fakeMultitouch();
Hammer.plugins.showTouches();

svgAgile.init(['manoeuvrable-svg', 'home-button', 'zzsp']);
console.log('what');
svgAgile.plugins.mouseWheel.init();