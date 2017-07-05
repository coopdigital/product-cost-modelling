/* globals chart */

var recipe = (function() {

  var modal = $('#commoditySelection');
  var recipe = $('#recipe-section');

  var init = function() {
    var activeCommodities = modal.find('.commodity.active');
    activeCommodities.each(function() {
      recipe.append(
        '<div class="row">' +
          '<div class="col-md-6">' +
            $(this).text() +
          '</div>' +
        '</div>');
    });
    chart.init();
  };

  return {
      init: init,
  };

})();
