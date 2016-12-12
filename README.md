## aframe-always-fullscreen-component

A Always Fullscreen component for [A-Frame](https://aframe.io).

This component makes sure, that the A-Frame Scene will always use up as much Screen as possible. This is especially challenging on iOS where you don't always get the minimal UI.

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.2.0/aframe.min.js"></script>
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
```
