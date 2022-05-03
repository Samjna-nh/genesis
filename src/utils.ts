import { html } from 'ui_action';

type params = string[][];

/*
 * How to use: store all the updatable parameters in the array.
 * The name, the tag id and the type of the parameters should be put as strings in one array to store.
 * Example:
 *   updatableData = [["first", "tag-1", "int"], ["second", "tag-2", "float"]];
 *   Two parameters "first", which is an integer, and "second",
 *   which is a float number, where be shown in tag-1 and tag-2.
 *   Available types: "integer" ("int"), "float", "string" ("str"), "function" ("func").
 */
export class BaseGameData {
  updatableData: params;

  constructor() {
    this.updatableData = [];
  }

  updateData() {
    for (let data of this.updatableData) {
      switch (data[2]) {
        case "int":
        case "integer":
          html.updateInteger(data[1], this[data[0]] ?? 0);
          break;
        case "float":
          html.updateFloat(data[1], this[data[0]] ?? 0.0);
          break;
        case "function":
        case "func":
          console.log(this[data[0]].call());
          html.updateString(data[1], this[data[0]].call() ?? "");
          break;
        case "string":
        case "str":
        default:
          html.updateString(data[1], this[data[0]] ?? "");
          break;
      }
    }
  }
}
