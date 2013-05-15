;(function($){
  var youtuberUrl, $button, $router, loaderImageUrl, user_uid;

  user_uid = localStorage.getItem('user:uid');
  if (! user_uid ) {
    chrome.runtime.sendMessage({call: 'user.uid'}, function(res) {
      var user_uid = res;
      localStorage.setItem('user:uid', user_uid);
    });
  }
  // this object exists to publish events
  $router = $({});

  youtuberUrl = 'http://localhost:4000';
  //youtuberUrl = 'http://daily-news10.com';
  loaderImageUrl = chrome.extension.getURL("images/ajax-loader.gif");
  
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

  // subscribe to the download
  $router.on('download:start.button', function(jqEvent) {
    $button.find('span').html('<img src="' + loaderImageUrl + '" style="margin-right: 4px; width: 16px; height: 16px"/>downloading');
    $.ajax({
      url: youtuberUrl + '/queue',
      type: 'get',
      data: { video_url: location.href, uid: localStorage.getItem('user:uid') },
      success: function(res){
        if (res.errors.length > 0) {
          $router.trigger("download:fail", [res.errors]);
        } else {
          $router.trigger('download:done', [res.files]);
        }
      },
      // handle errors
      error: function(res){
        $router.trigger('download:fail');
      },
      dataType: 'json'
    });
  });

  $router.on('download:done', function(jqEvent, files){
    $button.find('span').text('done');
    window.top.location.href = youtuberUrl + "/download/" + encodeURIComponent( files[0] );
  });

  $router.on('download:fail', function(jqEvent, errors) {
    $button.find('span').text('Youtubr is sorry :(');
    alert("We're having trouble downloading this for you. Please try a different video :(.");
  });

  // add handler to button
  $button.on('click.download', function(jqEvent){
    var $this = $(this);

    $this.off('click.download');
    
    $router.trigger('download:start');
  });
  
  $button.appendTo('#watch7-user-header');
})(jQuery);
