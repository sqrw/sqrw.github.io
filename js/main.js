(function($, List, _, moment) {

  // List.js classes to use for search elements
  var listOptions = {
    valueNames: [
      'js-promise-text',
      'js-promise-category',
      'js-promise-status'
    ]
  };

  // tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  // tabs
  $('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  });

  // Find any within a facet
  function foundAny(facets, compareItem) {
    // No facets selected, show all for this facet
    if (_.isEmpty(facets)) {
      return true;
    }
    // Otherwise, show this item if it contains any of the selected facets
    return facets.reduce(function(found, facet) {
      if (found) {
        return found;
      }
      return compareItem[facet['facet']] === facet['value'];
    }, false);
  }

  $(function() {

    // Dates
    var today = moment();
    var inauguration = moment('2012-11-19');
    $('#inauguration-days').html(inauguration.diff(today, 'days') > 0 ? inauguration.diff(today, 'days') : 'NA');
    $('#inauguration-time-container').hide(); //TEMP FIX 
    $('#days-in-office').html(today.diff(inauguration, 'days') > 0 ? today.diff(inauguration, 'days') : 0);

    //Always show tooltip on confidence-btn
    //$('#confidence-btn').tooltip('show');
    
    // Select and replace maintained by name
    var maintainers = ["Bitter about EvE Goons", "Derek's Smarties", "SomethingAwful Goons", "Salty Asshats", "Goons (who know nothing about game development)", "Goons stuck in checkmate", "T-posed Goons", "MY GIRLFRIEND", "The Fourth Stimpire", "Ryan Archer"]
    var maintainer = maintainers[Math.floor(Math.random() * maintainers.length)];
    $('.maintainer-name').html(maintainer);

    // List.js object that we can filter upon
    var promiseList = new List('promises', listOptions).on('updated', function(list) {
      $('#count').html(list.visibleItems.length);
    });

    var $search = $('#search');
    var $facets = $('[data-list-facet]'); // All buttons that can filter

    // Clear all
    function resetFilter(e) {
      e.preventDefault();
      // Visually reset buttons
      $facets.removeClass('active');
      // Clear out text field
      $search.val('');
      // Wipe all filters
      promiseList.search();
      promiseList.filter();
    }

    // Hard reset all the buttons
    $('.promises__category--reset').on('click', resetFilter);

    // Any facet filter button
    $facets.on('click', function(e) {

      var facet = $(this).data('list-facet'); // ie 'js-promise-category'
      var value = $(this).data('facet-value'); // ie 'Culture'
      var isSingle = !!$(this).data('select-single'); // ie true/false for if there can only be one of this filter

      // Single-select categories should have their active state wiped
      if (isSingle) {
        $facets
          .filter(function() { return $(this).data('list-facet') === facet; })
          .removeClass('active');
      }

      // Flag as active
      $(this).toggleClass('active');

      // Array of active
      var facets = $facets.filter('.active').map(function() {
        // return object instead with facet/value
        return {
          facet: $(this).data('list-facet'),
          value: $(this).data('facet-value'),
          isSingle: !!$(this).data('select-single')
        };
      }).get();

      // When deselecting last, clear all filters
      if (facets.length === 0) {
        promiseList.filter();
        return; // Eject now
      }

      // Otherwise, filter on the array
      promiseList.filter(function(item) {

        var itemValues = item.values();

        // Single selects, eg "Not started"
        var single = _.filter(facets, ['isSingle', true]);
        var foundSingle = foundAny(single, itemValues);
        // Single-selection items hide if false no matter what, so eject if not found here
        if (!foundSingle) {
          return false;
        }

        // Full categories can have multiples show, list out here
        var multis = _.filter(facets, ['isSingle', false]);
        return foundAny(multis, itemValues);

      }); // promiseList.filter()

    });
  });

})(jQuery, List, _, moment);

//Chart
function Build_and_fill_Chart() {
    var History = [
        { "Not_implemented": 0, "Broken": 0, "Completed": 0, "In_alpha": 0, "Compromised": 0, "date": "2012-10-01T07:00:00.000Z" },
        { "Not_implemented": 13, "Broken": 2, "Completed": 1, "date": "2012-11-01T07:00:00.000Z" }, { "Not_implemented": 29, "Broken": 4, "Completed": 5, "date": "2012-12-01T08:00:00.000Z" }, { "Not_implemented": 30, "Broken": 4, "Completed": 5, "date": "2013-01-01T08:00:00.000Z" }, { "Not_implemented": 31, "Broken": 4, "Completed": 6, "date": "2013-02-01T08:00:00.000Z" }, { "Not_implemented": 32, "Broken": 4, "Completed": 7, "date": "2013-03-01T08:00:00.000Z" }, { "Not_implemented": 34, "Broken": 4, "Completed": 7, "date": "2013-04-01T07:00:00.000Z" }, { "Not_implemented": 37, "Broken": 4, "Completed": 7, "date": "2013-05-01T07:00:00.000Z" }, { "Not_implemented": 37, "Broken": 5, "Completed": 9, "date": "2013-06-01T07:00:00.000Z" }, { "Not_implemented": 47, "Broken": 6, "Completed": 9, "date": "2013-07-01T07:00:00.000Z" }, { "Not_implemented": 49, "Broken": 6, "Completed": 9, "date": "2013-08-01T07:00:00.000Z" }, { "Not_implemented": 51, "Broken": 6, "Completed": 9, "date": "2013-09-01T07:00:00.000Z" }, { "Not_implemented": 53, "Broken": 6, "Completed": 10, "date": "2013-10-01T07:00:00.000Z" }, { "Not_implemented": 54, "Broken": 6, "Completed": 10, "In_alpha": 1, "date": "2013-11-01T07:00:00.000Z" }, { "Not_implemented": 62, "Broken": 6, "Completed": 10, "In_alpha": 1, "date": "2013-12-01T08:00:00.000Z" }, { "Not_implemented": 67, "Broken": 7, "Completed": 16, "In_alpha": 2, "date": "2014-01-01T08:00:00.000Z" }, { "Not_implemented": 93, "Broken": 8, "Completed": 30, "In_alpha": 3, "Compromised": 1, "date": "2014-02-01T08:00:00.000Z" }, { "Not_implemented": 114, "Broken": 9, "Completed": 32, "In_alpha": 4, "Compromised": 1, "date": "2014-03-01T08:00:00.000Z" }, { "Not_implemented": 136, "Broken": 9, "Completed": 35, "In_alpha": 4, "Compromised": 1, "date": "2014-04-01T07:00:00.000Z" }, { "Not_implemented": 154, "Broken": 11, "Completed": 38, "In_alpha": 4, "Compromised": 1, "date": "2014-05-01T07:00:00.000Z" }, { "Not_implemented": 165, "Broken": 11, "Completed": 38, "In_alpha": 4, "Compromised": 1, "date": "2014-06-01T07:00:00.000Z" }, { "Not_implemented": 182, "Broken": 14, "Completed": 39, "In_alpha": 4, "Compromised": 1, "date": "2014-07-01T07:00:00.000Z" }, { "Not_implemented": 186, "Broken": 15, "Completed": 40, "In_alpha": 5, "Compromised": 1, "date": "2014-08-01T07:00:00.000Z" }, { "Not_implemented": 197, "Broken": 15, "Completed": 42, "In_alpha": 6, "Compromised": 1, "date": "2014-09-01T07:00:00.000Z" }, { "Not_implemented": 199, "Broken": 15, "Completed": 42, "In_alpha": 7, "Compromised": 1, "date": "2014-10-01T07:00:00.000Z" }, { "Not_implemented": 199, "Broken": 15, "Completed": 42, "In_alpha": 7, "Compromised": 1, "date": "2014-11-01T07:00:00.000Z" }, { "Not_implemented": 202, "Broken": 17, "Completed": 42, "In_alpha": 7, "Compromised": 1, "date": "2014-12-01T08:00:00.000Z" }, { "Not_implemented": 204, "Broken": 17, "Completed": 43, "In_alpha": 7, "Compromised": 1, "date": "2015-01-01T08:00:00.000Z" }, { "Not_implemented": 205, "Broken": 17, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-02-01T08:00:00.000Z" }, { "Not_implemented": 205, "Broken": 17, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-03-01T08:00:00.000Z" }, { "Not_implemented": 206, "Broken": 19, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-04-01T07:00:00.000Z" }, { "Not_implemented": 208, "Broken": 19, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-05-01T07:00:00.000Z" }, { "Not_implemented": 209, "Broken": 19, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-06-01T07:00:00.000Z" }, { "Not_implemented": 210, "Broken": 19, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-07-01T07:00:00.000Z" }, { "Not_implemented": 210, "Broken": 19, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-08-01T07:00:00.000Z" }, { "Not_implemented": 211, "Broken": 20, "Completed": 58, "In_alpha": 7, "Compromised": 1, "date": "2015-09-01T07:00:00.000Z" }, { "Not_implemented": 212, "Broken": 20, "Completed": 59, "In_alpha": 7, "Compromised": 1, "date": "2015-10-01T07:00:00.000Z" }, { "Not_implemented": 212, "Broken": 21, "Completed": 59, "In_alpha": 7, "Compromised": 1, "date": "2015-11-01T07:00:00.000Z" }, { "Not_implemented": 212, "Broken": 21, "Completed": 59, "In_alpha": 7, "Compromised": 1, "date": "2015-12-01T08:00:00.000Z" }, { "Not_implemented": 213, "Broken": 21, "Completed": 59, "In_alpha": 7, "Compromised": 1, "date": "2016-01-01T08:00:00.000Z" }, { "Not_implemented": 213, "Broken": 22, "Completed": 62, "In_alpha": 7, "Compromised": 1, "date": "2016-02-01T08:00:00.000Z" }, { "Not_implemented": 213, "Broken": 22, "Completed": 62, "In_alpha": 7, "Compromised": 1, "date": "2016-03-01T08:00:00.000Z" }, { "Not_implemented": 223, "Broken": 22, "Completed": 62, "In_alpha": 7, "Compromised": 1, "date": "2016-04-01T07:00:00.000Z" }, { "Not_implemented": 223, "Broken": 22, "Completed": 63, "In_alpha": 7, "Compromised": 1, "date": "2016-05-01T07:00:00.000Z" }, { "Not_implemented": 223, "Broken": 22, "Completed": 63, "In_alpha": 7, "Compromised": 1, "date": "2016-06-01T07:00:00.000Z" }, { "Not_implemented": 223, "Broken": 22, "Completed": 63, "In_alpha": 7, "Compromised": 1, "date": "2016-07-01T07:00:00.000Z" }, { "Not_implemented": 223, "Broken": 22, "Completed": 63, "In_alpha": 7, "Compromised": 1, "date": "2016-08-01T07:00:00.000Z" }, { "Not_implemented": 227, "Broken": 22, "Completed": 63, "In_alpha": 7, "Compromised": 1, "date": "2016-09-01T07:00:00.000Z" }, { "Not_implemented": 227, "Broken": 22, "Completed": 63, "In_alpha": 7, "Compromised": 1, "date": "2016-10-01T07:00:00.000Z" }, { "Stagnant": 4, "Broken": 22, "Completed": 63, "Not_implemented": 248, "In_alpha": 7, "Compromised": 1, "date": "2016-11-01T07:00:00.000Z" }, { "Stagnant": 24, "Broken": 23, "Completed": 63, "Not_implemented": 229, "In_alpha": 7, "Compromised": 1, "date": "2016-12-01T08:00:00.000Z" }, { "Stagnant": 29, "Broken": 23, "Completed": 63, "Not_implemented": 224, "In_alpha": 7, "Compromised": 1, "date": "2017-01-01T08:00:00.000Z" }, { "Stagnant": 31, "Broken": 23, "Completed": 63, "Not_implemented": 222, "In_alpha": 7, "Compromised": 1, "date": "2017-02-01T08:00:00.000Z" }, { "Stagnant": 31, "Broken": 23, "Completed": 63, "Not_implemented": 222, "In_alpha": 7, "Compromised": 1, "date": "2017-03-01T08:00:00.000Z" }, { "Stagnant": 32, "Broken": 23, "Completed": 63, "Not_implemented": 221, "In_alpha": 7, "Compromised": 1, "date": "2017-04-01T07:00:00.000Z" }, { "Stagnant": 35, "Broken": 23, "Completed": 63, "Not_implemented": 218, "In_alpha": 7, "Compromised": 1, "date": "2017-05-01T07:00:00.000Z" }
    ];
    var brokenArray = [], stagnantArray = [], notimplementedArray = [], inalphaArray = [], compromisedArray = [], completedArray = [];
    //build arrays of data
    for (var _i = 0, History_1 = History; _i < History_1.length; _i++) {
        var month = History_1[_i];
        brokenArray.push(month.Broken);
        stagnantArray.push(month.Stagnant);
        notimplementedArray.push(month.Not_implemented);
        inalphaArray.push(month.In_alpha);
        compromisedArray.push(month.Compromised);
        completedArray.push(month.Completed);
        labels.push(month.date);
    }
    //Charts Data
    var ctx = document.getElementById("timechart");
    var data = {
        labels: labels,
        datasets: [{
                label: "Broken",
                backgroundColor: "#f2dede",
                borderColor: "#c56d6d",
                borderWidth: 1,
                data: brokenArray,
            }, {
                label: "Stagnant",
                backgroundColor: "#fcddc4",
                borderColor: "#f5903d",
                borderWidth: 1,
                data: stagnantArray
            }, {
                label: "Not implemented",
                backgroundColor: "#fcf8e3",
                borderColor: "#ecd046",
                borderWidth: 1,
                data: notimplementedArray
            }, {
                label: "In alpha",
                backgroundColor: "#d9edf7",
                borderColor: "#57afdb",
                borderWidth: 1,
                data: inalphaArray
            }, {
                label: "Compromised",
                backgroundColor: "#ccdde8",
                borderColor: "#72a1c0",
                borderWidth: 1,
                data: compromisedArray
            }, {
                label: "Completed",
                backgroundColor: "#dff0d8",
                borderColor: "#86c66c",
                borderWidth: 1,
                data: completedArray
            }]
    };
    console.log(typeof (AllChart));
    //update chart data if already created
    if (typeof (AllChart) == "object") {
        AllChart.config.data = data;
        AllChart.update();
    }
    else {
        console.log("Created empty chart");
        AllChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                tooltips: {
                    mode: "label"
                },
                scales: {
                    xAxes: [{ stacked: false,
                            ticks: { autoSkip: true },
                            type: 'time',
                            time: {
                                displayFormats: {
                                    'millisecond': 'MMM YYYY',
                                    'second': 'MMM YYYY',
                                    'minute': 'MMM YYYY',
                                    'hour': 'MMM YYYY',
                                    'day': 'MMM YYYY',
                                    'week': 'MMM YYYY',
                                    'month': 'MMM YYYY',
                                    'quarter': 'MMM YYYY',
                                    'year': 'MMM YYYY',
                                }
                            }
                        }],
                    yAxes: [{ stacked: true }]
                }
            }
        });
    }
}
//Build AllChart with default input
Build_and_fill_Chart();




