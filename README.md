# Modal Monitor
A dead simple JS library (with zero dependancies) that will help you trigger modal popups based on time, or scroll position

## Quick Overview

### The Backdrop

Each each element that you intend to turn into a modal should be wrapped in a DIV with the class of `.modal-monitor-backdrop`. This DIV will create the backdrop behind the modal. The backdrop can be styled however you'd like.

### The modal

**Required Attributes**
Four attributes must be present with each element that you'd like to turn into a modal:

1. A unique id
2. A class of `modal-monitor`
3. A `data-method` attribute with the value of either "scroll", or "timed"
4. A `data-trigger` attribute:
  - for a **timed** method the trigger would be time in ms (i.e. 10000 would trigger the modal after 10 seconds)
  - for a **scroll** method "middle", or "bottom" are the valid trigger options signifying the position on the page that the modal should be triggered

You can have as many modals on a page as you'd like as long as they each have the 4 attributes listed above.

**Optional Attributes**
The following attribute can optionally be added to any `.modal-monitor` element:

- A `data-frequency` attribute can be set to a positive integer (i.e. 1, 7, 30, 365). The frequency attribute sets the number of days a modal should be hidden, before being viewed again by a visitor. The default value being 30 days (if a frequency is not manually set). Note: Once a conversion is set via the `MODAL.Monitor.conversion(id)` method, a modal will no longer be shown, no matter the frequency that is set.

## Examples
With modal monitor, you can turn any DOM element into a modal popup. Here are a few examples:

**1) Scroll to middle**
```
<div class="modal-monitor-backdrop">
	<div id="scrollmiddle" class="modal-monitor" data-method="scroll" data-trigger="middle">You scrolled to the middle of the page. No frequency was set, so this modal will stay hidden for the default 30 days before being shown again.</div>
</div>
<script type="text/javascript" src="modalmonitor.js"></script>
<script>
	MODAL.Monitor.init();
</script>
```

**2) Scroll to bottom**
```
<div class="modal-monitor-backdrop">
	<div id="scrollbottom" class="modal-monitor" data-method="scroll" data-trigger="bottom" data-frequency="1">You scrolled to the bottom of the page. With the frequency set to 1, this modal will be shown again after 1 day (as long as no conversion has been registered).</div>
</div>
<script type="text/javascript" src="modalmonitor.js"></script>
<script>
	MODAL.Monitor.init();
</script>
```

**3) After 10 seconds**
```
<div class="modal-monitor-backdrop">
	<div id="timed10000" class="modal-monitor" data-method="timed" data-trigger="10000" data-frequency="7">10 seconds has passed before showing this modal. With the frequency set to 7, this modal will be shown again after 7 day (as long as no conversion has been registered).</div>
</div>
<script type="text/javascript" src="modalmonitor.js"></script>
<script>
	MODAL.Monitor.init();
</script>
```

Check out example.html for more examples.

## Methods

**init()**

Init kicks everything off. It searched for any element with the class of `.modal-monitor` and sets everything up

Example usage: `MODAL.Monitor.init();`

**conversion()**

Add a conversion for a specific modal based on the id you give it. Once a modal has a conversion, I will not be shown again no matter the frequency that is set.

Example usage: `MODAL.Monitor.conversion('scrollmiddle');`

**hide()**

The hide method lets you to manually hide all modals.

Example usage: `MODAL.Monitor.hide();`

**show(id)**

The show method allows you to manually trigger a modal to show based on the id you give it.

Example usage: `MODAL.Monitor.show('scrollmiddle');`
