// if a map placeholder exists
// initialize the map
if ($('#map').length) {
	// Initialize map
	var map;
	window.initMap = function () {
		map = new google.maps.Map($('#map')[0], {
			center: { lat: 40.7127837, lng: -74.00594130000002 },
			zoom: 8
		});
	}


	$(document).ready(function () {

		// Initialize slider
		$('.slider').slider({full_width: true});


		// Set all map points
		var geocoder = new google.maps.Geocoder();
		window.volunteerDatabase.events.forEach(function(volunteerEvent) {

			var searchString = volunteerEvent.company.address.street1 + " " + volunteerEvent.company.address.zipCode;

			geocoder.geocode({'address': searchString }, function(results, status) {
				if (status === 'OK') {
					console.log("Search success! ", searchString)
					map.setCenter(results[0].geometry.location);
						var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					});
				} else {
					console.log('Search fail: ' + searchString + " "+ status);
				}
			});

			// render cards

		});


	}); // end of document ready
} 

// If the page content has a location search
// attach form listeners.
if ($('#location').length) {

	$('#location').keypress(function(event){
		if (event.which === 13) {
			onKeyPressed();
		}
	});
	$("#location-btn").click(onKeyPressed);

	function onKeyPressed(event) {
		event.preventDefault();

		let currentElement = $('#location');

		let userAddress = currentElement.val();
		console.log('I got the address')

		console.log(getURLExceptCurrentPage() + "index-results.html#" + encodeURI(userAddress) )

		window.location.href = getURLExceptCurrentPage() + "index-results.html#" + userAddress;
	}

}

function getURLExceptCurrentPage() {
	let pathFragments = window.location.pathname.split('/');
	let currentPage = pathFragments[pathFragments.length - 1];
	return window.location.href.replace(currentPage, '');
}


// Dynamically change the header on index-results.html to include the userAddress variable //

function setHeader() {}
	
	let addressH2Container = $("#address-header");

	let userAddress = window.location.hash;

	console.log(userAddress);

	let newH2Text - `Here are some charities near ${userAddress} that you can volunteer at today!`

	console.log(newH2Text);

	$("#addres-header").innerHTML = "newH2Text";


}




function replaceH2(address){
	let newH2Text - `There are places near ` ${userAddress} that you can volunteer today!`

};





/*
		const container = $('.js-container');
		container.html('');

		const urlToRequest = `http://api.giphy.com/v1/gifs/search?q=${queryString}&api_key=dc6zaTOxFJmzC`;
		console.log(urlToRequest)

		const data = $.get( urlToRequest );

		data.then(onDataBack);

*/