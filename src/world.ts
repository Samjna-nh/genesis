import { html } from 'ui_action';
import { BaseGameData } from 'utils';
import { Jobs } from 'jobs';
import { DEBUG, LFPS } from 'genesis';

export class World extends BaseGameData {
  populationLimit: number;
  creature: number;
  food: number;
  baseCreatureCost: number;
  creatureCost: number;
  jobs: Jobs;

  constructor(data) {
    super(data);

    this.updateCreatureCost();
    this.checkJobUnlocks();
    this.updateNum();
    this.jobs.updateElement();
  }

  getSavableData() {
    return ["food", "creature", "populationLimit", "baseCreatureCost"];
  }

  load(data) {
    super.load(data);
    this.jobs = new Jobs(data.jobs, this);
  }

  init() {
    this.food = 0;
    this.creature = 0;
    this.populationLimit = 100;
    this.baseCreatureCost = 10;
    this.jobs = new Jobs(null, this);
  }

  getUpdatableData() {
    return [
      ["food", "food-num", "int"],
      ["creature", "creature-num", "int"],
      ["creature", "job-total-creature", "int"],
      ["populationLimit", "population-limit", "int"],
      ["creatureCost", "creature-cost", "int"],
      ["foodPs", "food-ps", "float"],
    ];
  }

  incFood(v: number) {
    if (v <= 0) return;
    this.food += v;
    this.updateNum();
  }

  addFood(v: number) {
    this.incFood(v);
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

  getHunterPps() {
    return this.jobs.jobbed["hunter"] * 0.2;
  }

  get foodPs() {
    return this.getHunterPps();
  }

  update() {
    this.incFood(this.foodPs / LFPS);
    this.checkJobUnlocks();
  }

  updateCreatureCost() {
    this.creatureCost = Math.ceil(this.baseCreatureCost * 1.1 ** this.creature);
  }

  updateNum() {
    this.updateData();
    this.jobs.updateData();
    this.updateElement();
  }

  checkJobUnlocks() {
    this.jobs.unlock("hunter"); // Initially unlocked
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
