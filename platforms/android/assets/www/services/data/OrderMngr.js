ls_factory('data.OrderMngr',
  function(LsAPI, $q) {
    var unsaved = {};
    var timediff = 0;
    var lastTimeSyncAt = 0;

    return {
      SEAT_TYPES: {
        '1': '大厅',
        '2': '包厢'
      },
      TITLES: {
        '1': '女士',
        '2': '先生'
      },
      /**
       * 创建/获取临时订单
       */
      getUnsavedOrder: function(shopId) {
        var key = '' + shopId;
        if (unsaved[shopId]) {
          return unsaved[shopId];
        }

        return unsaved[shopId] = {
          info:     {},
          dishs:    {},
          cates:    {},
          selected: [],
          shopId:   parseInt(shopId),
          getTotalMoney: function() {
            var money = 0;
            for (var i = this.selected.length - 1; i >= 0; i--) {
              var obj = this.selected[i];
              obj = this.dishs[obj];
              if (!obj) continue;
              money += obj.price * obj.amount;
            }
            return money;
          },
          getTotalAmount: function() {
            if (!this.selected) {
              return 0;
            }

            if (!this.selected.length) {
              return 0;
            }

            var dishs = this.dishs;
            return this.selected.reduce(function(a, b) {
              return a + dishs[b].amount;
            }, 0);
          },
          getCateAmount: function(cate) {
            if (!this.cates[cate]) {
              return 0;
            }

            if (!this.cates[cate].length) {
              return 0;
            }

            var dishs = this.dishs;
            return this.cates[cate].reduce(function(a, b) {
              return a + dishs[b].amount;
            }, 0);
          },
          getDish: function(id) {
            return this.dishs[id];
          },
          getDishAmount: function(id) {
            var dish = this.getDish(id);
            if (!dish) {
              return 0;
            }
            return dish.amount;
          },
          getSelectedDishs: function(cate) {
            var ids = [];
            if (!cate) {
              ids = ids.concat(this.selected);
            } else {
              if (this.cates[cate]) {
                ids = ids.concat(this.cates[cate]);
              }
            }

            var dishs = this.dishs;

            return ids.map(function(idx) {
              return dishs[idx];
            });
          },
          containsDish: function(dish) {
            if (!angular.isNumber(dish)) {
              if (angular.isObject(dish)) {
                dish = dish.id;
              }
              if (!dish) {
                return false;
              }
            }

            return !!this.dishs[dish];
          },
          addDish: function(cate, dish) {
            var odish = dish;
            if (!angular.isNumber(dish)) {
              if (angular.isObject(dish)) {
                dish = dish.id;
              }
              if (!dish) {
                return;
              }
            }

            if (this.containsDish(dish)) {
              return;
            }

            //odish = angular.copy(odish);
            odish.amount = 1;
            this.dishs[dish] = odish;

            if (!this.cates[cate]) {
              this.cates[cate] = [];
            }
            this.cates[cate].push(dish);
            this.selected.push(dish);
          },
          removeDish: function(dish) {
            if (!angular.isNumber(dish)) {
              if (angular.isObject(dish)) {
                dish = dish.id;
              }
              if (!dish) {
                return;
              }
            }

            for (var i = this.selected.length - 1; i >= 0; i--) {
              var obj = this.selected[i];
              if (obj == dish) {
                this.selected.splice(i, 1);
                break;
              }
            }

            for (var i in this.cates) {
              var cdishs = this.cates[i];
              for (var j = cdishs.length - 1; j >= 0; j--) {
                var obj = cdishs[j];
                if (obj == dish) {
                  cdishs.splice(j, 1);
                  break;
                }
              }

              if (!cdishs || !cdishs.length) {
                delete this.cates[i];
              }
            }

            delete this.dishs[dish];
          }
        };
      },
      saveOrder: function(order) {
        var selected = {};
        for (var i = 0; i < order.selected.length; i++) {
          var id = order.selected[i];
          var dish = order.dishs[id];
          if (!dish) continue;

          selected[id] = dish.amount;
        }

        return LsAPI.postJSON('order/save', {info:order.info, selected:selected, shopId:order.shopId});
      },
      fetchMyOrders: function(page) {
        return LsAPI.get('order/my', {page: page});
      },
      cancelOrder: function(id) {
        return LsAPI.get('order/cancel', {id: id});
      },
      fetchDetail: function(id) {
        return LsAPI.get('order/detail', {id: id});
      },
      /**
       * 获取上次订餐用户基本信息
       */
      fetchLastOrderUserInfo: function() {
        return LsAPI.post('order/last_order_user_info');
      },
      /**
       * 时间同步
       */
      syncTime: function(force) {
        var now = new Date().valueOf();
        if (!force && Math.abs(now - lastTimeSyncAt) < 30000) {
          var defer = $q.defer();
          defer.resolve(this.getServerTime());
          return defer.promise;
        }

        return LsAPI.post('order/sync_time').
          then(function(ret) {
            lastTimeSyncAt = new Date().valueOf();
            timediff = ret.message - lastTimeSyncAt;
            return ret.message;
          });
      },
      getServerTime: function() {
        return timediff + new Date().valueOf();
      }
    };
  });
