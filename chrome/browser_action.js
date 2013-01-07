$(function(){
  var branches = JSON.parse( localStorage.getItem('branches') || '{}' );
  var $messages = $('<ul></ul>');
  $('.messages').html('').append($messages);

  branches = _.values( branches ).sort(function(a, b) {
    if (! a.lastBuildTime ) { return true; }
    if (! b.lastBuildTime ) { return false; }
    
    return new Date(a.lastBuildTime) < new Date(b.lastBuildTime);
  });

  for(branchName in branches) {
    var branch = branches[ branchName ],
      className;
    switch(branch.lastBuildStatus) {
      case "Success":
        className = 'success';
        break;

      case "Failure":
        className = 'important'
        break;
      default:
        className = '';
    }

    label = (className) ? '<span class="label label-' + className + '">' + className + '</span>' : '';
    $messages.append(
      '<li class="' + className + '">' +
      label +
      (branch.lastBuildTime || '') + ' ' +
      branch.name.replace(/Oceans/, '') + ': ' + (branch.lastBuildStatus || '') + '</li>'
    ).click((function(url){
      return function(){
        window.open( url );
      }
    })(branch.webUrl));
  }
});

