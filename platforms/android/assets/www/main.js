/**
 * app entry point. loads al the main files nedded for
 * the application to start and bootstrap the application main module
 */


//core imports
var imports = ['route-resolver', 'oc-lazy-load', 'app', 'bindonce'];

//add common import!!
var common_imports = {
  'LsAPI': 'services/LsAPI',
  'LsCommon': 'services/LsCommon',
  'LsFilters': 'services/LsFilters'
};

//add widgets here!!
var widgets = [
  'ls-nav-clear',
  'ls-back-button'
];

var lsglobal = {};

//do not touch this!!
(function () {
  var paths = {
    'route-resolver'  : 'core/routeResolver',
    'oc-lazy-load'    : 'core/ocLazyLoad',
    'bindonce'        : 'core/bindonce',
    'app'             : 'app'
  };

  for (var i in common_imports) {
    paths[i] = common_imports[i];
    imports.push(i);
  }

  for (var i in widgets) {
    paths[widgets[i]] = 'widget/' + widgets[i];
    imports.push(widgets[i]);
  }
  require.config({paths: paths});
})();

//do not touch this!!
require(imports,
  function () {
    angular.bootstrap(document, ['app']);
  });


//short defined
function ls_directive() {
  var args = arguments;
  define(['app'], function (app) {
    app.directive.apply(this, args);
  });
}

function ls_filter() {
  var args = arguments;
  define(['app'], function (app) {
    app.filter.apply(this, args);
  });
}

function ls_app(func) {
  define(['app'], function (app) {
    func(app);
  });
}

function ls_factory() {
  var args = arguments;
  define(['app'], function (app) {
    app.factory.apply(this, args);
  });
}

function ls_module() {
  var args = arguments;
  define(['app'], function (app) {
    app.module.apply(this, args);
  });
}

function ls_service() {
  var args = arguments;
  define(['app'], function (app) {
    app.service.apply(this, args);
  });
}

function ls_controller() {
  var args = arguments;
  define(['app'], function (app) {
    app.controller.apply(this, args);
  });
}
