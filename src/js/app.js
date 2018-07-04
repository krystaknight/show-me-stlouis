/////////////////////////NAVIGATION///////////////////////////////////
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
};

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
};

function onerror() {
  console.log("Google Maps connection timeout");

};
//////////////////////////////////////////////////////////////////////
//5 places to see in St.Louis
var busch = {
  location: {
    lat: 38.6226,
    lng: -90.1928
  },
  name: 'Busch Stadium'
};
var zoo = {
  location: {
    lat: 38.6367,
    lng: -90.2932
  },
  name: 'St. Louis Zoo'
};

var cityMuseum = {
  location: {
    lat: 38.6336,
    lng: -90.2006
  },
  name: 'St. Louis City Museum'
};

var arch = {
  location: {
    lat: 38.6247,
    lng: -90.1848
  },
  name: 'St. Louis Arch'
};

var gardens = {
  location: {
    lat: 38.6128,
    lng: -90.2594
  },
  name: 'Missouri Botanical Garden'
}

//chooses a random number to base filter on
function isCool() {
  var num = Math.floor((Math.random() * 5) + 1);
  if (num > 3) {
    return true;
  } else {
    return false;
  }
}

var Place = function(name, location, addr, icon) {
  var place = {
    name: name, //pre-set
    location: location, // pre-set
    addr: addr, //from foursquare api
    icon: icon, //from foursqaure api
    isCool: isCool(),
    show: ko.observable(true) //default to true
  };
  return place;
}

////////////////////////MAP////////////////////////////////
var map;
var completePlaces = ko.observableArray();
var markers = []
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

  // place object creates marker for each place unpon intilization and returns place object


  //call the foursqaure api for each place and get address and icon, then create a new Place object
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
        if (location.hasOwnProperty('formattedAddress')) {
          var address = location.formattedAddress || "Not Available";
        }

        var category = result.hasOwnProperty('categories') ? result.categories : '';
        var getCategory = category[0]
        var prefix = getCategory.icon.prefix
        var suffix = getCategory.icon.suffix
        var icon = prefix + "88" + suffix

        var newPlace = Place(item.name, item.location, address, icon)
        completePlaces.push(newPlace)
        var content = "<div>" + item.name + "</div><div>" + address + "</div>";
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
        var marker = new google.maps.Marker({
          position: item.location,
          map: map
        });
        marker.addListener("click", function() {
          infowindow.open(map, marker);
        });
        markers.push(marker)

      },
      error: function(e) {
        document.getElementById("foursquareError").style.visibility = "visible"
        console.log("ERROR: Foursquare cannot be reached.")
      }
    });
  }

}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(location) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].getPosition().lat() == location.lat || markers[i].getPosition().lng() == location.lng) {
      markers[i].setMap(null);
    }
  }
}

// Shows any markers currently in the array.
function showMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function resetShow() {
  for (var i = 0; i < completePlaces().length; i++) {
    completePlaces()[i].show(true)
  }
}


var ViewModel = function() {
  var cpLength = 5;

  this.showAll = function() {
    resetShow()
    showMarkers()
    document.getElementById("place").style.backgroundColor = "#33FFBD"
  };

  this.showCool = function() {
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
      //why doesn't this work :(
      document.getElementById("place").style.backgroundColor = "#33A2FF"
    }
    if (noCool == 5) {
      document.getElementById("no-cool").style.visibility = "visible"
    }
  };

  this.showUncool = function() {
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
      //why doesn't this work :(
      document.getElementById("place").style.backgroundColor = "#FF3352"
    }
    if (noUncool == 5) {
      document.getElementById("no-uncool").style.visibility = "visible"
    }
  };

};

//array.push is async so must wait to create ViewModel
const wait = time => new Promise((resolve) => setTimeout(resolve, time));
wait(3000).then(() => ko.applyBindings(new ViewModel()));