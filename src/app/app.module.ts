import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler ,} from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage'; //数据库模块
// 页面组件
import { ComingSoonPage } from '../pages/coming_soon/coming_soon';
import { Top250Page } from '../pages/top250/top250';
import { IntheatersPage } from '../pages/in_theaters/in_theaters';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPageModule} from '../pages/login/login.module';
import {AccountPageModule} from '../pages/account/account.module';
import {SubjectPageModule} from '../pages/subject/subject.module';
//服务组件
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProvidersHttpServiceProvider } from '../providers/providers-http-service/providers-http-service';
import { BackButtonServiceProvider } from '../providers/back-button-service/back-button-service';

//相机图片组件
import { Camera } from '@ionic-native/camera';
import { ImagePicker} from '@ionic-native/image-picker';
//文件
import { File } from '@ionic-native/file';
import { CameraProvider } from '../providers/camera/camera';
import { DatabaseProvider } from '../providers/database/database';

@NgModule({
  declarations: [ /*申明组件*/
    MyApp,
    ComingSoonPage,
    Top250Page,
    IntheatersPage,
    TabsPage
  ],
  imports: [ /*引入的模块　依赖的模块*/
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:'true',   //隐藏全部子页面的tabs
      backButtonText:'返回', /*配置返回按钮*/
      backButtonIcon: 'ios-arrow-back',//按钮图标样式
    }),
    HttpClientModule,
    LoginPageModule,
    IonicStorageModule.forRoot({
      name:'cinemaData',
      driverOrder:['indexeddb','websql','sqlist']
    }),
    AccountPageModule,
    SubjectPageModule
  ],
  bootstrap: [IonicApp],  /*启动模块 */
  entryComponents: [ /*配置不会在模板中使用的组件*/
    MyApp,
    ComingSoonPage,
    Top250Page,
    IntheatersPage,
    TabsPage
  ],
  providers: [ /*配置服务*/
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProvidersHttpServiceProvider,
    BackButtonServiceProvider,
    Camera,
    ImagePicker,
    //FileTransfer,
    File,
    CameraProvider,
    DatabaseProvider
  ]
})
export class AppModule {}
