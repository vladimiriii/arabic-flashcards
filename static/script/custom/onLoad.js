/*-----------------------------------
Global Variables
-----------------------------------*/
var languages = ["arabic", "english", "transcribed"],
    language = "arabic",
    category = "All",
    correct = 0,
    wrong = 0,
    cardCount = 4,
    allIds = [],
    currentIds;

/*-----------------------------------
Functions
-----------------------------------*/
// Build list of indicators
function buildIndicatorList(div, dataset) {
	$("#" + div).empty();
    //console.log(dataset);
    for (key in dataset) {
        text = "<option value='" + dataset[key] + "'>" + capitalizeFirstLetter(dataset[key]) + "</option>";
        $("#" + div).append(text);
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);

};

function resizeText(cardNo, ft, bt1, bt2) {
    // Arabic does not need to be resized
    if (language != "arabic") {
        if (ft.length > 11) {
            $("#" + "card" + cardNo + "-ft").css("font-size", "25pt");
        } else if (ft.length > 7) {
            $("#" + "card" + cardNo + "-ft").css("font-size", "30pt");
        };
    } else if (language == "arabic") {
        if (bt1.length > 11) {
            $("#" + "card" + cardNo + "-bt1").css("font-size", "25pt");
        } else if (bt1.length > 7) {
            $("#" + "card" + cardNo + "-bt1").css("font-size", "30pt");
        };
    };

    // Second back text is never Arabic and always needs to be resized
    if (bt2.length > 11) {
        $("#" + "card" + cardNo + "-bt2").css("font-size", "25pt");
    } else if (bt2.length > 7) {
        $("#" + "card" + cardNo + "-bt2").css("font-size", "30pt");
    };
};

function getCategoryList(array) {
    var finalList = ["All"];
    var cat;

    for (var index = 0; index < array.length; ++index) {
        cat = array[index]["category"];
        if ($.inArray(cat, finalList) == -1) {
            finalList.push(cat);
        };
    };
    return finalList;
};

function createIDList(array, cat) {
    // Reinitialize allIds
    allIds = [];

    // Filter data for the category
    if (cat != "All") {
        var array = array.filter( function(itm) {
            return itm.category == cat;
        });
    };

    for (key in array) {
        allIds.push(array[key]["id"])
    };

    // Randomize Array
    allIds = shuffle(allIds);
};

function shuffle(array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    };

  return array;
};

function getRandomIds(array, entries) {
    var idsRemaining = allIds.length;

    if (idsRemaining >= entries) {
        currentIds = allIds.slice(0, entries);
        allIds = allIds.slice(entries, allIds.length);
    } else {
        currentIds = allIds.slice(0, allIds.length);
        var addIDsNeeded = entries - idsRemaining;
        createIDList(data, category);
        while (currentIds.length < entries) {
            var newValue = allIds[0];
            // Check if item is already selected
            if (currentIds.indexOf(newValue) == -1) {
                currentIds.push(newValue);
                allIds.splice(0, 1);
            } else {
                // If it is, move item to end of array
                allIds.push(allIds.splice(0, 1)[0]);
            };
        };
    };
};

function populateCards(array, front) {
    var id,
        engText,
        araText,
        traText,
        record,
        cardNo,
        htmlID;

    // Determine Front and Back entries
    var back_entries = languages.slice(0);
    var index = back_entries.indexOf(front);
    if (index > -1) {
        back_entries.splice(index, 1);
    };

    // Get Text and Append to Cards
    for (var index = 0; index < (currentIds.length); ++index) {
        id = currentIds[index];
        record = $.grep(array, function(e){ return e.id == id; });
        frontText = record[0][front];
        backText1 = record[0][back_entries[0]];
        backText2 = record[0][back_entries[1]];
        frontHtmlID = '#card' + String(index + 1) + ' .front';
        backHtmlID = '#card' + String(index + 1) + ' .back';

        // Empty Old Values
        $(frontHtmlID + ' p').remove();
        $(backHtmlID + ' p').remove();

        if (language == "arabic") {
            // Add New Values
            $(frontHtmlID).append('<p class="card-text" lang="ar" id="card' + String(index + 1) + '-ft">' + frontText + '</p>');
            $(backHtmlID).prepend('<p class="card-text" lang="en" id="card' + String(index + 1) + '-bt1">' + backText1 + '</p><p class="card-text" lang="en" id="card' + String(index + 1) + '-bt2">' +  backText2 + '</p>');
        } else {
            $(frontHtmlID).append('<p class="card-text" lang="en" id="card' + String(index + 1) + '-ft">' + frontText + '</p>');
            $(backHtmlID).prepend('<p class="card-text" lang="ar" id="card' + String(index + 1) + '-bt1">' +  backText1 + '</p><p class="card-text" lang="en" id="card' + String(index + 1) + '-bt2">' +  backText2 + '</p>');
        };
        // Reduce Font Size for Longer Strings
        resizeText(String(index + 1), frontText, backText1, backText2);

    };
};

