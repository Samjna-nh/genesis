import { World } from './world';
import { add_reaction } from './react';

const DEBUG = true;

interface IGame {
  world: World;
}

class Game implements IGame {
  world: World;

  constructor(data: IGame) {
    if (data) {
      this.world = new World(data.world);
    } else {
      this.world = new World(null);
    }
  }

  start() {
    add_reaction();
    setInterval(() => this.update(), 10);
    setInterval(() => this.save(), 10000);
  }

  update() {
    this.world.update();
  }

  save() {
    console.log("saved");
    localStorage.setItem("save", btoa(JSON.stringify(this)));
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
