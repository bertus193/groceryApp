import { Item } from './item';

export class ItemBox {
    item: Item;
    editFunctionNameButton: string;

    public constructor(item: Item, editFunctionNameButton?: string) {
        this.item = item;
        this.editFunctionNameButton = editFunctionNameButton || "editBoxContent";
    }
}