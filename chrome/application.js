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
    this.$deals = $toolbar.find('.deals');
    $logo =  $toolbar.find('.icon-logo');
    $logo.width(140);
    $close_btn = $toolbar.find('.close-button');
    $toolbar.hide();

    $logo.click(function(){
      if ( self.$('.deals .deal').size() === 1 ) {
        return self.$('.deals .deal').click();
      }
      //self.toggle_deals();
    });

    $close_btn.click(function(){
      self.destroy();
    });
   
    this.get_uid();
    this.register_listener();

  };

  App.prototype.register_listener = function() {
    var self = this;
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
      switch( request.call ) {
        case "toggle_deals":
          self.toggle_deals();
          break;

        case "build_deals":
          $(request.data).each(function( index ){
            var item = this;
            $('<div class="deal ' + (index % 2 ? 'alt' : '' ) + '">' + 
               this.v + '</div>')
              .click(function(){
              location.href = "http://fatwallet.com/" + item.u;
            }).appendTo( self.$deals );
          });

          $('body').append( self.$toolbar );
          self.$toolbar.css( 'opacity', 1 );

          break;

        default:
          throw "unknown request"
      }

    });
  };

  App.prototype.toggle_deals = function() {
    this.$().css('opacity') < .5 ? this.$().css({ opacity: 1 }) : this.$().css('opacity', 0);
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
    return this.toggle_deals();
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

  new App();
  $(function(){
    //var fatwalletApp = new App();
    //if (ENVIRONMENT === 'development') global.fatwalletApp = fatwalletApp;
  });
}).call(this);
