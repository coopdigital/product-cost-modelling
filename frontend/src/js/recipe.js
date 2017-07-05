/* globals chart */

var recipe = (function() {

  var modal = $('#commoditySelection');
  var recipe = $('#recipe-section');

  var init = function() {
    var activeCommodities = modal.find('.commodity.active');
    activeCommodities.each(function() {
      recipe.append(
        '<div class="row">' +
          '<div class="col-md-4">' +
            '<p class="display">' + $(this).text() + '</p>' +
          '</div>' +
          '<div class="col-md-1">' +
          // Decrement buttons
          '</div>' +
          '<div class="col-md-2">' +
            '<p><input type="number" min=1 value=1> units</p>' +
          '</div>' +
          '<div class="col-md-1">' +
          // Increment buttons
          '</div>' +
        '</div>');
    });
    chart.init();
    $('#recipe-section input').change(function() {
      chart.init();
    });
  };

  return {
      init: init,
  };

})();
