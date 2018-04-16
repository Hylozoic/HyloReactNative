#!/bin/bash

# Force script to be called from root (which is 1 level up from the directory with this script)
cd "$(dirname "$0")"
cd ../

echo "Root Directory $PWD"

watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/npm-*
rm -rf ios/Pods
yarn cache clean
yarn install
cd ios/
pod cache clean --all
pod repo update && pod install
cd ../
./android/gradlew clean -p ./android/
rm -rf ios/build
yarn start -- --reset-cache
