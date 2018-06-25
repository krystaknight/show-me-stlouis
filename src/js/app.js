/////////////////////////NAVIGATION///////////////////////////////////
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

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

  //////////////////////////////////////////////////////////////////////
  // place object
  var Place = function(name, location, addr, reviews, attr) {
    this.name = name; //pre-set
    this.location = location; // pre-set
    this.addr = addr; //from yelp api
    this.reviews = reviews; //from yelp api
    this.attr = attr; //pre-set
    this.content = "<div>" + name + "</div><div>" + addr;
    var infowindow = new google.maps.InfoWindow({
      content: this.content
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
    this.marker = marker;
    this.show = true; //default to true
  }

  var viewModel = {
    // when view model is initailized get info for each place and create place object
    place: [
      new Place('Bush Stadium', {
        lat: 38.6226,
        lng: -90.1928
      }, '', '', [
        "free"
      ])
    ],

    showAll: function() {
      //show all places in list
    },
    showFree: function() {
      //show free places
    }
  };

  ko.applyBindings(viewModel);

}


// 5 places to see in St. Louis
// var fp = {
//   location: {
//     lat: 38.6365,
//     lng: -90.2876
//   },
//   name: 'Forest Park'
// }
//
// var cityMuseum = {
//   location: {
//     lat: 38.6336,
//     lng: -90.2006
//   },
//   name: 'St. Louis City Museum'
// }
//
// var arch = {
//   location: {
//     lat: 38.6247,
//     lng: -90.1848
//   },
//   name: 'St. Louis Arch'
// }
//
// var gardens = {
//   location: {
//     lat: 38.6128,
//     lng: -90.2594
//   },
//   name: 'Botanical Gardens'
// }