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

#### Release video walkthrough

This video was recorded in December of 2023 and may be somewhat out-of-date, also review the Release Checklist below

- https://www.youtube.com/watch?v=sE60ymB4ZHM
  - 30 min: How to release an app that points to staging
  - 35:50 min: Installing the release into a stimulator
  - 48 min: discussion on breaking changes in NODE and EVO

#### Release checklist

- Merge changes to `dev`
- Make sure tests are passing
- Update and commit `CHANGELOG`:
  - Remove any pre-release qualifier from the version heading (e.g. 5.4.0-0 becomes 5.4.0)
  - Review Github Milestone for release and existing entries in `CHANGELOG` for the current pre-release
- Run `npm version patch|minor|major` to move off current pre-release version:
  - For example, if current version is 5.4.0-0 running `npm version minor` will move the version to 5.4.0
- `git push --tags`
- Wait for Bitrise build and confirm it built successfully
- Install and manually test Bitrise builds
  - For iOS install from TestFlight
  - For Android manually install APK file on physical device (or emulator if no physical device available)
- Prepare release notes appropriate for stores by reviewing `CHANGELOG` and the related issues and PRs on the release Github Milestone
- Submit to Apple App Store:
  - Login to Apple Developer account and submit app for review / release
  - Be sure to double-check that you're submitting the exactly version/Bitrise build number which was build and tested above
  - Add release notes
  - Submit for review
- Submit to Google Play Store:
  - Login to Google Play Store Console 
  - Upload the APK file downloaded from Bitrise and tested above
  - Add release notes
  - Submit for review/release
- Once the release is accepted by both the stores run `npm version prereleaase` on `dev` and `git push --tags` to setup the next prereleae build versioning (will bump up on patch version and add `-0` to the end of the version number)
- Open a new Milestone with the current pre-release patch version:
  - Look to `package.json#version` to get the version generated, but leave off the `-0`
  