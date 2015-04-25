
var startInput = document.getElementById("from");
var toInput = document.getElementById("to");
var markers = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var geocoder;
var map;
var start;
var end;

/** Initialize the map UI **/
function initializeMap() {
  // Set default map center as Seoul
  var seoul = new google.maps.LatLng(37.5667, 126.9667);
  var mapOptions = {
   zoom: 11,
   center: seoul
 };
 map = new google.maps.Map(document.getElementById("start-location"), mapOptions);
};

/** Calculate directions between start and end points **/
function calcRoute() {
  if (start != null && end != null) {
   var request = { 
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    // If status is OK, set directions on panel and refresh warning field
    if (status == google.maps.DirectionsStatus.OK) {
     directionsDisplay.setDirections(response);
     document.getElementById("warnings").innerHTML = "";
   } 
   // Otherwise if no route is found, display warning
   else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
     document.getElementById("warnings").innerHTML += "<br/> No driving route can be found between the starting location and final destination.";
   }
  });
  }
};

/** Set marker upon receiving geocoder result **/
function setMarker(geocoderResult) {
	var marker = new google.maps.Marker({
		map: map,
		position: geocoderResult[0].geometry.location
	          			});
	markers.push(marker);
};

function initialize() {
	// Initalize map
	initializeMap();
	
	// Initialize geocoder
	geocoder = new google.maps.Geocoder();

	// Initialzie directions display service
	directionsDisplay = new google.maps.DirectionsRenderer({map: map});

	// Set directions display panel
	directionsDisplay.setPanel(document.getElementById("dir-panel"));

	// Search boxes linked to the UI elements
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
			// Geocode the location
			geocoder.geocode({'address': start}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// Display it on map
					map.setCenter(results[0].geometry.location);
					// Set marker (remove old marker to add new one, if necessary)
					if (markers.length == 0) {
						setMarker(results);
					}
					else {
						// Remove current marker, then set new one
						markers[markers.length-1].setMap(null);
						setMarker(results);

					}	
					// Set zoom closer
					map.setZoom(16);
				}
				// Otherwise, 
				else {
					
				}
			});
			console.log(start);
		}

      // If input field of destination is also not empty
      // Get the directions
      if (toInput.value.length > 0) {
      	calcRoute();
      }
  });

	// Add event listener to the destination search box
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