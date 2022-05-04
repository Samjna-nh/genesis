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
define("ui_action", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.html = void 0;
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
        }
    };
    function show(id) {
        if ($("#" + id).css("display") != "flex") {
            $("#" + id).show("slow");
            $("#" + id).css("display", "flex");
        }
    }
});
define("utils", ["require", "exports", "ui_action"], function (require, exports, ui_action_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseGameData = void 0;
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
        function BaseGameData() {
            this.updatableData = [];
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
        return BaseGameData;
    }());
    exports.BaseGameData = BaseGameData;
});
define("jobs", ["require", "exports", "utils", "ui_action"], function (require, exports, utils_1, ui_action_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jobs = exports.allJobs = void 0;
    exports.allJobs = [
        "hunter", "farmer", "miner", "lumberjack", "scientist"
    ];
    var Jobs = /** @class */ (function (_super) {
        __extends(Jobs, _super);
        function Jobs(data) {
            var _this = _super.call(this) || this;
            _this.updatableData = [
                ["totalCreature", "job-total-creature", "int"],
                ["idle", "job-idle-creature", "int"],
            ];
            if (data) {
                _this.totalCreature = data.totalCreature;
                _this.jobbed = data.jobbed;
                _this.unlockedJobs = data.unlockedJobs;
                _this.idle = data.idle;
            }
            else {
                _this.totalCreature = 0;
                _this.jobbed = {};
                for (var _i = 0, allJobs_1 = exports.allJobs; _i < allJobs_1.length; _i++) {
                    var job = allJobs_1[_i];
                    _this.jobbed[job] = 0;
                }
                _this.unlockedJobs = [];
            }
            _this.updateIdle();
            return _this;
        }
        Jobs.prototype.add = function (job) {
            if (this.unlockedJobs.indexOf(job) >= 0 && this.idle > 0) {
                this.jobbed[job]++;
                this.updateIdle();
            }
        };
        Jobs.prototype.sub = function (job) {
            if (this.unlockedJobs.indexOf(job) >= 0 && this.jobbed[job] > 0) {
                this.jobbed[job]--;
                this.updateIdle();
            }
        };
        Jobs.prototype.setCreature = function (creature) {
            this.totalCreature = creature;
            this.updateIdle();
        };
        Jobs.prototype.updateIdle = function () {
            this.idle = this.totalCreature;
            for (var job in this.jobbed) {
                this.idle -= this.jobbed[job];
            }
            this.updateData();
        };
        Jobs.prototype.updateData = function () {
            _super.prototype.updateData.call(this);
            for (var _i = 0, _a = this.unlockedJobs; _i < _a.length; _i++) {
                var job = _a[_i];
                ui_action_2.html.updateInteger(job + "-num", this.jobbed[job]);
            }
        };
        Jobs.prototype.unlock = function (job) {
            if (this.unlockedJobs.indexOf(job) < 0) {
                this.unlockedJobs.push(job);
                ui_action_2.html.showJob(job);
            }
        };
        return Jobs;
    }(utils_1.BaseGameData));
    exports.Jobs = Jobs;
});
define("world", ["require", "exports", "ui_action", "utils", "jobs", "genesis"], function (require, exports, ui_action_3, utils_2, jobs_1, genesis_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.World = void 0;
    var World = /** @class */ (function (_super) {
        __extends(World, _super);
        function World(data) {
            var _this = _super.call(this) || this;
            _this.updatableData = [
                ["food", "food-num", "int"],
                ["creature", "creature-num", "int"],
                ["populationLimit", "population-limit", "int"],
                ["creatureCost", "creature-cost", "int"],
            ];
            if (data) {
                _this.food = data.food;
                _this.creature = data.creature;
                _this.populationLimit = data.populationLimit;
                _this.baseCreatureCost = data.baseCreatureCost;
                _this.jobs = new jobs_1.Jobs(data.jobs);
            }
            else {
                _this.food = 0;
                _this.creature = 0;
                _this.populationLimit = 100;
                _this.baseCreatureCost = 10;
                _this.jobs = new jobs_1.Jobs(null);
                _this.jobs.unlock("hunter");
            }
            _this.updateCreatureCost();
            _this.updateNum();
            return _this;
        }
        World.prototype.addFood = function () {
            this.food += genesis_1.DEBUG ? 100 : 1;
            this.updateNum();
        };
        World.prototype.addCreature = function () {
            if (this.creature < this.populationLimit)
                if (this.food >= this.creatureCost) {
                    this.creature += 1;
                    this.food -= this.creatureCost;
                    this.updateCreatureCost();
                    this.updateNum();
                }
        };
        World.prototype.update = function () {
        };
        World.prototype.updateCreatureCost = function () {
            this.creatureCost = Math.ceil(this.baseCreatureCost * Math.pow(1.1, this.creature));
        };
        World.prototype.updateNum = function () {
            this.jobs.setCreature(this.creature);
            this.updateData();
            this.updateElement();
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
    }(utils_2.BaseGameData));
    exports.World = World;
});
define("react", ["require", "exports", "genesis", "jobs"], function (require, exports, genesis_2, jobs_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.add_reaction = void 0;
    function add_reaction() {
        $(function () {
            $("#add-creature").click(function () {
                genesis_2.game.world.addCreature();
            });
            $("#add-food").click(function () {
                genesis_2.game.world.addFood();
            });
            $("#hard-reset").click(function () {
                localStorage.removeItem("save");
                $("#main").effect("clip", { direction: "horizontal" });
                setTimeout(function () { return location.reload(); }, 1000);
            });
            var _loop_1 = function (job) {
                $("#add-" + job).click(function () {
                    genesis_2.game.world.jobs.add(job);
                });
                $("#sub-" + job).click(function () {
                    genesis_2.game.world.jobs.sub(job);
                });
            };
            for (var _i = 0, allJobs_2 = jobs_2.allJobs; _i < allJobs_2.length; _i++) {
                var job = allJobs_2[_i];
                _loop_1(job);
            }
            $("#mannually-save").click(function () {
                genesis_2.game.save();
            });
        });
    }
    exports.add_reaction = add_reaction;
});
define("genesis", ["require", "exports", "world", "react"], function (require, exports, world_1, react_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.game = exports.DEBUG = void 0;
    exports.DEBUG = true;
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
            setInterval(function () { return _this.update(); }, 10);
            setInterval(function () { return _this.save(); }, 10000);
        };
        Game.prototype.update = function () {
            this.world.update();
        };
        Game.prototype.save = function () {
            if (exports.DEBUG) {
                console.log("saved");
                console.log(exports.game);
            }
            localStorage.setItem("save", btoa(JSON.stringify(this)));
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
