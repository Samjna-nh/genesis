import { BaseGameData } from 'utils';
import { html } from 'ui_action';
import { World } from 'world';

export const allJobs = [
  "hunter", "farmer", "miner", "lumberjack", "scientist"
]

export class Jobs extends BaseGameData {
  jobbed: object;
  unlockedJobs: string[];
  world: World

  constructor(data, world: World) {
    super(data);

    this.world = world;
  }

  init() {
    this.jobbed = {};
    for (let job of allJobs) {
      this.jobbed[job] = 0;
    }
    this.unlockedJobs = [];
  }

  getSavableData() {
    return ["jobbed", "unlockedJobs"];
  }

  getUpdatableData() {
    return [
      ["idle", "job-idle-creature", "int"],
    ];
  }

  add(job: string, v: number) {
    if (this.unlockedJobs.indexOf(job) >= 0 && this.idle > 0) {
      this.jobbed[job] += Math.min(this.idle, v);
      this.updateData();
      this.updateElement();
    }
  }

  sub(job: string, v: number) {
    if (this.unlockedJobs.indexOf(job) >= 0 && this.jobbed[job] > 0) {
      this.jobbed[job] -= Math.min(this.jobbed[job], v);
      this.updateData();
      this.updateElement();
    }
  }

  get idle() {
    let res = this.world.creature;
    for (let job in this.jobbed) {
      res -= this.jobbed[job];
    }
    return res;
  }

  updateData() {
    super.updateData();
    for (const job of this.unlockedJobs) {
      html.updateInteger(job + "-num", this.jobbed[job]);
    }
    this.updateHunter();
    this.updateLumberjack();
  }

  updateElement() {
    for (let job in this.jobbed) {
      if (this.jobbed[job] > 0) html.showJobProduct(job);
      else html.hideJobProduct(job);
    }
  }

  updateHunter() {
    html.updateFloat("hunter-food", this.world.getHunterPps());
  }

  updateLumberjack() {
    html.updateFloat("lumberjack-wood", this.world.getLumberjackPps());
  }

  unlock(job: string) {
    if (this.unlockedJobs.indexOf(job) < 0) {
      this.unlockedJobs.push(job);
    }
    html.showJob(job);
    this.updateData();
    this.updateElement();
  }

  unlocked(job: string) {
    return this.unlockedJobs.indexOf(job) >= 0;
  }
}
