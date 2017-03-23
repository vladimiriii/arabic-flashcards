/*-----------------------------------
Global Variables
-----------------------------------*/
var languages = ["arabic", "english", "transcribed"],
    language = "arabic",
    category = "All",
    rand_ids;

/*-----------------------------------
Functions
-----------------------------------*/
// Build list of indicators
function buildIndicatorList(div, dataset) {
	$("#" + div).empty();
    //console.log(dataset);
    for (key in dataset){
        text = "<option value='" + dataset[key] + "'>" + capitalizeFirstLetter(dataset[key]) + "</option>";
        $("#" + div).append(text);
    };
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function getCategoryList(array) {
    var finalList = ["All"];
    var cat;

    for (var index = 0; index < (array.length); ++index) {
        cat = array[index]["category"];
        if ($.inArray(cat, finalList) == -1) {
            finalList.push(cat);
        };
    };
    return finalList;
};

function getRandomIds(array, entries, cat) {
    // Filter data for the category
    if (cat != "All") {
        var array = array.filter( function(itm) {
            return itm.category == cat;
        });
    };

    var ids = [],
        all_recs = array.length,
        new_rand = 0,
        new_rec,
        new_id,
        i = 0;

    while (i < entries) {
        new_rand = Math.floor(Math.random() * all_recs);
        new_id = array[new_rand]["id"];
        if ($.inArray(new_id, ids) == -1 && typeof new_id !== "undefined") {
            ids.push(new_id);
            i = i + 1;
        };
    };

    return ids;
};

function populateCards(array, ids, front) {
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
    for (var index = 0; index < (ids.length); ++index) {
        id = ids[index];
        record = $.grep(array, function(e){ return e.id == id; });
        frontText = record[0][front];
        backText1 = record[0][back_entries[0]];
        backText2 = record[0][back_entries[1]];
        frontHtmlID = '#card' + String(index + 1) + ' .front';
        backHtmlID = '#card' + String(index + 1) + ' .back';

        // Empty Old Values
        $(frontHtmlID).empty();
        $(backHtmlID).empty();

        // Add New Values
        $(frontHtmlID).append('<p class="card-text">' + frontText + '</p>');
        $(backHtmlID).append('<p class="card-text">' + backText1 + '</p>');
        $(backHtmlID).append('<p class="card-text">' + backText2 + '</p>');
    };
};

// Unflip all Cards
function unflipCards() {
    for (var index = 1; index <= (4); ++index) {
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

    // Get Random numbers
    rand_ids = getRandomIds(data, 4, category);

    // Populate Cards
    populateCards(data, rand_ids, language);

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

        // Update Cards (delayed so answer is not revealed)
        setTimeout(function() {

            // Get Selected Language
            language = $("#language-list").val();

            // Get Random IDs
            rand_ids = getRandomIds(data, 4, category);

            // Populate Cards
            populateCards(data, rand_ids, language);
        }, 250);
    });

    // On Category Change
    $("#category-list").change(function(){
        // Unflip all Cards
        unflipCards();

        // Update Cards (delayed so answer is not revealed)
        setTimeout(function() {

            // Get Selected category
            category = $("#category-list").val();

            // Get Random IDs
            rand_ids = getRandomIds(data, 4, category);

            // Populate Cards
            populateCards(data, rand_ids, language);
        }, 250);
    });

    $('#refresh-btn').click(function() {
        $('#refresh-btn').toggleClass('active');

        // Unflip all Cards
        unflipCards();

        // Update Cards (delayed so answer is not revealed)
        setTimeout(function() {

            // Get Selected Language
            language = $("#language-list").val();

            // Get Random IDs
            rand_ids = getRandomIds(data, 4, category);

            // Populate Cards
            populateCards(data, rand_ids, language);
        }, 250);

        // Gives more satisfying click
        setTimeout(function() {
            $('#refresh-btn').removeClass('active');
        }, 500);
    });

});
