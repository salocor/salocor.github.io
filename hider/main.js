var currLat, currLong, nextLat, nextLong, dirToNext, dirToNextOffset, compass, alpha, radius, completed = 0, debugGestureCount = 0;

var locations = [];

const userAgent = navigator.userAgent;

var logLocation = () => {
  navigator.geolocation.getCurrentPosition(function(location) {
    currLat = location.coords.latitude;
    currLong = location.coords.longitude;
    console.log("Latitude: " + currLat);
    console.log("Longitude: " + currLong);
    if (inDestBoundary()) {
      document.getElementById('complete').setAttribute('style', "visibility: visible");
    } else {
      document.getElementById('complete').setAttribute('style', "visibility: hidden");
    }
    sendLocation();
    //console.log(location.coords.accuracy);
  });
};

function sendLocation() {
  dirToNext = (getDeg(currLat, currLong, nextLat, nextLong) * 57.29);
  var xhr = new XMLHttpRequest();
  var request = "https://salocor.pythonanywhere.com/location?lat=" + currLat + "&long=" + currLong;
  xhr.open('GET', request);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log("Sent ok");
      debugResult.innerHTML = "<h3>Lat: " + currLat + "/nLong: " + currLong + "</h3>";
    }
    else {
      console.error(xhr.statusText);
    }
  };
  xhr.send();
}

function pathRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://salocor.pythonanywhere.com/paths?pack=liberty&size=medium');
  xhr.onload = function() {
    if (xhr.status === 200) {
      let response = xhr.responseText;
      let obj = JSON.parse(response);
      locations = [];
      var rand;
      var indexUsed = [];
      for (var i = 0; i < 4; i++) {
        rand = Math.floor(Math.random() * 10);
        var j;
        for (j = 0; j < i; j++) {
          if (rand == indexUsed[j]) {
            j = 0;
            rand = Math.floor(Math.random() * 10);
          }
        }
        locations.push(obj[rand]);
        indexUsed.push(rand);
        console.log(rand);
      }
      updateDestination();
    }
    else {
      console.error(xhr.statusText);
    }
  };
  xhr.send();

}
//

function getDeg(currLat, currLong, enLat, enLong) {
    let longDiff = (enLong - currLong);
    let latDiff = (enLat - currLat);

    let heading;
    if ((latDiff > 0 && longDiff > 0) || (latDiff > 0 && longDiff < 0)) {
        heading = Math.atan(longDiff / latDiff);
    }
    else {
        longDiff = -longDiff;
        latDiff = -latDiff;
        heading = Math.atan(longDiff / latDiff);
        if (heading > 3.1415)
            heading -= 3.1415;
        else
            heading += 3.1415;
    }
    if (heading < 0)
        heading += 6.28319;
    else if (heading > 6.28319)
        heading -= 6.28319;
    let headingDegrees = heading * 180 / 3.1415;
    console.log("Heading: " + heading + " radians. " + headingDegrees + " degrees.");
    return heading;
}

function rotate() {
  var dirToEnemyOffset;
  if (getIOSVersion() > 14){
    DeviceOrientationEvent.requestPermission();
  }
  window.addEventListener('deviceorientation', function(event) {
    if (event.webkitCompassHeading) {

      alpha = event.webkitCompassHeading;
      if (alpha < 0) { alpha += 360; }
      if (alpha > 360) { alpha -= 360; }

      compass = -((-alpha) % 360);

      dirToNextOffset = -compass + dirToNext;
      if (dirToNextOffset < 0) { dirToNextOffset += 360; }
      if (dirToNextOffset > 360) { dirToNextOffset -= 360; }

      document.getElementById('arrow').setAttribute('style', 'transform: rotate(' + dirToNextOffset + 'deg)'); // -90 since 0 degrees is set to north

    }
} , true);
}

function getDistance(lat1, lon1, lat2, lon2) {
  var R = 20908800; // Radius of the earth in feet
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in feet
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function startGame() {
  resetDatabase();
  document.getElementById('title').setAttribute('style', 'animation: moveTitle 1s; top: 0%; font-size: 10vw;');
  document.getElementById('startButton').setAttribute('style', 'visibility: hidden;');
  pathRequest();
  setTimeout(fadeInArrow(), 1000);
  rotate();

  var timer = setInterval(logLocation, 1000);

}

function fadeInArrow() {
  document.getElementById('game').setAttribute('class', 'arrowFadeIn game')
}

function updateDestination() {
  nextLocation.innerHTML = "<p class='nextLoc'> " + locations[completed]['name'] + "</p>";
  nextLat = locations[completed]['data']['lat'];
  nextLong = locations[completed]['data']['long'];
  radius = locations[completed]['radius'];


}

function inDestBoundary() {
  var distanceToNext = getDistance(currLat, currLong, nextLat, nextLong);
  if (distanceToNext < radius) {
    return true;
  }
  else {
    return false;
  }
}

function completeLocation() {
  logLocation();

  if (completed < 4){
    var xhr = new XMLHttpRequest();
    var req = "https://salocor.pythonanywhere.com/completed?index=" + completed + "&location=" + locations[completed]['name'];
    xhr.open('GET', req);
    console.log(req);
    xhr.onload = function() {
      if (xhr.status === 200) {
        let response = xhr.responseText;
        let obj = JSON.parse(response);
        for (var i = 0; i < 4; i++) {
          locations.push(obj[0][i]);
        }
        updateDestination();
      }
      else {
        console.error(xhr.statusText);
      }
    };
    xhr.send();
    completed++;
    //updateDestination();
  }
  if (completed == 4) {
    var xhr = new XMLHttpRequest();
    var req = "https://salocor.pythonanywhere.com/win";
    xhr.open('GET', req);
    console.log(req);
    xhr.onload = function() {
      if (xhr.status === 200) { }
      else {
        console.error(xhr.statusText);
      }
    };
    xhr.send();
  }
  document.getElementById('complete').setAttribute('style', "visibility: hidden");
}

function resetDatabase() {
  var xhr = new XMLHttpRequest();
  var request = "https://salocor.pythonanywhere.com/reset"
  xhr.open('GET', request);
  xhr.onload = function() {
    if (xhr.status === 200) {

    }
    else {
      console.error(xhr.statusText);
    }
  };
  xhr.send();
}

function debugGesture() {
  debugGestureCount++;
  if (debugGestureCount > 5) {
    if (document.getElementById('debugItems').getAttribute('style') == 'visibility: hidden;') {
      document.getElementById('debugItems').setAttribute('style', 'visibility: visible;');

    } else {
      document.getElementById('debugItems').setAttribute('style', 'visibility: hidden;');

    }
  }
}

function getIOSVersion() {
  const userAgent = navigator.userAgent;
  const iOSIndex = userAgent.indexOf('OS ');
  if (iOSIndex === -1) return null;
  return parseInt(userAgent.substr(iOSIndex + 3, 2), 10);
}
