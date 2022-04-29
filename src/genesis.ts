import { Value1 } from './value1';
import { add_reaction } from './react';
import { html } from './ui_action';

export class Game {
  value1: Value1;
  a = 1;

  toString(): string {
    return this.value1.toString();
  }

  init() {
    this.load();
    add_reaction();
    setInterval(() => this.update(), 10);
    setInterval(() => this.save(), 10000);
  }

  load() {
    const save = localStorage.getItem("save");
    if (save) {
      const d = atob(save).split(";");
      this.value1 = new Value1(d[0]);
    } else {
      this.value1 = new Value1("");
    }
  }

  update() {
    this.value1.update();
  }

  save() {
    console.log("saved");
    localStorage.setItem("save", btoa(this.toString()));
  }
}

export const game = new Game;
