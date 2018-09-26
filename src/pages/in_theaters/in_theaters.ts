import { Component ,ViewChild,ChangeDetectorRef,ElementRef} from '@angular/core';
import { NavController,LoadingController,Content,NavParams,ToastController } from 'ionic-angular';

import {SubjectPage} from '../subject/subject';
import {ProvidersHttpServiceProvider} from '../../providers/providers-http-service/providers-http-service';
import {LoginPage} from '../login/login';
import {DatabaseProvider} from '../../providers/database/database';

@Component({
  selector: 'page-in_theaters',
  templateUrl: 'in_theaters.html'
})
export class IntheatersPage {

  public listData:any=[];
  public title="";
  public hasmore:any = true;
  private start = 0;
  private count = 20;
  public topflag = false;
  public search:any = "";

  //没有搜索数据
  public searchFlag = false;

  @ViewChild(Content) content: Content;
  //回顶dom
  @ViewChild('loginbox') loginColor:ElementRef;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private load:ProvidersHttpServiceProvider,
              private  cd:ChangeDetectorRef,
              public navParams:NavParams,
              private toastCtrl:ToastController,
              private dataService:DatabaseProvider) {
        this.loginColorToggle();
  }

  //改变头像颜色
  loginColorToggle(){
     var _that = this;
     setInterval(()=>{
      _that.dataService.getAllData().then((data)=> {
        for(var i in data){
          if(data[i].status == 1){
            _that.setStyle(_that.loginColor,"color", 'red');
            _that.cd.detectChanges(); //好像不起作用
            return;
          }
        }
      }).catch((error)=> {
        console.log(error);
      })
  },1000);
  }

  //跳转到登录
  loginFun(){
    this.navCtrl.push(LoginPage);
  }

  setStyle(dom,pro,value){
    let el:HTMLElement = <HTMLElement>dom.nativeElement;
    el.style[pro] = value;
  }
  /*回顶部*/
  scrollTo(e){
    e.stopPropagation();
    this.content.scrollTo(0,0, 2000);
    this.cd.detectChanges();
  }
  /*监听屏幕滚动数值*/
  check(){
    var _that = this;
    if(_that.content.scrollTop > 400){
      _that.topflag = true;
    }else{
      _that.topflag = false;
    }
    _that.cd.detectChanges();
  }

  //搜索
  searchFun(search){
    if(search != "" && search != undefined) {
      //加载数据中
      let loading = this.loadingCtrl.create({
        content: '加载数据中...'//数据加载中显示
      });
      //显示等待样式
      loading.present();
      // 网络请求
      var _that = this;
      this.load.httpService("http://api.douban.com/v2/movie/search",
        {q:search},
        function (data) {
          console.log(data);
          if(data.subjects.length == 0){
            console.log("没有更多数据了");
            _that.hasmore = false;
            _that.searchFlag = true; //显示没搜索到内容
            _that.listData = [];
            loading.dismiss();//显示多久消失
            return;
          }else{
            _that.title = data.title;
            _that.listData = data.subjects;
          }
           //隐藏等待样式，同时同步跨域请求
          loading.dismiss();//显示多久消失
        });
    }else{
       this.ionViewDidLoad();
    }
  }
  keyFun(key,search){
      if(key.keyCode === 13 && search != undefined){
        this.searchFun(search);
      }
  }
  //详细信息
  goDetailedInfo(id){
    this.navCtrl.push(SubjectPage,{id:id});
  }

  //首页载
  ionViewDidLoad() {
    var _that = this;
    //查看是否登录
    _that.loginColorToggle();
    //加载数据中
     let loading = _that.loadingCtrl.create({
       content: '加载数据中...'//数据加载中显示
     });
     //显示等待样式
    loading.present();
    // 网络请求
    _that.load.httpService("http://api.douban.com/v2/movie/in_theaters",
      {count:_that.count,start:_that.start},
      function (data) {

      if(data.subjects.length == 0){
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
//上拉加载更多
  doInfinite(infiniteScroll) {
    var _that = this;
    //如果是搜索不作加载更多
    if(_that.search != "" && _that.search != undefined){
      console.log(_that.search + "123");
      infiniteScroll.complete();
      return;
    }
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
     _that.searchFlag = false;
     _that.search = "";
    setTimeout(()=>{
      //清空所有数据重新加载
      _that.listData = [];
      _that.start = 0;
      _that.ionViewDidLoad();
      //加载完成后，关闭刷新
      e.complete();
      _that.showInfo("加载完成");
    },1000)
  }

  //加载完成后提示
  showInfo(msg){
    let toast = this.toastCtrl.create({
      message: msg, //提示消息
      duration: 2000,//3秒后自动消失
      position: 'top',//位置top,bottom
      showCloseButton:true, //是否显示关闭按钮
      closeButtonText:"关闭" //关闭按钮字段
    });

    //关闭后执行的操作
    toast.onDidDismiss(() => { console.log('toast被关闭之后执行'); });

    //显示toast
    toast.present();//符合触发条件后立即执行显示。
  }


}
