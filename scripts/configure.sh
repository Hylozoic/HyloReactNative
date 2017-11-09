source ../.env

if [ -z ${FACEBOOK_APP_ID_DEV+x} ]; then echo "ERROR: Missing appropriate config in .env. eg: FACEBOOK_APP_ID_DEV"; exit 1; else echo "Configuring Project:"; fi

echo "creating ios/debug.xcconfig"

cat > ../ios/debug.xcconfig <<EOL
#include "./Pods/Target Support Files/Pods-HyloReactNative/Pods-HyloReactNative.debug.xcconfig"
FACEBOOK_APP_ID = $FACEBOOK_APP_ID_DEV
ONESIGNAL_APP_ID = $ONESIGNAL_APP_ID_DEV

EOL

echo "creating ios/release.xcconfig"

cat > ../ios/release.xcconfig <<EOL
#include "./Pods/Target Support Files/Pods-HyloReactNative/Pods-HyloReactNative.release.xcconfig"
FACEBOOK_APP_ID = $FACEBOOK_APP_ID_RELEASE
ONESIGNAL_APP_ID = $ONESIGNAL_APP_ID_RELEASE

EOL

echo "creating android/app/src/debug/res/values/strings.xml"

mkdir -p ../android/app/src/debug/res/values
cat > ../android/app/src/debug/res/values/strings.xml <<EOL
<resources>
    <string name="facebook_app_id">$FACEBOOK_APP_ID_DEV</string>
</resources>

EOL

echo "creating android/app/src/release/res/values/strings.xml"

mkdir -p ../android/app/src/release/res/values
cat > ../android/app/src/release/res/values/strings.xml <<EOL
<resources>
    <string name="facebook_app_id">$FACEBOOK_APP_ID_RELEASE</string>
</resources>

EOL

echo ""
echo "IMPORTANT!!! Final Step:"
echo "Add the following values to your ~/.gradle/gradle.properties":
echo ""
echo "DEBUG_ONESIGNAL_APP_ID=$ONESIGNAL_APP_ID_DEV"
echo "RELEASE_ONESIGNAL_APP_ID=$ONESIGNAL_APP_ID_RELEASE"
