/* globals dates, priceIndices */

var chart = (function() {

  var init = function() {
    var recipe = getRecipe();
    var compositeIndex = buildComposite(recipe);
    renderChart(recipe, compositeIndex);
  };

  var getRecipe = function() {
    components = [];
    totalUnits = 0;
    $('#ingredients .row').each(function() {
      units = $(this).find('input').val();
      components.push({
        display: $(this).find('.display').text(),
        units: units
      });
      totalUnits += parseInt(units);
    });

    return {
      components: components,
      totalUnits: totalUnits
    };
  };

  var buildComposite = function(recipe) {
    compositeIndex = [];
    compositeIndex.length = dates.length;
    compositeIndex.fill(0);
    compositeIndex[0] = 'Blend';

    recipe.components.forEach(function(element){
      index = priceIndices[element.display].usd;

      for (var i = 1; i < compositeIndex.length; i++) {
        // Indexes can be a month behind: filling forward feels reasonable
        if (!index[i]) {
          index[i] = index[i - 1];
        }
        compositeIndex[i] += element.units / recipe.totalUnits * index[i];
      }
    });

    var headlineChange = Math.round(compositeIndex.slice(-1)[0] - 100);
    if (headlineChange > 0) {
      headlineChange = 'increased by ' + headlineChange + '%';
    } else if (headlineChange < 0) {
      headlineChange = 'decreased by ' + headlineChange + '%';
    } else {
      headlineChange = 'did not change';
    }

    $('#headline-change').text(headlineChange);

    return compositeIndex;
  };

  var renderChart = function(recipe, compositeIndex) {
    var data = [dates];

    components.forEach(function(element){
      data.push(priceIndices[element.display].usd);
    });

    if (recipe.components.length > 1) {
      data.push(compositeIndex);
    }

    c3.generate({
      data: {
        x: 'date',
        columns: data,
        colors: {
          Blend: '#282828',
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          padding: {
            // In milliseconds for timeseries!
            right: 1.5e+9
          },
          tick: {
            format: '%b \'%y'
          }
        },
        y: {
          min: 50,
          max: 150,
          padding: {
            top: 10,
            bottom: 0
          },
          tick: {
            count: 5,
            values: [50, 75, 100, 125, 150]
          }
        }
      },
      point: {
        show: false
      },
      grid: {
        y: {
          show: true
        }
      },
      tooltip: {
        format: {
          value: function (value) {
              var format = d3.format('.0f');
              return format(value);
            }
        }
      }
    });

  };

  return {
      init: init,
  };

})();
