interface IItem {
    id: string;
    name: string;
    color: string;
    bought: boolean;
    price: number;
}

export class Item {
    id: string;
    name: string;
    color: string;
    bought: boolean;
    price: number;

    public constructor(obj?: IItem) {
        this.id = obj && obj.id || "";
        this.name = obj && obj.name || "";
        this.color = obj && obj.color || "";
        this.bought = obj && obj.bought || false;
        this.price = obj && obj.price || 0;
    }
}