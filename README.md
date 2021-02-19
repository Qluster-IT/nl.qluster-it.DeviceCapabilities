Set capabilities of device's per zone, for example open or close all curtains in a certain zone, including (or not) the subzones.
Also listens for capabilities of which there are no triggers from the app developer.
And a condition able to set a capability and wait for a specific "error".

Example: Set curtain.windowcoverings_set To 0 in Home including subzones (Yes).
This will close all curtains in the Home and subzones. Setting it to 1 will open all curtains.

Example: Listen (watch) from Vacuumcleaner1 for bin_full.
The flow will be triggered when a device called Vacuumcleaner1 has the capacity bin_full changed.
Check the value for true and send a notification to your phone to know when the vacuumcleaner bin is full.

Example: Set SamsungFrameTV.onof to True and wait for error: Powered on already...
The flow will continue after the TV has been turned ON. So no more flows with delays for waiting for TV or Coffeemaker to turn on.
Try it with a faulty error or a whitespace and in 20 seconds  you'll get they existing error message from the device: this way you know what to look for.