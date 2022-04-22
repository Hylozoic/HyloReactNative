# HyloReactNative

## Quick Start

1. Run through the React Native environment setup on the [React Native website](https://reactnative.dev/docs/environment-setup)
2. `yarn install`
3. Ask a teammate for a copy of the `.env` file, copy that into the root of this project
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

The canonical source for documentation is currently at: [Hylo Confluence](https://hylozoic.atlassian.net/wiki/spaces/DEV/pages/425986/Getting+Started).
