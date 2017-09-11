/* tslint:disable */

declare var Object: any;
export interface GroceryAppInterface {
  "id"?: number;
}

export class GroceryApp implements GroceryAppInterface {
  "id": number;
  constructor(data?: GroceryAppInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `GroceryApp`.
   */
  public static getModelName() {
    return "GroceryApp";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of GroceryApp for dynamic purposes.
  **/
  public static factory(data: GroceryAppInterface): GroceryApp{
    return new GroceryApp(data);
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
      name: 'GroceryApp',
      plural: 'GroceryApps',
      path: 'GroceryApps',
      properties: {
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
      }
    }
  }
}
