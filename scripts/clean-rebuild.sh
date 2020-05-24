#!/bin/bash

# A somewhat out of date refernce point:
# 
#  https://gist.github.com/jarretmoses/c2e4786fd342b3444f3bc6beff32098d

# Force script to be called from root (which is 1 level up from the directory with this script)
cd "$(dirname "$0")"
cd ../

echo "Running From Root Directory $PWD"

echo "Deleting watchman: 'watchman watch-del-all'"
watchman watch-del-all

echo "Remove node modules: 'rm -rf node_modules'"
rm -rf node_modules

echo "'yarn cache clean'"
yarn cache clean

echo "'yarn install'"
yarn install

if [[ $* == *--no-pod* ]]
then
  echo "skipping cocoapods rebuild"
else
  echo "cleaning cocoapods.  run with --no-pod to skip this step"
  rm -rf ios/Pods
  cd ios/
  pod cache clean --all
  pod repo update && pod install
  cd ../
fi

# Probably no longer relevant
echo "Remove tmp/react: 'rm -rf $TMPDIR/react-*'"
rm -rf $TMPDIR/react-*

echo "Remove tmp/npm: 'rm -rf $TMPDIR/npm-*'"
rm -rf $TMPDIR/npm-*

echo "Remove metro bundler and haste caches"
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

echo "'./android/gradlew clean -p ./android/'"
./android/gradlew clean -p ./android/

echo "'rm -rf ios/build'"
rm -rf ios/build

echo "'yarn start --reset-cache'"
yarn start --reset-cache
