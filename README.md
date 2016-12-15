## aframe-always-fullscreen-component

A Always Fullscreen component for [A-Frame](https://aframe.io).

This component makes sure, that the A-Frame Scene will always use up as much Screen as possible.

The component implements the Fullscreen API for Desktop/Android. But since iOS Device do not support the Fullscreen API, it is challenging to get the minimal UI of Safari/Chrome.

Usually Safari/Chrome on iOS will change to the minimal UI when you start scrolling down the page. But since most A-Frame Webapps are not scrollable, this will never happen. Therefore this component provides a scrollable element to activate the minimal UI.

iOS example (using the scroll-mechanism):
<img src="http://lab.immersiveweb.ch/assets/aframe-fullscreen-ios.gif" width="250"/>

Android/Desktop example (using the Fullscreen API):
<img src="http://lab.immersiveweb.ch/assets/aframe-fullscreen-android.gif" width="500"/>

Close and Reopen:
<img src="http://lab.immersiveweb.ch/assets/aframe-fullscreen-closed.PNG" width="250"/>
<img src="http://lab.immersiveweb.ch/assets/aframe-fullscreen-close.PNG" width="250"/>

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| platform         | Define on which Platform the component should be active (oneOf: all, desktop, mobile)            | mobile              |
| debug         | Whether or not Debug Information should be shown            | false              |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://rawgit.com/bestiejs/platform.js/master/platform.js"></script>
  <script src="https://rawgit.com/protyze/aframe-always-fullscreen-component/master/dist/aframe-always-fullscreen-component.min.js"></script>
</head>

<body>
  <a-scene embedded always-fullscreen>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-always-fullscreen-component
```

Then register and use.

```js
require('aframe');
require('aframe-always-fullscreen-component');
require('platform');
```
