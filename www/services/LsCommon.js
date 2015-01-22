ls_factory('LsCommon',
  function($ionicViewService, $window) {
    return {
      LOADING_COMPLETE: 1,
      LOADING_ERROR: 2,

      clearBackHistory: function(scope) {
        lsconfig.history_size = -1;

        var unregisterListener = scope.$on('$stateChangeStart', function() {
            $ionicViewService.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            unregisterListener();
        });
        $window.setTimeout(unregisterListener, 300);
      }
    };
  });