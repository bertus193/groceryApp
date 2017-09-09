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
	totalPrice: number;
	items: Item[] = [];
	itemsBought: Item[] = [];

	constructor(private itemsApi: ItemsApi) {
		LoopBackConfig.setBaseURL("http://127.0.0.1:3000");
		LoopBackConfig.setApiVersion("api");
	}

	ngOnInit() {
		this.getItemsCount();
		this.getItemsPriceTotal();
		//this.getItemById("59b1979ee9d20e1def531938");
		this.getItems();
	}

	public getItemsCount() {
		this.itemsApi.count().subscribe(data => {
			this.totalCount = String(data.count);
		});
	}

	public getItemsPriceTotal() {
		this.totalPrice = 0;
		this.itemsApi.find().subscribe((res: Item[]) => {
			for (let item of res) {
				this.totalPrice += item.price;
			}
		});
	}

	public getItems() {
		this.itemsApi.find().subscribe((res: Item[]) => {
			for (let item of res) {
				if (item.bought == false) {
					this.items.push(item);
				} else {
					this.itemsBought.push(item);
				}
			}
		});
	}

	public getItemById(id): Item {
		var out = new Item();
		this.itemsApi.findById(id).subscribe((res: Item) => {
			out = res;
		});
		return out;
	}

	private async delay(milliseconds: number) {
		return new Promise<void>(resolve => {
			setTimeout(resolve, milliseconds);
		});
	}

	public markItemBought(item: Item): boolean {
		var inBool = item.bought;
		var out = item.bought;
		if (inBool == false) {
			out = true;
		} else {
			out = false;
		}
		item.bought = out;
		this.itemsApi.updateAttributes(item.id, item).subscribe(success => {
			if (inBool == false) {
				this.items.splice(this.items.indexOf(item, 0), 1);
				this.itemsBought.push(item);
			} else {
				this.itemsBought.splice(this.itemsBought.indexOf(item, 0), 1);
				this.items.push(item);
			}

		});
		return out;
	}

}
