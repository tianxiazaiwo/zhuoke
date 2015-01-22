ls_controller('dingzuo.ConfirmCtrl',
  ['$scope', '$state', '$stateParams', '$ionicLoading', '$ionicPopup', 'data.OrderMngr', 'data.DishMngr', 'LsCommon',
  function($scope, $state, $stateParams, $ionicLoading, $ionicPopup, OrderMngr, DishMngr, LsCommon) {

    var shopId = $stateParams.shopId;
    var clicked = 0;

    $scope.title = lsglobal.globalTitle;
    $scope.startFrom = lsglobal.startFrom;

    $scope.currentStep = 2;
    //获取前一步的临时订单
    $scope.order = OrderMngr.getUnsavedOrder(shopId);
    //称谓定义
    $scope.titles = OrderMngr.TITLES;
    //座位类型定义
    $scope.seat_types = OrderMngr.SEAT_TYPES;

    //店铺信息
    DishMngr.fetchDishInfo(shopId)
      .then(function (ret) {
        var dishInfo = ret.message;
        $scope.shopName  = dishInfo.shop_name;
      });

    $scope.modifyOrderInfo = function() {
      $state.go('dingzuo.modify', {shopId:shopId});
    };

    $scope.modifyDishInfo = function() {
      $state.go('dingcan.modify', {shopId:shopId});
    };

    $scope.orderConfirm = function() {
      clicked++;
      $ionicLoading.show({
        template: '<span class="ion-loading-d" style="font-size: 30px;"></span>正在提交订单, 请稍候...',
        duration: 10000,
        noBackdrop: true
      });

      if(clicked == 1) {
        OrderMngr.saveOrder($scope.order)
          .then(function(ret) {
            $ionicLoading.hide();
            if (!ret.status) {
              LsCommon.clearBackHistory($scope);
              $state.go('^.compelete', {}, {'location': 'replace'});
            } else {
              $ionicPopup.alert({
                title: '提示',
                okText: '确定',
                template: '<center>订单提交失败, 请修改后重新提交。<br />['+ret.message+']</center>'
              });
              isSubmitting = false;
              clicked = 0;
            }
          });
      }

    };

  }]);