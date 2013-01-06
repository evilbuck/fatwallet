$(function(){
  $('#branch_pattern').val( localStorage.getItem('branchPattern') || '' );
  $('button').click(function(){
    localStorage.setItem('branchPattern', $('#branch_pattern').val().trim() );
    $('.message span').text('successfully saved branch pattern');
    setTimeout(function(){
      $('.message span').fadeOut(250, function(){
        $(this).text('').show();
      });
    }, 2000);
  });
});
