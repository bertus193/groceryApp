import { Component } from '@angular/core';

import { LoopBackConfig } from './sdk';
import { Items } from './sdk/models';
import { ItemsApi } from './sdk/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ItemsApi],
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private items: ItemsApi) {
    LoopBackConfig.setBaseURL("127.0.0.1:3000");
    LoopBackConfig.setApiVersion("api");
  }

  private getItems(): String {
    let itemCount;

    this.items.count().subscribe(data => {
      itemCount = data;
      console.log(itemCount);
    });
    return "salida" + this.items.count();
  }

  title = this.getItems();
}
