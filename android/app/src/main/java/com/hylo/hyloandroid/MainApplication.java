package com.hylo.hyloandroid;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import io.sentry.RNSentryPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import im.shimo.react.prompt.RNPromptPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.imagepicker.ImagePickerPackage;

import java.util.Arrays;
import java.util.List;

import com.oblador.vectoricons.VectorIconsPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new IntercomPackage(),
            new RNGoogleSigninPackage(),
            new RNSentryPackage(MainApplication.this),
            new ReactNativeRestartPackage(),
            new ReactNativeDocumentPicker(),
            new RNPromptPackage(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new BackgroundTimerPackage(),
            new ReactNativeOneSignalPackage(),
            new RNMixpanel(),
          new ImagePickerPackage(),
          new FBSDKPackage(mCallbackManager),
          new VectorIconsPackage(),
          new WebViewBridgePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());

    SoLoader.init(this, /* native exopackage */ false);
  }
}
