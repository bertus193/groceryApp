/* tslint:disable */

declare var Object: any;
export interface ItemsInterface {
  "name": string;
  "id"?: any;
}

export class Items implements ItemsInterface {
  "name": string;
  "id": any;
  constructor(data?: ItemsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Items`.
   */
  public static getModelName() {
    return "Items";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Items for dynamic purposes.
  **/
  public static factory(data: ItemsInterface): Items {
    return new Items(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Items',
      plural: 'Items',
      path: 'Items',
      properties: {
        "id": {
          name: 'id',
          type: 'any'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "bought": {
          name: 'bought',
          type: 'boolean'
        },
        "color": {
          name: 'color',
          type: 'string'
        },
        "price": {
          name: 'price',
          type: 'number'
        },
        "available": {
          name: 'available',
          type: 'boolean'
        }
      },
      relations: {
      }
    }
  }
}
