import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private iab: InAppBrowser) { 

  }

  openPreco(){
    this.iab.create('https://www.google.com.br/shopping?hl=pt-BR&source=og&tab=wf1', '_system');
  }

  openImagem(){
    this.iab.create('https://www.google.com.br/imghp?hl=pt-BR&tab=wi&ogbl', '_system');
  }
}
