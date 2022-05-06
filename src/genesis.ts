import { World } from './world';
import { add_reaction } from './react';

export const DEBUG = true;
export const LFPS = 100;

class Game {
  world: World;

  constructor(data) {
    if (data) {
      this.world = new World(data.world);
    } else {
      this.world = new World(null);
    }
  }

  start() {
    add_reaction();
    setInterval(() => this.update(), 1000 / LFPS);
    setInterval(() => this.save(), 30000);
  }

  update() {
    this.world.update();
  }

  save() {
    if (DEBUG) {
      console.log("saved");
      console.log(game);
    }
    const data = {
      world: this.world.save(),
    };

    localStorage.setItem("save", btoa(JSON.stringify(data)));
  }
}

export const game = load();

function load(): Game {
  let save = null;
  save = localStorage.getItem("save");

  if (save) {
    try {
      return new Game(JSON.parse(atob(save)));
    } catch (e) {
      console.error("failed to load");
      console.error(e);
    }
  }

  return new Game(null);
}
