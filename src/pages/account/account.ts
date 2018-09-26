import { Component,ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, AlertController,ActionSheetController} from 'ionic-angular';

import {MyApp} from '../../app/app.component';
import {CameraProvider} from '../../providers/camera/camera';
import {DatabaseProvider} from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public username:string = "";
  public imagePath:string = "";

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private dataService:DatabaseProvider,
              private actionSheetCtrl:ActionSheetController,
              private camera:CameraProvider,
              private cd:ChangeDetectorRef
            ) {
              let that = this;
              setInterval(()=>{
                that.getUserInfo();
                that.cd.detectChanges(); //好像不起作用
              },1000);
  }

//获取用户相关信息
getUserInfo(){
  var _that = this;
  _that.dataService.getAllData().then((data)=>{
    for(var i in data){
      if(data[i].status == 1){
        _that.username = data[i].username;
        _that.imagePath = data[i].imagePath;
        return;
      }
    }
  }).catch((error)=>{});
}

  //退出ionicPopup
  func_exitLogin(){
    var _that = this;
    let al = _that.alertCtrl.create({
      title: '',
      subTitle: '你确定要退出登录吗....',
      buttons: [{
        text: '取消',
        handler: data => {
          console.log('取消');
        }
      },
         {
        text: '确定',
        handler: data => {
          _that.dataService.getAllData().then((data)=>{
            for(var i in data){
              if(data[i].status == 1){
                data[i].status = 0;
                _that.dataService.updata(data[i].phone,data[i]);
                //退出后返回到主页
                setTimeout(()=>{
                  _that.navCtrl.push(MyApp);
                },500);
                return;
              }
            }
          })
        }
      }]
    });
    al.present();
  }

  //打电话功能
  // func_callPhone(number){
  //   window.location.href="tel:"+number;
  // }

   //更换头像
   presentActionSheet() {
    var _that = this;
    // this.imgService.showPicActionSheet();
    let actionSheet = this.actionSheetCtrl.create({
      title: '更换头像',
      cssClass:'headChoice',
      buttons: [
        {
          text: '拍照',
          icon: 'ios-arrow-forward',
          role: 'destructive',
          handler: () => {
            _that.camera.getCamera();
            _that.getUserInfo();
          }
        },{
          text: '从相册选择',
          icon: 'ios-arrow-forward',
          handler: () => {
            _that.camera.getImage();
            _that.getUserInfo();
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

}
