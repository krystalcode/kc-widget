/**
 * Factories for the kcWidget module.
 *
 * @module kcWidget/factories
 */

angular.module('kcWidget')

  .factory('kcWidgetApiFactory', function($http, $q, kcApiFactory, CacheFactory) {
    // Get the api base url defined in the app through kcApiFactory.
    var baseUrl = kcApiFactory.baseUrl();

    // Define default api endpoints.
    /**
     * @Issue(
     *   "Merge any endpoints overrides defined in the app through kcApiFactory"
     *   type="improvement"
     *   priority="low"
     *   labels="modularity"
     * )
     */
    var endpoints = {
      group: 'widgets/groups/:id'
    };

    return {

      // Fetch a group of widgets.
      group: function(id, filters, useCache) {
        if (useCache == undefined) {
          useCache = true;
        }

        var params = {
          filters: filters
        };

        // Construct the url for this call.
        var url = kcApiFactory.prepareUrl(baseUrl + endpoints.group, { inline: { id: id }, query: params });

        /**
         * @Issue(
         *   "Support caching configuration incl. enabling/disabling cache and
         *   cache duration"
         *   type="improvement"
         *   priority="normal"
         *   labels="configuration management"
         * )
         */
        var deferred = $q.defer();
        var data     = null;
        var cache    = CacheFactory.get('weeklyCache');
        var cacheKey = '/widgets/groups/' + id + '/' + JSON.stringify(params);

        // Try to get the data from the cache first.
        if (useCache) {
          data = cache.get(cacheKey);
          if (data) {
            deferred.resolve(data);
          }
        }

        // If it is requested not to use the cache, or the cache did not return
        // valid data, get the data from the server.
        if (!useCache || !data) {
          $http
            .get(url)
	    .success(function(data, status) {
              // Cache the results.
              cache.put(cacheKey, data);

	      // Use global default resolution.
	      kcApiFactory.resolveResponse(deferred, data, status);
	    })
	    .error(function(data, status) {
	      // Use global default rejection.
	      kcApiFactory.rejectResponse(deferred, status);
	    })
          ;
        }

        // Return the promise so that .then can be used in the controller.
        return deferred.promise;
      }

    }

  })

;
