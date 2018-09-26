import { Component ,ViewChild} from '@angular/core';
import { Platform,Tabs } from 'ionic-angular';
import { ComingSoonPage } from '../coming_soon/coming_soon';
import { Top250Page } from '../top250/top250';
import { IntheatersPage } from '../in_theaters/in_theaters';
import {AccountPage} from '../account/account'

import {BackButtonServiceProvider} from '../../providers/back-button-service/back-button-service';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('myTabs') tabRef:Tabs;

  tab1Root = IntheatersPage;
  tab2Root = ComingSoonPage;
  tab3Root = Top250Page;
  tab4Root = AccountPage;

  constructor(platform: Platform,
    private back:BackButtonServiceProvider) {
      platform.ready().then(()=>{
        this.back.registerBackButtonAction(this.tabRef);
      })
  }
}
