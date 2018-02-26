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
    $('[data-toggle="tooltip"]').tooltip();
  });

  // tabs
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
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
    var maintainers = ["CryTek Legal Beagles", "Coutts & Co.", "Bitter EvE Goons", "SomethingAwful Goons", "Salty Asshats", "Goons (who know nothing about game development)", "Goons stuck in checkmate", "T-posed Goons", "MY GIRLFRIEND", "The Fourth Stimpire", "WaffleImages", "COBOL Greybeards", "Blocked Buddies", "Thanks notepad", "Archive-Priests™", "Ryan Archer"]
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

    var anchorhash = window.location.hash.substr(1);
    if (anchorhash) {
      anchorhash = _.replace(anchorhash, new RegExp("_","g")," ");
      $search.val(anchorhash.toString());
      promiseList.search(anchorhash);
      // promiseList.filter();
      // promiseList.update();
      // promiseList = new List('promises', listOptions).on('updated', function(list) {
      //   $('#count').html(list.visibleItems.length);
      // });
    }

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
      
      // console.log(facets);
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
      {"Completed":2,"In_alpha":1,"Not_implemented":13,"date":"2012-11-01T07:00:00.000Z"},{"Not_implemented":39,"Broken":5,"Compromised":1,"Completed":8,"In_alpha":1,"date":"2012-12-01T08:00:00.000Z"},{"Not_implemented":39,"Broken":5,"Compromised":1,"Completed":8,"In_alpha":1,"date":"2013-01-01T08:00:00.000Z"},{"Completed":9,"Not_implemented":48,"In_alpha":2,"Broken":5,"Compromised":1,"date":"2013-02-01T08:00:00.000Z"},{"Not_implemented":50,"Completed":10,"In_alpha":2,"Broken":5,"Compromised":1,"date":"2013-03-01T08:00:00.000Z"},{"Not_implemented":52,"Completed":10,"In_alpha":2,"Broken":5,"Compromised":1,"date":"2013-04-01T07:00:00.000Z"},{"Not_implemented":58,"Completed":10,"In_alpha":2,"Broken":5,"Compromised":1,"date":"2013-05-01T07:00:00.000Z"},{"Not_implemented":60,"Completed":12,"In_alpha":2,"Broken":5,"Compromised":1,"date":"2013-06-01T07:00:00.000Z"},{"Completed":13,"Not_implemented":72,"In_alpha":3,"Broken":5,"Compromised":1,"date":"2013-07-01T07:00:00.000Z"},{"Not_implemented":74,"Completed":13,"In_alpha":3,"Broken":5,"Compromised":1,"date":"2013-08-01T07:00:00.000Z"},{"Not_implemented":79,"Completed":13,"In_alpha":3,"Broken":5,"Compromised":1,"date":"2013-09-01T07:00:00.000Z"},{"Not_implemented":82,"Completed":14,"In_alpha":3,"Broken":5,"Compromised":1,"date":"2013-10-01T07:00:00.000Z"},{"In_alpha":4,"Not_implemented":84,"Completed":14,"Broken":5,"Compromised":1,"date":"2013-11-01T07:00:00.000Z"},{"Not_implemented":91,"Broken":6,"In_alpha":4,"Completed":14,"Compromised":1,"date":"2013-12-01T08:00:00.000Z"},{"Not_implemented":98,"Completed":19,"In_alpha":6,"Broken":6,"Compromised":1,"date":"2014-01-01T08:00:00.000Z"},{"Completed":30,"Not_implemented":122,"In_alpha":9,"Compromised":2,"Broken":7,"date":"2014-02-01T08:00:00.000Z"},{"Completed":33,"In_alpha":11,"Not_implemented":142,"Compromised":2,"Broken":7,"date":"2014-03-01T08:00:00.000Z"},{"Not_implemented":164,"Completed":35,"In_alpha":12,"Compromised":2,"Broken":7,"date":"2014-04-01T07:00:00.000Z"},{"Not_implemented":190,"Completed":38,"In_alpha":16,"Compromised":2,"Broken":7,"date":"2014-05-01T07:00:00.000Z"},{"Compromised":3,"Not_implemented":216,"In_alpha":17,"Completed":38,"Broken":7,"date":"2014-06-01T07:00:00.000Z"},{"Not_implemented":249,"Completed":41,"Compromised":3,"In_alpha":17,"Broken":8,"date":"2014-07-01T07:00:00.000Z"},{"In_alpha":18,"Not_implemented":259,"Completed":42,"Compromised":3,"Broken":8,"date":"2014-08-01T07:00:00.000Z"},{"Not_implemented":279,"Completed":44,"In_alpha":19,"Compromised":3,"Broken":8,"date":"2014-09-01T07:00:00.000Z"},{"Not_implemented":283,"In_alpha":20,"Completed":46,"Compromised":3,"Broken":8,"date":"2014-10-01T07:00:00.000Z"},{"Not_implemented":286,"In_alpha":20,"Completed":47,"Compromised":3,"Broken":8,"date":"2014-11-01T07:00:00.000Z"},{"Not_implemented":302,"In_alpha":22,"Broken":10,"Completed":48,"Compromised":3,"date":"2014-12-01T08:00:00.000Z"},{"Completed":50,"Not_implemented":304,"In_alpha":22,"Broken":10,"Compromised":3,"date":"2015-01-01T08:00:00.000Z"},{"Completed":62,"Not_implemented":302,"In_alpha":22,"Broken":16,"Compromised":3,"date":"2015-02-01T08:00:00.000Z"},{"Not_implemented":303,"In_alpha":23,"Completed":62,"Broken":16,"Compromised":3,"date":"2015-03-01T08:00:00.000Z"},{"Broken":17,"Not_implemented":305,"In_alpha":23,"Completed":62,"Compromised":3,"date":"2015-04-01T07:00:00.000Z"},{"Not_implemented":306,"Broken":17,"In_alpha":23,"Completed":63,"Compromised":3,"date":"2015-05-01T07:00:00.000Z"},{"Compromised":4,"Not_implemented":306,"Broken":18,"In_alpha":23,"Completed":63,"date":"2015-06-01T07:00:00.000Z"},{"Not_implemented":310,"Compromised":4,"Broken":19,"In_alpha":23,"Completed":63,"date":"2015-07-01T07:00:00.000Z"},{"Not_implemented":308,"Compromised":4,"Broken":20,"In_alpha":23,"Completed":64,"date":"2015-08-01T07:00:00.000Z"},{"Not_implemented":313,"In_alpha":24,"Compromised":4,"Broken":20,"Completed":65,"date":"2015-09-01T07:00:00.000Z"},{"Not_implemented":334,"In_alpha":24,"Compromised":4,"Broken":21,"Completed":65,"date":"2015-10-01T07:00:00.000Z"},{"Not_implemented":339,"In_alpha":24,"Compromised":4,"Broken":21,"Completed":65,"date":"2015-11-01T07:00:00.000Z"},{"Not_implemented":339,"In_alpha":24,"Compromised":4,"Broken":21,"Completed":65,"date":"2015-12-01T08:00:00.000Z"},{"Not_implemented":338,"Broken":23,"In_alpha":24,"Compromised":4,"Completed":66,"date":"2016-01-01T08:00:00.000Z"},{"Not_implemented":336,"Completed":69,"Broken":27,"In_alpha":24,"Compromised":4,"date":"2016-02-01T08:00:00.000Z"},{"Not_implemented":345,"Completed":69,"Broken":27,"In_alpha":24,"Compromised":4,"date":"2016-03-01T08:00:00.000Z"},{"Not_implemented":354,"Completed":71,"Broken":27,"In_alpha":24,"Compromised":4,"date":"2016-04-01T07:00:00.000Z"},{"Not_implemented":356,"Completed":71,"Broken":27,"In_alpha":24,"Compromised":4,"date":"2016-05-01T07:00:00.000Z"},{"Completed":73,"Not_implemented":354,"Broken":28,"In_alpha":24,"Compromised":4,"date":"2016-06-01T07:00:00.000Z"},{"Completed":74,"Not_implemented":353,"Broken":28,"In_alpha":24,"Compromised":4,"date":"2016-07-01T07:00:00.000Z"},{"Not_implemented":354,"Completed":74,"Broken":28,"In_alpha":24,"Compromised":4,"date":"2016-08-01T07:00:00.000Z"},{"Not_implemented":377,"Compromised":5,"In_alpha":27,"Completed":75,"Broken":28,"date":"2016-09-01T07:00:00.000Z"},{"Not_implemented":379,"Compromised":5,"In_alpha":27,"Completed":75,"Broken":28,"date":"2016-10-01T07:00:00.000Z"},{"Broken":29,"Completed":76,"Not_implemented":380,"Compromised":5,"In_alpha":27,"Stagnant":3,"date":"2016-11-01T07:00:00.000Z"},{"Not_implemented":363,"Broken":30,"Completed":77,"Compromised":5,"In_alpha":27,"Stagnant":19,"date":"2016-12-01T08:00:00.000Z"},{"Not_implemented":350,"Broken":30,"Completed":79,"Compromised":5,"In_alpha":27,"Stagnant":31,"date":"2017-01-01T08:00:00.000Z"},{"Not_implemented":343,"Broken":33,"Completed":81,"Compromised":5,"In_alpha":27,"Stagnant":34,"date":"2017-02-01T08:00:00.000Z"},{"Not_implemented":345,"Broken":33,"Completed":81,"Compromised":5,"In_alpha":27,"Stagnant":34,"date":"2017-03-01T08:00:00.000Z"},{"Not_implemented":341,"Broken":34,"Completed":82,"Compromised":5,"In_alpha":27,"Stagnant":36,"date":"2017-04-01T07:00:00.000Z"},{"Not_implemented":337,"Broken":36,"Completed":82,"Compromised":5,"In_alpha":27,"Stagnant":39,"date":"2017-05-01T07:00:00.000Z"},{"Not_implemented":331,"Broken":36,"Completed":82,"Compromised":5,"In_alpha":27,"Stagnant":45,"date":"2017-06-01T07:00:00.000Z"},{"Not_implemented":322,"Broken":36,"Completed":82,"Compromised":5,"In_alpha":27,"Stagnant":55,"date":"2017-07-01T07:00:00.000Z"},{"Not_implemented":320,"Broken":37,"Completed":83,"Compromised":5,"In_alpha":27,"Stagnant":57,"date":"2017-08-01T07:00:00.000Z"},{"Not_implemented":321,"Broken":37,"Completed":83,"Compromised":5,"In_alpha":27,"Stagnant":60,"date":"2017-09-01T07:00:00.000Z"},{"Not_implemented":318,"Broken":37,"Completed":83,"Compromised":5,"In_alpha":27,"Stagnant":63,"date":"2017-10-01T07:00:00.000Z"},{"Not_implemented":305,"Broken":46,"Completed":89,"Compromised":5,"In_alpha":27,"Stagnant":65,"date":"2017-11-01T07:00:00.000Z"},{"Not_implemented":307,"Broken":46,"Completed":90,"Compromised":5,"In_alpha":27,"Stagnant":65,"date":"2017-12-01T08:00:00.000Z"},{"In_alpha":28,"Not_implemented":298,"Completed":93,"Broken":47,"Compromised":5,"Stagnant":72,"date":"2018-01-01T08:00:00.000Z"},{"In_alpha":28,"Not_implemented":292,"Completed":93,"Broken":47,"Compromised":5,"Stagnant":78,"date":"2018-02-01T08:00:00.000Z"}
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
        // console.log("Created empty chart");
        Chart.defaults.global.legend.display = false;
        AllChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                tooltips: {
                    mode: "label",
                    position: "nearest",
                    callbacks: {
                        title: function(data) {
                            return moment(data["0"].xLabel).format("MMMM YYYY");
                        }
                    }
                },
                scales: {
                    xAxes: [{   stacked: true, 
                                ticks: {autoSkip: false},
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
                    yAxes: [{stacked: true}]
                }
            }
        });
    }
}
//Build AllChart with default input
Build_and_fill_Chart();
