ls_controller('dingzuo.HomepageCtrl',
  ['$filter', '$scope', '$state', '$stateParams', '$ionicModal', '$ionicPopup',
   '$ionicActionSheet', '$q', '$ionicNavBarDelegate', '$timeout', 'LsCommon',
   'data.OrderMngr', 'data.DishMngr',
  function(
    $filter, $scope, $state, $stateParams, $ionicModal, $ionicPopup,
    $ionicActionSheet, $q, $ionicNavBarDelegate, $timeout, LsCommon,
    OrderMngr, DishMngr) {

    if (window.wizSpinner) {
      window.wizSpinner.setBackPreventingText({
        'title': '离开订座',
        'text': '现在离开，订座信息将被清空噢!',
        'negative': '确定',
        'neutral': '继续订座'
      });
    }

    var skipTimeSelectorReset = 1;
    var shopId = $stateParams.shopId;
    var timezoneOffset = new Date().getTimezoneOffset();

    if (!lsglobal.globalTitle) {
      $scope.title = lsglobal.globalTitle = '在线订座';
    } else {
      $scope.title = lsglobal.globalTitle;
    }
    $scope.startFrom = lsglobal.startFrom;
    $scope.form = {};

    //表单模式
    $scope.formMode = $state.is('dingzuo.modify') ? 'modify' : 'empty';
    //控制顶部导航
    $scope.currentStep = 1;
    //生成一个临时订单/获取前一步的临时订单
    $scope.order = OrderMngr.getUnsavedOrder(shopId);
    //取临时订单中的用户信息与UI绑定
    $scope.info  = angular.copy($scope.order.info);
    //座位类别
    $scope.seatTypes = OrderMngr.SEAT_TYPES;
    //日期选择器: 中餐/晚餐
    $scope.lunchOrDinner = 'lunch';
    //日期选择器: 当前时间(小时:分钟)
    $scope.currentTimeString = '';
    //日期选择器: 选中时间(小时:分钟)
    $scope.selectedTimeString = '';
    //日期选择器: 当前时间(Date, 强制东八区非标准时, 用于显示)
    $scope.selectedTime = new Date();
    //日期选择器: 今日的日期(Date, 强制东八区非标准时, 用于显示)
    $scope.baseDate = new Date();
    //日期选择器: 一周内的日期数组(Date, 强制东八区非标准时, 用于显示)
    $scope.dates = [];


    //若未填写则从API取上次订单的个人信息
    if (Object.keys($scope.info).length == 0) {
      var def = {
        persons: 4,
        seat:    1
      };
      $scope.info = def;

      var refreshOrderUserInfo = function() {
         OrderMngr.fetchLastOrderUserInfo().then(function (ret) {
          $scope.info = ret.message;
          if (!$scope.info.title) {
            $scope.info.title = 2;
          }
        }).catch(function (err) {
          if (err.status == 401) {
            $scope.needLogin = true;
            if (window.wizSpinner) {
              window.wizSpinner.showLogin(function () {
                $scope.needLogin = false;
                refreshOrderUserInfo();
              });
            }
          }
          $scope.info = {};
        }).finally(function(ret) {
          angular.extend($scope.info, def);
        });
      };


      refreshOrderUserInfo();

    }

    //取订餐信息(订餐时段)
    var q1 = DishMngr.fetchDishInfo(shopId)
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
        $scope.timespans  = dishInfo.timespans;
        $scope.discount   = dishInfo.discount;
        $scope.balcony_nums = dishInfo.balcony_nums;

        if (angular.isArray($scope.timespans)) {
          $scope.timespans.sort();
        }
      });

    //服务器时间同步
    var q2 = OrderMngr.syncTime()
      .then(function(ret) {
        var time = new Date(ret);
        time.setMinutes(time.getMinutes() - (-480 - timezoneOffset));
        var hour = time.getHours();
        if (hour >= 17) {
          $scope.lunchOrDinner = 'dinner';
        } else {
          $scope.lunchOrDinner = 'lunch';
        }
        $scope.currentTimeString = sprintf('%02d:%02d', hour, time.getMinutes());

        //创建一周内的日期数组
        var date = new Date(time);
        date.setMinutes(0);
        date.setHours(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        $scope.baseDate = new Date(date);
        $scope.selectedTime = new Date(date);

        var day = date.getDate();
        for (var i = 0; i < 7; i++) {
          var d = new Date($scope.baseDate);
          d.setDate(day + i);
          $scope.dates.push(d);
        }

        $scope.form.selectedDateIdx = 0;
      });

    //修改订餐信息中的称谓
    $scope.changeInfoTitle = function(title) {
      $scope.info.title = title;
    };

    //修改订餐信息中的座位
    $scope.changeInfoSeat = function(seat) {
      if (seat == 2 && $scope.info.persons < $scope.balcony_nums) {
        return;
      }
      $scope.info.seat = seat;
    };

    //修改订餐时间, 并确认
    $scope.changeInfoTime = function(timespan) {
      $scope.selectedTimeString = timespan;
      timespan = timespan.split(':');
      $scope.selectedTime.setHours(parseInt(timespan[0]));
      $scope.selectedTime.setMinutes(parseInt(timespan[1]));
      $scope.selectedTime.setSeconds(0);
      $scope.selectedTime.setMilliseconds(0);

      var weeks = '日一二三四五六';
      var time = new Date($scope.selectedTime);
      $scope.info.strTime = sprintf('%02d月%02d日 星期%s %02d:%02d', time.getMonth()+1, time.getDate(), weeks[time.getDay()], time.getHours(), time.getMinutes());
      time.setMinutes(time.getMinutes() + (-480 - timezoneOffset));
      $scope.info.time = Math.round(time.valueOf() / 1000);
      $scope.closeTimeSelector();
    };

    //修改订餐日期
    $scope.changeInfoDate = function(date) {
      $scope.form.selectedDateIdx = $scope.dates.indexOf(date);
      $scope.selectedTime.setFullYear(date.getFullYear());
      $scope.selectedTime.setMonth(date.getMonth());
      $scope.selectedTime.setDate(date.getDate());
      $scope.selectedTime.setHours(0);
      $scope.selectedTime.setMinutes(0);
      $scope.selectedTime.setSeconds(0);
      $scope.selectedTime.setMilliseconds(0);
      $scope.selectedTimeString = '';
    };

    //判断上午/下午，及默认时间选择
    $q.all([q1, q2]).then(function() {
      var timespan;
      if (angular.isArray($scope.timespans)) {
        for (var i = $scope.timespans.length - 1; i >= 0; i--) {
          timespan = $scope.timespans[i];
          if (timespan < '17:00') {
            break;
          }
        }
      } else {
        timespan = $scope.timespans;
      }

      if (timespan && $scope.currentTimeString > timespan) {
          $scope.lunchOrDinner = 'dinner';
      }

      var search = angular.copy($scope.timespans);
      search.push($scope.currentTimeString);
      search.sort();
      var autoTime = search[search.indexOf($scope.currentTimeString)+1];
      if (autoTime) {
        $scope.changeInfoTime(autoTime);
      } else {
        $scope.changeInfoDate($scope.dates[1]);
        $scope.changeInfoTime($scope.timespans[0]);
      }
      $scope.loadingStatus = LsCommon.LOADING_COMPLETE;
    });

    //提交订单
    $scope.orderSubmit = function () {
      var pop = null;
      if (!$scope.info.time) {
        pop = $ionicPopup.alert({
          title: '提示',
          okText: '确定',
          template: '<center>请选择就餐时间</center>'
        });
      }

      if (!$scope.info.persons) {
        pop = $ionicPopup.alert({
          title: '提示',
          okText: '确定',
          template: '<center>请选择就餐人数</center>'
        });
      }

      if (!$scope.info.seat) {
        pop = $ionicPopup.alert({
          title: '提示',
          okText: '确定',
          template: '<center>请选择座位环境</center>'
        });
      }

      if (!$scope.info.name) {
        pop = $ionicPopup.alert({
          title: '提示',
          okText: '确定',
          template: '<center>请选择填写预订人姓名</center>'
        });
      }

      if (!$scope.info.mobile) {
        pop = $ionicPopup.alert({
          title: '提示',
          okText: '确定',
          template: '<center>请选择填写预订人手机号码</center>'
        });
      }
      
      if(pop) {
        $timeout(function() {
          pop.close();
        }, 2000);
        return;
      }



      $scope.order.info = $scope.info;
      if ($scope.formMode == 'modify') {
        $ionicNavBarDelegate.back();
      } else {
        if (in_array($scope.order.info['mobile'], $scope.info['authorized_mobiles'])) {
          $state.go('^.confirm', {shopId: shopId});
        } else {
          $state.go('^.phonebind', {phone: $scope.order.info['mobile'], shop_id: shopId});
        }
      }
    };

    //判断是否为今天
    $scope.isToday = function(date) {
      return $scope.isSameDay($scope.baseDate, date);
    };

    //比较两个日期是否为同一天
    $scope.isSameDay = function(date1, date2) {
      if (!date1 || !date2) {
        return false;
      }

      return date1.getFullYear() == date2.getFullYear()
        && date1.getMonth() == date2.getMonth()
        && date1.getDate() == date2.getDate();
    };

    //获取邻近日期
    $scope.getNearlyDates = function () {
      var sel = $scope.form.selectedDateIdx || 0;
      if (sel == 0) {
        return $scope.dates.slice(0, 3);
      } else if ((sel + 1) == $scope.dates.length) {
        return $scope.dates.slice($scope.dates.length - 3, $scope.dates.length);
      } else {
        return $scope.dates.slice(sel-1, sel+2);
      }
    };


    //以下代码使用ionicModal定义一个时间选择器
    $ionicModal.fromTemplateUrl('time-selector.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalTimeSelector = modal;
    });
    //打开时间选择器
    $scope.openTimeSelector = function() {
      if ($scope.modalTimeSelector) {
        $scope.modalTimeSelector.show();
      }
    };
    //关闭时间选择器
    $scope.closeTimeSelector = function() {
      if ($scope.modalTimeSelector) {
        $scope.modalTimeSelector.hide();
      }
    };
    $scope.$on('$destroy', function() {
      if ($scope.modalTimeSelector) {
        $scope.modalTimeSelector.remove();
      }
    });
    $scope.$on('modal.hidden', function(e, t) {
      var ret = $(t.$el[0]).find('.time-selector');
      if (!ret.length) {
        return;
      }

      if (skipTimeSelectorReset) {
        skipTimeSelectorReset = 0;
        return;
      }

      var date;
      if ($scope.info.time) {
        date = new Date($scope.info.time*1000);
        date.setMinutes(date.getMinutes() - (-480 - timezoneOffset));
        $scope.selectedTimeString = sprintf('%02d:%02d', date.getHours(), date.getMinutes());
      } else {
        date = new Date($scope.baseDate);
      }

      $scope.form.selectedDateIdx = 0;
      for (var i = $scope.dates.length - 1; i >= 0; i--) {
        if ($scope.isSameDay(date, $scope.dates[i])) {
          $scope.form.selectedDateIdx = i;
          break;
        }
      }

      $scope.selectedTime = date;
    });
    $scope.$on('modal.removed', function() {
      // Execute action
    });



    //以下代码使用ionicModal定义一个日期选择器
    $ionicModal.fromTemplateUrl('date-selector.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalDateSelector = modal;
    });
    //打开时间选择器
    $scope.openDateSelector = function() {
      if ($scope.modalDateSelector) {
        $scope.modalDateSelector.show();
      }
    };
    //关闭时间选择器
    $scope.closeDateSelector = function() {
      if ($scope.modalDateSelector) {
        $scope.modalDateSelector.hide();
      }
      $timeout(function() {
        $scope.changeInfoDate($scope.dates[$scope.form.selectedDateIdx]);
      });
    };
    $scope.$on('$destroy', function() {
      if ($scope.modalDateSelector) {
        $scope.modalDateSelector.remove();
      }
    });




    //以下代码使用ionicModal定义一个人数选择器
    $ionicModal.fromTemplateUrl('persons-selector.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalPersonSelector = modal;
    });
    //打开时间选择器
    $scope.openPersonSelector = function() {
      skipTimeSelectorReset = 1;

      if ($scope.modalPersonSelector) {
        $scope.modalPersonSelector.show();
      }
    };
    //关闭时间选择器
    $scope.closePersonSelector = function() {
      if ($scope.modalPersonSelector) {
        $scope.modalPersonSelector.hide();
      }
      if ($scope.info.persons < $scope.balcony_nums) {
        $scope.info.seat = 1;
      }
    };
    $scope.$on('$destroy', function() {
      if ($scope.modalPersonSelector) {
        $scope.modalPersonSelector.remove();
      }
    });




  }]);
