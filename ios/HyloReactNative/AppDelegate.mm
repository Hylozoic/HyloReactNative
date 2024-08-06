#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

// Added libraries
#import "RNBootSplash.h"
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <IntercomModule.h>

@implementation AppDelegate

- (BOOL)bridgelessEnabled {
    return NO;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"HyloReactNative";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Intercom
  [IntercomModule
    initialize:@"ios_sdk-b11cb526589263a9890b895d40b934bffa876c43"
    withAppId:@"wwelodje"
  ];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Hylo url/linking and social auth related
- (BOOL)application:(UIApplication *)application
  openURL:(NSURL *)url
  options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  BOOL handledGG = [RNGoogleSignin
    application:application
    openURL:url
    options:options
  ];
  BOOL handledRCT = [RCTLinkingManager
    application:application
    openURL:url
    options:options
  ];

  return handledGG || handledRCT;
}

// Hylo url/linking and app open/continuation related
- (BOOL)application:(UIApplication *)application
  continueUserActivity:(nonnull NSUserActivity *)userActivity
  restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager
    application:application
    continueUserActivity:userActivity
    restorationHandler:restorationHandler
  ];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// RNBootsplash
- (void)customizeRootView:(RCTRootView *)rootView {
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // ⬅️ initialize the splash screen
}

@end
