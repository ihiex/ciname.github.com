import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {ProvidersHttpServiceProvider} from '../../providers/providers-http-service/providers-http-service';
/**
 * Generated class for the SubjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subject',
  templateUrl: 'subject.html',
})
export class SubjectPage {

  public data:any={};
  public genres:any[];  //类型
  public imgSrc:string;　
  public directors:any[];　//导演
  public countries:any[]; //地区
  public casts:any[]; //演员

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private load:ProvidersHttpServiceProvider) {
    //加载数据中
    let loading = this.loadingCtrl.create({
      content: '加载数据中...'//数据加载中显示
    });
    //显示等待样式
    loading.present();
    // 网络请求
    var _that = this;
    this.load.httpService("http://api.douban.com/v2/movie/subject/" + navParams.data.id,
      {},
      function (data) {

        _that.data = data;
        _that.casts = data.casts;
        _that.imgSrc = data.images.large;
        _that.genres = data.genres;
        _that.directors = data.directors;
        _that.countries = data.countries;

        //隐藏等待样式，同时同步跨域请求
        loading.dismiss();//显示多久消失
      });
  }
}
