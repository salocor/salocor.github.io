var currLat;
var currLong;


var logLocation = () => {
  navigator.geolocation.getCurrentPosition(function(location) {
    currLat = location.coords.latitude;
    currLong = location.coords.longitude;
    console.log("Latitude: " + currLat);
    console.log("Longitude: " + currLong);

    //console.log(location.coords.accuracy);
  });
};

var timer = setInterval(logLocation, 1000);

const sendLocation = async()=>{
  let errorThrown = false;
  debug.innerHTML = "<h4>Latitude: " + currLat + "<br>Longitude: " + currLong + "</h3>";
  console.log("Sent request: " + request);

  try {
    const response =  fetch(request,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      console.log("Sent ok");
      debugResult.innerHTML = "<h3>Result: " + response + "</h3>";
    }
    }
    catch(e) {
      console.log("Error with request");

  }
}
//
