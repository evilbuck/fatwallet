(function(){

  var App = function(){
    var $toolbar, $deals, 
      $logo,
      self = this;
    
    this.$toolbar = $toolbar = $(
      '<div class="c2b-toolbar">' + 
        '<div class="icon-logo"/>' +
        '<div class="deals"/>' +
      '</div>'
    );
    $deals = $toolbar.find('.deals');
    $logo =  $toolbar.find('.icon-logo');


    $logo.click(function(){
      console.log( 'clicked' );
      self.show_deals();
    });
    
    // check the host against fatwallet
    $.ajax({
      url: "http://www.fatwallet.com/query/autocomplete_store_category.php",
      data: { q: window.location.host.replace(/^www\.(.+?)\..{2,4}$/, '$1') },
      success: function(data, textStatus, jqXHR) {
        $(data).each(function(){
          var item = this;
          $('<div class="deal">' + this.v + '</div>').click(function(){
            location.href = "http://fatwallet.com/" + item.u;
          }).appendTo($deals);
        });

        $('body').append( $toolbar );
      },
      dataType: 'json'
    });
  };

  App.prototype.show_deals = function() {
    this.$('.deals').show();
  };

  App.prototype.$ = function(selector) {
    return $(selector, this.$toolbar);
  };

  $(function(){
    new App();
  });
}).call(this);
