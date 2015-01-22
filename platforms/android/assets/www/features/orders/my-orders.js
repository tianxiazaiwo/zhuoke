ls_controller('orders.MyOrdersCtrl',
  ['$scope', '$state', 'data.OrderMngr', 'LsCommon',
  function ($scope, $state, orderMngr, LsCommon) {
    $scope.seat_types = orderMngr.SEAT_TYPES;

    _load(1);

    function _load(page) {
      orderMngr.fetchMyOrders(page)
      .then(function (ret) {
        if (!$scope.orders) {
          $scope.orders = ret.message;
        } else {
          $scope.is_loading = false;
          var data = ret.message;
          data.data = $scope.orders.data.concat(data.data);
          $scope.orders = data;
        }
        if (!ret.message.data.length) {
          $scope.loadingStatus = 11;
        } else {
          $scope.loadingStatus = LsCommon.LOADING_COMPLETE;
        }
      })
      .catch(function() {
        $scope.loadingStatus = 11;
      });
    }

    $scope.viewDetail = function(order) {
      $state.go('^.detail', {orderId: order.id});
    };

    $scope.loadMore = function() {
      $scope.is_loading = true;
      if (!$scope.orders) {
        _load(1);
      } else {
        if ($scope.orders.has_more) {
          _load($scope.orders.page + 1);
        };
      }
    };
  }]);
