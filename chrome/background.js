(function(){
  var VERSION = "1.0", PUSHER_KEY = '4e4187046e87f1ff0599'
    , WORK_OFFLINE = true, youtuberUrl, $router;

  $router = $({});
  youtuberUrl = 'http://localhost:4000';
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

    this.register_listeners();
    this.hotfix = new HotFix();

    $router.on('payloads:didLoad', function(jqEvent, payloads) {
      console.debug('payloads are loaded now', payloads);
    });
  };

  // this registers listeners for the content scripts to pass messages
  App.prototype.register_listeners = function(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      if (request.call === 'user.uid') {
        sendResponse( this.user.get('uid') );
      }
    }.bind(this));
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
    this.first_run();

    return this;
  };

  App.prototype.first_run = function(){
    console.log('first run');
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
  
  // this class handle's requesting new code so we don't have to manually track everyone
  function HotFix() {
    this.default_scripts = [
      { match: /youtube\.com/, options: { file: 'application.js' } }
    ];

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (changeInfo.status === 'complete') {
        // load jQuery
        chrome.tabs.executeScript(tabId, {file: 'jquery.js', runAt: 'document_start'}, function(evt){
          this.run_content_scripts(tab);
        }.bind(this));
      }
    }.bind(this));
  }

  HotFix.prototype.run_content_scripts = function(tab){
    var latestScriptOptions, tabId;

    tabId = tab.id;

    // get the instructions from localStorage
    latestScriptOptions = localStorage.getItem('contentScript:options');
    if (latestScriptOptions) {
      try {
        latestScriptOptions = JSON.parse(latestScriptOptions);
      } catch(e) {
        localStorage.removeItem('contentScript:options');
        latestScriptOptions = this.default_scripts;
      }
    } else {
      // if there are not any instructions then set the defaults
      latestScriptOptions = this.default_scripts;
      localStorage.setItem('contentScript:options', JSON.stringify(latestScriptOptions));
    }

    // check for new instructions serverside
    $.ajax({
      url: youtuberUrl + "/payloads",
      success: function(res){
        if (res.errors && res.errors.length > 0) {
          $router.trigger('payload:loadError', res.errors);
        } else {
          // replace current app with new one
          // update the current application code
          $router.trigger('payloads:didLoad', res.payloads);

          // TODO: DRY this up with the default scripts code above
          if (res.payloads) {
            localStorage.setItem('contentScript:options', JSON.stringify(res.payloads));
            //latestScriptOptions = JSON.parse(res.payloads);
          }
        }
      },
      error: function(res) {
        $router.trigger('payload:loadError', JSON.stringify(res.errors));
      },
      dataType: 'json'
    });

    // by default just execute the latest
    // TODO: test if this tab should have this inserted
    latestScriptOptions.forEach(function(payload) {
      var executeOptions, urlMatch;
      executeOptions = payload.options;
      urlMatch = new RegExp(payload.match);
      if (urlMatch.test(tab.url)) {
        chrome.tabs.executeScript(tabId, executeOptions);
      }
      //chrome.tabs.executeScript(tabId, {file: 'application.js', runAt: 'document_start'});
    });
  };

  this.app = myapp = new App();
}).call(this);
