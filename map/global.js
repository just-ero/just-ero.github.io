import { } from 'https://code.jquery.com/jquery-3.6.3.min.js';
import { } from 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
import { } from '/map/styling.js';

const _mapOptions = {
  background: '#FFFFFF',
  font: null,

  attributionControl: false,
  zoomControl: false,

  zoomDelta: .5,
  zoomSnap: .5,

  inertia: true,
  inertiaDeceleration: 3000,
  inertiaMaxSpeed: 250,
  maxBoundsViscosity: 1,

  bounceAtZoomLimits: false,

  crs: L.CRS.Simple,
  center: [0, 0],
  tileSize: 256,
  zoom: 0
};

const _layerOptions = {
  name: null,
  attribution: null,

  keepBuffer: 2,
  opacity: 1,

  updateWhenIdle: false,
  updateInterval: 200,
  zIndex: 1,

  minZoom: 0,
  maxZoom: 0
};

const _layers = L.control.layers();
let _rendered = false, _bounds, _map;

export function init(options = {}) {
  if (_rendered)
    return;

  options = { ..._mapOptions, ...options };
  options.maxBounds ??= [[0, 0], [-options.tileSize, options.tileSize]];

  if (options.font) {
    $('<style/>')
      .html(`@font-face { font-family: 'MapFont'; src: url('assets/${options.font}'); }`)
      .appendTo('head');
  }

  if (options.background) {
    $('#map').css({
      'background': options.background
    });
  }

  _bounds = options.maxBounds;
  _map = L.map('map', options);
  _layers.addTo(_map);

  _rendered = true;
}

export function addLayer(options = {}, show = true) {
  options = { ..._layerOptions, ...options };
  options.bounds ??= _bounds;

  const folder = 'tiles/' + options.name + '/';
  const path = folder + '{z}/tile_{x}_{y}.png';

  const layer = L.tileLayer(path, options);

  _layers.addBaseLayer(layer, options.name ?? 'Main');

  if (show)
    layer.addTo(_map);
}

export function addMarkers(layers) {
  for (const layer in layers) {
    const group = L.layerGroup();

    let name = layer;
    if (layers[layer].ico) {
      name = `<img src='assets/${layer.toLowerCase()}.png' height='18pt'/> ${name}`;
    }

    layers[layer].items.forEach(item => {
      if (item.radius) {
        circle(item).addTo(group);
      } else if (item.coords) {
        polygon(item).addTo(group);
      } else {
        marker(item).addTo(group);
      }
    });

    _layers.addOverlay(group, name);

    if (layer.show ?? true)
      group.addTo(_map);
  }
}

function marker(marker) {
  return L.marker(
    [-marker.y, marker.x],
    !marker.ico ? {} : {
      icon: L.icon({
        iconUrl: `assets/${marker.ico.path}`,
        iconSize: [marker.ico.width, marker.ico.height]
      })
    }).bindTooltip(tt(marker.name, marker.desc));
}

function circle(circle) {
  return L.circle([-circle.y, circle.x], {
    color: circle.outline ?? '#fff',
    fillColor: circle.fill ?? '#ddd',
    fillOpacity: circle.opacity ?? .4,
    radius: circle.radius
  }).bindTooltip(tt(circle.name, circle.desc));
}

function polygon(polygon) {
  polygon.coords.forEach(coord => [coord[0], coord[1]] = [-coord[1], coord[0]]);

  return L.polygon(polygon.coords, {
    color: polygon.outline ?? '#fff',
    fillColor: polygon.fill ?? '#ddd',
    fillOpacity: polygon.opacity ?? .4,
  }).bindTooltip(tt(polygon.name, polygon.desc));
}

function tt(id, desc = null) {
  return L.tooltip({
    content: !desc ? id : `${id}<p style='font-size: 10pt; margin: 0;'>${desc}</p>`
  });
}
