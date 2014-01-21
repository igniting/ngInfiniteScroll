/* ng-infinite-scroll - v1.0.0 - 2014-01-21 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, container, handler, scrollDistance, scrollEnabled, value;
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
        container = $window;
        if (attrs.infiniteScrollContainer != null) {
          value = $("." + attrs.infiniteScrollContainer);
          if (value != null) {
            container = value;
          } else {
            throw new Exception("invalid infinite-scroll-container attribute.");
          }
        }
        handler = function() {
          var containerBottom, containerTop, elementBottom, elementTop, remainingBottom, remainingTop, shouldScrollDown, shouldScrollUp;
          if (container === $window) {
            containerBottom = container.height() + container.scrollTop();
            elementBottom = elem.offset().top + elem.height();
            containerTop = container.scrollTop();
          } else {
            containerBottom = container.height();
            elementBottom = elem.offset().top - container.offset().top + elem.height();
            containerTop = container.offset().top;
          }
          elementTop = elem.offset().top;
          remainingBottom = elementBottom - containerBottom;
          shouldScrollDown = remainingBottom <= container.height() * scrollDistance;
          remainingTop = containerTop - elementTop;
          shouldScrollUp = remainingTop <= container.height() * scrollDistance;
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
        container.on('scroll', handler);
        scope.$on('$destroy', function() {
          return container.off('scroll', handler);
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
