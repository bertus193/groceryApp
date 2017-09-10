export class Item {
    id: string;
    name: string;
    color: string;
    bought: boolean;
    price: number;

    public constructor(name: string, color?: string, bought?: boolean, price?: number) {
        this.name = name || ""
        this.color = color || "#ffffff"
        this.bought = bought || false
        this.price = price || Math.floor(Math.random() * 201)
    }
}