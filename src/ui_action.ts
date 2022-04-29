declare var $;
import {Game} from './genesis';

export const html = {
  update_value_1(v: number) {
    $("#value").text(v.toFixed(0));
  },

  show_pluser() {
    $("#pluser").show(100);
  },
}
