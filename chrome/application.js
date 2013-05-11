;(function($){
  var youtuberUrl, $button;

  youtuberUrl = 'http://localhost:3000';
  // add a download button
  $button = $('<button><span class="yt-uix-button-content">download audio</span></button>');
  $button.css({
    color: 'rgb(51, 51, 51)',
    cursor: 'pointer',
    border: '1px solid rgb(204, 204, 204)',
    'border-radius': '2px',
    'background-image': 'linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%)',
    font: 'bold 12px "Arial", "sans-serif"',
    padding: '5px 6px'
  });

  // add handler to button
  $button.on('click.download', function(jqEvent){
    $.ajax({
      url: youtuberUrl + '/queue',
      data: { video_url: location.href },
      success: function(res){
        console.log(res);
        window.top.location.href = youtuberUrl + "/download/" + encodeURIComponent( res.files[0] );
      },
      // handle errors
      error: function(res){
        console.log(res);
      },
      dataType: 'json'
    });
  });
  
  $button.appendTo('#watch-headline-title');
})(jQuery);
