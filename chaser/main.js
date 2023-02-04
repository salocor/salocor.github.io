
var offset = 0;

var compass, directionToEnemy, distanceBetweenEnemy, alpha, tooClose;

var debugOpen = false, enLat = 1, enLong = 2;

var debugGestureCount = 0, doLog = false, locationsComp = [];

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
    if (doLog) {
      console.log("Heading: " + heading + " radians. " + headingDegrees + " degrees.");
    }
    return heading;
}

function rotate() {
  var dirToEnemyOffset;
  DeviceOrientationEvent.requestPermission()
  window.addEventListener('deviceorientation', function(event) {
    if (event.webkitCompassHeading) {

      // You may consider adding/distracting landscape/portrait mode value here
      alpha = event.webkitCompassHeading;
      if (alpha < 0) { alpha += 360; }
      if (alpha > 360) { alpha -= 360; }
      //console.log("Alpha: " + alpha);
      //debugOutput.innerHTML =
      compass = -((-alpha - offset) % 360);
      // Negative alpha because alpha is
      // reversed for some reason. -26 for
      // true north. Mod 360 beacuse i was
      // getting ranges from 24 - 380. The
      // last negative is because the output
      // was negative and i have no idea why.
      dirToEnemyOffset = -compass + directionToEnemy;
      if (dirToEnemyOffset < 0) { dirToEnemyOffset += 360; }
      if (dirToEnemyOffset > 360) { dirToEnemyOffset -= 360; }
      compassOutput.innerHTML = "<h3>Compass: " + compass + "<br>Alpha: " + alpha + "<br>DirectionToEnemy: " + directionToEnemy + "<br>Arrow direction: " + dirToEnemyOffset +  "</h3>";
      //console.log("Heading: " + (alpha + 116 + (360 - directionToEnemy)) % 360); // Output + 26 for adjusting to true north + 90 since the arrow is 90 degrees off
      document.getElementById('arrow').setAttribute('style', 'transform: rotate(' + dirToEnemyOffset + 'deg)'); // -90 since 0 degrees is set to north
      //console.log("(directionToEnemy - alpha - 26) % 360 = " + ((directionToEnemy - alpha - 26) % 360 ));
    }
} , true);
//document.getElementById('arrow').setAttribute('style', 'transform: rotate(' + alpha + 'deg)');


}

function getLocation() {
  navigator.geolocation.getCurrentPosition(function(location) {
  console.log(location.coords.latitude);
  console.log(location.coords.longitude);
  console.log(location.coords.accuracy);
});
}

function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}


var getLocationAsync = () => {
    navigator.geolocation.getCurrentPosition(function(location) {
      console.log(location.coords.latitude);
      console.log(location.coords.longitude);
      console.log(location.coords.accuracy);
  });
};

//var location = setInterval(getLocationAsync, 1000);
// (B) RUN THIS FUNCTION EVERY SECOND TO UPDATE HTML

var logLocation = () => {
  navigator.geolocation.getCurrentPosition(function(location) {
    currLat = location.coords.latitude;
    currLong = location.coords.longitude;
    if (doLog) {
      console.log("Latitude: " + currLat);
      console.log("Longitude: " + currLong);
    }
    directionToEnemy = (getDeg(currLat, currLong, enLat, enLong) * 57.29);
    distanceBetweenEnemy = getDistance(currLat, currLong, enLat, enLong);
    if (distanceBetweenEnemy < 100) {
      tooClose = true;
    } else {
      tooClose = false;
    }
    //console.log(location.coords.accuracy);
    tooCloseOutput.innerHTML = "<h3>Too close: " + tooClose + "<br>Distance = " + distanceBetweenEnemy + "</h3>";
    enCoords.innerHTML = "<h3>Enemy Latitude: " + enLat + "<br>Enemy Longitude: " + enLong + "</h3>";
    httpsRequest();
  });
  if (doLog) {
    console.log('logged location');
  }
};


// (C) START INTERVAL
// RESET THIS ONE FOR LOCATON LOOP -->

// TO STOP - clearInterval(logLocation);


// Debug stuff. Remove in prod.

function updateCoords() {
  enCoords.innerHTML = "<h3>Enemy Latitude: " + enLat + "<br>Enemy Longitude: " + enLong + "</h3>";
}

function enableLog() {
  if (doLog) {
    doLog = false;
  } else {
    doLog = true;
  }
}

function updateOffset() {
  offset = 360 - alpha;
  console.log("New offset = " + offset);
}

function showDebug() {
  if (document.getElementById('debugItems').getAttribute('style') == 'visibility: hidden;') {
    document.getElementById('debugItems').setAttribute('style', 'visibility: visible;');

  } else {
    document.getElementById('debugItems').setAttribute('style', 'visibility: hidden;');

  }
}

function startGame() {


  var timer = setInterval(logLocation, 500);
  document.getElementById('startDiv').setAttribute('style', 'opacity: 0%; top: 120vh;');

  document.getElementById('title').setAttribute('style', 'animation: moveTitle 1s; top: 0%; font-size: 10vw;');
  rotate();
  setTimeout(fadeInArrow(), 1000);
}

function fadeInArrow() {
  document.getElementById('arrow').setAttribute('class', 'arrowFadeIn')
}

function httpsRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://salocor.pythonanywhere.com/getLocation');
  xhr.onload = function() {
    if (xhr.status === 200) {
      let response = xhr.responseText;
      let obj = JSON.parse(response);
      enLat = obj["location"]["latitude"];
      enLong = obj["location"]["longitude"];
      let locationsCompReq = obj["visited"]["state"];
      for (var i = 0; i < 4; i++) {
        if (locationsCompReq[i]["completed"] != locationsComp[i]["completed"]) {
          locationsComp[i]["completed"] == locationsCompReq[i]["completed"];

        }
      }
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
    showDebug();
  }
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
