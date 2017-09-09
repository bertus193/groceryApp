import { Component, OnInit } from '@angular/core';

import { LoopBackConfig } from './sdk';
import { Items } from './sdk/models';
import { ItemsApi } from './sdk/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ItemsApi],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = "Cargando...";

  constructor(private items: ItemsApi) {
    LoopBackConfig.setBaseURL("http://127.0.0.1:3000");
    LoopBackConfig.setApiVersion("api");
  }

  ngOnInit() {
    this.getItems();
  }


  private getItems() {
    this.items.count().
      subscribe(
      data => {
        this.title = "total " + data.count;
      },
      error => console.log("Error getItems() found")
      );
  }
}
