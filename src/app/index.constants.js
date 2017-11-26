/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('web')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('apiUrl', 'http://localhost:60731/api')
    .constant('authUrl', 'http://localhost:60731/api/account/oauth/token');
})();
