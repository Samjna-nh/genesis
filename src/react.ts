import { game } from './genesis';
declare var $;

export function add_reaction() {
  $(() => {
    $("#plus1").click(() => {
      game.value1.plus1();
    });
    $("#pluser").click(() => {
      game.value1.buy1();
    });

    $("#hreset").click(() => {
      localStorage.removeItem("save");
      $("#main").effect("clip", {direction:"horizontal"});
      setTimeout(()=>location.reload(), 1000);
    });
  });
}
