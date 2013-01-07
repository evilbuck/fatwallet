// TODO: 
// - allow changing the branches to watch
// - create a details page about the branches 
//

;(function(){
  var tddiumUrl = 'https://api.tddium.com/cc/88b9f80b5bbe2b868e322362762e8ec1666f1f76/cctray.xml',
    // TODO: let this come from localStorage eventually
    featurePrefix = new RegExp( localStorage.getItem('branchPattern') ),
    branches = {};

  function parseProject( projectNode ) {
    return { name: projectNode.attr('name'),
      lastBuildTime: projectNode.attr('lastBuildTime'),
      activity: projectNode.attr('activity'),
      webUrl: projectNode.attr('webUrl'),
      lastBuildStatus: projectNode.attr('lastBuildStatus') };
  }

  // TODO: show notification; change popup html
  function updateBranches($branch) {
    var name = $branch.attr('name'),
      project = parseProject( $branch ),
      notification;

      notification = webkitNotifications.createNotification(
        '/images/fire.png',
        $branch.attr('lastBuildStatus') || name,
        name + ": " + $branch.attr('lastBuildStatus') || $branch.attr('activity')
      );

    if ( ! _.has(branches, name) ) {
      branches[ name ] = project;
      notification.show();
    } else if ( new Date(branches[name].lastBuildTime) < new Date(project.lastBuildTime)) {
      branches[ name ] = project;
      notification.show();
    }
    
    // update pageAction page
    // TODO: look into a better way to pass the data to the browserAction page
    
    localStorage.setItem('branches', JSON.stringify(branches));
  }

  function fetchStatus(){
    $.ajax({
      url: tddiumUrl,
      cache: false,
      success: function(res) {
        var featureBranches = $(res).find('Project').map(function(item) {
          if ( featurePrefix.test( $(this).attr('name') ) ) { return this; }
        });

        $(featureBranches).each(function(){
          // TODO: change icon
          var $branch = $(this);
          updateBranches($branch);
        });
        chrome.browserAction.setPopup({popup: 'browser_action.html'});
      },
      dataType: 'xml'
    });
  }
  _.defer(fetchStatus);
  setInterval(fetchStatus, 1 * 1000 * 60);
})();
