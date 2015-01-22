ls_directive('lsNavClear',
    ['$ionicViewService', '$state', '$location', '$window', '$rootScope', 'LsCommon',

    function($ionicViewService, $location, $state, $window, $rootScope, LsCommon) {
        $rootScope.$on('$stateChangeError', function() {
            $ionicViewService.nextViewOptions(null);
        });

        return {
            priority: 100,
            restrict: 'AC',
            compile: function($element) {
                return {
                    pre: prelink
                };

                function prelink($scope, $element, $attrs) {
                    function listenForStateChange() {
                        LsCommon.clearBackHistory($scope);
                    }

                    $element.on('click', listenForStateChange);
                }
            }
        };
    }]);