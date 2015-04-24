
var startInput = document.getElementById("from");
var toInput = document.getElementById("to");
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var map;
var start;
var end;

/** Initialize the map UI **/
function initializeMap() {
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
   zoom:7,
   center: chicago
 };
 map = new google.maps.Map(document.getElementById("start-location"), mapOptions);
};

function calcRoute() {
  if (start != null && end != null) {
  	// console.log("executed");
   var request = { 
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
     directionsDisplay.setDirections(response);
     document.getElementById("warnings").innerHTML = "";
   } 
   else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
     document.getElementById("warnings").innerHTML += "<br/> No driving route can be found between the starting location and final destination.";
   }
  });
  }
};

function initialize() {
		// Initalize map
		initializeMap();
		
		// Initialzie directions display service
		directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    directionsDisplay.setPanel(document.getElementById("dir-panel"));

		// Search box linked to the UI element
		var searchBoxFrom = new google.maps.places.SearchBox((startInput));
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(startInput);

		var searchBoxTo = new google.maps.places.SearchBox((toInput));
		map.controls[google.maps.ControlPosition.LEFT_TOP].push(toInput);

	// Listen for the event fired when the user selects an item from the
		// pick list.
		google.maps.event.addListener(searchBoxFrom, 'places_changed', function() {
			var places = searchBoxFrom.getPlaces();
			if (places.length == 0) {
				return;
			}

			// If input field of starting location is not empty
			// Set start location information
			if (startInput.value.length > 0) {
				start = startInput.value;
				console.log(start);
			}

      // If input field of destination is also not empty
      // Get the directions
			if (toInput.value.length > 0) {
				calcRoute();
			}
		});

		google.maps.event.addListener(searchBoxTo, 'places_changed', function() {
			var places = searchBoxTo.getPlaces();
			if (places.length == 0) {
				return;
			}

			if (toInput.value.length > 0) {
				end = toInput.value;
				console.log(end);
			}

			if (startInput.value.length > 0) {
				calcRoute();
			}
		});
	};

 google.maps.event.addDomListener(window, 'load', initialize);