// Unflip all Cards
function unflipCards() {
    for (var index = 1; index <= cardCount; ++index) {
        if ($('#card' + index).hasClass('flipped')) {
            $('#card' + index).toggleClass('flipped');
        };
    };
};

/*-----------------------------------
On Page Load
-----------------------------------*/
$(document).ready(function(){

    // Get Category List
    var categories = getCategoryList(data);

    // Populate Dropdowns
    buildIndicatorList("language-list", languages);
    $("#language-list").val(language);
    buildIndicatorList("category-list", categories);

    // Initialize Scoreboard
    $('#correct-count').append('<span id="cor-count">0</span>');
    $('#wrong-count').append('<span id="wro-count">0</span>');

    // Get Random numbers
    createIDList(data, category);
    getRandomIds(data, cardCount);

    // Populate Cards
    populateCards(data, language);

    // Flip cards on click
    $('#card1').click(function() {
        $('#card1').toggleClass('flipped');
    });

    $('#card2').click(function() {
        $('#card2').toggleClass('flipped');
    });

    $('#card3').click(function() {
        $('#card3').toggleClass('flipped');
    });

    $('#card4').click(function() {
        $('#card4').toggleClass('flipped');
    });

    // On Language Change
    $("#language-list").change(function(){

        // Unflip all Cards
        unflipCards();

        // Reset all Buttons
        for (var index = 1; index <= cardCount; ++index) {
            $('#card' + index + "-back :button").attr("disabled", false);
            $('#card' + index + '-back').css("background-color", "#FFFFD6");
        };

        // Update Cards (delayed so answer is not revealed)
        setTimeout(function() {

            // Get Selected Language
            language = $("#language-list").val();

            // Get IDs
            createIDList(data, category);
            getRandomIds(data, cardCount);

            // Populate Cards
            populateCards(data, language);
        }, 250);
    });

    // On Category Change
    $("#category-list").change(function(){
        // Unflip all Cards
        unflipCards();

        // Reset all Buttons
        for (var index = 1; index <= cardCount; ++index) {
            $('#card' + index + "-back :button").attr("disabled", false);
            $('#card' + index + '-back').css("background-color", "#FFFFD6");
        };

        // Update Cards (delayed so answer is not revealed)
        setTimeout(function() {

            // Get Selected category
            category = $("#category-list").val();

            // Get IDs
            createIDList(data, category);
            getRandomIds(data, cardCount);

            // Populate Cards
            populateCards(data, language);
        }, 250);
    });

    $('#refresh-btn').click(function() {
        $('#refresh-btn').toggleClass('active');

        // Unflip all Cards
        unflipCards();

        // Reset all buttons and colors
        for (var index = 1; index <= cardCount; ++index) {
            $('#card' + index + "-back :button").attr("disabled", false);
            $('#card' + index + '-back').css("background-color", "#FFFFD6");
        };

        // Update Cards (delayed so answer is not revealed)
        setTimeout(function() {

            // Get Selected Language
            language = $("#language-list").val();

            // Get Random IDs
            getRandomIds(data, cardCount);

            // Populate Cards
            populateCards(data, language);
        }, 250);

        // Gives more satisfying click
        setTimeout(function() {
            $('#refresh-btn').removeClass('active');
        }, 500);
    });

    // Keeping Score
    $('.correct-btn').click(function() {
        event.stopPropagation();
        var cardID = $(this).parent().attr('id');
        correct = correct + 1;
        $('#correct-count span').remove();
        $('#correct-count').append('<span id="cor-count">' + String(correct) + '</span>');
        $('#' + cardID + " :button").attr("disabled", true);
        $('#' + cardID).css("background-color", "#a5d2ff");

    });
    $('.wrong-btn').click(function() {
        event.stopPropagation();
        var cardID = $(this).parent().attr('id');
        wrong = wrong + 1;
        $('#wrong-count span').remove();
        $('#wrong-count').append('<span id="wro-count">' + String(wrong) + '</span>');
        $('#' + cardID + " :button").attr("disabled", true);
        $('#' + cardID).css("background-color", "#ffd3a8");
    });

    $('#reset-score').click(function() {
        correct = 0;
        wrong = 0;
        $('#correct-count span').remove();
        $('#wrong-count span').remove();
        $('#correct-count').append('<span id="cor-count">' + String(correct) + '</span>');
        $('#wrong-count').append('<span id="wro-count">' + String(wrong) + '</span>');
    });

});
