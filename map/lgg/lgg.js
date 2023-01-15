import * as G from '/map/global.js';

G.init({
  background: '#6767b4',
  font: 'lgg.ttf',

  zoom: 5,
  minZoom: 1
});

G.addLayer({
  name: 'No Trees',
  updateInterval: 10,
  minZoom: 1,
  maxZoom: 5
});

G.addLayer({
  name: 'Trees',
  updateInterval: 10,
  minZoom: 1,
  maxZoom: 5
}, false);

const friendIco = { path: 'friends.png', width: 22, height: 32 };

G.addMarkers({
  'Friends': {
    show: true,
    items: [{
      name: 'Jill',
      ico: friendIco,
      x: 29.05, y: 70.4
    }, {
      name: 'martin',
      ico: friendIco,
      x: 77.6, y: 51.25
    }, {
      name: 'avery!',
      ico: friendIco,
      x: 37.7, y: 24.9
    }, {
      name: 'gerald',
      ico: friendIco,
      x: 70.1, y: 19.5
    }, {
      name: 'franny',
      ico: friendIco,
      x: 20.54, y: 55.3
    }]
  }
});
