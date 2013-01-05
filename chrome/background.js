;(function(){
  var tddiumUrl = 'https://api.tddium.com/cc/88b9f80b5bbe2b868e322362762e8ec1666f1f76/cctray.xml',
    // TODO: let this come from localStorage eventually
    featurePrefix = /br\//;
  
  function fetchStatus(){
    $.ajax({
      url: tddiumUrl,
      success: function(res) {
        var featureBranches = $(res).find('Project').map(function(item) {
          if ( featurePrefix.test( $(this).attr('name') ) ) { return this; }
        });

        $(featureBranches).each(function(){
          var $branch = $(this),
            name = $branch.attr('name');

          // TODO: change icon
          console.log( $branch.attr('name'), $branch.attr('activity'), $branch.attr('lastBuildStatus') || 'N/A' );
          webkitNotifications.createNotification(
            'icon.png',
            name,
            name + ": " + $branch.attr('lastBuildStatus') || $branch.attr('activity')
          ).show();
        });
      },
      dataType: 'xml'
    })
  }
  _.defer(fetchStatus);
  setInterval(fetchStatus, 1 * 1000 * 60);
})();
