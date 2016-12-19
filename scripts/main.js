// EVERYTHING WAS WORKING LAST NIGHT AND NOW NOTHING IS WORKING SINCE I TRIED THE BUTTON >:]



// if a map placeholder exists
// initialize the map
// cannot change to const because it broke the map. 

// Initialize map.
//checks to see if there is a target div to render the map to
if ($("#map").length) {
    function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
}

if ($('.slider').length) {

// Initialize slider on the homepage. 
$('.slider').slider({ full_width: true });
}




// If the page content has a location search
// attach form listeners.
if ($("#location").length) {

    $("#location").keypress(function(event) {
        if (event.which === 13) {
            onKeyPressed();
        }
    });

    $("#location-btn").click(onKeyPressed);

}

getURLExceptCurrentPage()


// Dynamically change the header on index-results.html to include the userAddress variable //
setHeader();





//declare my functions

function setHeader() {

    let addressH2Container = $("#address-header");
    let userAddress = window.location.hash;
    console.log(userAddress);
    let newH2Text = `Here are some charities near ${ userAddress } that you can volunteer at today!`
    console.log(newH2Text);

    $("#addres-header").text(newH2Text);


}

function getURLExceptCurrentPage() {
    let pathFragments = window.location.pathname.split('/');

    let currentPage = pathFragments[pathFragments.length - 1];

    return window.location.href.replace(currentPage, '');
}

function onKeyPressed(event) {
    console.log('OKP!');
    event.preventDefault();
    let currentElement = $("#location");
    let userAddress = currentElement.val();
    console.log('I got the address');
    console.log(getURLExceptCurrentPage() + "index-results.html#" + encodeURI(userAddress));
    window.location.href = getURLExceptCurrentPage() + "index-results.html#" + userAddress;
}