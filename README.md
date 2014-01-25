svgAgile
=========

A library to manipulate svg images with equal priority given to touch and mouse events.
The library is built to support pan/drag and zoom events of large svg images (Originally created for navigation over a map)

Dependancies
------------

Uses [Hammer.js](http://eightmedia.github.io/hammer.js/) to access both touch and mouse events.
Uses Hammer.js fake multi-touch and show touches for development.

Plugins
-------

Support for mouse wheel zooming is packaged as a plugin. 
Plugins are also in development for swipe selection of menu's (Swishly) and to support simple tap selection on the rest of the page (tap manager)

Use
---

This library is used by setting up a static viewboc for inline svg and to use the meta tag below to disable default panning and scrolling behaviour.

    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />

Insert the following script tags to the main html document

    <script src="js/hammer.min.js"></script>
    <script src="js/hammer.fakemultitouch.js"></script> #optional
    <script src="js/hammer.showtouches.js"></script> #optional
    <script src="js/svgAgile.js"></script>

Initialise svgAgile with the init call passing the svg group to manipulate as an argument

    svgAgile.init('manoeuvrable-svg');
