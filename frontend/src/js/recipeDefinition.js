var recipeDefinition = (function() {

  var init = function() {
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

  return {
      init: init,
      buildComposite: buildComposite
  };

})();
