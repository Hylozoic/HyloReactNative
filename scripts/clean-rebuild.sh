cd ../ 
watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/npm-*
rm -rf ios/Pods
yarn cache clean
cd ios/
pod cache clean --all
pod repo update && pod install
cd ../
yarn install
./android/gradlew clean -p ./android/
rm -rf ios/build
yarn start -- --reset-cache
