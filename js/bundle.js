var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("utils", ["require", "exports", "ui_action"], function (require, exports, ui_action_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAmountWithKeys = exports.buyWithKeys = exports.BaseGameData = void 0;
    /*
     * How to use: store all the updatable parameters in the array.
     * The name, the tag id and the type of the parameters should be put as strings in one array to store.
     * Example:
     *   updatableData = [["first", "tag-1", "int"], ["second", "tag-2", "float"]];
     *   Two parameters "first", which is an integer, and "second",
     *   which is a float number, where be shown in tag-1 and tag-2.
     *   Available types: "integer" ("int"), "float", "string" ("str"), "function" ("func").
     */
    var BaseGameData = /** @class */ (function () {
        function BaseGameData(data) {
            this.updatableData = this.getUpdatableData();
            this.savableData = this.getSavableData();
            if (data) {
                this.load(data);
            }
            else {
                this.init();
            }
        }
        BaseGameData.prototype.updateData = function () {
            var _a, _b, _c, _d;
            for (var _i = 0, _e = this.updatableData; _i < _e.length; _i++) {
                var data = _e[_i];
                switch (data[2]) {
                    case "int":
                    case "integer":
                        ui_action_1.html.updateInteger(data[1], (_a = this[data[0]]) !== null && _a !== void 0 ? _a : 0);
                        break;
                    case "float":
                        ui_action_1.html.updateFloat(data[1], (_b = this[data[0]]) !== null && _b !== void 0 ? _b : 0.0);
                        break;
                    case "function":
                    case "func":
                        console.log(this[data[0]].call());
                        ui_action_1.html.updateString(data[1], (_c = this[data[0]].call()) !== null && _c !== void 0 ? _c : "");
                        break;
                    case "string":
                    case "str":
                    default:
                        ui_action_1.html.updateString(data[1], (_d = this[data[0]]) !== null && _d !== void 0 ? _d : "");
                        break;
                }
            }
        };
        // Need to be overrided to load the BGD objects.
        BaseGameData.prototype.load = function (obj) {
            for (var _i = 0, _a = this.savableData; _i < _a.length; _i++) {
                var data = _a[_i];
                this[data] = obj[data];
            }
        };
        BaseGameData.prototype.save = function () {
            var obj = {};
            for (var _i = 0, _a = this.savableData; _i < _a.length; _i++) {
                var data = _a[_i];
                if (this[data] instanceof BaseGameData) {
                    obj[data] = this[data].save();
                }
                else {
                    obj[data] = this[data];
                }
            }
            return obj;
        };
        return BaseGameData;
    }());
    exports.BaseGameData = BaseGameData;
    function buyWithKeys(e, func) {
        var time = getAmountWithKeys(e);
        if (time < 0) {
            while (func())
                ;
        }
        else {
            while (time-- > 0 && func())
                ;
        }
    }
    exports.buyWithKeys = buyWithKeys;
    function getAmountWithKeys(e) {
        if (e.shiftKey)
            return 25;
        if (e.ctrlKey)
            return 100;
        if (e.altKey)
            return -1;
        return 1;
    }
    exports.getAmountWithKeys = getAmountWithKeys;
});
define("ui_action", ["require", "exports", "utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.html = exports.MAX_ALERT_NUM = void 0;
    exports.MAX_ALERT_NUM = 5;
    var alertNum = 0;
    var alertID = 0;
    exports.html = {
        updateInteger: function (id, v) {
            $("#" + id).text(v.toFixed(0));
        },
        updateFloat: function (id, v) {
            $("#" + id).text(v.toFixed(3));
        },
        updateString: function (id, v) {
            $("#" + id).text(v);
        },
        showCreature: function () {
            show("creature");
        },
        showWorldTab: function () {
            show("world-nav");
        },
        showJob: function (job) {
            show(job + "pane");
        },
        showJobProduct: function (job) {
            show(job + "-product", null);
        },
        hideJobProduct: function (job) {
            hide(job + "-product", null);
        },
        alert: function (info) {
            $("#info").append("<div id=\"alert-".concat(alertID, "\" class=\"alert alert-primary alert-dismissible fade show hide_\" role=\"alert\">") +
                "<span id=\"alert-".concat(alertID, "-text\"></span>") +
                "<button id=\"alert-".concat(alertID, "-btn\" type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">") +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>');
            $("#alert-" + alertID + "-btn").on("click", function () {
                alertNum--;
            });
            $("#alert-" + alertID + "-text").text(info);
            $("#alert-" + alertID).show("normal");
            $("#alert-" + alertID).css("display", "block");
            alertID++;
            alertID %= exports.MAX_ALERT_NUM * 2;
            alertNum++;
            tryRemoveAlert();
        },
        updateWithKey: function (e) {
            var amount = (0, utils_1.getAmountWithKeys)(e);
            $(".amount-type-1").text(amount > 0 ? (0, utils_1.getAmountWithKeys)(e) : " all");
            $(".amount-type-2").text(e.shiftKey ? " all" : "");
        }
    };
    function tryRemoveAlert() {
        if (alertNum > exports.MAX_ALERT_NUM) {
            var firstAlert_1 = $("#info div:first-child");
            firstAlert_1.hide("normal", function () {
                alertNum--;
                firstAlert_1.remove();
                tryRemoveAlert();
            });
        }
    }
    function show(id, speed) {
        if (speed === void 0) { speed = "normal"; }
        if ($("#" + id).css("display") == "none") {
            $("#" + id).show(speed);
            $("#" + id).css("display", "flex");
        }
    }
    function hide(id, speed) {
        if (speed === void 0) { speed = "normal"; }
        if ($("#" + id).css("display") != "hide") {
            $("#" + id).hide(speed);
        }
    }
});
define("jobs", ["require", "exports", "utils", "ui_action"], function (require, exports, utils_2, ui_action_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jobs = exports.allJobs = void 0;
    exports.allJobs = [
        "hunter", "farmer", "miner", "lumberjack", "scientist"
    ];
    var Jobs = /** @class */ (function (_super) {
        __extends(Jobs, _super);
        function Jobs(data, world) {
            var _this = _super.call(this, data) || this;
            _this.world = world;
            return _this;
        }
        Jobs.prototype.init = function () {
            this.jobbed = {};
            for (var _i = 0, allJobs_1 = exports.allJobs; _i < allJobs_1.length; _i++) {
                var job = allJobs_1[_i];
                this.jobbed[job] = 0;
            }
            this.unlockedJobs = [];
        };
        Jobs.prototype.getSavableData = function () {
            return ["jobbed", "unlockedJobs"];
        };
        Jobs.prototype.getUpdatableData = function () {
            return [
                ["idle", "job-idle-creature", "int"],
            ];
        };
        Jobs.prototype.add = function (job, v) {
            if (this.unlockedJobs.indexOf(job) >= 0 && this.idle > 0) {
                this.jobbed[job] += Math.min(this.idle, v);
                this.updateData();
                this.updateElement();
            }
        };
        Jobs.prototype.sub = function (job, v) {
            if (this.unlockedJobs.indexOf(job) >= 0 && this.jobbed[job] > 0) {
                this.jobbed[job] -= Math.min(this.jobbed[job], v);
                this.updateData();
                this.updateElement();
            }
        };
        Object.defineProperty(Jobs.prototype, "idle", {
            get: function () {
                var res = this.world.creature;
                for (var job in this.jobbed) {
                    res -= this.jobbed[job];
                }
                return res;
            },
            enumerable: false,
            configurable: true
        });
        Jobs.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            for (var _i = 0, _a = this.unlockedJobs; _i < _a.length; _i++) {
                var job = _a[_i];
                ui_action_2.html.updateInteger(job + "-num", this.jobbed[job]);
            }
            this.updateHunter();
        };
        Jobs.prototype.updateElement = function () {
            for (var job in this.jobbed) {
                if (this.jobbed[job] > 0)
                    ui_action_2.html.showJobProduct(job);
                else
                    ui_action_2.html.hideJobProduct(job);
            }
        };
        Jobs.prototype.updateHunter = function () {
            ui_action_2.html.updateFloat("hunter-food", this.world.getHunterPps());
        };
        Jobs.prototype.unlock = function (job) {
            if (this.unlockedJobs.indexOf(job) < 0) {
                this.unlockedJobs.push(job);
                ui_action_2.html.showJob(job);
            }
        };
        return Jobs;
    }(utils_2.BaseGameData));
    exports.Jobs = Jobs;
});
define("world", ["require", "exports", "ui_action", "utils", "jobs", "genesis"], function (require, exports, ui_action_3, utils_3, jobs_1, genesis_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.World = void 0;
    var World = /** @class */ (function (_super) {
        __extends(World, _super);
        function World(data) {
            var _this = _super.call(this, data) || this;
            _this.updateCreatureCost();
            _this.checkJobUnlocks();
            _this.updateNum();
            _this.jobs.updateElement();
            return _this;
        }
        World.prototype.getSavableData = function () {
            return ["food", "creature", "populationLimit", "baseCreatureCost", "jobs"];
        };
        World.prototype.load = function (data) {
            _super.prototype.load.call(this, data);
            this.jobs = new jobs_1.Jobs(data.jobs, this);
        };
        World.prototype.init = function () {
            this.food = 0;
            this.creature = 0;
            this.populationLimit = 100;
            this.baseCreatureCost = 10;
            this.jobs = new jobs_1.Jobs(null, this);
        };
        World.prototype.getUpdatableData = function () {
            return [
                ["food", "food-num", "int"],
                ["creature", "creature-num", "int"],
                ["creature", "job-total-creature", "int"],
                ["populationLimit", "population-limit", "int"],
                ["creatureCost", "creature-cost", "int"],
                ["foodPs", "food-ps", "float"],
            ];
        };
        World.prototype.incFood = function (v) {
            if (v <= 0)
                return;
            this.food += v;
            this.updateNum();
        };
        World.prototype.addFood = function (v) {
            this.incFood(v);
        };
        World.prototype.addCreature = function () {
            if (this.creature < this.populationLimit) {
                if (this.food >= this.creatureCost) {
                    this.creature += 1;
                    this.food -= this.creatureCost;
                    this.updateCreatureCost();
                    this.updateNum();
                    return true;
                }
            }
            return false;
        };
        World.prototype.getHunterPps = function () {
            return this.jobs.jobbed["hunter"] * 0.2;
        };
        Object.defineProperty(World.prototype, "foodPs", {
            get: function () {
                return this.getHunterPps();
            },
            enumerable: false,
            configurable: true
        });
        World.prototype.update = function () {
            this.incFood(this.foodPs / genesis_1.LFPS);
            this.checkJobUnlocks();
        };
        World.prototype.updateCreatureCost = function () {
            this.creatureCost = Math.ceil(this.baseCreatureCost * Math.pow(1.1, this.creature));
        };
        World.prototype.updateNum = function () {
            this.updateData();
            this.jobs.updateData();
            this.updateElement();
        };
        World.prototype.checkJobUnlocks = function () {
            this.jobs.unlock("hunter"); // Initially unlocked
        };
        World.prototype.updateElement = function () {
            if (this.food >= 10 || this.creature > 0) {
                ui_action_3.html.showCreature();
            }
            if (this.creature >= 5) {
                ui_action_3.html.showWorldTab();
            }
        };
        return World;
    }(utils_3.BaseGameData));
    exports.World = World;
});
define("react", ["require", "exports", "genesis", "jobs", "ui_action", "utils"], function (require, exports, genesis_2, jobs_2, ui_action_4, utils_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add_reaction = void 0;
    function add_reaction() {
        $(function () {
            // key press checks
            $(document).keydown(function (e) {
                switch (e.which) {
                    case 16: // shift
                    case 17: // control
                    case 18: // alt
                        ui_action_4.html.updateWithKey(e);
                        break;
                    default:
                        break;
                }
            });
            $(document).keyup(function (e) {
                switch (e.which) {
                    case 16: // shift
                    case 17: // control
                    case 18: // alt
                        ui_action_4.html.updateWithKey(e);
                        break;
                    default:
                        break;
                }
            });
            $("#add-creature").click(function (e) {
                (0, utils_4.buyWithKeys)(e, function () { return genesis_2.game.world.addCreature(); });
            });
            $("#add-food").click(function () {
                genesis_2.game.world.addFood(1);
            });
            $("#hard-reset").click(function () {
                localStorage.removeItem("save");
                $("#main").effect("clip", { direction: "horizontal" });
                setTimeout(function () { return location.reload(); }, 1000);
            });
            var _loop_1 = function (job) {
                $("#add-" + job).click(function (e) {
                    genesis_2.game.world.jobs.add(job, e.shiftKey ? genesis_2.game.world.creature : 1);
                });
                $("#sub-" + job).click(function (e) {
                    genesis_2.game.world.jobs.sub(job, e.shiftKey ? genesis_2.game.world.creature : 1);
                });
            };
            for (var _i = 0, allJobs_2 = jobs_2.allJobs; _i < allJobs_2.length; _i++) {
                var job = allJobs_2[_i];
                _loop_1(job);
            }
            $("#mannually-save").click(function () {
                genesis_2.game.save();
                ui_action_4.html.alert("Game saved.");
            });
            $("#music-play").click(function () {
                var player = $("#audio-player").get(0);
                if (player.paused) {
                    player.play();
                    $("#music-play").text("Pause BGM");
                }
                else {
                    player.pause();
                    $("#music-play").text("Play BGM");
                }
            });
        });
    }
    exports.add_reaction = add_reaction;
});
define("genesis", ["require", "exports", "world", "react"], function (require, exports, world_1, react_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.game = exports.LFPS = exports.DEBUG = void 0;
    exports.DEBUG = true;
    exports.LFPS = 100;
    var Game = /** @class */ (function () {
        function Game(data) {
            if (data) {
                this.world = new world_1.World(data.world);
            }
            else {
                this.world = new world_1.World(null);
            }
        }
        Game.prototype.start = function () {
            var _this = this;
            (0, react_1.add_reaction)();
            setInterval(function () { return _this.update(); }, 1000 / exports.LFPS);
            setInterval(function () { return _this.save(); }, 30000);
        };
        Game.prototype.update = function () {
            this.world.update();
        };
        Game.prototype.save = function () {
            if (exports.DEBUG) {
                console.log("saved");
                console.log(exports.game);
            }
            var data = {
                world: this.world.save(),
            };
            localStorage.setItem("save", btoa(JSON.stringify(data)));
        };
        return Game;
    }());
    exports.game = load();
    function load() {
        var save = null;
        save = localStorage.getItem("save");
        if (save) {
            try {
                return new Game(JSON.parse(atob(save)));
            }
            catch (e) {
                console.error("failed to load");
                console.error(e);
            }
        }
        return new Game(null);
    }
});
