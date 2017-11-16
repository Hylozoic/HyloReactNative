#!/bin/bash

# Force script to be called from root (which is 1 level up from the directory with this script)
cd "$(dirname "$0")"
cd ../

echo "Root Directory $PWD"

source .env

if [ -z ${FACEBOOK_APP_ID_DEBUG+x} ]; then echo "ERROR: Missing appropriate config in .env. eg: FACEBOOK_APP_ID_DEBUG"; exit 1; else echo "Configuring Project:"; fi

mytmpdir=`mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir'`
git clone -b android https://github.com/Hylozoic/code-signing.git $mytmpdir/android
git clone -b ios https://github.com/Hylozoic/code-signing.git $mytmpdir/ios

echo "Applying android/app/google-services.json"
cp $mytmpdir/android/google-services.json android/app/
echo "Applying android/app/debug.keystore"
cp $mytmpdir/android/debug.keystore android/app/

echo "Applying ios/debug.keystore"
cp $mytmpdir/ios/GoogleService-Info.plist ios/

trap 'rm -rf "$mytmpdir"' EXIT

echo "creating ios/debug.xcconfig"

cat > ios/debug.xcconfig <<EOL
#include "./Pods/Target Support Files/Pods-HyloReactNative/Pods-HyloReactNative.debug.xcconfig"
FACEBOOK_APP_ID = $FACEBOOK_APP_ID_DEBUG
ONESIGNAL_APP_ID = $ONESIGNAL_APP_ID_DEBUG

EOL

echo "creating ios/release.xcconfig"

cat > ios/release.xcconfig <<EOL
#include "./Pods/Target Support Files/Pods-HyloReactNative/Pods-HyloReactNative.release.xcconfig"
FACEBOOK_APP_ID = $FACEBOOK_APP_ID_RELEASE
ONESIGNAL_APP_ID = $ONESIGNAL_APP_ID_RELEASE

EOL

echo "creating android/app/src/debug/res/values/strings.xml"

mkdir -p android/app/src/debug/res/values
cat > android/app/src/debug/res/values/strings.xml <<EOL
<resources>
    <string name="facebook_app_id">$FACEBOOK_APP_ID_DEBUG</string>
</resources>

EOL

echo "creating android/app/src/release/res/values/strings.xml"

mkdir -p android/app/src/release/res/values
cat > android/app/src/release/res/values/strings.xml <<EOL
<resources>
    <string name="facebook_app_id">$FACEBOOK_APP_ID_RELEASE</string>
</resources>

EOL

echo ""
echo "IMPORTANT!!! Final Step:"
echo "Add the following values to your ~/.gradle/gradle.properties":
echo ""
echo "HYLO_DEBUG_STORE_FILE=debug.keystore"
echo "HYLO_DEBUG_KEY_ALIAS=androiddebugkey"
echo "HYLO_DEBUG_STORE_PASSWORD=android"
echo "HYLO_DEBUG_KEY_PASSWORD=android"
echo "DEBUG_ONESIGNAL_APP_ID=$ONESIGNAL_APP_ID_DEBUG"
echo "RELEASE_ONESIGNAL_APP_ID=$ONESIGNAL_APP_ID_RELEASE"
