# HyloReactNative
Version 2 of the Hylo mobile app, built with React Native.

## Basic development how-to

#### First time

1. Follow the instructions in [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html).

2. Set up your `.env.development` file, e.g.:

```
API_HOST=https://www.hylo.com
IOS_EMULATOR_API_HOST=http://localhost:3001
ANDROID_EMULATOR_API_HOST=http://10.0.2.2:3001
IOS_GOOGLE_CLIENT_ID=xyza.apps.googleusercontent.com
WEB_GOOGLE_CLIENT_ID=xyzw.apps.googleusercontent.com
```

#### Every time

1. Run `yarn start`; this starts the "packager", which is a server that bundles up the JS and serves it to the app running on the simulator or device.

2. Run `react-native run-ios` or `react-native run-android`; this compiles the native app and deploys it to the simulator. 
   - It will open the iOS simulator automatically, but the Android simulator must already be running.
   - If you run this without starting the packager yourself, it will start it up in Terminal; but it may not behave the same way when started like that, because of differing working directories. So start the packager yourself first.

3. When you make changes to the app code, the packager will update its bundle and hot-reload it in the simulator. You can also force-refresh the simulator (Cmd-R in iOS, R R in Android).

4. From within the simulator, you can bring up a developer menu (shake or Cmd-D on iOS, Cmd-M on Android) to enable remote debugging among other things.

## Gotchas

- Crashing with `Your app is missing support for the following URL schemes: com.googleusercontent.apps...` 
  - [Read this](https://developers.google.com/identity/sign-in/ios/start-integrating#add_a_url_scheme_to_your_project) and make sure the value of `IOS_GOOGLE_CLIENT_ID` in your `.env` file matches the value of `CLIENT_ID` in the `GoogleService-info.plist` file in the XCode project.
  - TODO: derive these values from something that doesn't get checked into the Git repo)
