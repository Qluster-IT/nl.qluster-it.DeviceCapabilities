New: Fully Customisable Virtual Device with unique Textual Status Indicator!
See the topic for examples.

Create a device and configure it yourself:
* Textual Status which you can select as Status Indicator on the Device Tile in Mobile App, setable through flows.
* Custom uploadable icons can be set as capability icon.
* Have the Device Tile function as a Pushbutton (staying light/dark after clicked) but set Dark/Light on the Tile as status from a flow.
* 10 Numbers, Texts, Yes/No's, Buttons and Cameras can be add_devices.
* Hide device tile button from the device itself.

And 

A flowcard to retrieve the User and Client from the Insights from x minutes ago (can be zero for now).
Example: Retrieve the value from LivingRoom for Temperature from 30 minutes ago.

Or

Set capabilities of device's per zone, for example open or close all curtains in a certain zone, including (or not) the subzones, of a certain brand or devicetype.
Also listens for capabilities of which there are no triggers from the app developer and gives you tokens with the User and Client (App) which activated/changed the capability value.
And a condition able to set a capability and wait for a specific "error".

Now also a new actioncard, which retrieves the value from a capability from a device from [numberof] minutes ago (including the User and Client which changed the value).

And an App has started card (When) and an App is running card (And).

Example: Set curtain.windowcoverings_set To 0 in Home including subzones (Yes).
This will close all curtains in the Home and subzones. Setting it to 1 will open all curtains.

Example: Listen (watch) from Vacuumcleaner1 for bin_full
The flow will be triggered when a device called Vacuumcleaner1 has the capacity bin_full changed.
Check the value for true and send a notification to your phone to know when the vacuumcleaner bin is full.

Example: Set SamsungFrameTV.onof to True and wait for error: Powered on already...
The flow will continue after the TV has been turned ON. So no more flows with delays for waiting for TV or Coffeemaker to turn on.

Example: Retrieve the value from LivingRoom for Temperature from 30 minutes ago.