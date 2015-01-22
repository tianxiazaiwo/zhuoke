ls_controller('dingzuo.CompeleteCtrl',
  ['$scope', '$state',
  function($scope, $state) {
    $scope.exitApp = function() {
      if (window.wizSpinner) {
        window.wizSpinner.exitApp();
      }

      $scope.title = lsglobal.globalTitle;
      $scope.startFrom = lsglobal.startFrom;
    };
  }]);