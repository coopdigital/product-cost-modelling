/* globals chart */

var recipe = (function() {

  var modal = $('#commoditySelection');
  var ingredients = $('#ingredients');

  var init = function() {
    $('#ingredients').empty();

    var activeCommodities = modal.find('.commodity.active');

    activeCommodities.each(function() {
      ingredients.append(
        '<div class="row">' +
          '<div class="col-xs-8 col-md-4">' +
            '<p class="display">' + $(this).text() + '</p>' +
          '</div>' +
          '<div class="col-xs-4 col-md-2 input">' +
            '<p><input type="number" min=1 value=1> units</p>' +
          '</div>' +
        '</div>');
    });

    if (activeCommodities.length === 1) {
      $('#ingredients .input').addClass('hidden');
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
