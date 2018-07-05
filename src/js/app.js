/////////////////////////NAVIGATION///////////////////////////////////
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
};

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
};

//////////////////////////////////////////////////////////////////////

//chooses a random number to base filter on
function isCool() {
  var num = Math.floor((Math.random() * 5) + 1);
  if (num > 3) {
    return true;
  } else {
    return false;
  }
}

//5 places to see in St.Louis
var busch = {
  location: {
    lat: 38.6226,
    lng: -90.1928
  },
  name: 'Busch Stadium',
  isCool: isCool(),
  show: ko.observable(true)
};
var zoo = {
  location: {
    lat: 38.6367,
    lng: -90.2932
  },
  name: 'St. Louis Zoo',
  isCool: isCool(),
  show: ko.observable(true)
};

var cityMuseum = {
  location: {
    lat: 38.6336,
    lng: -90.2006
  },
  name: 'St. Louis City Museum',
  isCool: isCool(),
  show: ko.observable(true)
};

var arch = {
  location: {
    lat: 38.6247,
    lng: -90.1848
  },
  name: 'St. Louis Arch',
  isCool: isCool(),
  show: ko.observable(true)
};

var gardens = {
  location: {
    lat: 38.6128,
    lng: -90.2594
  },
  name: 'Missouri Botanical Garden',
  isCool: isCool(),
  show: ko.observable(true)
}

var simplePlaces = [busch, zoo, arch, cityMuseum, gardens];
var completePlaces = ko.observableArray();

//get address and icon from foursqaure for each item
var CLIENT_ID = "4Q1OVHHXPENTRL3JQN5ODBJJPUNTO2NGB2APYO5JYDKHGLRK";
var CLIENT_SECRET = "ZL4NPBEBU1114V2KY5PEHYVQ21VENYDFAQPYWIWISGBPWDNV";
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
      if (location.hasOwnProperty('formattedAddress')) {
          item.address = location.formattedAddress || "Not Available";
      }

      var category = result.hasOwnProperty('categories') ? result.categories : '';
      var getCategory = category[0]
      var prefix = getCategory.icon.prefix
      var suffix = getCategory.icon.suffix
      item.icon = prefix + "88" + suffix

      //add completed places to oservable array
      completePlaces.push(item)


    },
    error: function(e) {
      document.getElementById("foursquareError").style.visibility = "visible"
      console.log("ERROR: Foursquare cannot be reached. " + e.code)
    }
  });
}

//create marker for each place
var markers = []
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

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(location) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].getPosition().lat() == location.lat || markers[i].getPosition().lng() == location.lng) {
      markers[i].setMap(null);
    }
  }
}

// Shows all markers currently in the array.
function showMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// reset show to true for all places
function resetShow() {
  for (var i = 0; i < completePlaces().length; i++) {
    completePlaces()[i].show(true)
  }
}


var ViewModel = function() {
  var self = this;
  var cpLength = simplePlaces.length;

  self.showAll = function(place) {
    resetShow()
    showMarkers()
    completePlaces().forEach(function(place){
      document.getElementById(place.name).style.backgroundColor = "#33FFBD"
    });
  };

  self.showCool = function() {
    console.log("Uncool Places")
    resetShow()
    showMarkers()
    var noCool = 0
    for (var i = 0; i < cpLength; i++) {
      var item = completePlaces()[i]
      if (!item.isCool) {
        item.show(false)
        console.log(item)
        clearMarkers(item.location)
        noCool += 1
      }
    }
    completePlaces().forEach(function(place){
      document.getElementById(place.name).style.backgroundColor = "#f9ff33"
    });
    if (noCool == 5) {
      document.getElementById("no-cool").style.visibility = "visible"
    }
  };

  self.showUncool = function() {
    console.log("Cool Places")
    resetShow()
    showMarkers()
    var noUncool = 0
    for (var i = 0; i < cpLength; i++) {
      var item = completePlaces()[i]
      if (item.isCool) {
        item.show(false)
        console.log(item)
        clearMarkers(item.location)
        noUncool += 1
      }
    }
    completePlaces().forEach(function(place){
      document.getElementById(place.name).style.backgroundColor = "#f933ff"
    });
    if (noUncool == 5) {
      document.getElementById("no-uncool").style.visibility = "visible"
    }
  };

  self.animate = function(place){
    document.getElementById(place.name).style.backgroundColor = "#ff5733"
    var location = place.location
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getPosition().lat() == location.lat || markers[i].getPosition().lng() == location.lng) {
        //animate marker and change color
        place.marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    window.setTimeout(function(){
      place.marker.setAnimation(null)
      document.getElementById(place.name).style.backgroundColor = "#33FFBD"
    }, 3750);
  }

};

ko.applyBindings(new ViewModel())
