import { Component, OnInit } from '@angular/core';

import { LoopBackConfig } from './sdk';
import { Items } from './sdk/models';
import { ItemsApi } from './sdk/services';
import { Item } from './item';
import { ItemBox } from './itemBox';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [ItemsApi],
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	totalCount = "Loading...";
	totalPrice: number;
	itemBoxes: ItemBox[] = [];
	itemBoxesBought: ItemBox[] = [];

	constructor(private itemsApi: ItemsApi) {
		LoopBackConfig.setBaseURL("http://127.0.0.1:3000");
		LoopBackConfig.setApiVersion("api");
	}

	ngOnInit() {
		this.getItemsCount();
		this.getItemsPriceTotal();
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
				var itemBox = new ItemBox(item);
				if (item.bought == false) {
					this.itemBoxes.push(itemBox);
				} else {
					this.itemBoxesBought.push(itemBox);
				}
			}
		});
	}

	public getItemById(id): Item {
		var out = new Item("");
		this.itemsApi.findById(id).subscribe((res: Item) => {
			out = res;
		});
		return out;
	}

	public markItemBought(currentItemBox: ItemBox) {
		var inBool = currentItemBox.item.bought;
		var out = currentItemBox.item.bought;
		if (inBool == false) out = true;
		if (inBool == true) out = false;
		currentItemBox.item.bought = out;
		this.itemsApi.updateAttributes(currentItemBox.item.id, currentItemBox.item).subscribe(success => {
			if (inBool == false) {
				this.itemBoxes.splice(this.itemBoxes.indexOf(currentItemBox, 0), 1);
				this.itemBoxesBought.push(currentItemBox);
			} else {
				this.itemBoxesBought.splice(this.itemBoxesBought.indexOf(currentItemBox, 0), 1);
				this.itemBoxes.push(currentItemBox);
			}

		});
		return out;
	}

	public addItem(name: string) {
		let item = new Item(name);
		this.itemsApi.create(item).subscribe((res: Item) => {
			var itemBox = new ItemBox(res);
			this.itemBoxes.push(itemBox);
			this.getItemsPriceTotal();
		});
	}

	public updateItem(itemBox: ItemBox) {
		this.itemsApi.updateAttributes(itemBox.item.id, itemBox.item).subscribe((res: Item) => {
		})

		this.editBoxContentFinish(itemBox)
	}

	public deleteItem(itemBox: ItemBox) {
		this.itemsApi.deleteById(itemBox.item.id).subscribe(res => {
			if (itemBox.item.bought == false) {
				this.itemBoxes.splice(this.itemBoxes.indexOf(itemBox, 0), 1);
			} else {
				this.itemBoxesBought.splice(this.itemBoxesBought.indexOf(itemBox, 0), 1);
			}
			this.getItemsPriceTotal();
		});
	}

	public editBoxContent(itemBox: ItemBox) {
		let editOKBox = document.getElementById(itemBox.item.id + "_editOK");
		let editCancelBox = document.getElementById(itemBox.item.id + "_editCancel");
		let nameBox = document.getElementById(itemBox.item.id + "_name");
		let priceBox = document.getElementById(itemBox.item.id + "_price");
		document.getElementById(itemBox.item.id + "_delete").innerHTML = "";
		document.getElementById(itemBox.item.id + "_bought").innerHTML = "";

		editOKBox.innerHTML = '<button class="btn btn-success btn-xs">OK</button>';
		editOKBox.querySelector('button').addEventListener('click', (event) => {
			itemBox.item.name = nameBox.querySelector("input").value
			var newPriceNumber = Number(priceBox.querySelector("input").value)
			if (!isNaN(newPriceNumber)) {
				itemBox.item.price = newPriceNumber;
			}

			this.updateItem(itemBox)
		})

		editCancelBox.innerHTML = '<button class="btn btn-danger btn-xs">Cancel</button>';
		editCancelBox.querySelector('button').addEventListener('click', (event) => this.editBoxContentFinish(itemBox));

		var name = itemBox.item.name.replace(" ", "&nbsp;")
		nameBox.innerHTML = '<input type="text" style="height: 26px;border-radius: 3px;border-style: solid;border-color: #8d8d8d;border-width: 1px;" value=' + name + '></input>';
		priceBox.innerHTML = '<input type="text" style="width: 60px;height: 26px;border-radius: 3px;border-style: solid;border-color: #8d8d8d;border-width: 1px;" value=' + itemBox.item.price + '></input> $';

		itemBox.editFunctionNameButton = 'editBoxContentFinish'
	}

	public editBoxContentFinish(itemBox: ItemBox) {
		let editOKBox = document.getElementById(itemBox.item.id + "_editOK");
		let deleteBox = document.getElementById(itemBox.item.id + "_delete");
		let markBoughtBox = document.getElementById(itemBox.item.id + "_bought");
		let nameBox = document.getElementById(itemBox.item.id + "_name");
		let priceBox = document.getElementById(itemBox.item.id + "_price");
		document.getElementById(itemBox.item.id + "_editCancel").innerHTML = "";

		nameBox.innerHTML = itemBox.item.name;
		priceBox.innerHTML = itemBox.item.price + " $";

		deleteBox.innerHTML = '<button class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>';
		deleteBox.querySelector('button').addEventListener('click', (event) => this.deleteItem(itemBox));

		if (itemBox.item.bought == false) {
			markBoughtBox.innerHTML = '<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-ok"></span></button>';
		} else {
			markBoughtBox.innerHTML = '<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon glyphicon-minus"></span></button>';
		}
		markBoughtBox.querySelector('button').addEventListener('click', (event) => this.markItemBought(itemBox));

		editOKBox.innerHTML = '<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-pencil"></span></button>';
		editOKBox.querySelector('button').addEventListener('click', (event) => this.editBoxContent(itemBox));

		itemBox.editFunctionNameButton = 'editBoxContent'
	}



}
