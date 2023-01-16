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
  var request = "http://" + document.getElementById('ip').value + ":5000/location?lat=" + currLat + "&long=" + currLong;
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
