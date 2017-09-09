interface IItem {
    id: string;
    name: string;
}

export class Item {
    id: string = "";
    name: string = 'Angular2';

    public constructor(obj?: IItem) {
        this.id = obj && obj.id || "";
        this.name = obj && obj.name || "";
    }
}