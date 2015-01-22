ls_controller('dingzuo.PhonebindCtrl',
  ['$scope', '$state', '$stateParams', '$ionicPopup', '$interval', 'data.DishMngr',
    function ($scope, $state, $stateParams, $ionicPopup, $interval, dishMngr) {
      $scope.title = '验证手机号码';
      $scope.phone = $stateParams.phone;
      $scope.ccTextDefault = '获取验证码';
      $scope.ccText = $scope.ccTextDefault;
      $scope.getCheckcode = function() {
        $scope.ccText = '正在获取...';
        dishMngr.sendCheckcode($scope.phone).then(function(ret) {
          if (ret.status) {
            $ionicPopup.alert({
              title: $scope.title,
              okText: '确定',
              template: '发送失败，' + ret.message
            });
          } else {
            document.getElementById('checkcode').focus();
            var index = 60;
            var interval = $interval(function(){
              if (0 == index) {
                interval = false;
                $scope.ccText = $scope.ccTextDefault;
              } else {
                $scope.ccText = $scope.ccTextDefault + '(' + index-- +')';
              }
            }, 1000, index + 1);
          }
        });
      };
      $scope.submitCheckcode = function() {
        if (! $scope.checkcode) {
          $ionicPopup.alert({
            title: $scope.title,
            okText: '确定',
            template: '请输入验证码'
          });
          return;
        }
        $scope.is_loading = true;
        dishMngr.submitCheckcode($scope.phone, $scope.checkcode).then(function(ret) {
          $scope.is_loading = false;
          if (ret.status) {
            $ionicPopup.alert({
              title: $scope.title,
              okText: '确定',
              template: ret.message
            });
          } else {
            $state.go('^.confirm', {shopId: $stateParams.shop_id});
          }
        });
      };
    }]);