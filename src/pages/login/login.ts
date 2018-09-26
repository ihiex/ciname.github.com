import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';

import {DatabaseProvider} from '../../providers/database/database';
import {MyApp} from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginFlag = true;
  //是否同意协议
  public checked:any = null;
  public userName:string = "";
  public pwd:string = "";
  public againPwd:string = "";
  public phone:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toast:ToastController,
              private dataService:DatabaseProvider
            ) {
  }

  ionViewDidLoad() {}

  statuZero(data,value){
    data.status = value;
    this.dataService.updata(data.phone, data);
  }

  //登录或注册
  loginFun(falg){
    var _that = this;
    //0注册,1登录
    switch (falg){
      case 0:
        if(_that.userName != "" && _that.pwd === _that.againPwd && _that.pwd.length >= 6){
          //注册成功将所有其它用户的状态改为0
          _that.dataService.getAllData().then(data=>{
            for(let i in data){
             _that.statuZero(data[i],0);
            }
          })
          //新用户数据
          let data = {phone: _that.phone, username: _that.userName, password: _that.pwd,imagepath:"",status:1};
          _that.dataService.addData(data)
          .then(function (value) {
            if(value === 1){
                //第二参数主要是给跳转页面传参数的
                _that.navCtrl.push(MyApp);
            }
          })
          .catch(function (error) {
            this.showMsg("注册失败");
          });
        }
        break;
      case 1:
       _that.dataService.getAllData()
       .then((data)=>{
         for(let i in data){
            if(_that.userName === data[i].username && _that.pwd === data[i].password){

             //将所有用户状态修改为0;
             _that.dataService.getAllData()
             .then((data2)=>{
               for(var j in data2){
                _that.statuZero(data2[j],0);
               }
             });
             //注册成功后跳转至主页,添加定时器主要是为了解决数据存储时间慢
            setTimeout(function () {
              _that.statuZero(data[i],1); //如果放在定时器外，数据得不到修改
              _that.navCtrl.push(MyApp);
            },100);

            return;
            }
          }
       })
       .catch((err)=>{_that.showMsg("登录失败")});
        break;
      default:
    }
  }

  //显示登录、注册toggle
  showFun1(){
    this.loginFlag = true;
    //清空数据
    this.userName = "";
    this.pwd = "";
    this.againPwd = "";
    this.phone = "";
  }
  showFun2(){
    this.loginFlag = false;
    //清空数据
    this.userName = "";
    this.pwd = "";
    this.againPwd = "";
    this.phone = "";
  }

  //提示信息
  showMsg(msg:string){
    let toast = this.toast.create({
      message: ''+msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
