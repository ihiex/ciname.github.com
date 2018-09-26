import { Injectable } from '@angular/core';

import {Storage} from '@ionic/storage';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(private storage:Storage) {
    console.log('Hello DatabaseProvider Provider');
  }

  addData(data){
    let that = this;
    return new Promise(function(resolve,reject){
      that.storage.set(data.phone,data)
      .then(()=>{resolve(1)})
      .catch(()=>{reject(-1)});
    });
  }

  updata(key,data){
    let that = this;
    return new Promise(function(resolve,reject){
      that.storage.set(key,data)
      .then(()=>{resolve(1)})
      .catch(()=>{reject(-1)});
    });
  }

  deleteData(key){
    let that = this;
    return new Promise(function(resolve,reject){
      that.storage.remove(key)
      .then(()=>{resolve(1)})
      .catch(()=>{reject(-1)});
    });
  }

  getData(key){
    let that = this;
    return new Promise(function(resolve,reject){
      that.storage.get(key)
      .then((data)=>{resolve(data)})
      .catch(()=>{reject(-1)});
    });
  }

  getAllData(){
    let that = this;
    let listdata = [];
    return new Promise(function(resolve,reject){
      that.storage.forEach(function(data){
        listdata.push(data);
      }).then(()=>{resolve(listdata)}).catch(()=>{reject(-1)});
    })
  }

  deleteAll(){
    this.storage.clear();
  }
}
