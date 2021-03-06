//Grabs and the articles and display it on the page.

$(document).on("click", "#scraper", function(event) {
  event.preventDefault(event);
  $.ajax({
    method:"GET",
    url:"/scrape"
  })
  .done(function(){
    // Grab the articles as a json
    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "</p>" + "<br />" + "<button id='save' data-id='" + data[i]._id + "'>" + "save article" + "</button>" );
        };
    });
  })
})

// when you click the save button
$(document).on('click', '#save', function(){
  // grab the id associated with the article from the submit button
  var thisId = $(this).attr('data-id');
  console.log(thisId);
  // run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(), // value taken from title input
      body: $('#bodyinput').val() // value taken from note textarea
    }
  })
    // with that done
    .done(function( data ) {
      // log the response
      console.log(data);
      // empty the notes section
      $('#notes').empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $('#titleinput').val("");
  $('#bodyinput').val("");
});


// Grab the articles as a json
// $.getJSON("/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "<br />" + "<button> Save </button>" + "</p>");
//   }
// });


// // Whenever someone clicks a p tag
// $(document).on("click", "#scraper", function() {
//   // Empty the notes from the note section
//   $("#articles").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .done(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#articles").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#articles").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#articles").append("<button data-id='" + data._id + "' id='savecomment'> Save Comment</button>");

//       // If there's a note in the article
//       if (data.comment) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.comment.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.comment.body);
//       }
//     });
// });

// When you click the savenote button
$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
