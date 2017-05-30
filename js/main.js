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
			console.log("scrolling to: " + this)
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

//Defaults
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

//Startup + Misc
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
      // Wipe graph to default
      Build_and_fill_Chart();
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
      
	console.log(facets);
	//Update graph on "js-promise-status" changes
	if (facets[0].facet == "js-promise-status") {
		Build_and_fill_Chart(facets[0].value);
	}
	  
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
function Build_and_fill_Chart(para_Type) {
    if (para_Type === void 0) { para_Type = "all"; }
    var History = [
        {"Not_implemented":0,"Completed":0,"date":"2012-10-01T07:00:00.000Z"},
        {"Not_implemented":16,"Completed":1,"date":"2012-11-01T07:00:00.000Z"},{"Not_implemented":34,"Completed":5,"date":"2012-12-01T08:00:00.000Z"},{"Not_implemented":35,"Completed":5,"date":"2013-01-01T08:00:00.000Z"},{"Not_implemented":36,"Completed":6,"date":"2013-02-01T08:00:00.000Z"},{"Not_implemented":37,"Completed":7,"date":"2013-03-01T08:00:00.000Z"},{"Not_implemented":39,"Completed":7,"date":"2013-04-01T07:00:00.000Z"},{"Not_implemented":42,"Completed":7,"date":"2013-05-01T07:00:00.000Z"},{"Not_implemented":43,"Completed":9,"date":"2013-06-01T07:00:00.000Z"},{"Not_implemented":54,"Completed":9,"date":"2013-07-01T07:00:00.000Z"},{"Not_implemented":56,"Completed":9,"date":"2013-08-01T07:00:00.000Z"},{"Not_implemented":58,"Completed":9,"date":"2013-09-01T07:00:00.000Z"},{"Not_implemented":60,"Completed":10,"date":"2013-10-01T07:00:00.000Z"},{"Not_implemented":61,"Completed":10,"In_alpha":1,"date":"2013-11-01T07:00:00.000Z"},{"Not_implemented":69,"Completed":10,"In_alpha":1,"date":"2013-12-01T08:00:00.000Z"},{"Not_implemented":75,"Completed":16,"In_alpha":2,"date":"2014-01-01T08:00:00.000Z"},{"Not_implemented":101,"Completed":30,"Broken":1,"In_alpha":3,"Compromised":1,"date":"2014-02-01T08:00:00.000Z"},{"Not_implemented":123,"Completed":32,"Broken":1,"In_alpha":4,"Compromised":1,"date":"2014-03-01T08:00:00.000Z"},{"Not_implemented":145,"Completed":35,"Broken":1,"In_alpha":4,"Compromised":1,"date":"2014-04-01T07:00:00.000Z"},{"Not_implemented":165,"Completed":38,"Broken":1,"In_alpha":4,"Compromised":1,"date":"2014-05-01T07:00:00.000Z"},{"Not_implemented":176,"Completed":38,"Broken":1,"In_alpha":4,"Compromised":1,"date":"2014-06-01T07:00:00.000Z"},{"Not_implemented":195,"Completed":39,"Broken":2,"In_alpha":4,"Compromised":1,"date":"2014-07-01T07:00:00.000Z"},{"Not_implemented":200,"Completed":40,"Broken":2,"In_alpha":5,"Compromised":1,"date":"2014-08-01T07:00:00.000Z"},{"Not_implemented":211,"Completed":42,"Broken":2,"In_alpha":6,"Compromised":1,"date":"2014-09-01T07:00:00.000Z"},{"Not_implemented":213,"Completed":42,"Broken":2,"In_alpha":7,"Compromised":1,"date":"2014-10-01T07:00:00.000Z"},{"Not_implemented":213,"Completed":42,"Broken":2,"In_alpha":7,"Compromised":1,"date":"2014-11-01T07:00:00.000Z"},{"Not_implemented":217,"Completed":42,"Broken":2,"In_alpha":7,"Compromised":1,"date":"2014-12-01T08:00:00.000Z"},{"Not_implemented":219,"Completed":43,"Broken":2,"In_alpha":7,"Compromised":1,"date":"2015-01-01T08:00:00.000Z"},{"Not_implemented":214,"Completed":58,"Broken":8,"In_alpha":7,"Compromised":1,"date":"2015-02-01T08:00:00.000Z"},{"Not_implemented":214,"Completed":58,"Broken":8,"In_alpha":7,"Compromised":1,"date":"2015-03-01T08:00:00.000Z"},{"Not_implemented":217,"Completed":58,"Broken":8,"In_alpha":7,"Compromised":1,"date":"2015-04-01T07:00:00.000Z"},{"Not_implemented":219,"Completed":58,"Broken":8,"In_alpha":7,"Compromised":1,"date":"2015-05-01T07:00:00.000Z"},{"Not_implemented":219,"Broken":9,"Completed":58,"In_alpha":7,"Compromised":1,"date":"2015-06-01T07:00:00.000Z"},{"Not_implemented":219,"Broken":10,"Completed":58,"In_alpha":7,"Compromised":1,"date":"2015-07-01T07:00:00.000Z"},{"Not_implemented":218,"Broken":11,"Completed":58,"In_alpha":7,"Compromised":1,"date":"2015-08-01T07:00:00.000Z"},{"Not_implemented":220,"Broken":11,"Completed":58,"In_alpha":7,"Compromised":1,"date":"2015-09-01T07:00:00.000Z"},{"Not_implemented":221,"Broken":11,"Completed":59,"In_alpha":7,"Compromised":1,"date":"2015-10-01T07:00:00.000Z"},{"Not_implemented":222,"Broken":11,"Completed":59,"In_alpha":7,"Compromised":1,"date":"2015-11-01T07:00:00.000Z"},{"Not_implemented":222,"Broken":11,"Completed":59,"In_alpha":7,"Compromised":1,"date":"2015-12-01T08:00:00.000Z"},{"Not_implemented":222,"Broken":12,"Completed":59,"In_alpha":7,"Compromised":1,"date":"2016-01-01T08:00:00.000Z"},{"Not_implemented":219,"Broken":16,"Completed":62,"In_alpha":7,"Compromised":1,"date":"2016-02-01T08:00:00.000Z"},{"Not_implemented":219,"Broken":16,"Completed":62,"In_alpha":7,"Compromised":1,"date":"2016-03-01T08:00:00.000Z"},{"Not_implemented":229,"Broken":16,"Completed":62,"In_alpha":7,"Compromised":1,"date":"2016-04-01T07:00:00.000Z"},{"Not_implemented":229,"Broken":16,"Completed":63,"In_alpha":7,"Compromised":1,"date":"2016-05-01T07:00:00.000Z"},{"Not_implemented":228,"Broken":17,"Completed":63,"In_alpha":7,"Compromised":1,"date":"2016-06-01T07:00:00.000Z"},{"Not_implemented":228,"Broken":17,"Completed":63,"In_alpha":7,"Compromised":1,"date":"2016-07-01T07:00:00.000Z"},{"Not_implemented":228,"Broken":17,"Completed":63,"In_alpha":7,"Compromised":1,"date":"2016-08-01T07:00:00.000Z"},{"Not_implemented":232,"Broken":17,"Completed":63,"In_alpha":7,"Compromised":1,"date":"2016-09-01T07:00:00.000Z"},{"Not_implemented":232,"Broken":17,"Completed":63,"In_alpha":7,"Compromised":1,"date":"2016-10-01T07:00:00.000Z"},{"Stagnant":4,"Broken":17,"Completed":63,"Not_implemented":253,"In_alpha":7,"Compromised":1,"date":"2016-11-01T07:00:00.000Z"},{"Stagnant":24,"Broken":18,"Completed":63,"Not_implemented":234,"In_alpha":7,"Compromised":1,"date":"2016-12-01T08:00:00.000Z"},{"Stagnant":29,"Broken":18,"Completed":63,"Not_implemented":229,"In_alpha":7,"Compromised":1,"date":"2017-01-01T08:00:00.000Z"},{"Stagnant":31,"Broken":21,"Completed":63,"Not_implemented":224,"In_alpha":7,"Compromised":1,"date":"2017-02-01T08:00:00.000Z"},{"Stagnant":31,"Broken":21,"Completed":63,"Not_implemented":224,"In_alpha":7,"Compromised":1,"date":"2017-03-01T08:00:00.000Z"},{"Stagnant":32,"Broken":22,"Completed":63,"Not_implemented":222,"In_alpha":7,"Compromised":1,"date":"2017-04-01T07:00:00.000Z"},{"Stagnant":35,"Broken":23,"Completed":63,"Not_implemented":218,"In_alpha":7,"Compromised":1,"date":"2017-05-01T07:00:00.000Z"},
        {"Stagnant":36,"Broken":23,"Completed":63,"Not_implemented":217,"In_alpha":7,"Compromised":1,"date":"2017-06-01T07:00:00.000Z"}
    ];
    var brokenArray = [], stagnantArray = [], notimplementedArray = [], inalphaArray = [], compromisedArray = [], completedArray = [], labels = [];
    //build data arrays
    for (var _i = 0, History_1 = History; _i < History_1.length; _i++) {
        var month = History_1[_i];
        switch (para_Type) {
            default:
                brokenArray.push(month.Broken);
                stagnantArray.push(month.Stagnant);
                notimplementedArray.push(month.Not_implemented);
                inalphaArray.push(month.In_alpha);
                compromisedArray.push(month.Compromised);
                completedArray.push(month.Completed);
                break;
            case "Broken":
                brokenArray.push(month.Broken);
                break;
            case "Stagnant":
                stagnantArray.push(month.Stagnant);
                break;
            case "Not implemented":
                notimplementedArray.push(month.Not_implemented);
                break;
            case "In alpha":
                inalphaArray.push(month.In_alpha);
                break;
            case "Compromised":
                compromisedArray.push(month.Compromised);
                break;
            case "Completed":
                completedArray.push(month.Completed);
                break;
        }
        //Labels always needed to mark each tick on the graph
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
                spanGaps: true,
            }, {
                label: "Stagnant",
                backgroundColor: "#fcddc4",
                borderColor: "#f5903d",
                data: stagnantArray
            }, {
                label: "Not implemented",
                backgroundColor: "#fcf8e3",
                borderColor: "#ecd046",
                data: notimplementedArray
            }, {
                label: "In alpha",
                backgroundColor: "#d9edf7",
                borderColor: "#57afdb",
                data: inalphaArray
            }, {
                label: "Compromised",
                backgroundColor: "#ccdde8",
                borderColor: "#72a1c0",
                data: compromisedArray
            }, {
                label: "Completed",
                backgroundColor: "#dff0d8",
                borderColor: "#86c66c",
                data: completedArray
            }]
    };
    //add any shared elements to all datasets
    for (var i = 0; i < data.datasets.length; i++) {
        data.datasets[i].borderWidth = 1;
        data.datasets[i].pointRadius = 1;
        data.datasets[i].pointHitRadius = 10;
        data.datasets[i].pointHoverRadius = 6;
        data.datasets[i].pointHoverBorderWidth = 3;
    }
    //update chart data if already created
    if (typeof (AllChart) == "object") {
        AllChart.config.data = data;
        AllChart.update();
    }
    else {
        console.log("Created empty chart");
        Chart.defaults.global.legend.display = false;
        AllChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                tooltips: {
                    mode: "label",
                    position: "nearest"
                },
                scales: {
                    xAxes: [{ stacked: false,
                            ticks: { autoSkip: false },
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
