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
var completePlaces = [];
var CLIENT_ID = "4Q1OVHHXPENTRL3JQN5ODBJJPUNTO2NGB2APYO5JYDKHGLRK";
var CLIENT_SECRET = "ZL4NPBEBU1114V2KY5PEHYVQ21VENYDFAQPYWIWISGBPWDNV";
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
  // place object creates marker for each place unpon intilization and returns place object
  var Place = function(name, location, addr, rating) {
    var content = "<div>" + name + "</div><div>" + addr;
    var infowindow = new google.maps.InfoWindow({
      content: content
    });
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });

    var place = {
      name: name, //pre-set
      location: location, // pre-set
      addr: addr, //from foursquare api
      rating: rating, //from foursqaure api
      marker: marker,
      infowindow: infowindow,
      show: true //default to true
    };

    return place;
  }

  //5 places to see in St.Louis
  var busch = {
    location: {
      lat: 38.6226,
      lng: -90.1928
    },
    name: 'Busch Stadium'
  }
  var zoo = {
    location: {
      lat: 38.6367,
      lng: -90.2932
    },
    name: 'St. Louis Zoo'
  }

  var cityMuseum = {
    location: {
      lat: 38.6336,
      lng: -90.2006
    },
    name: 'St. Louis City Museum'
  }

  var arch = {
    location: {
      lat: 38.6247,
      lng: -90.1848
    },
    name: 'St. Louis Arch'
  }

  var gardens = {
    location: {
      lat: 38.6128,
      lng: -90.2594
    },
    name: 'Botanical Gardens'
  }

  //call the foursqaure api for each place and get address and rating, then create a new Place object
  var simplePlaces = [busch, zoo, arch, cityMuseum, gardens];
  simplePlaces.forEach(getInfo)

  function getInfo(item, index) {
    $.ajax({
      url: 'https://api.foursquare.com/v2/venues/search',
      dataType: 'json',
      data: 'limit=1' +
        '&ll=' + item.location.lat + ',' + item.location.lng +
        '&client_id=' + CLIENT_ID +
        '&client_secret=' + CLIENT_SECRET +
        '&intent=match' +
        '&query=' + item.name +
        '&v=' + '20180626',
      async: true,
      success: function(data) {
        var result = data.response.venues[0];

        var location = result.hasOwnProperty('location') ? result.location : '';
        if (location.hasOwnProperty('address')) {
          item.address = location.address || '';
        }
        var rating = result.hasOwnProperty('rating') ? result.rating : '';
        item.rating = rating || 'none';

        var newPlace = Place(item.name, item.location, item.address, item.rating)
        completePlaces.push(newPlace)

      },
      error: function(e) {
        console.log("ERROR: " + e)
      }
    });
  }
}

var ViewModel = function() {

  this.placeList = completePlaces;

  this.showAll = function() {

  };

  this.showFree = function() {

  };

};

//array.push is async so must wait to create ViewModel
const wait = time => new Promise((resolve) => setTimeout(resolve, time));
wait(3000).then(() => ko.applyBindings(new ViewModel()));





// 5 places to see in St. Louis