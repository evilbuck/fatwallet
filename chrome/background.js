;(function(){
  var tddiumUrl = 'https://api.tddium.com/cc/88b9f80b5bbe2b868e322362762e8ec1666f1f76/cctray.xml',
    // TODO: let this come from localStorage eventually
    featurePrefix = /br\//,
    branches = {};

  function parseProject( projectNode ) {
    return { name: projectNode.attr('name'),
      lastBuildTime: projectNode.attr('lastBuildTime'),
      activity: projectNode.attr('activity') }
  }

  // TODO: show notification; change popup html
  function handleBranchChange(argument) {
    // body...  
  }
  function fetchStatus(){
    $.ajax({
      url: tddiumUrl,
      success: function(res) {
        var featureBranches = $(res).find('Project').map(function(item) {
          if ( featurePrefix.test( $(this).attr('name') ) ) { return this; }
        });

        $(featureBranches).each(function(){
          // TODO: change icon
          var $branch = $(this),
            name = $branch.attr('name'),
            notification = webkitNotifications.createNotification(
              'icon.png',
              name,
              name + ": " + $branch.attr('lastBuildStatus') || $branch.attr('activity')
            ),
            project = parseProject( $branch );

          if ( ! _.has(branches, name) ) {
            branches[ name ] = project;
            notification.show();
          } else if ( ! _.isEqual(branches[name], project) ) {
            branches[ name ] = project;
            notification.show();
          }
        });
      },
      dataType: 'xml'
    })
  }
  _.defer(fetchStatus);
  setInterval(fetchStatus, 1 * 1000 * 60);
})();
