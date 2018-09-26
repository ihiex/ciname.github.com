import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Platform,ToastController, App,NavController,Tabs} from 'ionic-angular';

// import { ComingSoonPage } from '../../pages/coming_soon/coming_soon';
// import { Top250Page } from '../../pages/top250/top250';
// import { IntheatersPage } from '../../pages/in_theaters/in_theaters';
// import {AccountPage} from '../../pages/account/account';

@Injectable()
export class BackButtonServiceProvider {

 //控制硬件返回按钮是否触发，默认false
 backButtonPressed: boolean = false;

  constructor(public http: HttpClient,
              private platform:Platform,
              private appCtrl:App,
              private toastCtrl:ToastController) {
    console.log('Hello BackButtonServiceProvider Provider');
  }
//注册方法
 registerBackButtonAction(tabRef: Tabs): void {
  //registerBackButtonAction(){
    //registerBackButtonAction是系统自带的方法
    this.platform.registerBackButtonAction(() => {
      //获取NavController
      let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
      //如果可以返回上一页，则执行pop
      if (activeNav.canGoBack()) {
        activeNav.pop();
      } else {
        if (tabRef == null || tabRef._selectHistory[tabRef._selectHistory.length - 1] === tabRef.getByIndex(0).id) {
          //执行退出
          this.showExit();
        } else {
          //选择首页第一个的标签
          tabRef.select(0);
        }
      }
      /*
      if(this.checkPage){
        this.showExit();
      }else{
        this.appCtrl.goBack();
      }*/

    },101);
  }

  //退出应用方法
  private showExit(): void {
    //如果为true，退出
    if (this.backButtonPressed) {
      this.platform.exitApp();
    } else {
        //第一次按，弹出Toast
        this.toastCtrl.create({
            message: '再按一次退出应用',
            duration: 2000,
            position: 'top'
        }).present();
      //标记为true
      this.backButtonPressed = true;
      //两秒后标记为false，如果退出的话，就不会执行了
      setTimeout(() => this.backButtonPressed = false, 2000);
    }
  }

   /*  private checkPage = false;
    //判断当前页面是不是tabs上的几个主页面
    goBack(){
      var currentCmp = this.appCtrl.getActiveNavs()[0].getActive().component;
      var isComingSoonPage = (currentCmp === ComingSoonPage);
      var isTOP250Page = (currentCmp === Top250Page);
      var isIsHitPage = (currentCmp === IntheatersPage);
      var isAccountPage = (currentCmp === AccountPage);

      if(isAccountPage || isComingSoonPage || isTOP250Page || isIsHitPage){
        this.checkPage = true;
      }else{
        this.checkPage = false;
      }
    } */

}
