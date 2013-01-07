$(function(){
  var branches = JSON.parse( localStorage.getItem('branches') || '{}' );
  var $messages = $('<ul></ul>');
  $('.messages').html('').append($messages);

  for(branchName in branches) {
    var branch = branches[ branchName ],
      className;
    switch(branch.lastBuildStatus) {
      case "Success":
        className = 'success';
        break;

      case "Failure":
        className = 'failure'
        break;
      default:
        className = '';
    }

    $messages.append('<li class="' + className + '">' + branch.lastBuildTime + ' ' +
                     branch.name.replace(/Oceans/, '') + ': ' + (branch.lastBuildStatus || '') + '</li>')
      .click((function(url){
        return function(){
          window.open( url );
        }
      })(branch.webUrl));
  }
});

