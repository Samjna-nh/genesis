import { BaseGameData } from 'utils';

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
      ["totalCreature", "total-creature", "int"],
      ["idle", "idle-creature", "int"],
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

  updateIdle() {
    this.idle = this.totalCreature;
    for (let job in this.jobbed) {
      this.idle -= this.jobbed[job];
    }
    this.updateData();
  }

  unlock(job: string) {
    if (this.unlockedJobs.indexOf(job) >= 0) {
      this.unlockedJobs.push(job);
      // TODO show job tag in html
    }
  }
}
