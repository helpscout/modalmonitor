"use strict";

// Check to make sure global namespace is not already being used
// Set an empty object if it's not
if ( !window.MODAL ) { window.MODAL = {}; }

window.MODAL.Monitor = function () {
	
	// Variables for debounce function below
	var debounceRun = true,
		timer = 0;

	// Bare bones simulation of jQuery like query selector
	function $(el) {
		return document.querySelectorAll(el);
	}

	// Add conversion (as a result, the modal will no longer be shown)
	function addConversion(id) {
		cookieSet(id,'conversion-true',10000);
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
		$('.modal-monitor-backdrop')[0].style.display = 'none';
		hideAllModals();
	}

	// Loops through, and hides all modals
	function hideAllModals() {
		var modals = $('.modal-monitor');
		Array.prototype.forEach.call(modals, function(el){
			el.style.display = 'none';
		});
	}

	// Kicks everything off
	function initModalMonitor(el) {
		// Grab data attributes on modal container
		var settings = {};
			settings.frequency = data(el, 'frequency') || 30,
			settings.method = data(el, 'method'),
			settings.trigger = data(el, 'trigger');
		// Scrolling method
		if ('scroll' === settings.method) {
			var bodyHeight = document.body.offsetHeight,
				middle = parseInt(bodyHeight/2),
				bottom = parseInt(bodyHeight-[bodyHeight*0.15]);
			document.addEventListener('scroll', debounce(function() {
				var scrolled = document.body.scrollTop;
				if ('middle' === settings.trigger && middle < scrolled) {
					showModal(el);
				}
				if ('bottom' === settings.trigger && bottom < scrolled) {
					showModal(el);
				}
			}, 300));
		// Timed method
		} else if ('timed' === settings.method) {
			var modalTimeout = '';
				clearTimeout(modalTimeout);
				modalTimeout = setTimeout(function() {
					showModal(el);
				}, parseInt(settings.trigger));
		}
	}

	// Show a specific modal
	function showModal(el) {
		var thisId = el.getAttribute('id'),
			thisCookie = cookieGet(thisId);
		if (!thisId) {
			return false;
		}
		
		// Check for conversions
		// If they've already converted', never show this modal again
		if (thisCookie && 'conversion-true' === thisCookie) {
			return false;
		}

		// If cookie is already set, return false
		if (cookieGet(thisId)) {
			return false;
		}

		// No cookie is set
		// Add cookie for frequency specified (default is 30 days if no frequency is set)
		cookieSet(thisId,'conversion-false',data(el, 'frequency') || 30);
		// Show the backdrop
		$('.modal-monitor-backdrop')[0].style.display = 'block';
		// First hide all other modals
		hideAllModals();
		// Then show this modal
		el.style.display = 'block';
		
	}

	// Public facing methods
	return {
		init: function() {
			// initialize modal monitor for all elements with class="modal-monitor"
			var modals = $('.modal-monitor');
			Array.prototype.forEach.call(modals, function(el){
				initModalMonitor(el);
			});
			// Add click event on backdrop to close modals
			$('.modal-monitor-backdrop')[0].addEventListener('click', function() {
  				window.MODAL.Monitor.hide();
  			});
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