import { Component,ViewChild ,ChangeDetectorRef} from '@angular/core';
import { NavController,LoadingController,Content,ToastController } from 'ionic-angular';

import { SubjectPage } from '../subject/subject';
import {ProvidersHttpServiceProvider} from '../../providers/providers-http-service/providers-http-service';

@Component({
  selector: 'page-top250',
  templateUrl: 'top250.html'
})
export class Top250Page {

  public title="";
  public listData = [];
  public hasmore:any = true;
  private start = 0;
  private count = 20;
  public topflag = false;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private load:ProvidersHttpServiceProvider,
              private  cd:ChangeDetectorRef,
              private toastCtrl:ToastController) {
  }

  //页面数据加载
  ionViewDidLoad() {
    //加载数据中
    let loading = this.loadingCtrl.create({
      content: '加载数据中...'//数据加载中显示
    });
    //显示等待样式
    loading.present();
    // 网络请求
    var _that = this;
    this.load.httpService("http://api.douban.com/v2/movie/top250",
      {count:_that.count,start:_that.start},
      function (data) {
      if(data.subjects.length ==0){
        console.log("没有更多数据了");
        _that.hasmore = false;
        loading.dismiss();//显示多久消失
        return;
      }else{
        _that.title = data.title;
        _that.listData = _that.listData.concat(data.subjects);
        //同步跨域请求
        loading.dismiss();//显示多久消失
      }
      });
  }
private loadFlag = true;
  //滚动到页脚时触发的函数用于加载数据
 //上拉加载更多
 doInfinite(infiniteScroll) {
  var _that = this;
  if(_that.loadFlag){
    _that.loadFlag = false;
    if(_that.hasmore){
     _that.start += 20;
     _that.ionViewDidLoad();
    }
   }
  setTimeout(() => {
    infiniteScroll.complete();
    _that.loadFlag = true;
  }, 1000);
}

 //下拉刷新
 doRefresh(e){
   var _that = this;
  setTimeout(()=>{
    //清空所有数据重新加载
    _that.listData = [];
    _that.start = 0;
    _that.ionViewDidLoad();
    //加载完成后，关闭刷新
    e.complete();
    this.showInfo("加载完成");
  },1000)
}

//加载完成后提示
showInfo(msg){
  let toast = this.toastCtrl.create({
    message: msg, //提示消息
    duration: 1000,//3秒后自动消失
    position: 'top',//位置top,bottom
    showCloseButton:true, //是否显示关闭按钮
    closeButtonText:"关闭" //关闭按钮字段
  });

  //关闭后执行的操作
  toast.onDidDismiss(() => { console.log('toast被关闭之后执行'); });

  //显示toast
  toast.present();//符合触发条件后立即执行显示。
}


  //详细信息
  goDetailedInfo(id){
    this.navCtrl.push(SubjectPage,{id:id});
  }
  /*回顶部*/
  scrollTo(e){
    e.stopPropagation();
    this.content.scrollTo(0,0, 2000);
    this.cd.detectChanges();
  }
  /*监听屏幕滚动数值*/
  private checkFlag = true;
  check(){
    var _that = this;
    if(_that.content.scrollTop > 400){
      if(_that.checkFlag){
        _that.checkFlag = false;
        _that.topflag = true;
        _that.cd.detectChanges();
      }
    }else{
      if(!_that.checkFlag){
        _that.checkFlag = true;
        _that.topflag = false;
        _that.cd.detectChanges();
      }
    }
  }
}
