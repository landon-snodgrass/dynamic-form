// Max number of inputs per row, defaults to 3
var maxInputs = 3;
var windowWidth = $(window).innerWidth();

function createTextInput(id) {
    var $newInput = $(document.createElement('input'));
    $newInput.attr("placeholder", "Text Input");
    $newInput.attr("type", "text");
    $newInput.attr("id", id);
    return $newInput;
}

function createSelectInput(id) {
    var $newInput = $(document.createElement('select'));
    $newInput.attr("id", id);
    $newInput.append("<option disabled selected>Select An Option</option>");
    for (var i = 0; i < 4; i++) {
        $newInput.append(`<option value="option ${i}">Option ${i}</option>`);
    }
    return $newInput;
}

function createDateInput(id) {
    var $newInput = $(document.createElement('input'));
    $newInput.attr("id", id);
    $newInput.addClass("datepicker");
    $newInput.attr("placeholder", "Date");
    return $newInput;
}

function createLabel(id) {
    var $newLabel = $(document.createElement('label'));
    $newLabel.addClass("sr-only");
    $newLabel.attr("for", id);
    return $newLabel;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function makeOptionsDynamic($optionsArray, maxInputs) {
    /*******************************************
     * JS for contianing every input after the
     * third into 'Advanced Options'
     *******************************************/

    $inner = $('.inner');

    if (!$('.dynamic-form').hasClass('loading')) {
        $('.dynamic-form').addClass('loading');
    }

    // This is the array that will be wrapped into advanced options
    // It's acting as a queue (FIFO)
    // This mfer stumped me, we have to copy the array instead of just making them equal
    var advancedOptions = $optionsArray.slice();

    // This is to check if there's more than one input
    if (advancedOptions.length > 1) {
        $(".options").addClass("flex-column");
    }

    // Iterator
    var i = 0;

    if (windowWidth < 576) {
        maxInputs = 1;
    } else if (windowWidth < 768) {
        maxInputs = 2;
    }

    // This do while will filter out the first row of cells
    // The first row always needs at least one cell (hence the do while)
    do {
        // Filter out the first item in the array
        if (advancedOptions.length) {
            advancedOptions.splice(0, 1);
            console.log("Filter " + i);
            console.log("Length " + $optionsArray.length);
        } else {
            break;
        }
        i++;
    } while (i < maxInputs);

    if (advancedOptions.length) {
        console.log(advancedOptions.length);
        if ($('.advanced-options').length > 0) {
            $('.advanced-options').empty();
            $('.advanced-options').append(advancedOptions);
        } else {
            // If there are advanced options
            var $advancedOptionsContainer = $(
                "<div class='advanced-options' aria-hidden='true' style='display:none;'></div>", {}
            );
            var $advancedOptionsLabel = $(
                '<label class="show-advanced" for="advanced-check" role="button"><span>Show Advanced Options</span></label>', {}
            );
            var $advancedCheck = $(
                '<input type="checkbox" id="advanced-check">', {}
            ).on("change", function() {
                if ($(this).is(":checked")) {
                    $(".advanced-options").slideDown(250, function() {
                        $(".advanced-options").attr("aria-hidden", "false");
                        $(".advanced-options").css("display", "flex");
                        $(".show-advanced span").html("Hide Advanced Options");
                    });
                } else {
                    $(".advanced-options").slideUp(250, function() {
                        $(".show-advanced span").html("Show Advanced Options");
                        $(".advanced-options").attr("aria-hidden", "true");
                    });
                }
            });
            $(advancedOptions).wrapAll($advancedOptionsContainer);
            $(".options").after($advancedOptionsLabel);
            $(".show-advanced").before($advancedCheck);
        }
    } else {
        // If there are no advanced options
        // We need to reorient the first row
        if ($('.advanced-options').length > 0) {
            $('.advanced-options').remove();
            $('.show-advanced').remove();
            $('#advanced-check').remove();
        }
        $inner.append($optionsArray);
        // So the search button will stay on the same line if there's no advanced options
        $(".options").removeClass("flex-md-row");
        $(".options").addClass("flex-sm-row");
    }

    resizeInputs();

    $('.dynamic-form').removeClass('loading');
}

function resizeInputs() {
    var newWidth = Math.round((1 / maxInputs) * 100);
    if (windowWidth < 576) {
        $('.cellinner').css('width', '100%');
    } else if (windowWidth < 768) {
        $('.cellinner').css('width', '50%');
    } else {
        $('.cellinner').css('width', newWidth + '%');
    }
}

$(window).on('resize', debounce(resizeInputs));

$(function() {
    /*******************************************
     * JS for adding and removing inputs to 
     * show off dynamic-ness(sp?)
     ******************************************/

    // Caching some stuff
    var $inner = $('.inner');
    var $optionsArray = $('.cellinner');

    makeOptionsDynamic($optionsArray, maxInputs);

    // Click handlers
    $('#addText').on('click', function() {
        var nextId = $optionsArray.length;
        var $newInput = createTextInput('input-' + nextId);
        var $newLabel = createLabel('input-' + nextId);
        var $newCell = $('<div class="cellinner"></div>', {});
        $newCell.append($newLabel);
        $newCell.append($newInput);
        $inner.append($newCell);
        $optionsArray = $('.cellinner');

        console.log("add text");

        makeOptionsDynamic($optionsArray, maxInputs);
    });

    $('#addSelect').on('click', function() {
        var nextId = $optionsArray.length;
        var $newInput = createSelectInput('input-' + nextId);
        var $newLabel = createLabel('input-' + nextId);
        var $newCell = $('<div class="cellinner"></div>', {});
        $newCell.append($newLabel);
        $newCell.append($newInput);
        $inner.append($newCell);
        $optionsArray = $('.cellinner');

        $newInput.chosen({
            disable_search_threshold: 30,
            width: "100%"
        });

        makeOptionsDynamic($optionsArray, maxInputs);
    });

    $('#addCalendar').on('click', function() {
        var nextId = $optionsArray.length;
        var $newInput = createDateInput('input-' + nextId);
        var $newLabel = createLabel('input-' + nextId);
        var $newCell = $('<div class="cellinner"></div>', {});
        $newCell.append($newLabel);
        $newCell.append($newInput);
        $inner.append($newCell);
        $optionsArray = $('.cellinner');

        $newInput.datepicker();

        makeOptionsDynamic($optionsArray, maxInputs);
    });

    $("#updateMaxInputs").on('click', function() {
        maxInputs = $('#maxInputs').val();
        if (maxInputs < 1) {
            alert("You need at least one...come on");
            return;
        } else if (maxInputs > 5) {
            alert("That's too many my dude");
            return;
        }
        $optionsArray = $('.cellinner');
        resizeInputs();
        makeOptionsDynamic($optionsArray, maxInputs);
    });

    $('#removeLast').on('click', function() {
        if ($('.cellinner').length > 0) {
            $('.cellinner')[$('.cellinner').length - 1].remove();
        } else {
            alert("No more to delete, WHAT MORE DO YOU WANT!?!?!");
        }

        $optionsArray = $('.cellinner');
        makeOptionsDynamic($optionsArray, maxInputs);
    });

    // Plugin inits
    $('.datepicker').datepicker();

    $("select").chosen({
        disable_search_threshold: 30,
        width: "100%"
    });

    // Some garbage for chosen
    var $dropdownLists = $("select");

    $dropdownLists.each(function() {
        if ($(this).val() != null) {
            $(this).siblings(".chosen-container-single").addClass("has-value");
        }
    });

    $dropdownLists.on("change", function() {
        if ($(this).val() != null) {
            $(this).siblings(".chosen-container-single").addClass("has-value");
        } else {
            $(this).siblings(".chosen-container-single").removeClass("has-value");
        }
    });
});