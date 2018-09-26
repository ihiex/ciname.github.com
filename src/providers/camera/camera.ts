import { Injectable } from '@angular/core';
import {ToastController } from 'ionic-angular';
//相机图片
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker';
import { Camera ,CameraOptions } from '@ionic-native/camera';
//数据库
import {DatabaseProvider} from '../../providers/database/database';

//文件操作
import { File } from '@ionic-native/file';

@Injectable()
export class CameraProvider {

  constructor(private camera:Camera,
              private imagePicker:ImagePicker,
              private file:File,
              private toast:ToastController,
              private dataService:DatabaseProvider) {
    //初始化文件夹
    this.createDir("cinema");
    this.createDir("cinema/user_images");
    this.checkDir();
  }

  getCamera(){
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit:true,     //如果想要在拍照后编辑，必须添加saveToPhotoAlbum:true
      saveToPhotoAlbum:true
    }

    this.camera.getPicture(options).then((imageData) => {
      let path = imageData.slice(0,imageData.lastIndexOf("/"));
      let fileName = imageData.slice(imageData.lastIndexOf("/")+1);
      this.copyFile_(path,fileName);
    }, (err) => {
      this.toastShow("相机获取图片失败");
    });

  }

  getImage(){
    // 设置选项
    const options: ImagePickerOptions = {
      maximumImagesCount: 2,    //可以选择的张数　最多１５
      width: 1024,
      height: 1024,
      quality: 100  //图片质量０－１００
    };
    // 获取图片
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          let path = results[i].slice(0,results[i].lastIndexOf("/"));
          let fileName = results[i].slice(results[i].lastIndexOf("/")+1);
          this.copyFile_(path,fileName);
      }
    }, (err) => {
      this.toastShow("获取图片失败");
    });

  }

  createDir(fileName){
    this.file.createDir(this.file.externalRootDirectory,fileName,false);
  }

  checkDir(){
    this.file.checkDir(this.file.externalRootDirectory,'cinema')
    .then((bool)=>{})
    .catch((err)=>{
      //文件夹初始化失败则再次创建文件夹
      this.createDir("cinema");
      setTimeout(()=>{ this.createDir("cinema/user_images")},2000);
    });
  }

  copyFile_(path, fileName){
    let that = this;
    that.file.copyFile(path,fileName,this.file.externalRootDirectory + "cinema/user_images",fileName)
    .then((bool)=>{
      that.dataService.getAllData().then(data=>{
        for (const key in data) {
          if (data[key].status == 1) {
            data[key].imagePath = (that.file.externalRootDirectory + "cinema/user_images/" + fileName);
            that.dataService.updata(data[key].phone,data[key]);
            return;
          }
        }
      })
    })
    .catch((err)=>{});
  }

  toastShow(msg){
    this.toast.create({
      message: ''+ msg,
      duration: 5000,
      position: 'top'
    }).present();
  }

}
