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
		//this.getItemById("59b1979ee9d20e1def531938");
		this.getItems();
	}

	public getItemsCount() {
		this.itemsApi.count().
			subscribe(
			data => {
				this.totalCount = "total " + data.count;
			},
			error => console.log("Error getItemsCount() found" + error)
			);
	}

	public getItems() {
		this.itemsApi.find()
			.subscribe((res: Item[]) => {
				this.items = res;
			},
			error => console.log("Error getItemById() found" + error)
			);
	}

	public getItemById(id): Item {
		var out = new Item();
		this.itemsApi.findById(id)
			.subscribe((res: Item) => {
				out = res;
			},
			error => console.log("Error getItemById() found" + error)
			);
		return out;
	}
	public showPopup() { console.log("dasas"); }

	public markItemBought(id): boolean {
		var item: Item = this.getItemById(id);
		var out = item.bought;
		if (out == false) {
			out = true;
		} else {
			out = false;
		}
		console.log(out);
		return out;
	}

}
