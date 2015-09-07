#!/usr/bin/env node

'use strict';

var fs = require('fs');
var wav = require('wav');
var Speaker = require('speaker');
var gongs = require('./gongs.json');
var GRID_SIZE = 4;

var midiConnector = require('midi-launchpad').connect(0);

midiConnector.on('ready', function(launchpad) {
  console.log('It\'s gong time');

  showGongChoices(launchpad);
});

function showGongChoices(launchpad) {
  var sounds = {};

  gongs.map(function(elem, i) {
    var row = Math.floor(i / GRID_SIZE);
    var col = i % GRID_SIZE;
    var button;

    if (row >= GRID_SIZE) {
      console.log('Warning: Too many gongs. Ignoring gong - ' + elem);
    } else {
      sounds[row] = sounds[row] || {};
      sounds[row][col] = elem;

      button = launchpad.getButton(row, col);
      button.light(launchpad.colors.green.high);
    }
  });

  launchpad.on('press', handlePress);
  launchpad.on('release', handleRelease);

  function handlePress(button) {
    button.dark();
  }

  function handleRelease(button) {
    if (sounds[button.x] && sounds[button.x][button.y]) {
      play(sounds[button.x][button.y]);
      button.light(launchpad.colors.green.high);
    } else {
      console.log('Warning: No gong for cell (' + button.x + ', ' + button.y + ')');
    }
  }
}

// TODO: Allow to choose b/w multiple gong sounds
function play(sound) {
  var file = fs.createReadStream(sound);
  var reader = new wav.Reader();

  reader.on('format', function(format) {
    reader.pipe(new Speaker(format));
  });


  file.pipe(reader);
}
