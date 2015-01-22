ls_factory('LsAPI',
  function($http, $q) {

    function makeUrl (url) {
      if (lsconfig.api_debug) {
        return 'http://food.guxy.365jia.lab/api/' + url + '.json';
      } else {
        return 'http://food.365jia.cn/api/' + url + '.json';
      }
    }

    function processResponse(resp) {
      return resp.then(function(resp) {
          if (!resp) {
            return $q.reject({type: 'ERROR', status: -1, message: 'No Response!!!'});
          }

          if (resp.status != 200) {
            return $q.reject({type: 'ERROR', status: -resp.status, message: 'Http Error!!!'});
          }

          resp = resp.data;
          if (!resp) {
            return $q.reject({type: 'ERROR', status: -1, message: 'No Response!!!'});
          }

          return resp;
        });
    }


    return {
      post: function(url, params, config) {
        if (angular.isObject(params)) {
          //remove fields like functions
          params = JSON.parse(JSON.stringify(params));
          //build query
          params = http_build_query(params).trim();
        }

        if (!angular.isObject(config)) {
          config = {};
        }

        if (!angular.isObject(config.headers)) {
          config.headers = {};
        }

        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        var url = makeUrl(url);
        return processResponse($http.post(url, params, config));
      },
      postJSON: function(url, params, config) {
        if (angular.isObject(params)) {
          //remove fields like functions
          params = JSON.parse(JSON.stringify(params));
        }

        if (!angular.isObject(params)) {
          params = null;
        }

        var url = makeUrl(url);
        return processResponse($http.post(url, params, config));
      },
      get: function(url, params, config) {
        if (angular.isString(params)) {
          //make sure all is urlencoded
          var temp = {};
          parse_str(params, temp);
          params = temp;
        }

        if (angular.isObject(params)) {
          params = http_build_query(params).trim();
        }

        if (!angular.isString(params)) {
          params = '';
        }

        var url = makeUrl(url);
        if (params) {
          url += '?' + params;
        }

        return processResponse($http.get(url, config));
      }
    };
  });