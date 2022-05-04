import { BaseGameData } from 'utils';
import { html } from 'ui_action';

export const allJobs = [
  "hunter", "farmer", "miner", "lumberjack", "scientist"
]

interface IJobs {
  totalCreature: number;
  jobbed: object;
  unlockedJobs: string[];
  idle: number;
}

export class Jobs extends BaseGameData implements IJobs {
  totalCreature: number;
  jobbed: object;
  unlockedJobs: string[];
  idle: number;

  constructor(data: IJobs) {
    super();
    this.updatableData = [
      ["totalCreature", "job-total-creature", "int"],
      ["idle", "job-idle-creature", "int"],
    ]

    if (data) {
      this.totalCreature = data.totalCreature;
      this.jobbed = data.jobbed;
      this.unlockedJobs = data.unlockedJobs;
      this.idle = data.idle;
    } else {
      this.totalCreature = 0;
      this.jobbed = {};
      for (let job of allJobs) {
        this.jobbed[job] = 0;
      }
      this.unlockedJobs = [];
    }

    this.updateIdle();
  }

  add(job: string) {
    if (this.unlockedJobs.indexOf(job) >= 0 && this.idle > 0) {
      this.jobbed[job]++;
      this.updateIdle();
    }
  }

  sub(job: string) {
    if (this.unlockedJobs.indexOf(job) >= 0 && this.jobbed[job] > 0) {
      this.jobbed[job]--;
      this.updateIdle();
    }
  }

  setCreature(creature: number) {
    this.totalCreature = creature;
    this.updateIdle();
  }

  updateIdle() {
    this.idle = this.totalCreature;
    for (let job in this.jobbed) {
      this.idle -= this.jobbed[job];
    }
    this.updateData();
  }

  updateData() {
    super.updateData();
    for (const job of this.unlockedJobs) {
      html.updateInteger(job + "-num", this.jobbed[job]);
    }
  }

  unlock(job: string) {
    if (this.unlockedJobs.indexOf(job) < 0) {
      this.unlockedJobs.push(job);
      html.showJob(job);
    }
  }
}
