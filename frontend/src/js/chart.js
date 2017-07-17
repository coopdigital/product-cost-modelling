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

      for (var i = 1; i < index.length; i++) {
        compositeIndex[i] += element.units / recipe.totalUnits * index[i];
      }
    });

    var headlineChange = parseInt((compositeIndex.slice(-1)[0] - 1) * 100);
    var sign = headlineChange > 0 ? '+' : '-';

    $('#headline-change').text(sign + headlineChange);

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
        columns: data
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%b \'%y'
          }
        },
        y: {
          min: 0,
          padding: {
            bottom: 0
          },
          tick: {
            format: d3.format('.1f')
          }
        }
      },
      tooltip: {
        format: {
          value: function (value) {
              var format = d3.format('.2f');
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
