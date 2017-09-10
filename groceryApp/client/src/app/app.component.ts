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
				if (item.bought == false) {
					this.itemBoxes.push(new ItemBox(item));
				} else {
					this.itemBoxesBought.push(new ItemBox(item));
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
			this.itemBoxes.push(new ItemBox(item));
		});
	}

	public deleteItem(item: Item) {
		console.log("deleteItem " + item.name);
	}

	public editBoxContent(itemBox: ItemBox) {
		let editOKBox = document.getElementById(itemBox.item.id + "_editOK");
		let editCancelBox = document.getElementById(itemBox.item.id + "_editCancel");
		let nameBox = document.getElementById(itemBox.item.id + "_name");
		let priceBox = document.getElementById(itemBox.item.id + "_price");
		document.getElementById(itemBox.item.id + "_delete").innerHTML = "";
		document.getElementById(itemBox.item.id + "_bought").innerHTML = "";

		editOKBox.querySelector('button').className = "btn btn-success btn-xs";

		editCancelBox.innerHTML = '<button class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-pencil"></span></button>';
		editCancelBox.querySelector('button').addEventListener('click', (event) => this.editBoxContentFinish(itemBox));

		nameBox.innerHTML = '<input type="text" style="height: 26px;border-radius: 3px;border-style: solid;border-color: #8d8d8d;border-width: 1px;" value=' + nameBox.innerHTML + '></input>';
		priceBox.innerHTML = '<input type="text" style="width: 60px;height: 26px;border-radius: 3px;border-style: solid;border-color: #8d8d8d;border-width: 1px;" value=' + priceBox.innerHTML + '></input> $';

		itemBox.editFunctionNameButton = 'editBoxContentFinish'
	}

	public editBoxContentFinish(itemBox: ItemBox) {
		let editOKBox = document.getElementById(itemBox.item.id + "_editOK");
		let deleteBox = document.getElementById(itemBox.item.id + "_delete");
		let markBoughtBox = document.getElementById(itemBox.item.id + "_bought");
		let nameBox = document.getElementById(itemBox.item.id + "_name");
		let priceBox = document.getElementById(itemBox.item.id + "_price");
		document.getElementById(itemBox.item.id + "_editCancel").innerHTML = "";

		nameBox.innerHTML = nameBox.querySelector("input").value;
		priceBox.innerHTML = priceBox.querySelector("input").value + " $";

		deleteBox.innerHTML = '<button class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>';
		deleteBox.querySelector('button').addEventListener('click', (event) => this.deleteItem(itemBox.item));

		if (itemBox.item.bought == false) {
			markBoughtBox.innerHTML = '<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-ok"></span></button>';
		} else {
			markBoughtBox.innerHTML = '<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon glyphicon-minus"></span></button>';
		}
		markBoughtBox.querySelector('button').addEventListener('click', (event) => this.markItemBought(itemBox));

		editOKBox.querySelector('button').className = "btn btn-primary btn-xs";
		itemBox.editFunctionNameButton = 'editBoxContent'
	}



}
