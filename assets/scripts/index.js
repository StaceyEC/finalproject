// All the javascript in this file should be
// loaded on the index page only, because
// it assumes certain elements will be on the page.
// Breaking up the javascript into multiple files
// just makes things easier.

// Use jQuery's "ready" event and callback.
// All of my code will be run after the page
// DOM is safe to manipulate. Meaning all the
// HTML and CSS has been downloaded and the browser
// has had time to layout the page based on the CSS, etc.
$(document).ready(function () {

  // My code STARTS here
  // ----
  console.log("Executing my index.js code")


  // Initialize the image slider
  $('.slider').slider({ full_width: true });
  console.log('here')
  $(".button-collapse").sideNav();



  // Attach a jQuery event listener to the "keypress" event
  // so that if the #location seearch field has focus AND the user presses a key
  // fire the event so I can figure out if I should submit the form.
  // I only want to submit the form if the "enter" key is pressed, code 13.
  // If it's the right key code, execute my custom function "submitForm"
  $('#location').keypress(function(event){
    if (event.which === 13) {
      // Pass in the event so we can
      // cancel the default browser action.
      submitForm(event);
    } else {
      // User is probably typing normal characters, as in not "enter"
      // If they submitted the form one or more times already,
      // and one of those times they didn't have anything
      // in the field, we probably added an "invalid" class
      // to show an error.
      // But now they are typing non-enter things, so lets
      // remove invalid class in case we set it already.
      $("#location").removeClass('invalid');
    }
  });

  // Attach a jQuery event listener to the "click" event
  // for the search form. Afterwards, submit the form with
  // my custom function "submitForm" which is a callback, since
  // it is automatically executed by jQuery when the button is clicked.
  $("#location-btn").click(submitForm);


  // Get the user submitted value from the search form
  // and change the page url to the search results page.
  // But if the user forgot to put something in the search
  // box, show them an error and stay on the same page.
  function submitForm(event) {

    // By default, most browsers will try to submit
    // a form when the user presses enter.
    // Since we have custom code to handle the form,
    // we want to prevent the default behavior.
    // And this is how you do that.
    // Side note: I don't actually need to "preventDefault" on the button click, because
    // the browser won't try to submit the form since
    // the user is just clicking on some random link,
    // which in this case doesn't even have an href value
    // so it couldn't take the user anywhere. But it's safe
    // to run in both cases.
    event.preventDefault();

    // Get the value entered by the user.
    let userAddress = $('#location').val();

    if (userAddress.length) {
      let newWindowLocaiton = getURLExceptCurrentPage() + "search-results.html#" + userAddress;
      window.location.href = newWindowLocaiton;
    } else {
      // Use jQuery to find the element right after the #location input element
      // Which is a "label" element, and set the "data-error" attribute,
      // which Materialize uses to display an error message.
      $("#location").next("label").attr("data-error", "please enter a location");

      // Add the "invalid" class to the #location input element,
      // which will trigger a CSS transition via Materialize,
      // that will make the input field red and show an error message.
      $("#location").addClass('invalid');
    }

    return false;
  }


  // This locic is kinda long, so to keep the submitForm function
  // nice and clean, I've created a custom function to return
  // the current page at the end of the URL. It doesn't take any input
  // because it gets the full url from a variable that the browser gives us.
  // Example:
    // > getURLExceptCurrentPage()
    // > "index.html"
  function getURLExceptCurrentPage() {
    let pathFragments = window.location.pathname.split('/');
    let currentPage = pathFragments[pathFragments.length - 1];
    return window.location.href.replace(currentPage, '');
  }



  // ---
  // My code ENDS here

}); // End of jQuery "ready" wrapper

