export class Item {
    id: string;
    name: string;
    color: string;
    bought: boolean;
    price: number;
    available: boolean;

    public constructor(name: string, price?: number, color?: string, bought?: boolean, available?: boolean) {
        this.name = name || ""
        this.color = color || "#ffffff"
        this.bought = bought || false
        this.price = price || Math.floor(Math.random() * 201)
        this.available = available || true
    }
}