# HyloReactNative

## Quick Start

1. Run through the React Native environment setup on the [React Native website](https://reactnative.dev/docs/environment-setup)
2. `yarn install`
3. Ask a teammate for a copy of the `.env` file, copy that into the root of this project (make sure to set `NO_FLIPPER=true`)
4. Then run `scripts/configure.sh`
5. `cd ios`
6. `bundle install` (** assuming you have a functioning version of Ruby)
7. `pod install`
8. `cd ..`
9. `yarn start`
10. `yarn run android` or `yarn run ios`

## Boot Splash Screen

Currently the splash screen on boot for both iOS and Android is handled by `react-native-boot-splash` and is limited to using only a centered icon with a choice of background color. It can be readily re-generated using the provided cli utility with the library, see: [react-native-bootstrap#asset-generation](https://github.com/zoontek/react-native-bootsplash#assets-generation)

Current Bootsplash screens / logo were generated using this command and parameters:

```
npx react-native generate-bootsplash ./bootsplash_logo.png --background-color "#0DC39F" --logo-width 160
```

## Additional Docs for Hylo App Dev

#### Deploy vid
https://www.youtube.com/watch?v=sE60ymB4ZHM
- 30 min: How to release an app that points to staging
- 35:50 min: Installing the release into a stimulator
- 48 min: discussion on breaking changes in NODE and EVO

#### Deploy todo list

- Merge changes to dev
- Make sure tests are passing *
- Make sure CHANGELOG is up to date, including anticipated version (5.4.0) today
- Run `npm version patch|minor|major`
- `git push --tags`
- Wait for Bitrise build
- Check Bitrise build, did it build successfully?
- Install and manually test Bitrise builds. For iOS install from TestFlight, for Android manually install APK file on physical device (or emulator if no physical device available)
- Prepare release notes appropriate for stores from CHANGELOG / Github Issues
- Login to Apple Developer account and submit app for review / release
- Login to Google Play Store Console and submit app for review / release
- Once the release is accepted by both the stores run `npm version prereleaase` on `dev` and `git push --tags` to setup the next prereleae build versioning (will bump up on patch version and add `-0` to the end of the version number)