//scrolling to anchor
(function(document, history, location) {
  var HISTORY_SUPPORT = !!(history && history.pushState);

  var anchorScrolls = {
    ANCHOR_REGEX: /^#[^ ]+$/,
    OFFSET_HEIGHT_PX: 50,

    /**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
    init: function() {
      this.scrollToCurrent();
      $(window).on('hashchange', $.proxy(this, 'scrollToCurrent'));
      $('body').on('click', 'a', $.proxy(this, 'delegateAnchors'));
    },

    /**
     * Return the offset amount to deduct from the normal scroll position.
     * Modify as appropriate to allow for dynamic calculations
     */
    getFixedOffset: function() {
      return this.OFFSET_HEIGHT_PX;
    },

    /**
     * If the provided href is an anchor which resolves to an element on the
     * page, scroll to it.
     * @param  {String} href
     * @return {Boolean} - Was the href an anchor.
     */
    scrollIfAnchor: function(href, pushToHistory) {
      var match, anchorOffset;

      if(!this.ANCHOR_REGEX.test(href)) {
        return false;
      }

      match = document.getElementById(href.slice(1));

      if(match) {
        anchorOffset = $(match).offset().top - this.getFixedOffset();
        $('html, body').animate({ scrollTop: anchorOffset});

        // Add the state to history as-per normal anchor links
        if(HISTORY_SUPPORT && pushToHistory) {
          history.pushState({}, document.title, location.pathname + href);
        }
      }

      return !!match;
    },
    
    /**
     * Attempt to scroll to the current location's hash.
     */
    scrollToCurrent: function(e) { 
      if(this.scrollIfAnchor(window.location.hash) && e) {
      	e.preventDefault();
      }
    },

    /**
     * If the click event's target was an anchor, fix the scroll position.
     */
    delegateAnchors: function(e) {
      var elem = e.target;

      if(this.scrollIfAnchor(elem.getAttribute('href'), true)) {
        e.preventDefault();
      }
    }
  };

	$(document).ready($.proxy(anchorScrolls, 'init'));
})(window.document, window.history, window.location);
