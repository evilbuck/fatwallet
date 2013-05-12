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

  // this object exists to publish events
  var $router = $({});

  // subscribe to 
  $router.on('download:start.button', function(jqEvent) {
    // disable the downloading
    //this.off('download:start.button');

    $.ajax({
      url: youtuberUrl + '/queue',
      data: { video_url: location.href },
      success: function(res){
        $router.trigger('download:done', [res.files]);
      },
      // handle errors
      error: function(res){
        alert('Sorry, there was an error downloading this file.');
      },
      dataType: 'json'
    });
  });

  $router.on('download:done', function(jqEvent, files){
    $button.find('span').text('done');
    window.top.location.href = youtuberUrl + "/download/" + encodeURIComponent( files[0] );
  });

  // add handler to button
  $button.on('click.download', function(jqEvent){
    var $this = $(this);

    $this.off('click.download');
    $this.find('span').text('downloading');
    
    $router.trigger('download:start');
  });
  
  $button.appendTo('#watch-headline-title');
})(jQuery);
