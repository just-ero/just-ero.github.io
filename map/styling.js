$('head').prepend([
  $('<meta/>', { charset: 'utf-8' }),
  $('<link/>', { rel: 'icon', href: 'assets/icon.png' }),
  $('<link/>', { rel: 'stylesheet', href: '../global.css' }),
  $('<link/>', { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css' })
]);

$('body').prepend([
  $('<div/>', { id: 'map', height: '100vh' })
]);
