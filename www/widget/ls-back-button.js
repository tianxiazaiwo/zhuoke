ls_directive('lsBackButton',
    function($animate, $rootScope, $sanitize, $ionicNavBarConfig, $ionicNgClick) {
        var isBackClicked = false;
        $rootScope.$on('$viewHistory.historyChange', function(e, data) {
            if (isBackClicked) {
                lsconfig.history_size --;
            } else {
                lsconfig.history_size ++;
            }

            isBackClicked = false;
        });
        return {
            restrict: 'E',
            require: '^ionNavBar',
            compile: function(tElement, tAttrs) {
                tElement.addClass('button back-button');
                tElement.removeClass('ng-hide');

                var hasIconChild = !! (tElement.html() || '').match(/class=.*?ion-/);

                return function($scope, $element, $attr, navBarCtrl) {

                    // Add a default back button icon based on the nav config, unless one is set
                    if (!hasIconChild && $element[0].className.indexOf('ion-') === -1) {
                        $element.addClass($ionicNavBarConfig.backButtonIcon);
                    }

                    //Default to ngClick going back, but don't override a custom one
                    if (!angular.isDefined($attr.ngClick)) {
                        $ionicNgClick($scope, $element, function () {

                            if (lsconfig.history_size > 0) {
                                isBackClicked = true;
                                navBarCtrl.back();
                            } else {
                                if (window.wizSpinner) {
                                  window.wizSpinner.exitApp();
                                }
                            }
                        });
                    }

                };
            }
        };
    });