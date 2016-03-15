# Modal Monitor
A dead simple JS library (with zero dependancies) that will help you trigger modal popups based on time, or scroll position

## Quick Overview

**The Backdrop**

Each each element that you intent to turn into a modal should be wrapped int a div with the clas of `.modal-monitor-backdrop`. This will create the backdrop behind the modal. This backdrop can be styled however you'd like.

**The modal**

Four attributes must be present with each element that you'd like to turn into a modal:

1. A unique id
2. A class of `modal-monitor`
3. A `data-method` attribute with the value of either "scroll", or "timed"
4. A `data-trigger` attribute:
  - for a **timed** method the trigger would be time in ms (i.e. 10000 would trigger the modal after 10 seconds)
  - for a **scroll** method "middle", or "bottom" are the valid trigger options signifying the position on the page that the modal should be triggered

You can have as many modals on a page as you'd like as long as they each have the 4 attributes listed above.

## Examples
With modal monitor, you can turn any DOM element into a modal popup. Here are a few examples:

**1) Scroll to middle**
```
<div class="modal-monitor-backdrop">
	<div id="scrollmiddle" class="modal-monitor" data-method="scroll" data-trigger="middle">You scrolled to the middle</div>
</div>
<script type="text/javascript" src="modalmonitor.js"></script>
<script>
	MODAL.Monitor.init();
</script>
```

**2) Scroll to bottom**
```
<div class="modal-monitor-backdrop">
	<div id="scrollbottom" class="modal-monitor" data-method="scroll" data-trigger="bottom">You scrolled to the bottom</div>
</div>
<script type="text/javascript" src="modalmonitor.js"></script>
<script>
	MODAL.Monitor.init();
</script>
```

**3) After 10 seconds**
```
<div class="modal-monitor-backdrop">
	<div id="timed10000" class="modal-monitor" data-method="timed" data-trigger="10000">10 seconds has passed</div>
</div>
<script type="text/javascript" src="modalmonitor.js"></script>
<script>
	MODAL.Monitor.init();
</script>
```

## Methods

**init()**

Init kicks everything off. It searched for any element with the class of `.modal-monitor` and sets everything up

Example usage: `MODAL.Monitor.init();`

**hide()**

The hide method lets you to manually hide all modals.

Example usage: `MODAL.Monitor.hide();`

**show(id)**

The show method allows you to manually trigger a modal to show based on the id you give it.

Example usage: `MODAL.Monitor.show('scrollmiddle');`
