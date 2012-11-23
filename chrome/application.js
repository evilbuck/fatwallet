(function(){
  var ENVIRONMENT = 'development';
  var global = this, 
  App = function(){
    var $toolbar, $deals, 
      $logo, $close_btn,
      self = this;
    
    this.$toolbar = $toolbar = $(
      '<div class="c2b-toolbar">' + 
        '<div class="icon-logo" title="Fatwallet offers cashback here.">' +
          '<div class="c2b-headline">Cashback Available!</div>' +
        '</div>' +
        '<div class="close-button" title="close"/>' +
        '<div class="deals"/>' +
      '</div>'
    );
    $deals = $toolbar.find('.deals');
    $logo =  $toolbar.find('.icon-logo');
    $logo.width(140);
    $close_btn = $toolbar.find('.close-button');
    $toolbar.hide();

    $logo.click(function(){
      if ( self.$('.deals .deal').size() === 1 ) {
        return self.$('.deals .deal').click();
      }
      self.toggle_deals();
    });

    $close_btn.click(function(){
      self.destroy();
    });
   
    this.get_uid();
    
    // check if we've shown this recently
    //if ( this.stand_down() ) return this;

    // TODO: abstract this functionality
    // check the host against fatwallet
    $.ajax({
      url: "http://www.fatwallet.com/query/autocomplete_store_category.php",
      data: { q: window.location.host.replace(/^www\.(.+?)\..{2,4}$/, '$1') },
      success: function(data, textStatus, jqXHR) {
        // don't do anything if no results are returned
        if ( !data.length ) return;
        
        // TODO: set badge text
        self.set_badge_text( data.length );

        $(data).each(function( index ){
          var item = this;
          $('<div class="deal ' + (index % 2 ? 'alt' : '' ) + '">' + 
             this.v + '</div>')
            .click(function(){
            location.href = "http://fatwallet.com/" + item.u;
          }).appendTo( $deals );
        });

        $('body').append( $toolbar );
        $toolbar.fadeIn( 300 );

        self.record_shown();
      },
      dataType: 'json'
    });

  };

  App.prototype.set_badge_text = function(text) {
    chrome.extension.sendMessage({ call: 'set_badge_text', args: [ text ] }, function(response) {
      
    });
  };

  App.prototype.toggle_deals = function() {
    this.$('.deals').toggle();
    //this.$('.deals').show().css({ height: 'auto' });
  };

  App.prototype.record_shown = function() {
    localStorage.setItem('last_shown', new Date());
  };

  App.prototype.stand_down = function() {
    var last_shown = localStorage.getItem('last_shown');
    if ( ! last_shown || (new Date() - new Date(last_shown)) / 1000 / 60  > 60 ) {
      return false;
    }
    return true;
  };

  App.prototype.destroy = function(){
    this.$().fadeOut(250, function(){
      self.$().remove();
    });
    // TODO: remove the application instance and return memory
  };

  App.prototype.$ = function(selector) {
    return selector ? $(selector, this.$toolbar) : this.$toolbar;
  };

  App.prototype.get_uid = function() {
    var self = this;
    chrome.extension.sendMessage({ call: "user.uid" }, function(response) {
      self.uid = response;
    });
  };

  $(function(){
    var fatwalletApp = new App();
    //if (ENVIRONMENT === 'development') global.fatwalletApp = fatwalletApp;
  });
}).call(this);
