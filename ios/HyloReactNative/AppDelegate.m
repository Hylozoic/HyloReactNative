/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Intercom/intercom.h>
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate
@synthesize oneSignal = _oneSignal;

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation
          ] ||
          [RNGoogleSignin application:application
                              openURL:url
                    sourceApplication:sourceApplication
                           annotation:annotation
          ] ||
          [RCTLinkingManager application:application
                                 openURL:url
                       sourceApplication:sourceApplication
                              annotation:annotation
          ];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Intercom setApiKey:@"ios_sdk-b11cb526589263a9890b895d40b934bffa876c43" forAppId:@"wwelodje"];

  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"HyloReactNative"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  [RNSentry installWithRootView:rootView];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  NSString *oneSignalAppID = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"OneSignalAppID"];
  self.oneSignal = [[RCTOneSignal alloc] initWithLaunchOptions:launchOptions
                                                         appId:oneSignalAppID
                                                      settings:@{
                                                        kOSSettingsKeyInFocusDisplayOption: @(OSNotificationDisplayTypeNone),
                                                        kOSSettingsKeyAutoPrompt: @false
                                                      }];

  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    // Intercom
    [Intercom setDeviceToken:deviceToken];
}

// Universal Linking
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

@end
