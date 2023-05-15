# Airbtyte Native

React Native ([Expo](https://expo.dev/)) project to use the Airbyte Public API to make a native app.

Try it immediately on your phone with Expo Go.

1. Sign up for [Expo](https://expo.dev/) with your email and let me invite you.
1. Download Expo Go app [here](https://expo.dev/client) and sign in
1. Install app from [here](https://expo.dev/@brianab429/airbyte-native?serviceType=classic&distribution=expo-go)

## Setup

`npm install` to install the core of what you need

### Run on iOS

You'll have to have some iOS developemnt [stuff](https://docs.expo.dev/workflow/ios-simulator/) set up.

`npm run ios`

### Run on Android

You'll have to have some Android development [stuff](https://docs.expo.dev/workflow/android-studio-emulator/) set up.

`npm run android`

### Run on Web

I've found the most foolproof way to get around CORS issues is to launch Chrome without it.

```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

`npm run web`

## Deploy

This can be deployed to Expo Go. It is [other](https://docs.expo.dev/build/setup/) steps to publish to the "real" App Stores.

`npm install -g expo-cli`
`expo publish`

For example, this made something installable from [here](https://expo.dev/@brianab429/airbyte-native?serviceType=classic&distribution=expo-go) if your user is added to the Expo project.
