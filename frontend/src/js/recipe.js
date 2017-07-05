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
            $(this).text() +
          '</div>' +
          '<div class="col-md-2">' +
          '</div>' +
          '<div class="col-md-3">' +
            '<p><input type="number" value=1> units</p>' +
          '</div>' +
          '<div class="col-md-2">' +
          '</div>' +
        '</div>');
    });
    chart.init();
  };

  return {
      init: init,
  };

})();
