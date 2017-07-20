/* globals chart, priceIndices */

var recipe = (function() {

  var modal = $('#commoditySelection');
  var ingredients = $('#ingredients');
  var commodityDetail = $('#commodity-detail');

  var init = function() {
    ingredients.empty();
    commodityDetail.empty();

    var activeCommodities = modal.find('.commodity.active');

    activeCommodities.each(function() {
      var commodityName = $(this).text();
      var commodityDescription = priceIndices[commodityName].description;

      ingredients.append(
        '<div class="row">' +
          '<div class="col-xs-8 col-md-4">' +
            '<p class="display">' + commodityName + '</p>' +
          '</div>' +
          '<div class="col-xs-4 col-md-2 input">' +
            '<p><input type="number" min=1 value=1> units</p>' +
          '</div>' +
        '</div>');

      commodityDetail.append(
        '<li><strong>' + commodityName + ':</strong> ' + commodityDescription + '</li>'
      );
    });

    if (activeCommodities.length === 1) {
      $('#recipe-instruction').addClass('hidden');
      $('#ingredients .input').addClass('hidden');
    } else {
      $('#recipe-instruction').removeClass('hidden');
    }

    chart.init();

    $('#recipe-section input').change(function() {
      chart.init();
    });
  };

  return {
      init: init,
  };

})();
