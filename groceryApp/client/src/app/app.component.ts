import { Component, OnInit } from '@angular/core'

import { LoopBackConfig } from './sdk'
import { Items } from './sdk/models'
import { ItemsApi } from './sdk/services'
import { Item } from './item'
import { ItemBox } from './itemBox'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	providers: [ItemsApi],
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	totalCount = "-"
	totalPrice: number
	itemBoxes: ItemBox[];
	itemBoxesBought: ItemBox[];
	autocompleteItems: Item[];

	constructor(private itemsApi: ItemsApi) {
		LoopBackConfig.setBaseURL("http://127.0.0.1:3000")
		LoopBackConfig.setApiVersion("api")
	}


	ngOnInit() {


		this.getItems()
		this.getItemsPriceTotal()
		this.getItemsCount()
		this.getAutocompleteItems()
	}

	public getItemsCount() {
		var out = 0;
		for (let i = 0; i < this.itemBoxes.length; i++) {
			if (this.itemBoxes[i].item.available == true) {
				out++;
			}
		}
		for (let i = 0; i < this.itemBoxesBought.length; i++) {
			if (this.itemBoxesBought[i].item.available == true) {
				out++;
			}
		}
		this.totalCount = String(out);
		/*this.itemsApi.count().subscribe(data => {
			this.totalCount = String(data.count)
		}, (error) => {
			this.handleError(error)
		})*/
	}

	public getItemsPriceTotal() {
		var out = 0;
		for (let i = 0; i < this.itemBoxes.length; i++) {
			if (this.itemBoxes[i].item.available == true) {
				out += this.itemBoxes[i].item.price;
			}
		}
		for (let i = 0; i < this.itemBoxesBought.length; i++) {
			if (this.itemBoxesBought[i].item.available == true) {
				out += this.itemBoxesBought[i].item.price;
			}
		}
		this.totalPrice = out;
	}

	public getItems() {
		this.itemBoxes = [];
		this.itemBoxesBought = [];
		this.itemsApi.find().subscribe((res: Item[]) => {
			for (var i = res.length - 1; i >= 0; i--) {
				if (res[i].available == true) {
					var itemBox = new ItemBox(res[i])
					if (res[i].bought == false) {
						this.itemBoxes.push(itemBox)
					} else {
						this.itemBoxesBought.push(itemBox)
					}
				}
			}
		}, (error) => {
			this.handleError(error)
		})
	}

	public getAutocompleteItems() {
		var count = 0
		this.autocompleteItems = [];
		this.itemsApi.find().subscribe((res: Item[]) => {
			for (var i = res.length - 1; i >= 0; i--) {
				if (count < 8) {
					this.autocompleteItems.push(res[i])
				}
				count++
			}
		}, (error) => {
			this.handleError(error)
		})
	}

	public getItemById(id): Item {
		var out = new Item("")
		this.itemsApi.findById(id).subscribe((res: Item) => {
			out = res
		}, (error) => {
			this.handleError(error)
		})
		return out
	}

	public markItemBought(currentItemBox: ItemBox) {
		var inBool = currentItemBox.item.bought
		var out = currentItemBox.item.bought
		if (inBool == false) out = true
		if (inBool == true) out = false
		currentItemBox.item.bought = out
		this.itemsApi.updateAttributes(currentItemBox.item.id, currentItemBox.item).subscribe(success => {
			if (inBool == false) {
				this.itemBoxes.splice(this.itemBoxes.indexOf(currentItemBox, 0), 1)
				this.itemBoxesBought.unshift(currentItemBox)
			} else {
				this.itemBoxesBought.splice(this.itemBoxesBought.indexOf(currentItemBox, 0), 1)
				this.itemBoxes.unshift(currentItemBox)
			}
		}, (error) => {
			this.handleError(error)
		})
		return out
	}

	public addItem(name: string, price?: number) {
		let item = new Item(name)
		if (price) { item = new Item(name, price) }

		this.itemsApi.create(item).subscribe((res: Item) => {
			var itemBox = new ItemBox(res)
			this.itemBoxes.unshift(itemBox)
			this.getItemsCount()
			this.getItemsPriceTotal()
			this.getAutocompleteItems()
		}, (error) => {
			this.handleError(error)
		})
	}

	public updateItem(itemBox: ItemBox) {
		this.itemsApi.updateAttributes(itemBox.item.id, itemBox.item).subscribe((res: Item) => {
		}, (error) => {
			this.handleError(error)
		})

		this.editBoxContentFinish(itemBox)
	}

	public deleteItem(itemBox: ItemBox) {
		itemBox.item.available = false
		this.updateItem(itemBox)
		this.getItemsCount()
		this.getItemsPriceTotal()
		if (itemBox.item.bought == false) {
			this.itemBoxes.splice(this.itemBoxes.indexOf(itemBox, 0), 1)
		} else {
			this.itemBoxesBought.splice(this.itemBoxesBought.indexOf(itemBox, 0), 1)
		}
		this.getItemsCount()
		this.getItemsPriceTotal()
		//this.itemsApi.deleteById(itemBox.item.id).subscribe(res => {})
	}

	public deleteAllItems() {
		for (let i = 0; i < this.itemBoxes.length; i++) {
			this.itemBoxes[i].item.available = false
			this.updateItem(this.itemBoxes[i])
			//this.itemsApi.deleteById(this.itemBoxes[i].item.id).subscribe(res => {})
		}
		for (let i = 0; i < this.itemBoxesBought.length; i++) {
			this.itemBoxesBought[i].item.available = false
			this.updateItem(this.itemBoxesBought[i])
			//this.itemsApi.deleteById(this.itemBoxesBought[i].item.id).subscribe(res => {})
		}
		this.itemBoxes = [];
		this.itemBoxesBought = [];
		this.getItemsCount()
		this.getItemsPriceTotal()
		this.newAlert("All items have been deleted", 2)
	}

	public editBoxContent(itemBox: ItemBox) {
		let editOKBox = document.getElementById(itemBox.item.id + "_editOK")
		let editCancelBox = document.getElementById(itemBox.item.id + "_editCancel")
		let nameBox = document.getElementById(itemBox.item.id + "_name")
		let priceBox = document.getElementById(itemBox.item.id + "_price")
		document.getElementById(itemBox.item.id + "_delete").innerHTML = ""
		document.getElementById(itemBox.item.id + "_bought").innerHTML = ""

		editOKBox.innerHTML = '<button class="btn btn-success btn-xs">OK</button>'
		editOKBox.querySelector('button').addEventListener('click', (event) => {
			itemBox.item.name = nameBox.querySelector("input").value
			var newPriceNumber = Number(priceBox.querySelector("input").value)
			if (!isNaN(newPriceNumber)) {
				itemBox.item.price = newPriceNumber
			}
			this.updateItem(itemBox)

		})

		editCancelBox.innerHTML = '<button class="btn btn-danger btn-xs">Cancel</button>'
		editCancelBox.querySelector('button').addEventListener('click', (event) => this.editBoxContentFinish(itemBox))

		var name = itemBox.item.name.replace(" ", "&nbsp")
		nameBox.innerHTML = ' <input type="text" style="padding: 3pxborder-radius: .25remheight: 26pxborder: 1px solid rgba(0,0,0,.15)border-style: solidcolor: #464a4c" value=' + name + '></input>'
		priceBox.innerHTML = '<input type="text" style="padding: 3pxborder-radius: .25remheight: 26pxborder: 1px solid rgba(0,0,0,.15)border-style: solidcolor: #464a4cwidth: 60px" value=' + itemBox.item.price + '></input> $'

		itemBox.editFunctionNameButton = 'editBoxContentFinish'
	}

	public editBoxContentFinish(itemBox: ItemBox) {
		let editOKBox = document.getElementById(itemBox.item.id + "_editOK")
		let deleteBox = document.getElementById(itemBox.item.id + "_delete")
		let markBoughtBox = document.getElementById(itemBox.item.id + "_bought")
		let nameBox = document.getElementById(itemBox.item.id + "_name")
		let priceBox = document.getElementById(itemBox.item.id + "_price")
		document.getElementById(itemBox.item.id + "_editCancel").innerHTML = ""

		nameBox.innerHTML = itemBox.item.name
		priceBox.innerHTML = itemBox.item.price + " $"

		deleteBox.innerHTML = '<button class="btn btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>'
		deleteBox.querySelector('button').addEventListener('click', (event) => this.deleteItem(itemBox))

		if (itemBox.item.bought == false) {
			markBoughtBox.innerHTML = '<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-ok"></span></button>'
		} else {
			markBoughtBox.innerHTML = '<button class="btn btn-primary btn-xs"><span class="glyphicon glyphicon glyphicon-minus"></span></button>'
		}
		markBoughtBox.querySelector('button').addEventListener('click', (event) => this.markItemBought(itemBox))

		editOKBox.innerHTML = '<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-pencil"></span></button>'
		editOKBox.querySelector('button').addEventListener('click', (event) => this.editBoxContent(itemBox))

		itemBox.editFunctionNameButton = 'editBoxContent'
	}

	public handleError(error) {
		var errorMessage = error.message
		if (errorMessage == "MongoDB connection is not established") {
			this.newAlert(error.message)
		} else if (error == "Server error") {
			this.newAlert("Server connection is not established")
		} else {
			console.log("Error: " + error)
		}
	}

	public closeAlert() {
		let messageAlert = document.getElementById("appAlerts")
		messageAlert.innerHTML = ""
	}

	public newAlert(message: string, type?: number) {
		var htmlMessage = ""
		let messageAlert = document.getElementById("appAlerts")
		messageAlert.innerHTML = '<div class="alert alert-danger" role="alert"><button class="close"><span>&times</span></button><span id="appAlertsMessage"><strong>Error:</strong> Error found.</span></div>'
		messageAlert.querySelector('button').addEventListener('click', (event) => this.closeAlert())
		let messageAlertMessage = document.getElementById("appAlertsMessage")
		switch (type) {
			case 2:
				htmlMessage += "<strong>Success:</strong> "
				messageAlert.querySelector('div').className = "alert alert-success"
				break
			default:
				htmlMessage += "<strong>Error:</strong> "
				break
		}
		htmlMessage += message

		messageAlertMessage.innerHTML = htmlMessage
	}
}
