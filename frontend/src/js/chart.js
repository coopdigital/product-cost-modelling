/* globals dates, blend, priceIndices */

var chart = (function() {

  var compositeIndex;

  var init = function() {
    compositeIndex = buildComposite(dates, blend, priceIndices);
    generate(compositeIndex);
  };

  var buildComposite = function(dates, blend, priceIndices){
    var compositeIndex = [];
    compositeIndex.length = dates.length;
    compositeIndex.fill(0);
    compositeIndex[0] = 'Blend';

    blend.forEach(function(element){
      index = priceIndices[element.display].usd;

      for (var i = 1; i < index.length; i++) {
        compositeIndex[i] += element.percentage * index[i];
      }
    });

    return compositeIndex;
  };

  var generate = function() {
    c3.generate({
      data: {
        x: 'date',
        columns: [
          dates,
          priceIndices['Wheat'].usd,
          priceIndices['Corn'].usd,
          compositeIndex
        ]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%b \'%y'
          }
        },
        y: {
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
