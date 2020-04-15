# Prime Now Delivery Finder
By Martin (Tato) Panelati

## Description
This is a simple Chrome extension built to find Amazon Prime Now delivery slots during times of quarentine or lockdown. It was made in part with educational purposes, as it is my first Chrome extension. Please don't expect quality code and expect some bugs.

## How to set up
1. Enable Chrome developer tools in Chrome extensions
2. Load Unpacked extension and select directory
3. Copy data/settings-sample.json to data/settings.json
4. Enter your Pushbullet access token and Mailgun settings into settings.json
5. Go to Prime Now, build your cart and go to the checkout page
6. Click on the extension icon once on the checkout page. It will refresh the page until finding a slot and will send you an email and a push notification.
7. When a slot becomes available rush to finish the checkout. Delivery slots lasts available usually between 30s and 1m, so be fast in seizing them.

## Caveats
- Pushbullet: unfortunately pushbullet has deprecated their iOS app, so this only works for Android.
- Mailgun: create a sandbox domain, whitelist your email_to address
- Weird behaviors: sometimes the extension stops running, I'm not sure why. In this case, you need to re-enable it again.

## Contact me
Tweet me @tatopane

Find me on LinkedIn https://www.linkedin.com/in/mpanelati/
