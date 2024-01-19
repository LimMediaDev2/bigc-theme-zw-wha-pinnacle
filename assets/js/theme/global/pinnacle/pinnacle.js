// <!-- SHOW POPUP AFTER 24 HOUR SESSION HAS EXPIRED OR WHEN BROWSER IS CLOSED -->
// <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
  // <!-- HIDE POPUP AFTER FIRST SESSION, RESETS IN 24 HOURS -->

    $(document).ready(function($) {
        if ($.cookie('popupShownOnceAlready')) {
            $('#newsletter-popup.popup-active-with-cookie').addClass('hide-popup');
            $('#newsletter-popup.popup-active-with-cookie').removeClass('show-popup');
            // console.log('Hide Popup');
        }
        else {
          // and now we create 1 day cookie
            $.cookie('popupShownOnceAlready', true, {path: '/', expire: 1});
            var $myDiv = $('.home');
                if ( $myDiv.length){
                  var id = '#dialog';
                  var maskHeight = $(document).height();
                  var maskWidth = $(window).width();
                  $('#mask').css({'width':maskWidth,'height':maskHeight});
                  $('#mask').fadeIn(500);
                  $('#mask').fadeTo("slow",0.9);
                  var winH = $(window).height();
                  var winW = $(window).width();
                  $(id).css('top',  winH/2-$(id).height()/2);
                  $(id).css('left', winW/2-$(id).width()/2-35);
                     $(id).fadeIn(2000);
                     $('.window .close').click(function (e) {
                  e.preventDefault();
                  $('#mask').hide();
                  $('.window').hide();
                     });
                     $('#mask').click(function () {
                  $(this).hide();
                  $('.window').hide();
                 });
                 // AFTER COOKIE EXPIRES RUN THIS CODE
                 $('#newsletter-popup.popup-active-with-cookie').addClass('show-popup');
                 $('#newsletter-popup.popup-active-with-cookie').removeClass('hide-popup');
                 // console.log('Show Popup');
                 // END AFTER COOKIE EXPIRES RUN THIS CODE
                }
        }
        $(window).on("unload", function(e) {
          deleteCookie('popupShownOnceAlready');
        });
    });


// FIX FOR SIDENAV SUBCATEGORY LINK WITH SUBCATEGORIES NOT CLICKABLE
$( "a.navPage-subMenu-action.navPages-action.navPages-action-depth-max.has-subMenu" ).on ('click', function() {
  window.location = this.href;
});


/**
 * Gets the browser name or returns an empty string if unknown.
 * This function also caches the result to provide for any
 * future calls this function has.
 *
 * @returns {string}
 */
var browser = function() {
  var ua = navigator.userAgent;
    // Return cached result if avalible, else get result then cache it.
    if (browser.prototype._cachedResult)
        return browser.prototype._cachedResult;

    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
      $('#body').addClass('firefox');
    }

    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
      // console.log('safari');
      $('#body').addClass('safari');
    }

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE = /*@cc_on!@*/false || !!document.documentMode) {
      $('#body').addClass('internet-explorer');
    } else {
      $('#body').addClass('not-internet-explorer');
    }

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
      var isChromium = window.chrome;
        if(isChromium){
          // console.log("chrome");
          $('#body').addClass('chrome');
      }


    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    return browser.prototype._cachedResult =
        isOpera ? 'Opera' :
        isFirefox ? 'Firefox' :
        isSafari ? 'Safari' :
        isChrome ? 'Chrome' :
        isIE ? 'IE' : 'NOT IE'
        isEdge ? 'Edge' :
        isBlink ? 'Blink' :
        "Don't know";
};

console.log(browser());

var OSName="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

if (navigator.appVersion.indexOf("Win")!=-1) {
  $('#body').addClass('windows');
}
console.log('Your OS: '+OSName);
