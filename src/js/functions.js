//Initailize map
function initMap()
  {
    var stl = {lat: 38.6240, lng: -90.2391 }
    var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 14,center: stl});

    // 5 places to see in St. Louis
    var fp = {lat: 38.6365, lng: -90.2876}
    var fPmarker = new google.maps.Marker({position: fp, map: map})
    var cityMuseum = {lat: 38.6336, lng: -90.2006}
    var cityMuseumMarker = new google.maps.Marker({position: cityMuseum, map: map})
    var arch = {lat: 38.6247, lng: -90.1848}
    var archMarker = new google.maps.Marker({position: arch, map: map})
    var gardens = {lat: 38.6128, lng: -90.2594}
    var gardensMarker = new google.maps.Marker({position: gardens, map: map})
    var bush = {lat: 38.6226, lng: -90.1928}
    var bushMarker = new google.maps.Marker({position: bush, map: map})
  }

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
