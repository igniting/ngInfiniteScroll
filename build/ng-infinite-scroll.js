/* ng-infinite-scroll - v1.0.0 - 2014-01-07 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScrollDown, shouldScrollUp, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScrollDown = remaining <= $window.height() * scrollDistance;
          shouldScrollUp = $window.scrollTop() === 0;
          if (scrollEnabled) {
            if (shouldScrollUp) {
              if ($rootScope.$$phase) {
                return scope.$eval(attrs.infiniteScrollUp);
              } else {
                return scope.$apply(attrs.infiniteScrollUp);
              }
            } else if (shouldScrollDown) {
              if ($rootScope.$$phase) {
                return scope.$eval(attrs.infiniteScrollDown);
              } else {
                return scope.$apply(attrs.infiniteScrollDown);
              }
            }
          } else if (shouldScrollUp || shouldScrollDown) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);
