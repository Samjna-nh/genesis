import { game } from 'genesis';
import { allJobs } from 'jobs';
import { html } from 'ui_action';
import { buyWithKeys } from 'utils';
import { DEBUG } from 'genesis';

declare var $;

export function add_reaction() {
  $(() => {

    // key press checks
    $(document).keydown((e) => {
      switch(e.which) {
        case 16: // shift
        case 17: // control
        case 18: // alt
          html.updateWithKey(e);
          break;
        default:
          break;
      }
    });

    $(document).keyup((e) => {
      switch(e.which) {
        case 16: // shift
        case 17: // control
        case 18: // alt
          html.updateWithKey(e);
          break;
        default:
          break;
      }
    });

    $("#add-creature").click((e) => {
      buyWithKeys(e, () => game.world.addCreature());
    });

    $("#add-food").click(() => {
      game.world.addFood(DEBUG ? 20 : 1);
    });

    $("#hard-reset").click(() => {
      localStorage.removeItem("save");
      $("#main").effect("clip", { direction: "horizontal" });
      setTimeout(() => location.reload(), 1000);
    });

    for (const job of allJobs) {
      $("#add-" + job).click((e) => {
        game.world.jobs.add(job, e.shiftKey ? game.world.creature : 1);
      });
      $("#sub-" + job).click((e) => {
        game.world.jobs.sub(job, e.shiftKey ? game.world.creature : 1);
      });
    }

    $("#mannually-save").click(() => {
      game.save();
      html.alert("Game saved.");
    });

    $("#music-play").click(() => {
      const player = $("#audio-player").get(0);
      if (player.paused) {
        player.play();
        $("#music-play").text("Pause BGM");
      } else {
        player.pause();
        $("#music-play").text("Play BGM");
      }
    });
  });
}
