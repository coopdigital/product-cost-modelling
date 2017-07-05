/* globals recipe */

var commoditySelection = (function() {

  var modal = $('#commoditySelection');
  var commodities = modal.find('.commodity');
  var apply = modal.find('#apply');

  var init = function() {
    modal.modal();
    commodities.click(function() {
      $(this).toggleClass('btn-success active').blur();
    });
    apply.click(function() {
      modal.modal('hide');
      $('#wrapper').removeClass('hidden');
      recipe.init();
    });
  };

  return {
      init: init,
  };

})();
