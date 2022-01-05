

/* require config */

requirejs.config({
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'jquerymobile': {
      deps: ['jquery']
    }
  }, //shim

  paths: {
    'backbone':     'lib/backbone',
    'jquerymobile': 'lib/jquery.mobile',
    'underscore':   'lib/underscore',
    'jquery':       'lib/jquery-1.9.1'
  } //path
});

requirejs(['jquery','backbone','router','api','utils','models'],
  function($, Backbone, router, api, utils, models){

  /************* utilities ***********/

  function registerLoginPageActions(){

    // register login button action
    $('#login form').submit(function(e){

      $.mobile.loading( 'show', { text: 'Authenticating...', textVisible: true} );
      e.preventDefault();


	if (typeof(Storage) !== "undefined") {
	  var reload = false;//( localStorage['ttrss_server_url'] !== $('#ttrss_server_urlInput').val());
      localStorage['ttrss_server_url'] = $('#ttrss_server_urlInput').val();
      localStorage['ttrss_username'] = $('#loginInput').val();
		if (reload) {  location.reload();  }
    }

      // message to send
      var data = {
        op: "login",
        user: $('#loginInput').val(),
        password : $('#ttrss_passwordInput').val()
      };

      $.ajaxSetup({
        url: localStorage['ttrss_server_url'] + 'api/',
        contentType: "application/json",
        dataType: 'json',
        cache: 'false',
        type: 'post',
        timeout: 15000 // 15s by default
      });


      jQuery.ajax(
        {
          url: localStorage['ttrss_server_url'] + 'api/',
          contentType: "application/json",
          dataType: 'json',
          cache: 'false',
          data: JSON.stringify(data),
          type: 'post',
          async: false
        }
      )
      .done(function(data){
        if (data.status == 0){
          // we store the sessions id
          models.settings.set("sid", data.content.session_id);
          models.settings.save();

          router.myRouter.setNextTransOptions({reverse: true, transition: "slideup"});

          // try to get from query string if it exists
          var fragment = location.hash;
          var re = /\?from=#(.+)/;
          var nextRoute = "cat";
          var ex = re.exec(fragment)
          if (ex != null){
            nextRoute = ex[1];
          }

          router.myRouter.navigate(nextRoute, {trigger: true});
        } else {
          var msg = "Unknown answer from the API:" + data.content;
          if (data.content.error == "API_DISABLED"){
            msg = 'API is disabled for this user';
          } else if (data.content.error == "LOGIN_ERROR"){
            msg = "ERROR: Entered username and password combination is wrong.";
          }
          alert(msg);
          $.mobile.loading('hide');
        }
      });
    }); // login button
  }



  /************** init bindings *************/

  $(document).bind('mobileinit', function(event){

    // desactivate jQueryMobile routing (we use Backbone.Router)
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.changePage.defaults.changeHash = false;
    $.mobile.defaultPageTransition = "none";
    
    // https://stackoverflow.com/questions/7667603/change-data-theme-in-jquery-mobile
    $.mobile.changeGlobalTheme = function(theme)  {  var themes = " a b c d e";  function setTheme(cssSelector, themeClass, theme)  {  $(cssSelector)  .removeClass(themes.split(" ").join(" " + themeClass + "-"))  .addClass(themeClass + "-" + theme)  .attr("data-theme", theme);  }  setTheme(".ui-mobile-viewport", "ui-overlay", theme);  setTheme("[data-role='page']", "ui-body", theme);  setTheme("[data-role='header']", "ui-bar", theme);  setTheme("[data-role='listview'] > li", "ui-bar", theme);  setTheme(".ui-btn", "ui-btn-up", theme);  setTheme(".ui-btn", "ui-btn-hover", theme);  };

    if (typeof(localStorage) !== "undefined" && localStorage["darkMode"] === "true") {
      $.mobile.changeGlobalTheme("b");
    }
  });




  var g_init = false;

  $(document).bind('pageinit', function(event){

    if (! g_init){

      g_init = true;

      // alternative to localStorage using cookies
      utils.localStorageSupport();
      if (localStorage['ttrss_server_url']) { $('#ttrss_server_urlInput').val(localStorage['ttrss_server_url']); }
      if (localStorage['ttrss_username']) { $('#loginInput').val(localStorage['ttrss_username']); }
      
      // events for login page
      registerLoginPageActions();

      // initialize all logout buttons
      $('a.logoutButton').on('click',
        function(e){
          e.preventDefault();
          $.mobile.loading( 'show', { text: 'Logging out...', textVisible: true} );
          api.logout();
        }
      );

      // initialize all back buttons
      $('a.backButton').on('click',
        function(e){
          router.myRouter.setNextTransOptions({reverse: true});
        }
      );

      // initialize all menu buttons
      $("a[data-rel='popup']").on('click',
        function(e){
          e.preventDefault();
          var popupId = $(e.currentTarget).attr('href');
          var transition = $(popupId).attr('data-transition');
          
          $(popupId).popup("open", {transition: transition,
                                    positionTo: $(e.currentTarget) });
        }
      );

      // prepare all pages now
      $("div:jqmData(role='page')").page();

      // first transition
      router.myRouter.setNextTransOptions({transition: "fade"});
      
      // start Backbone router
      if (! Backbone.history.start({
              pushState: false,
              root: window.location.pathname,
              silent: false
            })){

        alert("Could not start router!");
      }

    }
  });


  //loading jQuery Mobile after everything
  require(['jquerymobile'], function(){});

}); //requirejs

