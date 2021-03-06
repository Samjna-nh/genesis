import { getAmountWithKeys } from 'utils';

declare var $;

export const MAX_ALERT_NUM = 5;
let alertNum = 0;
let alertID = 0;

export const html = {
  updateInteger(id: String, v: number) {
    $("#" + id).text(v.toFixed(0));
  },

  updateFloat(id: String, v: number) {
    $("#" + id).text(v.toFixed(3));
  },

  updateString(id: String, v: string) {
    $("#" + id).text(v);
  },

  showCreature() {
    show("creature");
  },

  showWood() {
    show("wood");
  },

  showWorldTab() {
    show("world-nav");
  },

  showJob(job: string) {
    show(job + "-pane");
  },

  showJobProduct(job: string) {
    show(job + "-product", null);
  },

  hideJobProduct(job: string) {
    hide(job + "-product", null);
  },

  alert(info: string) {
    $("#info").append(
      `<div id="alert-${alertID}" class="alert alert-primary alert-dismissible fade show hide_" role="alert">` +
      `<span id="alert-${alertID}-text"></span>` +
      `<button id="alert-${alertID}-btn" type="button" class="close" data-dismiss="alert" aria-label="Close">` +
      '<span aria-hidden="true">&times;</span>' +
      '</button>' +
      '</div>'
    );
    $("#alert-" + alertID + "-btn").on("click", () => {
      alertNum--;
    });
    $("#alert-" + alertID + "-text").text(info);
    $("#alert-" + alertID).show("normal");
    $("#alert-" + alertID).css("display", "block");
    alertID++;
    alertID %= MAX_ALERT_NUM * 2;
    alertNum++;
    tryRemoveAlert();
  },

  updateWithKey(e) {
    const amount = getAmountWithKeys(e);
    $(".amount-type-1").text(amount > 0 ? getAmountWithKeys(e) : " all");
    $(".amount-type-2").text(
      e.shiftKey ? " all" : ""
    );
  }
}

function tryRemoveAlert() {
  if (alertNum > MAX_ALERT_NUM) {
    const firstAlert = $("#info div:first-child");
    firstAlert.hide("normal", () => {
      alertNum--;
      firstAlert.remove();
      tryRemoveAlert();
    });
  }
}

function show(id: string, speed = "normal") {
  if ($("#" + id).css("display") == "none") {
    $("#" + id).show(speed);
    $("#" + id).css("display", "flex");
  }
}

function hide(id: string, speed = "normal") {
  if ($("#" + id).css("display") != "hide") {
    $("#" + id).hide(speed);
  }
}
