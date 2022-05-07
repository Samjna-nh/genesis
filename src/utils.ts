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
export abstract class BaseGameData {
  updatableData: params;
  savableData: string[];

  constructor(data: object) {
    this.updatableData = this.getUpdatableData();
    this.savableData = this.getSavableData();
    if (data) {
      this.load(data);
    } else {
      this.init();
    }
  }

  abstract getUpdatableData(): params;
  abstract getSavableData(): string[];

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

  // Need to be overrided to load the BGD objects.
  load(obj: object) {
    for (let data of this.savableData) {
      this[data] = obj[data];
    }
  }

  abstract init(): void;

  save(): object {
    const obj = {};
    for (let data of this.savableData) {
      if (this[data] instanceof BaseGameData) {
        obj[data] = this[data].save();
      } else {
        obj[data] = this[data];
      }
    }

    return obj;
  }
}

export function buyWithKeys(e, func: () => boolean) {
  let time = getAmountWithKeys(e);
  if (time < 0) {
    while (func());
  } else {
    while (time-- > 0 && func());
  }
}

export function getAmountWithKeys(e) {
  if (e.shiftKey) return 25;
  if (e.ctrlKey) return 100;
  if (e.altKey) return -1;
  return 1;
}
