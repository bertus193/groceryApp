import { Component, OnInit } from '@angular/core';

import { LoopBackConfig } from './sdk';
import { Items } from './sdk/models';
import { ItemsApi } from './sdk/services';
import { Item } from './item';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [ItemsApi],
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	totalCount = "Loading...";
	items: Item[] = [];

	constructor(private itemsApi: ItemsApi) {
		LoopBackConfig.setBaseURL("http://127.0.0.1:3000");
		LoopBackConfig.setApiVersion("api");
	}

	ngOnInit() {
		this.getItemsCount();
		this.getItemById("59b1979ee9d20e1def531938");
	}

	private getItemsCount() {
		this.itemsApi.count().
			subscribe(
			data => {
				console.log(data);
				this.totalCount = "total " + data.count;
			},
			error => console.log("Error getItems() found")
			);
	}

	private getItemById(id) {
		this.itemsApi.findById(id)
			.subscribe((res: Item) => {
				console.log(res.name);
				this.items.push(res);
				//this.items = "total " + data;
			},
			error => console.log("Error getItemById() found" + error)
			);
	}
}
