ls_app(function(app) {
  app.filter('ls_mapped_value', function() {
    return function (key, maps) {
      if (!maps) {
        return null;
      }
      return maps[key];
    };
  });

  app.filter('ls_number', function() {
    return function (n, fixed) {
      return Number(n).toFixed(fixed).replace(/0+$/, '').replace(/[.]$/, '');
    };
  });

  app.filter('ls_repeat', function() {
    return function (str, times) {
      var ret = '';
      for (var i = 0; i < times; i++) {
        ret += str;
      }
      return ret;
    };
  });

  app.filter('ls_img_url', function() {
    var URI_PARSER = document.createElement('a');

    return function (url, prefix) {
      url += '';

      var width=100, height=100;
      var m = prefix.match(/^(\d+)x(\d+)(.+)$/);
      if (m) {
        width = parseInt(m[1]);
        height = parseInt(m[2]);
        prefix = m[3];
      } else {
        m = prefix.match(/^(\d+)(.+)$/);
        if (m) {
          width = parseInt(m[1]);
          height = parseInt(m[1]);
          prefix = m[2];
        } else {
          prefix = '';
        }
      };


      var ratio = window.devicePixelRatio;
      var w = width * ratio;
      var h = height * ratio;
      if (w > 640) {
        h *= 640/w;
        w = 640;
      }

      w = Math.round(w);
      h = Math.round(h);

      var path = '';
      if (/^http:\/\//.test(url)) {
        URI_PARSER.href = url;
        url = URI_PARSER.pathname;
      }

      if (!/^\//.test(url)) {
        url = '/uploads/' + url;
      }

      var m = [];
      if (m = url.match(/([\s\S]+\/)([^\/]+)[.][^.]+/)) {
        var host = 'http://365jia.cn';
        if (lsconfig.api_debug) {
          host = 'http://guxy.365jia.lab';
        }
        return host + m[1] + '.' + m[2] + 't' + w + 'x' + h + prefix + '.jpg';
      }

      return 'img/none.gif';
    }
  });

  app.filter('ls_stringify_date', function() {
    return function (date, opts, base) {
      if (angular.isString(opts)) {
        opts = opts.split(',');
      }

      var base;
      if (angular.isUndefined(base)) {
        base = new Date();
        base.setMinutes(base.getMinutes() - (-480 - base.getTimezoneOffset()));
      } else {
        base = new Date(base);
      }

      var weeks = '日一二三四五六';
      var days  = '今明后';
      var str = sprintf('%02d-%02d', date.getMonth()+1, date.getDate());
      if (opts.indexOf('week') >= 0) {
        var friendly = '';
        for (var i = 0; i < 3; i++) {
          var d = new Date(base);
          d.setDate(d.getDate() + i);
          if (d.getMonth() == date.getMonth() && d.getDate() == date.getDate() && d.getFullYear() == date.getFullYear()) {
            friendly = days[i] + '天';
            break;
          }
        }

        if (opts.indexOf('friendly') >= 0 && friendly) {
          if (opts.indexOf('nr') >= 0) {
            return friendly + '\n' + str;
          } else if (opts.indexOf('br') >= 0) {
            return friendly + '<br/>' + str;
          } else {
            return friendly + ' ' + str;
          }
        } else {
          var week = '周' + weeks[date.getDay()];
          if (opts.indexOf('nr') >= 0) {
            return week + '\n' + str;
          } else if (opts.indexOf('br') >= 0) {
            return week + '<br/>' + str;
          } else {
            return week + ' ' + str;
          }
        }
      }

      return null;
    };
  });

});