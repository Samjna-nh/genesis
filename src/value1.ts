import { html } from 'ui_action';

export class Value1 {
  value: number;
  pluser: number;

  constructor(data: string) {
    if (data) {
      let d = data.split("|");
      this.value = Number.parseFloat(d[0]);
      this.pluser = Number.parseFloat(d[1]);
      this.update_num();
      this.update_element();
    } else {
      this.value = 0;
      this.pluser = 0;
      this.update_num();
    }
  }

  toString(): string {
    return "" + this.value + "|" + this.pluser;
  }

  init() {
    this.value = 0;
    this.pluser = 0;
  }

  plus1() {
    this.value += 1;
    this.update_element();
    this.update_num();
  }

  buy1() {
    if (this.value >= 20) {
      this.value -= 20;
      this.pluser += 1;
      this.update_num();
    }
  }

  update() {
    this.value += this.pluser / 100;
    this.update_num();
  }

  update_num() {
    html.update_value_1(this.value);
  }

  update_element() {
    if (this.value >= 10) {
      html.show_pluser();
    }
  }
}
