var currLat;
var currLong;


var logLocation = () => {
  navigator.geolocation.getCurrentPosition(function(location) {
    currLat = location.coords.latitude;
    currLong = location.coords.longitude;
    debug.innerHTML = "<h4>Latitude: " + currLat + "<br>Longitude: " + currLong + "</h3>";

    //console.log(location.coords.accuracy);
  });
};

var timer = setInterval(logLocation, 1000);

const sendLocation = async()=>{
  let errorThrown = false;
  var request = "https://" + document.getElementById('ip').value + ":5000/location?lat=" + currLat + "&long=" + currLong;
  console.log("Sent request: " + request);

  try {
    const response =  fetch(request,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      console.log("Sent ok");
    }
    }
    catch(e) {
      console.log("Error with request");

  }
}
//
