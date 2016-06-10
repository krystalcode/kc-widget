/**
 * Directives for the kcWidget module.
 *
 * @module kcWidget/directives
 */

angular.module('kcWidget')

  // A directive for rendering a group of widgets.
  .directive('kcWidgetGroup', function($templateCache, kcWidgetApiFactory) {

    return {
      restrict: 'E',
      template: $templateCache.get('kc-widget/directives/group.html'),
      scope: {
        group: '='
      },
      link: function(scope) {
        // Watch the 'group' variable that holds the ids of the widgets, so that
        // we can automatically fetch and render the new widgets when the
        // 'group' to render has changed.
        scope.$watch('group', function(newValue, oldValue) {

          // There's nothing to do if the new group is the same with the old
          // group, as the widgets must have already been rendered. We can get
          // the same 'group' if, for example, the 'group' is changing when the
          // user clicks on a UI element, and the user clicks twice on the same
          // element.
          // We also get the same values the first time the 'group' is given,
          // thus the check whether 'scope.widgets' is defined.
          if (scope.widgets && angular.equals(newValue, oldValue)) {
            return;
          }

          // Trigger the loading indicator.
          scope.dataReady = false;

          /**
           * @Issue(
           *   "Charts do not render when fetching data from the cache"
           *   type="bug"
           *   priority="low"
           *   labels="performance"
           * )
           */
          kcWidgetApiFactory
            .group(newValue._id, newValue.filters, false)
            .then(function success(data) {
              scope.widgets   = data.widgets;
              scope.dataReady = true;
            })
          ;

        });
      }
    }
  })

;
