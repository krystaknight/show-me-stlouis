////////////////////////MAP////////////////////////////////
var map;
//Initailize map
function initMap() {
  var stl = {
    lat: 38.6240,
    lng: -90.2391
  }
  //create map, center at stl
  map = new google.maps.Map(
    document.getElementById('map'), {
      zoom: 14,
      center: stl
    });
}
