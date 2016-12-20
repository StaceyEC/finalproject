// Normally, all of my code would be inside of the
// jQuery ready wrapper. But in this case, the google
// maps api javascript expects there to be a function
// called "initMap" in the global scope.
var map;
window.initMap = function () {
  map = new google.maps.Map($('#map')[0], {
    center: { lat: 40.7127837, lng: -74.00594130000002 },
    zoom: 12
  });
}

// Use jQuery's "ready" event and callback.
// All of my code will be run after the page
// DOM is safe to manipulate. Meaning all the
// HTML and CSS has been downloaded and the browser
// has had time to layout the page based on the CSS, etc.

// ERROR: It's possible that document.ready will fire
// before window.initMap which will cause errors.
// Should instead fire everything from the initMap callback
$(document).ready(function () {

  // My code STARTS here
  // ----
  console.log("Executing my search-results.js code");

  // Create a new Geocoder object, for searching locations
  // from the Google API.
  const geocoder = new google.maps.Geocoder();
  const searchString = window.location.hash.replace('#', '');
  let previousWindow;

  geocoder.geocode({'address': searchString }, function(results, status) {
    console.log("results: ", results)
    if (status === 'OK') {
      console.log("Found location!")
      map.setCenter(results[0].geometry.location);
      const searchBounds = results[0].geometry.bounds;

      var rectangle = new google.maps.Rectangle({
        strokeColor: '#008000',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#008000',
        fillOpacity: 0.1,
        map: map,
        bounds: results[0].geometry.bounds
      });
      map.fitBounds(results[0].geometry.bounds);


      // Set all map points and render all cards
      let firstPointSet = false;
      let inBoundsCount = 0;
      window.volunteerDatabase.events.forEach(function(volunteerEvent, index) {
        const address = volunteerEvent.company.address;
        const eventSearchString = `${address.street1} ${address.zipCode}`;
        geocoder.geocode({'address': eventSearchString }, function(results, status) {
          if (status === 'OK' && searchBounds.contains(results[0].geometry.location)) {
            inBoundsCount ++;
            createMarker(results[0], volunteerEvent);
            if (!firstPointSet) {
              renderCard(volunteerEvent.company.name, volunteerEvent.company.description);
              firstPointSet = true;
            }
          }

          renderTitle(inBoundsCount, searchString);
        });
      });

    }
  });


  function createMarker(geocodeResult, volunteerEvent) {
    const contentString = `<h3>${volunteerEvent.company.name}</h3> <p>${volunteerEvent.company.description}</p>`;
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: $("#map").width() * 0.7 // Max width of 70% of map width
    });

    let marker = new google.maps.Marker({
      map: map,
      position: geocodeResult.geometry.location,
      title: volunteerEvent.company.name
    });

    marker.setAnimation(google.maps.Animation.DROP);

    marker.addListener('click', function() {
      renderCard(volunteerEvent.company.name, volunteerEvent.company.description);
      marker.setAnimation(google.maps.Animation.So);
    });
  }

  function renderCard(cardTitle, cardDescription) {
    let cardHTML = `<div class="card">
                      <div class="card-content">
                        <span class="card-title"><a href="#">${cardTitle}</a></span>
                        <p>${cardDescription}</p>
                      </div>
                      <div class="card-action">
                        <a href="#">This is a link</a>
                        <a href="#">This is a link</a>
                      </div>
                    </div>`
    $("#cards").html(cardHTML);
  }

  function renderTitle(eventsLength, searchString) {
    const newTitle = `There are <span class="event-count">${eventsLength}</span>
                      places near <span class="search-location">${searchString}</span>
                      where you can volunteer today`;
    $("#resultsTitle").html(newTitle);
  }


  // ---
  // My code ENDS here

}); // End of jQuery "ready" wrapper
