/* globals recipe */

var commoditySelection = (function() {

  var modal = $('#commoditySelection');
  var commodities = modal.find('.commodity');
  var dismiss = modal.find('#dismiss');
  var apply = modal.find('#apply');
  var modify = $('#modify');
  var isModified = false;

  var init = function() {
    modal.modal();

    commodities.click(function() {
      $(this).toggleClass('btn-success active').blur();
      isModified = true;
    });

    dismiss.click(dismissHandler);

    apply.click(applyHandler);

    modify.click(function() {
      isModified = false;
      modal.modal('show');
    });
  };

  var dismissHandler = function() {
    // commodities must reflect latest DOM state
    commodities = $('#commoditySelection').find('.commodity');

    commodities
      .filter('.btn-success')
      .not('.displayed')
      .removeClass('btn-success active');

    commodities
      .filter('.displayed')
      .addClass('btn-success active');
  };

  var applyHandler = function() {
    // commodities must reflect latest DOM state
    commodities = $('#commoditySelection').find('.commodity');

    modal.modal('hide');
    $('#wrapper').removeClass('hidden');

    if (isModified) {
      commodities.removeClass('displayed');
      commodities.filter('.btn-success').addClass('displayed');
      recipe.init();
    }
  };

  return {
      init: init,
  };

})();
