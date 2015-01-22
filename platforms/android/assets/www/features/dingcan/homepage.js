ls_controller('dingcan.HomepageCtrl',
  ['$scope', '$state', '$stateParams', '$ionicPopup', '$ionicBackdrop', '$ionicScrollDelegate',
   '$ionicNavBarDelegate', 'LsCommon',
   'data.DishMngr', 'data.OrderMngr',
  function(
    $scope, $state, $stateParams, $ionicPopup, $ionicBackdrop, $ionicScrollDelegate,
    $ionicNavBarDelegate, LsCommon,
    DishMngr, OrderMngr) {

    if (window.wizSpinner) {
      window.wizSpinner.setBackPreventingText({
        'title': '离开订餐',
        'text': '现在离开，订餐信息将被清空噢!',
        'negative': '确定',
        'neutral': '继续订餐'
      });
    }

    if (!lsglobal.globalTitle) {
      $scope.title = lsglobal.globalTitle = '在线点餐';
    } else {
      $scope.title = lsglobal.globalTitle;
    }
    $scope.startFrom = lsglobal.startFrom = 'dingcan';
    $scope.currentStep = 0;

    var shopId = $stateParams.shopId;
    DishMngr.fetchDishInfo(shopId)
      .then(function (ret) {
        if (ret.status) {
          $ionicPopup.alert({
            title: '错误',
            template: '<center>' + ret.message + '</center>',
            okText: '确定'
          }).then(function() {
            if (window.wizSpinner) {
              window.wizSpinner.setBackPreventingText('');
            }

            if (window.wizSpinner) {
              window.wizSpinner.exitApp();
            }
          });
          return;
        }

        var dishInfo = ret.message;
        $scope.discount  = dishInfo.discount;
        $scope.dishs     = dishInfo.dishs;
        $scope.dishCates = Object.keys(dishInfo.dishs);

        if ($scope.dishCates.length <= 0) {
          $ionicPopup.alert({
            title: '提示',
            template: '<center>本店暂不支持在线订餐<br/>应用将带您进入订座流程</center>',
            okText: '确定'
          }).then(function() {
            delete lsglobal.startFrom;
            delete lsglobal.globalTitle;
            LsCommon.clearBackHistory($scope);
            $state.go('dingzuo.form', {shopId: shopId}, {location:'replace'});
          });
        }


        setTimeout(function() {
          $('.dish-list .ls-lazyload').unveil(60, function() {
            this.onload=function() {
              $(this).addClass('ls-lazyload-done');
              $(this).removeClass('ls-lazyload');
            };
          });
        }, 500);
      })
      .finally(function() {
        $scope.loadingStatus = LsCommon.LOADING_COMPLETE;
      });

    //表单模式
    $scope.formMode = $state.is('dingcan.modify') ? 'modify' : 'empty';
    //当前所选分类Idx
    $scope.currentCate = 0;
    //生成一个临时订单
    $scope.order = OrderMngr.getUnsavedOrder(shopId);

    var detailImgWidth = parseInt(window.innerWidth * 0.85);
    if (detailImgWidth > 540) {
      $scope.imgCompress = 60;
    } else {
      $scope.imgCompress = 40;
    }
    $scope.detailImgSize = {
      width: detailImgWidth,
      height:parseInt(detailImgWidth * 0.5),
      loadingX: parseInt((detailImgWidth - 27) * 0.5), //轮转图实际的大小，不包括图片到边缘的空白区域
      loadingY: parseInt((detailImgWidth * 0.5 - 27) * 0.5 - 5)
    };

    //从已选菜品中取消全部分类后返回第一个分类
    $scope.$watch('order.getTotalAmount()', function(v, o) {
      if ((v != o) && (v == 0) && ($scope.currentCate == -1)) {
        $scope.changeCurrentCate(0);
      }
    });

    //改变侧栏选中分类
    $scope.changeCurrentCate = function(index) {
      $ionicScrollDelegate.$getByHandle('dish-list').scrollTop();
      $scope.currentCate = index;

      setTimeout(function() {
        $('.dish-list .ls-lazyload').unveil(60, function() {
          this.onload=function() {
            $(this).addClass('ls-lazyload-done');
            $(this).removeClass('ls-lazyload');
          };
        });
      }, 300);
    };

    //取得当前选中类别下的餐品
    $scope.getDishsOfCurrentCate = function() {
      if (!$scope.dishCates || !$scope.dishs) {
        return [];
      }

      if ($scope.currentCate == -1) {
        return $scope.order.getSelectedDishs();
      }

      var cate = $scope.dishCates[$scope.currentCate];

      return $scope.dishs[cate];
    };

    $scope.plusDishAmount = function(dish) {
      if (!$scope.order.containsDish(dish.id)) {
        var cate = $scope.dishCates[$scope.currentCate];
        $scope.order.addDish(cate, dish);
      } else {
        dish.amount++;
      }
    };

    $scope.minusDishAmount = function(dish) {
      if (dish.amount > 1) {
        dish.amount--;
      } else {
        dish.amount = 0;
        $scope.order.removeDish(dish.id);
      }
    };

    $scope.showDetail = function(dish) {
      var scope = $scope.$new();
      scope.dish = dish;

      var popup = $ionicPopup.show({
        templateUrl: 'features/dingcan/dish-detail.html',
        scope: scope
      });

      setTimeout(function() {

        $('.popup-body .ls-lazyload').unveil(60, function() {
          this.onload=function() {
            $(this).addClass('ls-lazyload-done');
            $(this).removeClass('ls-lazyload');
            this.style.height = 'auto';
          };
        });

      }, 200);

      scope.closeDetail = function() {
        popup.close();
      };
    };

    $scope.onDishListScroll = function() {
      $(window).triggerHandler('lookup.unveil');
    };

    $scope.nextStep = function() {
      if ($scope.order.getTotalAmount()) {
        if ($scope.formMode == 'modify') {
          $ionicNavBarDelegate.back();
        } else {
          $state.go('dingzuo.form', {shopId: shopId});
        }
      } else {
        $ionicPopup.confirm({
          title: '尚未点餐',
          cancelText: '开始订座',
          okText: '继续点餐',
          template: '您还没有点餐，是否跳过点餐流程直接订座?'
        }).then(function(res) {
          if(!res) {
            if ($scope.formMode == 'modify') {
              $ionicNavBarDelegate.back();
            } else {
              $state.go('dingzuo.form', {shopId: shopId});
            }
          } else {
            return;
          }
        });
      }
    };

  }]);
