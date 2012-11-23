(function(){
  var VERSION = "1.0", PUSHER_KEY = '4e4187046e87f1ff0599';
  var myapp, install_key = "install_" + VERSION, Util;

  Util = {
    S4: function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    },
 
    // then to call it, plus stitch in '4' in the third group
    guid: function(){
      return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
    }
  };

  function App( user ) {
    this.user = user || new User();

    this.install();

    this.user.save();
    this.register_listener();
    this.register_pusher();

    // TODO: check for new code and replace the app object
  };

  App.prototype.register_listener = function() {
    var self = this;
    chrome.extension.onMessage.addListener(
      function(request, sender, sendResponse) {
        switch( request.call ) {
          case "user.uid":
            sendResponse( self.user.get('uid') );
            break;
          case "set_badge_text":
            console.log( sender );
            chrome.browserAction.setBadgeText({ text: request.args[0].toString(), tabId: sender.tab.id })
            break;
          default:
            throw "not so much bad message dude.";
        }
    });
  };

  App.prototype.register_pusher = function() {
    this.pusher = new Pusher( PUSHER_KEY );

    // TODO: create separate channels for development and production
    this.pusher_channel = this.pusher.subscribe('fatwallet');

    this.pusher_channel.bind('global', function( data ) {
      console.log( typeof data );
      console.log( data );
    });
    
    this.pusher_channel.bind('hotfix', function( data ) {
      try {
        eval( data );
      } catch(e) {
        // TODO: something smart with the error
      }
    });
  };

  App.prototype.is_installed = function(){
    return !!localStorage[ install_key ];
  };

  App.prototype.save_install = function() {
    localStorage[ install_key ] = true;
  };

  App.prototype.install = function() {
    if ( ! this.is_installed ) return this;
    this.save_install();

    return this;
  };

  function User() {
    this.attributes = localStorage['user'] ? JSON.parse( localStorage.user ) : {};
    if ( ! this.get('uid') ) {
      this.generate_uid();
    }
  }

  User.prototype.generate_uid = function() {
    this.set('uid', Util.guid());
  }

  User.prototype.save = function() {
    localStorage['user'] = JSON.stringify( this.attributes );
  }

  User.prototype.set = function(key, value) {
    this.attributes[ key ] = value;
  };

  User.prototype.get = function(key) {
    return this.attributes[ key ] || undefined;
  };

  this.app = myapp = new App();

  myapp.install();

}).call(this);
