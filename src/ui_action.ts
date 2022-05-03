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
}

function show(id: string) {
  if(!$("#"+id).hasClass("show")) $("#"+id).show("slow");
}
