ls_controller('orders.DetailCtrl',
  ['$scope', '$state', '$stateParams', '$filter', '$ionicPopup', '$ionicLoading', 'data.OrderMngr', 'LsCommon',
  function ($scope, $state, $stateParams, $filter, $ionicPopup, $ionicLoading, orderMngr, LsCommon) {
    var orderId = $stateParams.orderId;
    $scope.seat_types = orderMngr.SEAT_TYPES;
    orderMngr.fetchDetail(orderId).then(function (ret) {
      $scope.order = ret.message;
      if ($scope.order.name) {
        var postfix = $filter('ls_mapped_value')($scope.order.gender, orderMngr.TITLES);
        if (postfix) {
          $scope.order.name += postfix;
        }
      }

      $scope.order.dishes_count = 0;
      angular.forEach($scope.order.dishes, function (dish, key) {
        $scope.order.dishes_count += parseInt(dish.nums);
      });

      $scope.loadingStatus = LsCommon.LOADING_COMPLETE;

      $scope.cancelOrder = function() {
        $ionicPopup.confirm({
          title: '取消订单',
          okText: '确定',
          cancelText: '保留',
          template: '确定要取消此订单吗？'
        }).then(function(res) {
          if(res) {
            $ionicLoading.show({
              template: '正在取消',
              duration: 5000,
              noBackdrop: true
            });
            orderMngr.cancelOrder(orderId).then(function (ret) {
              $ionicLoading.hide();

              if (ret.status) {
                $ionicPopup.alert({
                  title: '取消订单',
                  okText: '确定',
                  template: '订单取消失败'
                });
              } else {
                LsCommon.clearBackHistory($scope);
                $state.go('^.my-orders');
              }
            });
          }
        });
      };
    });
  }]);