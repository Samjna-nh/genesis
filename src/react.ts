import { game } from './genesis';
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

    $("#mannually-save").click(() => {
      game.save();
    });
  });
}
