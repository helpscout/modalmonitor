"use strict";

// Check to make sure global namespace is not already being used
// Set an empty object if it's not
if ( !window.MODAL ) { window.MODAL = {}; }

window.MODAL.Monitor = function () {

	// Global settings
	var abort = false,
		settings = {};
		settings.cookieNames = {};
		settings.cssTransitions = {};

	// Bare bones simulation of jQuery-like query selector
	function $(el) {
		return document.querySelectorAll(el);
	}

	// Add conversion (as a result, the modal will no longer be shown)
	function addConversion(id) {
		cookieSet(id,settings.cookieNames.conversion,10000);
	}

	// Add cookie
	function cookieSet(name,value,days) {
		var expires = '';
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = '; expires='+date.toGMTString();
		}
		document.cookie = name+'='+value+expires+'; path=/';
	}

	// Check for existing cookie
	function cookieGet(name) {
		var nameIs = name + '=';
		var ca = document.cookie.split(';');
		for (var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameIs) === 0) {
				return c.substring(nameIs.length,c.length);
			}
		}
		return null;
	}

	// Read data attributes
	function data(el, at) {
		return el.getAttribute('data-' + at);
	}

	// Debounce (used for scrolling event)
	var debounceRun = true,
		timer = 0;
	function debounce(fn, delay) {
		if (debounceRun) {
			debounceRun = false;
			return function () {
				var context = this, 
					args = arguments;
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn.apply(context, args);
					debounceRun = true;
				}, delay);
			};
		}
	}

	// Checks to see if an ID has a #, and removes it
	function hexRemoval(id) {
		return id.replace('#', '');
	}

	// Hides modal backdrop, and all modals
	function hideModal() {
		var modalMonitorBackdrop = $(settings.modalBackdropClass)[0];
		// Check to see if CSS transitions is on
		if (settings.cssTransitions.used) {
			var timer = true;
			// Check to see if browser supports classList
			if (modalMonitorBackdrop.classList) {
  				modalMonitorBackdrop.classList.remove(settings.cssTransitions.class);
			} else {
				modalMonitorBackdrop.className = modalMonitorBackdrop.className.replace(settings.cssTransitions.class, '');
			}
			clearTimeout(timer);
			timer = setTimeout(function () {
				modalMonitorBackdrop.style.display = 'none';
				hideAllModals();
			}, settings.cssTransitions.delay);
		} else {
			modalMonitorBackdrop.style.display = 'none';
			hideAllModals();
		}
	}

	// Loops through, and hides all modals
	function hideAllModals() {
		var modals = $(settings.modalClass);
		Array.prototype.forEach.call(modals, function(el){
			el.style.display = 'none';
		});
	}

	// Kicks everything off
	function initModalMonitor(el) {
		if (abort) {
			return false;
		}
		// Grab data attributes on modal container
			var thisId = el.getAttribute('id');
			settings[thisId] = {};
			settings[thisId].method = data(el, 'method');
			settings[thisId].trigger = data(el, 'trigger');
		// Scrolling method
		if ('scroll' === settings[thisId].method) {
			var bodyHeight = document.body.offsetHeight,
				middle = parseInt(bodyHeight/2),
				bottom = parseInt(bodyHeight-[bodyHeight*0.15]);
			document.addEventListener('scroll', debounce(function() {
				var scrolled = parseInt(document.body.scrollTop);
				if ('middle' === settings[thisId].trigger && middle < scrolled) {
					return showModal(el);
				}
				if ('bottom' === settings[thisId].trigger && bottom < scrolled) {
					return showModal(el);
				}
			}, 300));
		// Timed method
		} else if ('timed' === settings[thisId].method) {
			var modalTimeout = '';
			clearTimeout(modalTimeout);
			modalTimeout = setTimeout(function() {
				return showModal(el);
			}, parseInt(settings[thisId].trigger));
		} else if ('exit' === settings[thisId].method) {
			document.addEventListener('mouseleave', function(e) {
				e = (e) ? e : window.event;
				if ( e.clientY < 0) {
					return showModal(el);
				}
			});
		}
	}

	// Show a specific modal
	function showModal(el) {
		if (abort) {
			return false;
		}
		var modalMonitorBackdrop = $(settings.modalBackdropClass)[0],
			thisId = el.getAttribute('id'),
			thisCookie = cookieGet(thisId),
			timer = 0;
		// If there is no ID, return false
		if (!thisId) {
			return false;
		}
		// Check for conversions
		// If they've already converted', never show this modal again
		if (thisCookie && settings.cookieNames.conversion === thisCookie) {
			return false;
		}
		// If cookie is already set, return false
		if (cookieGet(thisId)) {
			return false;
		}
		// No cookie is set
		// Add cookie for frequency specified (default is 30 days if no frequency is set)
		cookieSet(thisId,settings.cookieNames.default,data(el, 'frequency') || settings.frequencyDefault);
		// Show the backdrop
		modalMonitorBackdrop.style.display = 'block';
		// Hide all other modals
		hideAllModals();
		// Then show this modal
		el.style.display = 'block';
		// Check to see if CSS transitions is on
		if (settings.cssTransitions.used) {
			clearTimeout(timer);
			timer = setTimeout(function () {
				// Check to see if browser supports classList
				if (modalMonitorBackdrop.classList) {
	  				modalMonitorBackdrop.classList.add(settings.cssTransitions.class);
				} else {
					modalMonitorBackdrop.className += ' ' + settings.cssTransitions.class;
				}
			}, 100);
		}
	}

	// Public facing methods
	return {
		init: function(options) {
			// Default settings
			// CSS class of modal backdrop
			settings.modalBackdropClass = (typeof options.modalBackdropClass === 'undefined') ? '.modal-monitor-backdrop' : options.modalBackdropClass;
			// CSS class of modal
			settings.modalClass = (typeof options.modalClass === 'undefined') ? '.modal-monitor' : options.modalClass;
			// false, or true (change to true to turn CSS transitions on)
			settings.cssTransitions.used = (typeof options.cssTransitions.used === 'undefined') ? 'false' : options.cssTransitions.used;
			// This class name will be added to .modal-monitor-backdrop
			settings.cssTransitions.class = (typeof options.cssTransitions.class === 'undefined') ? 'show' : options.cssTransitions.class;
			// When the modal is closed, the class name above will removed after this many ms
			settings.cssTransitions.delay = (typeof options.cssTransitions.delay === 'undefined') ? '300' : options.cssTransitions.delay;
			// Default for cookie length
			settings.frequencyDefault = (typeof options.frequencyDefault === 'undefined') ? '30' : options.frequencyDefault;
			// Default (non-conversion) cookie name
			settings.cookieNames.default = (typeof options.cookieNames.default === 'undefined') ? 'conversion-false' : options.cookieNames.default;
			// Conversion cookie name
			settings.cookieNames.conversion = (typeof options.cookieNames.conversion === 'undefined') ? 'conversion-true' : options.cookieNames.conversion;

			// initialize modal monitor for all elements with class="modal-monitor"
			var modals = $(settings.modalClass);
			Array.prototype.forEach.call(modals, function(el){
				// Prevent clicks on modal from bubbling up
				el.onclick = function(e) { 
					e.stopPropagation(); 
				};
				// Set everything up
				initModalMonitor(el);
			});
			// Add click event on backdrop to close modals
			$(settings.modalBackdropClass)[0].onclick = function() {
  				window.MODAL.Monitor.hide();
  			};
		},
		abort: function() {
			abort = true;
		},
		conversion: function(id) {
			id = hexRemoval(id);
			addConversion(id);
		},
		hide: function() {
			hideModal();
		},
		show: function(id) {
			id = hexRemoval(id);
			var el = Document.getElementById(id);
			showModal(el);
		}
	};
} ();