/*
 * Bones Scripts File
 * Author: Eddie Machado
 *
 * This file should contain any js scripts you want to add to the site.
 * Instead of calling it in the header or throwing it inside wp_head()
 * this file will be called automatically in the footer so as not to
 * slow the page load.
 *
 * There are a lot of example functions and tools in here. If you don't
 * need any of it, just remove it. They are meant to be helpers and are
 * not required. It's your world baby, you can do whatever you want.
*/


/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
*/
function updateViewportDimensions() {
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	return { width:x,height:y };
}
// setting the viewport width
var viewport = updateViewportDimensions();


/*
 * Throttle Resize-triggered Events
 * Wrap your actions in this function to throttle the frequency of firing them off, for better performance, esp. on mobile.
 * ( source: http://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed )
*/
var waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) { uniqueId = "Don't call this twice without a uniqueId"; }
		if (timers[uniqueId]) { clearTimeout (timers[uniqueId]); }
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

// how long to wait before deciding the resize has stopped, in ms. Around 50-100 should work ok.
var timeToWaitForLast = 100;



/*
 * Here's an example so you can see how we're using the above function
 *
 * This is commented out so it won't work, but you can copy it and
 * remove the comments.
 *
 *
 *
 * If we want to only do it on a certain page, we can setup checks so we do it
 * as efficient as possible.
 *
 * if( typeof is_home === "undefined" ) var is_home = $('body').hasClass('home');
 *
 * This once checks to see if you're on the home page based on the body class
 * We can then use that check to perform actions on the home page only
 *
 * When the window is resized, we perform this function
 * $(window).resize(function () {
 *
 *    // if we're on the home page, we wait the set amount (in function above) then fire the function
 *    if( is_home ) { waitForFinalEvent( function() {
 *
 *	// update the viewport, in case the window size has changed
 *	viewport = updateViewportDimensions();
 *
 *      // if we're above or equal to 768 fire this off
 *      if( viewport.width >= 768 ) {
 *        console.log('On home page and window sized to 768 width or more.');
 *      } else {
 *        // otherwise, let's do this instead
 *        console.log('Not on home page, or window sized to less than 768.');
 *      }
 *
 *    }, timeToWaitForLast, "your-function-identifier-string"); }
 * });
 *
 * Pretty cool huh? You can create functions like this to conditionally load
 * content and other stuff dependent on the viewport.
 * Remember that mobile devices and javascript aren't the best of friends.
 * Keep it light and always make sure the larger viewports are doing the heavy lifting.
 *
*/

/*
 * We're going to swap out the gravatars.
 * In the functions.php file, you can see we're not loading the gravatar
 * images on mobile to save bandwidth. Once we hit an acceptable viewport
 * then we can swap out those images since they are located in a data attribute.
*/
function loadGravatars() {
  // set the viewport using the function above
  viewport = updateViewportDimensions();
  // if the viewport is tablet or larger, we load in the gravatars
  if (viewport.width >= 768) {
  jQuery('.comment img[data-gravatar]').each(function(){
    jQuery(this).attr('src',jQuery(this).attr('data-gravatar'));
  });
	}
} // end function

/**
 * Created by Hebele on 21.01.2016.
 */
function qsa(selector) {
    return document.querySelectorAll(selector);
}
function qs(selector) {
    return document.querySelector(selector);
}
function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

var triggers = qsa(".trigger__modal");
var modals = qsa(".modal");
var isOpen = false;

function bindEvents() {
    function calculateTransition(final, initial) {
        // translate = window center - trigger center
        var translate = {
            x: (window.innerWidth / 2) - (initial.left + initial.width / 2),
            y: (window.innerHeight / 2) - (initial.top + initial.height / 2)
        };
        // scale = final dimension / initial dimension
        var scale = {
            width: final.width / initial.width,
            height: final.height / initial.height
        };
        return {translate: translate, scale: scale};
    }

    for (var i = 0; i < triggers.length; i++) {
        var t = triggers[i];
        var m = qs(t.dataset.trigger);

        t.addEventListener("click", (function (trig, mod) {
            return function () {
                var contentDims = mod.querySelector(".modal__content").getBoundingClientRect();
                var trigDims = trig.getBoundingClientRect();
                var props = calculateTransition(contentDims, trigDims);


                // TODO: implement imagesLoaded plugin
                var expander = document.createElement("div");
                expander.classList.add("modal__expander");
                expander.style.width = trigDims.width + "px";
                expander.style.height = trigDims.height + "px";
                expander.style.transformOrigin = "center center";
                trig.appendChild(expander);

                // Force browser to render dynamic element
                // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
                window.getComputedStyle(trig).opacity;

                trig.style.transform = "translateX(" + props.translate.x + "px)"
                    + "translateY(" + props.translate.y + "px)";
                expander.style.transform = "scaleX(" + props.scale.width + ")"
                    + "scaleY(" + props.scale.height + ")";

                //window.getComputedStyle(trig).opacity;
                //trig.classList.add("hidden");
                // when expander reaches final size
                // show modal
                function showModal() {
                    trig.removeEventListener("transitionend", showModal, false);
                    if(! isOpen) {
                        mod.classList.remove("hidden");
                        mod.classList.add("active");
                        isOpen = true;
                    }
                }
                trig.addEventListener("transitionend", showModal, false);

            }
        })(t, m), false);

        var closer = document.createElement("a");
        closer.classList.add("modal__close");
        closer.classList.add("button");
        closer.innerHTML = "&times;";
        closer.addEventListener("click", (function (trig) {

            return function () {
                if(isOpen) {
                    var expander = trig.querySelector(".modal__expander");
                    var modal = qs(trig.dataset.trigger);

                    //trig.classList.remove("hidden");
                    //window.getComputedStyle(trig).opacity;
                    modal.classList.add("hidden");
                    modal.classList.remove("active");
                    trig.style.transform = "";
                    expander.style.transform = "";

                    function remove(){
                        expander.removeEventListener("transitionend", remove, false);
                        expander.remove();
                    }
                    expander.addEventListener("transitionend", remove, false);

                    isOpen = false;
                }

            }
        })(t), false);

        // append to dialog
        m.querySelector(".modal__dialog").appendChild(closer);

    }
}




/*
 * Put all your regular jQuery in here.
*/
jQuery(document).ready(function($) {

/* jQuery(function() {
	var dialog = document.querySelector('dialog');
			var showDialogButton = document.querySelector('.show-info-modal');
			if (! dialog.showModal) {
				dialogPolyfill.registerDialog(dialog);
			}
			showDialogButton.addEventListener( 'click', function() {
				dialog.showModal();
			});
			dialog.querySelector('.close').addEventListener('click', function() {
				dialog.close();
			}); */




  /*
   * Let's fire off the gravatar function
   * You can remove this if you don't need it
  */
  loadGravatars();
	bindEvents();

}); /* end of as page load scripts */
