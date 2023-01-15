$('<div/>', {
  id: 'map',
  height: '100vh'
}).appendTo('body');

$('<meta/>', {
  charset: 'utf-8'
}).appendTo('head');

$('<link/>', {
  rel: 'icon',
  href: 'assets/icon.png'
}).appendTo('head');

$('<link/>', {
  rel: 'stylesheet',
  href: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css'
}).appendTo('head');

$('body').css({
  height: '100%',
  margin: 0
});

$('#map').css({
  'font-size': '18pt',
  'font-family': '"MapFont", sans-serif',
  'line-height': 1.2,
  'background': '#FFFFFF'
});

$('p').css({
  margin: 0
});
