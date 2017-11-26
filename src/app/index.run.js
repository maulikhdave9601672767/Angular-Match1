(function() {
  'use strict';

  angular
  .module('web')
  .run(runBlock);

  /** @ngInject */
  function runBlock($log,_,auth) {

    $log.debug('runBlock end');
    _.contains = _.includes;
    _.mixin({
      'findByValues': function(collection, property, values) {
        return _.filter(collection, function(item) {
          return _.contains(values, item[property]);
        });
      }
    });

    auth.tryAndLogin();
  }

})();
