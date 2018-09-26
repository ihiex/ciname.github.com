import { Component,ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
// import {GlobalData} from "../providers/GlobalData";
import {Platform, Nav,ToastController, Keyboard, IonicApp,App} from 'ionic-angular';
// import {Storage} from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  backButtonPressed: boolean = false;// 返回键是否已触发

   @ViewChild(Nav) nav:Nav

  constructor(private platform: Platform,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,

              public keyboard: Keyboard,
              public ionicApp: IonicApp,
              private toast: ToastController ,
              private appCtrl:App ,
              ) {
           this.init();
  }

/**
     * 初始化
     */
    init() {
      let that = this;

      // 启动完成
      that.platform.ready().then(() => {
          // 获取token并放入全局变量
          // this.storage.get('token').then(function (token) {
          //     // that.globalData.token = token;
          // })

          // 隐藏启动页
          that.splashScreen.hide();

          // 设置状态栏
          that.statusBar.styleDefault();
          that.statusBar.styleLightContent();

          // 注册返回按键事件
          that.platform.registerBackButtonAction((): any => {
              //按下返回键时，先关闭键盘
              if (that.keyboard.isOpen()) {
                  //按下返回键时，先关闭键盘
                  that.keyboard.close();
                  return;
              };
              //
              let activePortal = that.ionicApp._modalPortal.getActive() ||that.ionicApp._overlayPortal.getActive();
              //取得正在加载的
              let loadingPortal = that.ionicApp._loadingPortal.getActive();
              if (activePortal) {
                  //其他的关闭
                  activePortal.dismiss().catch(() => {
                  });
                  activePortal.onDidDismiss(() => {
                  });
                  return;
              }
              if (loadingPortal) {
                  //loading的话，返回键无效
                  return;
              }

              // 获取当前视图;
              let activeVC = that.appCtrl.getActiveNavs()[0].getActive().component;
              let page = activeVC.instance;
              if (!(page instanceof TabsPage)) {
                //如果不是一个有效页面，反之是tabs页
                  if (!that.nav.canGoBack()) {
                      // 当前页面为tabs，退出APP
                      return that.showExit();
                  }
                  // 当前页面为tabs的子页面，正常返回
                  return that.nav.pop();
              }

              let activeNav = that.appCtrl.getActiveNavs()[0].getActive() === that.nav.getPrevious(that.rootPage);
              if (activeNav) {
                  // 当前页面为tab栏，退出APP
                  return that.showExit();
              }
              // 当前页面为tab栏的子页面，正常返回 也可以用appCtrl.goBack();
              return that.nav.pop();
          }, 101);

      });
  }

  // 双击退出提示框
  showExit() {
      if (this.backButtonPressed) {
          // 当触发标志为true时，双击返回按键则退出APP
          this.platform.exitApp();
      } else {
          let toast = this.toast.create({
              message: '再按一次退出应用',
              duration: 2000,
              position: 'bottom'
          });
          toast.present();
          this.backButtonPressed = true;
          // 2秒内没有再次点击返回则将触发标志标记为false
          setTimeout(() => {
              this.backButtonPressed = false;
          }, 2000)
      }
  }


}
