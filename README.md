# Accurat OctoPal

A Chrome extension that helps you following Accurat's GitHub workflow

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/bgaoaeaaplebihikpnlloglbpficgopi.svg)](https://chrome.google.com/webstore/detail/accurat-octopal/bgaoaeaaplebihikpnlloglbpficgopi)

## Features

- Add `Add sub-issue` button
- Show inline issue description in PRs

## Develop

Run

```sh
yarn start
```

then

- open Chrome to [chrome://extensions](chrome://extensions)
- enable the Developer mode (toggle on the top right)
- click on `Load unpacked`
- select the `build` directory

## Publish to Chrome store

Change the version in `src/manifest.json` and then run

```sh
yarn publish-webstore
```

[Chrome Webstore Upload setup info](https://github.com/DrewML/chrome-webstore-upload/blob/master/How%20to%20generate%20Google%20API%20keys.md)
