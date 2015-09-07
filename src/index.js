#!/usr/bin/env node

'use strict';

var fs = require('fs');
var wav = require('wav');
var Speaker = require('speaker');

var midiConnector = require('midi-launchpad').connect(0);

midiConnector.on('ready', function(launchpad) {
  console.log('It\'s gong time');

  launchpad.on('press', handlePress);
  launchpad.on('release', handleRelease);

  function handlePress(button) {
    button.light(launchpad.colors.green.high);
  }

  function handleRelease(button) {
    button.dark();
    play();
  }
});

function play() {
  var file = fs.createReadStream('./src/assets/gong.wav');
  var reader = new wav.Reader();

  reader.on('format', function(format) {
    reader.pipe(new Speaker(format));
  });


  file.pipe(reader);
}

