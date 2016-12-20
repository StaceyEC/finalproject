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

  // Initialize Materialize modal
 
  // Create a new Geocoder object, for searching locations
  // from the Google API.
  const geocoder = new google.maps.Geocoder();
  const searchString = window.location.hash.replace('#', '');

  let previousWindow;

  geocoder.geocode({ 'address': searchString }, function(results, status) {
    
    // debug
    console.log("results: ", results);

    if (status === 'OK') {
      // Google's geocode API will return an array
      // of possible matches for a search term.
      // We just use the first one, which is most
      // likely to be the location the user was searching for.
      const searchGeocodeResult = results[0];

      // Change the center of the map to match the location
      // the user searched for.
      map.setCenter(searchGeocodeResult.geometry.location);


      // Move/Zoom the map so that the search area
      // fits inside of visible portion of the map
      // and a little extra padding
      map.fitBounds(searchGeocodeResult.geometry.bounds);


      // Set all map points and render all cards
      createAllMapMarkers(searchGeocodeResult);
    }
  });

  function createAllMapMarkers(searchGeocodeResult) {
    // We use this later in a few places
    const searchBounds = searchGeocodeResult.geometry.bounds;

    // Use this variable to know whether to render
    // a single default card. We set it to true
    // after we render the card, so we don't do it again.
    let firstPointSet = false;

    // If a search result is within the search area 
    // we want to increment this variable so we can
    // tell the user how many event were found in their
    // target area.
    let inBoundsCount = 0;

    window.volunteerDatabase.events.forEach(function(volunteerEvent, index) {
      
      const address = volunteerEvent.company.address;
      const eventSearchString = `${address.street1} ${address.zipCode}`;

      geocoder.geocode({'address': eventSearchString }, function(results, status) {
        if (status === 'OK' && searchBounds.contains(results[0].geometry.location)) {

          // The "++" operator increments a numerical
          // value by 1. Just like saying inBoundsCount = inBoundsCount + 1;
          // but shorter.
          inBoundsCount++;

          // Create the marker for the event
          createMarker(results[0], volunteerEvent);

          // Would be weird to not have a single card rendered
          // So render the first card automatically, but no more.
          if (!firstPointSet) {
            renderCard(volunteerEvent);
            firstPointSet = true;
          }

          // Set the title of the page with search details
          renderTitle(inBoundsCount, searchString);
        }
      });

    });
  }


  function createMarker(geocodeResult, volunteerEvent) {
    const marker = new google.maps.Marker({
      map: map,
      position: geocodeResult.geometry.location,
      animation: google.maps.Animation.DROP
    });


    marker.addListener('click', function() {
      renderCard(volunteerEvent);
      marker.setAnimation(google.maps.Animation.So);

      console.log(volunteerEvent);
    });
  }


  function renderCard(volunteerEvent) {
    // Remove old modal
    $('#event-modal').remove();

    // Building HTML for the card
    const cardHTML = `<div class="card">
                      <div class="card-content">
                        <span class="card-title"><a href="#">${volunteerEvent.company.name}</a></span>
                        <p>${volunteerEvent.eventDetails.About.paragraphs[0]}</p>
                        <p>${volunteerEvent.eventDetails.About.paragraphs[1]}</p>
                      </div>
                      <div class="card-action">
                        <a class="modal-trigger" href="#event-modal">Details</a>
                      </div>
                    </div>`

    // Inject card into div, overriding any previous card
    $("#cards").html(cardHTML);
    // Modals have more more content then card
    const cardModalHTML = `<div id="event-modal" class="modal">
                            <div class="modal-content">
                              <h4>${volunteerEvent.company.name}</h4>
                              <p>${volunteerEvent.eventDetails.About.paragraphs}</p>
                              <h5> Charity Type</h5>
                              <p>${volunteerEvent.eventDetails.causeAreas[0]}</p>
                              <p>${volunteerEvent.eventDetails.causeAreas[1]}</p>
                              <h5> Required Skills</h5>
                              <p>${volunteerEvent.eventDetails.skills[0]}</p>
                              <p>${volunteerEvent.eventDetails.skills[1]}</p>
                              <h5> Date and Time </h5>
                              <p>${volunteerEvent.eventDetails.when.date}</p>
                              <p>${volunteerEvent.eventDetails.when.time}</p>
                              <h5> Contact Info </h5>
                              <p>${volunteerEvent.company.contact.name}</p>
                              <p>${volunteerEvent.company.contact.phoneNumber}</p>
                            </div>
                            <div class="modal-footer">
                              <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">close</a>
                            </div>
                          </div>`
    $('body').append(cardModalHTML);

    $('.modal').modal();
    $('.modal-action').on("click", function(event){ event.preventDefault(); });

  }

  function renderTitle(eventsLength, searchString) {
    const newTitle = `There are <span class="event-count">${eventsLength}</span>
                      places near <span class="search-location">${searchString}</span>
                      where you can volunteer today`;
    $("#resultsTitle").html(newTitle);
  }


  // ---
  // code ENDS here

}); // End of jQuery "ready" wrapper
