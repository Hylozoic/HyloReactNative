#import "AppDelegate.h"
#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

// Added libraries
#import "RNBootSplash.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <Intercom/Intercom.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif
  RCTBridge *bridge = [[RCTBridge alloc]
    initWithDelegate:self
    launchOptions:launchOptions
  ];
  #if RCT_DEV
    [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif
  RCTRootView *rootView = [[RCTRootView alloc]
    initWithBridge:bridge
    moduleName:@"HyloReactNative"
    initialProperties:nil
  ];
  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }
  self.window = [[UIWindow alloc]
    initWithFrame:[UIScreen mainScreen].bounds
  ];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // react-native-bootsplash
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
  //  For Facebook SDK
  [[FBSDKApplicationDelegate sharedInstance]
    application:application
    didFinishLaunchingWithOptions:launchOptions
  ];
  // For Intercom
  [Intercom
    setApiKey:@"ios_sdk-b11cb526589263a9890b895d40b934bffa876c43"
    forAppId:@"wwelodje"
  ];

  return YES;
}

- (BOOL)application:(UIApplication *)application
  openURL:(NSURL *)url
  options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance]
    application:application
    openURL:url
    options:options
  ];
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

  return handledFB || handledGG || handledRCT;
}

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

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
