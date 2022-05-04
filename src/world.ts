import { html } from 'ui_action';
import { BaseGameData } from 'utils';
import { Jobs } from 'jobs';
import {DEBUG} from 'genesis';

interface IWorld {
  populationLimit: number;
  creature: number;
  food: number;
  baseCreatureCost: number;
  creatureCost: number;
  jobs: Jobs;
}

export class World extends BaseGameData implements IWorld {
  populationLimit: number;
  creature: number;
  food: number;
  baseCreatureCost: number;
  creatureCost: number;
  jobs: Jobs;

  constructor(data: IWorld) {
    super();
    this.updatableData = [
      ["food", "food-num", "int"],
      ["creature", "creature-num", "int"],
      ["populationLimit", "population-limit", "int"],
      ["creatureCost", "creature-cost", "int"],
    ];

    if (data) {
      this.food = data.food;
      this.creature = data.creature;
      this.populationLimit = data.populationLimit;
      this.baseCreatureCost = data.baseCreatureCost;
      this.jobs = new Jobs(data.jobs);
    } else {
      this.food = 0;
      this.creature = 0;
      this.populationLimit = 100;
      this.baseCreatureCost = 10;
      this.jobs = new Jobs(null);
      this.jobs.unlock("hunter");
    }

    this.updateCreatureCost();
    this.updateNum();
  }

  addFood() {
    this.food += DEBUG ? 100 : 1;
    this.updateNum();
  }

  addCreature() {
    if (this.creature < this.populationLimit)
      if (this.food >= this.creatureCost) {
        this.creature += 1;
        this.food -= this.creatureCost;
        this.updateCreatureCost();
        this.updateNum();
      }
  }

  update() {
  }

  updateCreatureCost() {
    this.creatureCost = Math.ceil(this.baseCreatureCost * 1.1 ** this.creature);
  }

  updateNum() {
    this.jobs.setCreature(this.creature);
    this.updateData();
    this.updateElement();
  }

  updateElement() {
    if (this.food >= 10 || this.creature > 0) {
      html.showCreature();
    }

    if (this.creature >= 5) {
      html.showWorldTab();
    }
  }
}
