ls_factory('data.DishMngr',
  function(LsAPI, $q) {
    var dishCaches = {};

    return {
      sendCheckcode: function(phone) {
        return LsAPI.get('dish/send_checkcode', {phone: phone});
      },
      submitCheckcode: function(phone, checkcode) {
        return LsAPI.get('dish/submit_checkcode', {phone: phone, checkcode: checkcode});
      },
      fetchDishInfo: function(shopId, forceReload) {
        if (angular.isUndefined(forceReload)) {
          forceReload = false;
        }

        if (!forceReload && dishCaches[shopId]) {
          var defer = $q.defer();
          defer.resolve({type:'SUCCESS', status:0, message:dishCaches[shopId]});
          return defer.promise;
        }

        return LsAPI.get('dish/info', {id: shopId}).then(function(ret) {
          if (!ret.status) {
            dishCaches[shopId] = ret.message;
          }

          return ret;
        });
      }
    };
  });