var map;
var markers = []
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

    //create marker for each place

      simplePlaces.forEach(createMarker)
      function createMarker(item, index){
        var content = "<div>" + item.name + "</div>";
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
        item.marker = new google.maps.Marker({
          position: item.location,
          map: map
        });
        item.marker.addListener("click", function() {
          infowindow.open(map, item.marker);
          item.marker.setAnimation(google.maps.Animation.BOUNCE);
          document.getElementById(item.name).style.backgroundColor = "#ff5733"
          //animation timeout
          window.setTimeout(function(){
            item.marker.setAnimation(null)
            document.getElementById(item.name).style.backgroundColor = "#33FFBD"
          }, 3750);

        });
        markers.push(item.marker)
      }
}
