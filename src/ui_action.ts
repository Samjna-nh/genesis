declare var $;

export const html = {
  updateInteger(id:String, v: number) {
      $("#"+id).text(v.toFixed(0));
  },

  updateFloat(id:String, v: number) {
      $("#"+id).text(v.toFixed(3));
  },

  updateString(id:String, v: string) {
      $("#"+id).text(v);
  },

  showCreature() {
    show("creature");
  },

  showWorldTab() {
    show("world-nav");
  },

  showJob(job: string) {
    show(job+"pane");
  }
}

function show(id: string) {
  if($("#"+id).css("display") != "flex") {
    $("#"+id).show("slow");
    $("#"+id).css("display", "flex");
  }
}
