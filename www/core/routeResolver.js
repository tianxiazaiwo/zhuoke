define(function () {
    /**
     * this service returns a valid route definition object
     * for the angular route 'when' method
     *
     * @type {*|module}
     */
    angular.module('routeResolver', [])

        .provider('routeResolver', function () {

            this.$get = function () {
                return this;
            };

            /**
             * configuration object
             */
            this.routeConfig = (function () {

                var serviceDirectory = 'services/',
                    viewsDirectory = 'features/',

                    setServiceDirectory = function (serviceDir) {
                        serviceDirectory = serviceDir + '/';
                    },

                    getServiceDirectory = function () {
                        return serviceDirectory;
                    },

                    setViewsDirectory = function (viewsDir) {
                        viewsDirectory = viewsDir + '/';
                    },

                    getViewsDirectory = function () {
                        return viewsDirectory;
                    };

                return {
                    setServiceDirectory: setServiceDirectory,
                    getServiceDirectory: getServiceDirectory,
                    setViewsDirectory: setViewsDirectory,
                    getViewsDirectory: getViewsDirectory

                };
            }());

            /**
             * build and return the route defniation object
             */
            this.route = function (routeConfig) {

                var resolve = function (view, services) {
                        if (arguments.length == 1 && (Array.isArray(view))) {
                            services = view;
                            view = '';
                        }

                        var pathComponents = view.split('.');
                        var name = pathComponents.pop();
                        var path = pathComponents.join('/');
                        var pkg  = pathComponents.join('.');
                        var ucName = name.charAt(0).toUpperCase() + name.slice(1);
                        ucName = ucName.replace(/[-](.)/g, function(m) {return m[1].toUpperCase();});

                        var viewDir = path + '/';
                        var routeDef = {};

                        if (ucName) {
                            routeDef.templateUrl = routeConfig.getViewsDirectory() + viewDir + name + '.html?v='+lsconfig.jsver;
                            routeDef.controller = pkg + '.' + ucName + 'Ctrl';
                        }

                        routeDef.resolve = {

                            load: ['$q', '$rootScope', function ($q, $rootScope) {

                                /**
                                 * init the dependencies array
                                 * @type {Array}
                                 */

                                var dependencies = [];

                                if (name) {
                                    dependencies.push(routeConfig.getViewsDirectory() + viewDir + name + '.js');
                                }

                                /**
                                 * add services to dependencies array
                                 */
                                if (services) {
                                    var service;
                                    for (service in services) {
                                        if (services.hasOwnProperty(service)) {
                                            var spathComponents = services[service].split('.');
                                            var sname = spathComponents.pop();
                                            var spath = spathComponents.join('/');
                                            var path;
                                            if (spath) {
                                                path = routeConfig.getServiceDirectory() + spath + '/' + sname + '.js';
                                            } else {
                                                path = routeConfig.getServiceDirectory() + sname + '.js';
                                            }
                                            dependencies.push(path);
                                        }
                                    }
                                }
                                return resolveDependencies($q, $rootScope, dependencies);
                            }]
                        };

                        return routeDef;
                    },

                    /**
                     * load the required dependencies, resolve
                     * a promise on sucsses
                     * @param $q
                     * @param $rootScope
                     * @param dependencies
                     * @returns {Function|promise}
                     */
                        resolveDependencies = function ($q, $rootScope, dependencies) {
                        var defer = $q.defer();
                        require(dependencies, function () {
                            defer.resolve();
                            $rootScope.$apply();
                        });

                        return defer.promise;
                    };

                return {
                    resolve: resolve
                };

            }(this.routeConfig);

        });
});
