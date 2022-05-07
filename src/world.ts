import { html } from 'ui_action';
import { BaseGameData } from 'utils';
import { Jobs } from 'jobs';
import { DEBUG, LFPS } from 'genesis';
import { metaParams } from 'meta';

export class World extends BaseGameData {
  populationLimit: number;
  creature: number;
  food: number;
  wood: number;
  baseCreatureCost: number;
  creatureCost: number;
  jobs: Jobs;

  constructor(data) {
    super(data);

    this.updateCreatureCost();
    this.updateNum();
    this.jobs.updateElement();
  }

  getSavableData() {
    return ["food", "wood", "creature", "populationLimit", "baseCreatureCost", "jobs"];
  }

  getUpdatableData() {
    return [
      ["food", "food-num", "int"],
      ["creature", "creature-num", "int"],
      ["creature", "job-total-creature", "int"],
      ["populationLimit", "population-limit", "int"],
      ["creatureCost", "creature-cost", "int"],
      ["foodPs", "food-ps", "float"],
      ["wood", "wood-num", "int"],
      ["woodPs", "wood-ps", "float"],
    ];
  }

  load(data) {
    super.load(data);
    this.jobs = new Jobs(data.jobs, this);
  }

  init() {
    this.food = 0;
    this.wood = 0;
    this.creature = 0;
    this.populationLimit = metaParams.creatureLimit;
    this.baseCreatureCost = metaParams.creatureCost;
    this.jobs = new Jobs(null, this);
  }

  incFood(v: number) {
    if (v <= 0) return;
    this.food += v;
    this.updateNum();
  }

  incWood(v: number) {
    if (v <= 0) return;
    this.wood += v;
    this.updateNum();
  }

  addFood(v: number) {
    this.incFood(v);
  }

  addCreature() {
    if (this.creature < this.populationLimit) {
      if (this.food >= this.creatureCost) {
        this.creature += 1;
        this.food -= this.creatureCost;
        this.updateCreatureCost();
        this.updateNum();
        return true;
      }
    }

    return false;
  }

  getHunterPps() {
    return this.jobs.jobbed["hunter"] * metaParams.hunterProduct;
  }

  getLumberjackPps() {
    return this.jobs.jobbed["lumberjack"] * metaParams.lumberjackProduct;
  }

  get foodPs() {
    return this.getHunterPps();
  }

  get woodPs() {
    return this.getLumberjackPps();
  }

  update() {
    this.incFood(this.foodPs / LFPS);
    this.incWood(this.woodPs / LFPS);
    this.checkJobUnlocks();
  }

  updateCreatureCost() {
    this.creatureCost = Math.ceil(this.baseCreatureCost * metaParams.creatureCostInc ** this.creature);
  }

  updateNum() {
    this.updateData();
    this.jobs.updateData();
    this.updateElement();
  }

  checkJobUnlocks() {
    this.jobs.unlock("hunter"); // Initially unlocked
    if (this.creature >= 10) {
      this.jobs.unlock("lumberjack");
    }
  }

  updateElement() {
    if (this.food >= metaParams.creatureCost || this.creature > 0) {
      html.showCreature();
      if (this.creature >= 5) {
        html.showWorldTab();
        this.checkJobUnlocks();
      }
      if (this.wood > 0) {
        html.showWood();
      }
    }
  }
}
