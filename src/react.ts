import { game } from 'genesis';
import {allJobs} from 'jobs';

declare var $;

export function add_reaction() {
  $(() => {
    $("#add-creature").click(() => {
      game.world.addCreature();
    });

    $("#add-food").click(() => {
      game.world.addFood();
    });

    $("#hard-reset").click(() => {
      localStorage.removeItem("save");
      $("#main").effect("clip", {direction:"horizontal"});
      setTimeout(()=>location.reload(), 1000);
    });

    for (const job of allJobs) {
      $("#add-"+job).click(() => {
        game.world.jobs.add(job);
      });
      $("#sub-"+job).click(() => {
        game.world.jobs.sub(job);
      });
    }

    $("#mannually-save").click(() => {
      game.save();
    });
  });
}
