$(function(){
  $('#branch_pattern').val( localStorage.getItem('branchPattern') || '' );
  $('button').click(function(){
    var branchPattern = $('#branch_pattern').val().trim();
    localStorage.setItem('branchPattern',  branchPattern);
    // TODO: run the fetchStatus with the new branchPattern
    $('.container').append(
      '<div class="alert alert-success fade in">' +
      '<button type="button" class="close" data-dismiss="alert">x</button>' +
      '<span>' + branchPattern + ' was saved.</span></div>'
    );
    setTimeout(function(){
      $('.container .alert:contains(' + branchPattern +')').alert('close');
    }, 3000);
  });
});
