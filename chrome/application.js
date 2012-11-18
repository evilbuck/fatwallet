(function(){

  var App = function(){
    var $toolbar = $('<div class="c2b-toolbar"/>');
    // check the host against fatwallet
    $.ajax({
      url: "http://www.fatwallet.com/query/autocomplete_store_category.php",
      data: { q: window.location.host.replace(/^www\.(.+?)\..{2,4}$/, '$1') },
      success: function(data, textStatus, jqXHR) {
        $(data).each(function(){
          var item = this;
          $('<div>' + this.v + '</div>').click(function(){
            location.href = "http://fatwallet.com/" + item.u;
          }).appendTo($toolbar);
        });

        $('body').append( $toolbar );
      },
      dataType: 'json'
    });
  };

  $(function(){
    new App();
  });
}).call(this);
