define("ui_action", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.html = void 0;
    exports.html = {
        update_value_1: function (v) {
            $("#value").text(v.toFixed(0));
        },
        show_pluser: function () {
            $("#pluser").show(100);
        },
    };
});
define("value1", ["require", "exports", "ui_action"], function (require, exports, ui_action_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Value1 = void 0;
    var Value1 = /** @class */ (function () {
        function Value1(data) {
            if (data) {
                var d = data.split("|");
                this.value = Number.parseFloat(d[0]);
                this.pluser = Number.parseFloat(d[1]);
                this.update_num();
                this.update_element();
            }
            else {
                this.value = 0;
                this.pluser = 0;
                this.update_num();
            }
        }
        Value1.prototype.toString = function () {
            return "" + this.value + "|" + this.pluser;
        };
        Value1.prototype.init = function () {
            this.value = 0;
            this.pluser = 0;
        };
        Value1.prototype.plus1 = function () {
            this.value += 1;
            this.update_element();
            this.update_num();
        };
        Value1.prototype.buy1 = function () {
            if (this.value >= 20) {
                this.value -= 20;
                this.pluser += 1;
                this.update_num();
            }
        };
        Value1.prototype.update = function () {
            this.value += this.pluser / 100;
            this.update_num();
        };
        Value1.prototype.update_num = function () {
            ui_action_1.html.update_value_1(this.value);
        };
        Value1.prototype.update_element = function () {
            if (this.value >= 10) {
                ui_action_1.html.show_pluser();
            }
        };
        return Value1;
    }());
    exports.Value1 = Value1;
});
define("react", ["require", "exports", "genesis"], function (require, exports, genesis_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add_reaction = void 0;
    function add_reaction() {
        $(function () {
            $("#plus1").click(function () {
                genesis_1.game.value1.plus1();
            });
            $("#pluser").click(function () {
                genesis_1.game.value1.buy1();
            });
            $("#hreset").click(function () {
                localStorage.removeItem("save");
                $("#main").effect("clip", { direction: "horizontal" });
                setTimeout(function () { return location.reload(); }, 1000);
            });
        });
    }
    exports.add_reaction = add_reaction;
});
define("genesis", ["require", "exports", "value1", "react"], function (require, exports, value1_1, react_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.game = exports.Game = void 0;
    var Game = /** @class */ (function () {
        function Game() {
            this.a = 1;
        }
        Game.prototype.toString = function () {
            return this.value1.toString();
        };
        Game.prototype.init = function () {
            var _this = this;
            this.load();
            (0, react_1.add_reaction)();
            setInterval(function () { return _this.update(); }, 10);
            setInterval(function () { return _this.save(); }, 10000);
        };
        Game.prototype.load = function () {
            var save = localStorage.getItem("save");
            if (save) {
                var d = atob(save).split(";");
                this.value1 = new value1_1.Value1(d[0]);
            }
            else {
                this.value1 = new value1_1.Value1("");
            }
        };
        Game.prototype.update = function () {
            this.value1.update();
        };
        Game.prototype.save = function () {
            console.log("saved");
            localStorage.setItem("save", btoa(this.toString()));
        };
        return Game;
    }());
    exports.Game = Game;
    exports.game = new Game;
});
