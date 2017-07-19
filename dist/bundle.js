(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var cursor_1 = require("./cursor");
var narrator_1 = require("./narrator");
var verb_bar_1 = require("./verb-bar");
var room_ufo_1 = require("./rooms/room-ufo");
var GameATron = (function () {
    function GameATron() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, // Default renderer
        "content", // DOM element
        this, false, // transparent
        false); // anti-aliasing
        this.cursor = new cursor_1.Cursor();
        this.narrator = new narrator_1.Narrator();
        this.narrator.initialize(this.game);
        this.verbBar = new verb_bar_1.VerbBar(this.game);
        this.room = new room_ufo_1.UfoRoom();
        this.room.initialize(this.game, this.cursor, this.verbBar);
    }
    GameATron.prototype.preload = function () {
        this.game.load.image("object-sonic", "../assets/objects/sonic.png");
        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");
        this.room.preload();
        this.cursor.preload(this.game);
    };
    GameATron.prototype.create = function () {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.smoothed = false;
        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;
        this.verbBar.create();
        this.room.create();
        this.cursor.create(this.game);
        this.narrator.create();
        this.narrator.say('You are in some kind of awesome pixelated spaceship');
    };
    GameATron.prototype.update = function () {
        this.room.update();
    };
    GameATron.prototype.render = function () {
        //        this.game.debug.text(this.game.input.mouse.locked.toString(), 320, 32);
    };
    return GameATron;
}());
window.onload = function () {
    var game = new GameATron();
};

},{"./cursor":2,"./narrator":3,"./rooms/room-ufo":7,"./verb-bar":8}],2:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Cursor = (function () {
    function Cursor() {
    }
    Cursor.prototype.preload = function (game) {
        game.load.spritesheet("cursor", "assets/sprites/cursor58x58.png", 58, 58);
    };
    Cursor.prototype.create = function (game) {
        var _this = this;
        // Create a sprite for the cursor.
        this.cursor = game.add.sprite(game.world.centerX, game.world.centerY, "cursor");
        var cursorBlink = this.cursor.animations.add("blink");
        this.cursor.animations.play("blink", 6, true);
        // Lock the pointer on mousedown.
        game.canvas.addEventListener("mousedown", function () {
            game.input.mouse.requestPointerLock();
            game.scale.startFullScreen(false);
        });
        // Register a move callback to render our own cursor.
        game.input.addMoveCallback(function (pointer, x, y, click) {
            // If the cursor is locked to the game, and the callback was not fired from a 'click' event
            // (such as a mouse click or touch down) - as then it might contain incorrect movement values
            if (game.input.mouse.locked && !click) {
                _this.cursor.x += game.input.mouse.event.movementX;
                _this.cursor.y += game.input.mouse.event.movementY;
            }
        }, this);
    };
    Cursor.prototype.overlap = function (sprite) {
        return this.cursor.overlap(sprite);
    };
    return Cursor;
}());
exports.Cursor = Cursor;

},{}],3:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Narrator = (function () {
    function Narrator() {
    }
    Narrator.prototype.initialize = function (game) {
        this.game = game;
    };
    Narrator.prototype.create = function () {
        this.textBox = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5);
    };
    Narrator.prototype.say = function (text) {
        this.textBox.setText("Hello, world!");
        //        this.textBox.updateText();
        // var timer = this.game.time.events.add(Phaser.Timer.SECOND * 2, function(this) {
        //     this.textBox.text = "";
        //     this.textBox.updateText();    
        // }, this);
        //at some point you want to remove itgame.time.events.remove(timer); MichaelD likes this
    };
    return Narrator;
}());
exports.Narrator = Narrator;

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var room_object_1 = require("../room-object");
var SonicObject = (function (_super) {
    __extends(SonicObject, _super);
    function SonicObject() {
        return _super.call(this, "sonic") || this;
    }
    Object.defineProperty(SonicObject.prototype, "DisplayName", {
        get: function () {
            return "Sonic the Hedgehog";
        },
        enumerable: true,
        configurable: true
    });
    return SonicObject;
}(room_object_1.RoomObject));
exports.SonicObject = SonicObject;

},{"../room-object":5}],5:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var RoomObject = (function () {
    function RoomObject(name) {
        this.name = name;
    }
    RoomObject.prototype.initialize = function (game) {
        this.game = game;
    };
    RoomObject.prototype.draw = function (x, y, onInputDown, onInputDownContext) {
        this.sprite = this.game.add.sprite(x, y, "object-" + this.name);
        this.sprite.anchor.set(0.5);
    };
    RoomObject.prototype.isHit = function (cursor) {
        return cursor.overlap(this.sprite);
    };
    return RoomObject;
}());
exports.RoomObject = RoomObject;

},{}],6:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Room = (function () {
    function Room(name) {
        this.name = name;
        this.roomObjects = new Array();
    }
    Room.prototype.initialize = function (game, cursor, verbBar) {
        this.game = game;
        this.cursor = cursor;
        this.verbBar = verbBar;
    };
    Room.prototype.preload = function () {
        this.game.load.image(this.name + "-room-background", "assets/backgrounds/" + this.name + ".png");
        // TODO Load other sprites.
    };
    Room.prototype.create = function () {
        this.game.add.sprite(0, 0, this.name + "-room-background");
        this.enter();
    };
    Room.prototype.update = function () {
        for (var i = 0; i < this.roomObjects.length; i++) {
            if (this.roomObjects[i].isHit(this.cursor)) {
                this.verbBar.setText(this.roomObjects[i].DisplayName);
                return;
            }
        }
        ;
        this.verbBar.clearText();
    };
    Room.prototype.addRoomObject = function (roomObject, x, y) {
        this.roomObjects.push(roomObject);
        roomObject.initialize(this.game);
        roomObject.draw(x, y, function onInputDown() {
        }, this);
    };
    return Room;
}());
exports.Room = Room;

},{}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var room_1 = require("../room");
var object_sonic_1 = require("../objects/object-sonic");
var UfoRoom = (function (_super) {
    __extends(UfoRoom, _super);
    function UfoRoom() {
        return _super.call(this, "ufo") || this;
    }
    UfoRoom.prototype.enter = function () {
        this.sonic = new object_sonic_1.SonicObject();
        this.addRoomObject(this.sonic, 400, 300);
    };
    return UfoRoom;
}(room_1.Room));
exports.UfoRoom = UfoRoom;

},{"../objects/object-sonic":4,"../room":6}],8:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var VerbBar = (function () {
    function VerbBar(game) {
        this.game = game;
    }
    VerbBar.prototype.create = function () {
        this.textBox = this.game.add.bitmapText(this.game.world.centerX, 560, "onesize", "", 20);
        this.textBox.anchor.setTo(0.5, 0.5);
    };
    VerbBar.prototype.clearText = function () {
        this.setText("");
    };
    VerbBar.prototype.setText = function (text) {
        this.textBox.setText(text);
    };
    return VerbBar;
}());
exports.VerbBar = VerbBar;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLnRzIiwic3JjL2N1cnNvci50cyIsInNyYy9uYXJyYXRvci50cyIsInNyYy9vYmplY3RzL29iamVjdC1zb25pYy50cyIsInNyYy9yb29tLW9iamVjdC50cyIsInNyYy9yb29tLnRzIiwic3JjL3Jvb21zL3Jvb20tdWZvLnRzIiwic3JjL3ZlcmItYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHNFQUFzRTs7QUFFdEUsbUNBQWlDO0FBQ2pDLHVDQUFxQztBQUNyQyx1Q0FBb0M7QUFHcEMsNkNBQTBDO0FBRTFDO0lBUUk7UUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FDdkIsR0FBRyxFQUNILEdBQUcsRUFDSCxNQUFNLENBQUMsSUFBSSxFQUFFLG1CQUFtQjtRQUNoQyxTQUFTLEVBQUUsY0FBYztRQUN6QixJQUFJLEVBQ0osS0FBSyxFQUFFLGNBQWM7UUFDckIsS0FBSyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7UUFFNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxrQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVPLDJCQUFPLEdB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LENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSwyQkFBUyxHQUFoQjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVNLHlCQUFPLEdBQWQsVUFBZSxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FyQkEsQUFxQkMsSUFBQTtBQXJCWSwwQkFBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIgLz5cblxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSAnLi9jdXJzb3InXG5pbXBvcnQgeyBOYXJyYXRvciB9IGZyb20gJy4vbmFycmF0b3InXG5pbXBvcnQgeyBWZXJiQmFyIH0gZnJvbSAnLi92ZXJiLWJhcidcblxuaW1wb3J0IHsgUm9vbSB9IGZyb20gJy4vcm9vbSdcbmltcG9ydCB7IFVmb1Jvb20gfSBmcm9tICcuL3Jvb21zL3Jvb20tdWZvJ1xuXG5jbGFzcyBHYW1lQVRyb24ge1xuXG4gICAgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZTtcbiAgICBwcml2YXRlIGN1cnNvcjogQ3Vyc29yO1xuICAgIHByaXZhdGUgbmFycmF0b3I6IE5hcnJhdG9yO1xuICAgIHByaXZhdGUgdmVyYkJhcjogVmVyYkJhcjtcbiAgICBwcml2YXRlIHJvb206IFJvb207XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gbmV3IFBoYXNlci5HYW1lKFxuICAgICAgICAgICAgODAwLFxuICAgICAgICAgICAgNjAwLFxuICAgICAgICAgICAgUGhhc2VyLkFVVE8sIC8vIERlZmF1bHQgcmVuZGVyZXJcbiAgICAgICAgICAgIFwiY29udGVudFwiLCAvLyBET00gZWxlbWVudFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGZhbHNlLCAvLyB0cmFuc3BhcmVudFxuICAgICAgICAgICAgZmFsc2UpOyAvLyBhbnRpLWFsaWFzaW5nXG5cbiAgICAgICAgdGhpcy5jdXJzb3IgPSBuZXcgQ3Vyc29yKCk7XG5cbiAgICAgICAgdGhpcy5uYXJyYXRvciA9IG5ldyBOYXJyYXRvcigpO1xuICAgICAgICB0aGlzLm5hcnJhdG9yLmluaXRpYWxpemUodGhpcy5nYW1lKTtcblxuICAgICAgICB0aGlzLnZlcmJCYXIgPSBuZXcgVmVyYkJhcih0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMucm9vbSA9IG5ldyBVZm9Sb29tKCk7XG4gICAgICAgIHRoaXMucm9vbS5pbml0aWFsaXplKHRoaXMuZ2FtZSwgdGhpcy5jdXJzb3IsIHRoaXMudmVyYkJhcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVsb2FkKCkge1xuXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwib2JqZWN0LXNvbmljXCIsIFwiLi4vYXNzZXRzL29iamVjdHMvc29uaWMucG5nXCIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmJpdG1hcEZvbnQoXCJvbmVzaXplXCIsIFwiLi4vZm9udHMvZm9udC5wbmdcIiwgXCIuLi9mb250cy9mb250LmZudFwiKTtcblxuICAgICAgICB0aGlzLnJvb20ucHJlbG9hZCgpO1xuICAgICAgICB0aGlzLmN1cnNvci5wcmVsb2FkKHRoaXMuZ2FtZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XG5cbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLmZ1bGxTY3JlZW5TY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICB0aGlzLmdhbWUuc3RhZ2Uuc21vb3RoZWQgPSBmYWxzZTtcblxuXG4gICAgICAgIC8vIENlbnRlciBnYW1lIGNhbnZhcyBvbiBwYWdlXG4gICAgICAgIC8vIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICAvLyB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgLy8gdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMudmVyYkJhci5jcmVhdGUoKTtcbiAgICAgICAgdGhpcy5yb29tLmNyZWF0ZSgpO1xuICAgICAgICB0aGlzLmN1cnNvci5jcmVhdGUodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5uYXJyYXRvci5jcmVhdGUoKTtcblxuICAgICAgICB0aGlzLm5hcnJhdG9yLnNheSgnWW91IGFyZSBpbiBzb21lIGtpbmQgb2YgYXdlc29tZSBwaXhlbGF0ZWQgc3BhY2VzaGlwJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMucm9vbS51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcblxuLy8gICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy50ZXh0KHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5sb2NrZWQudG9TdHJpbmcoKSwgMzIwLCAzMik7XG4gICAgfVxufVxuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgIGxldCBnYW1lID0gbmV3IEdhbWVBVHJvbigpO1xufTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIgLz5cblxuZXhwb3J0IGNsYXNzIEN1cnNvciB7XG5cbiAgICBwcml2YXRlIGN1cnNvcjogUGhhc2VyLlNwcml0ZTtcblxuICAgIHB1YmxpYyBwcmVsb2FkKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIGdhbWUubG9hZC5zcHJpdGVzaGVldChcImN1cnNvclwiLCBcImFzc2V0cy9zcHJpdGVzL2N1cnNvcjU4eDU4LnBuZ1wiLCA1OCwgNTgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGUoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcblxuICAgICAgICAvLyBDcmVhdGUgYSBzcHJpdGUgZm9yIHRoZSBjdXJzb3IuXG4gICAgICAgIHRoaXMuY3Vyc29yID0gZ2FtZS5hZGQuc3ByaXRlKGdhbWUud29ybGQuY2VudGVyWCwgZ2FtZS53b3JsZC5jZW50ZXJZLCBcImN1cnNvclwiKTtcblxuICAgICAgICBsZXQgY3Vyc29yQmxpbmsgPSB0aGlzLmN1cnNvci5hbmltYXRpb25zLmFkZChcImJsaW5rXCIpO1xuXG4gICAgICAgIHRoaXMuY3Vyc29yLmFuaW1hdGlvbnMucGxheShcImJsaW5rXCIsIDYsIHRydWUpO1xuXG4gICAgICAgIC8vIExvY2sgdGhlIHBvaW50ZXIgb24gbW91c2Vkb3duLlxuICAgICAgICBnYW1lLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsICgpID0+IHtcbiAgICAgICAgICAgIGdhbWUuaW5wdXQubW91c2UucmVxdWVzdFBvaW50ZXJMb2NrKCk7XG4gICAgICAgICAgICBnYW1lLnNjYWxlLnN0YXJ0RnVsbFNjcmVlbihmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJlZ2lzdGVyIGEgbW92ZSBjYWxsYmFjayB0byByZW5kZXIgb3VyIG93biBjdXJzb3IuXG4gICAgICAgIGdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKChwb2ludGVyLCB4LCB5LCBjbGljaykgPT4ge1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgY3Vyc29yIGlzIGxvY2tlZCB0byB0aGUgZ2FtZSwgYW5kIHRoZSBjYWxsYmFjayB3YXMgbm90IGZpcmVkIGZyb20gYSAnY2xpY2snIGV2ZW50XG4gICAgICAgICAgICAvLyAoc3VjaCBhcyBhIG1vdXNlIGNsaWNrIG9yIHRvdWNoIGRvd24pIC0gYXMgdGhlbiBpdCBtaWdodCBjb250YWluIGluY29ycmVjdCBtb3ZlbWVudCB2YWx1ZXNcbiAgICAgICAgICAgIGlmIChnYW1lLmlucHV0Lm1vdXNlLmxvY2tlZCAmJiAhY2xpY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnNvci54ICs9IGdhbWUuaW5wdXQubW91c2UuZXZlbnQubW92ZW1lbnRYO1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yLnkgKz0gZ2FtZS5pbnB1dC5tb3VzZS5ldmVudC5tb3ZlbWVudFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvdmVybGFwKHNwcml0ZTogUGhhc2VyLlNwcml0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJzb3Iub3ZlcmxhcChzcHJpdGUpO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIgLz5cblxuZXhwb3J0IGNsYXNzIE5hcnJhdG9yIHtcblxuICAgIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWU7XG4gICAgcHJpdmF0ZSB0ZXh0Qm94OiBQaGFzZXIuQml0bWFwVGV4dDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0aWFsaXplKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50ZXh0Qm94ID0gdGhpcy5nYW1lLmFkZC5iaXRtYXBUZXh0KHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYLCB0aGlzLmdhbWUud29ybGQuY2VudGVyWSwgXCJvbmVzaXplXCIsIFwiXCIsIDIwKTtcbiAgICAgICAgdGhpcy50ZXh0Qm94LmFuY2hvci5zZXRUbygwLjUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzYXkodGV4dDogc3RyaW5nKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy50ZXh0Qm94LnNldFRleHQoXCJIZWxsbywgd29ybGQhXCIpO1xuLy8gICAgICAgIHRoaXMudGV4dEJveC51cGRhdGVUZXh0KCk7XG5cbiAgICAgICAgLy8gdmFyIHRpbWVyID0gdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChQaGFzZXIuVGltZXIuU0VDT05EICogMiwgZnVuY3Rpb24odGhpcykge1xuICAgICAgICAvLyAgICAgdGhpcy50ZXh0Qm94LnRleHQgPSBcIlwiO1xuICAgICAgICAvLyAgICAgdGhpcy50ZXh0Qm94LnVwZGF0ZVRleHQoKTsgICAgXG4gICAgICAgIC8vIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAvL2F0IHNvbWUgcG9pbnQgeW91IHdhbnQgdG8gcmVtb3ZlIGl0Z2FtZS50aW1lLmV2ZW50cy5yZW1vdmUodGltZXIpOyBNaWNoYWVsRCBsaWtlcyB0aGlzXG4gICAgfVxufSIsImltcG9ydCB7IFJvb21PYmplY3QgfSBmcm9tICcuLi9yb29tLW9iamVjdCdcblxuZXhwb3J0IGNsYXNzIFNvbmljT2JqZWN0IGV4dGVuZHMgUm9vbU9iamVjdCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJzb25pY1wiKTtcbiAgICB9XG5cbiAgICBnZXQgRGlzcGxheU5hbWUoKSA6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIlNvbmljIHRoZSBIZWRnZWhvZ1wiO1xuICAgIH1cbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIgLz5cblxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSAnLi9jdXJzb3InXG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSb29tT2JqZWN0IHtcblxuICAgIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWU7XG4gICAgcHJpdmF0ZSBzcHJpdGU6IFBoYXNlci5TcHJpdGU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5hbWU6IHN0cmluZykge1xuICAgIH1cblxuICAgIHB1YmxpYyBhYnN0cmFjdCBEaXNwbGF5TmFtZSA6IHN0cmluZztcblxuICAgIHB1YmxpYyBpbml0aWFsaXplKGdhbWU6IFBoYXNlci5HYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcoeDogbnVtYmVyLCB5OiBudW1iZXIsIG9uSW5wdXREb3duOiBGdW5jdGlvbiwgb25JbnB1dERvd25Db250ZXh0PzogYW55KTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh4LCB5LCBcIm9iamVjdC1cIiArIHRoaXMubmFtZSk7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXQoMC41KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNIaXQoY3Vyc29yOiBDdXJzb3IpIDogYm9vbGVhbiB7XG5cbiAgICAgICAgcmV0dXJuIGN1cnNvci5vdmVybGFwKHRoaXMuc3ByaXRlKTtcbiAgICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL3BoYXNlci90eXBlc2NyaXB0L3BoYXNlci5kLnRzXCIgLz5cblxuaW1wb3J0IHsgQ3Vyc29yIH0gZnJvbSAnLi9jdXJzb3InXG5pbXBvcnQgeyBSb29tT2JqZWN0IH0gZnJvbSAnLi9yb29tLW9iamVjdCdcbmltcG9ydCB7IFZlcmJCYXIgfSBmcm9tICcuL3ZlcmItYmFyJ1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUm9vbSB7XG5cbiAgICBwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lO1xuICAgIHByaXZhdGUgY3Vyc29yOiBDdXJzb3I7XG4gICAgcHJpdmF0ZSB2ZXJiQmFyOiBWZXJiQmFyO1xuICAgIHByaXZhdGUgcm9vbU9iamVjdHM6IEFycmF5PFJvb21PYmplY3Q+O1xuICAgIHByaXZhdGUgaGl0Ym94OiBQaGFzZXIuU3ByaXRlO1xuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3Q6IFBoYXNlci5TcHJpdGU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJvb21PYmplY3RzID0gbmV3IEFycmF5PFJvb21PYmplY3Q+KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXRpYWxpemUoZ2FtZTogUGhhc2VyLkdhbWUsIGN1cnNvcjogQ3Vyc29yLCB2ZXJiQmFyOiBWZXJiQmFyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY3Vyc29yID0gY3Vyc29yO1xuICAgICAgICB0aGlzLnZlcmJCYXIgPSB2ZXJiQmFyO1xuICAgIH1cblxuICAgIHB1YmxpYyBwcmVsb2FkKCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKHRoaXMubmFtZSArIFwiLXJvb20tYmFja2dyb3VuZFwiLCBcImFzc2V0cy9iYWNrZ3JvdW5kcy9cIiArIHRoaXMubmFtZSArIFwiLnBuZ1wiKTtcblxuICAgICAgICAvLyBUT0RPIExvYWQgb3RoZXIgc3ByaXRlcy5cbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMubmFtZSArIFwiLXJvb20tYmFja2dyb3VuZFwiKTtcblxuICAgICAgICB0aGlzLmVudGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm9vbU9iamVjdHMubGVuZ3RoOyBpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvb21PYmplY3RzW2ldLmlzSGl0KHRoaXMuY3Vyc29yKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmVyYkJhci5zZXRUZXh0KHRoaXMucm9vbU9iamVjdHNbaV0uRGlzcGxheU5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnZlcmJCYXIuY2xlYXJUZXh0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGVudGVyKCk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgYWRkUm9vbU9iamVjdChyb29tT2JqZWN0OiBSb29tT2JqZWN0LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuXG4gICAgICAgIHRoaXMucm9vbU9iamVjdHMucHVzaChyb29tT2JqZWN0KTtcblxuICAgICAgICByb29tT2JqZWN0LmluaXRpYWxpemUodGhpcy5nYW1lKTtcbiAgICAgICAgcm9vbU9iamVjdC5kcmF3KHgsIHksIGZ1bmN0aW9uIG9uSW5wdXREb3duICgpIHtcblxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBSb29tIH0gZnJvbSAnLi4vcm9vbSdcbmltcG9ydCB7IFNvbmljT2JqZWN0IH0gZnJvbSAnLi4vb2JqZWN0cy9vYmplY3Qtc29uaWMnXG5cbmV4cG9ydCBjbGFzcyBVZm9Sb29tIGV4dGVuZHMgUm9vbSB7XG5cbiAgICBwcml2YXRlIHNvbmljOiBTb25pY09iamVjdDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcInVmb1wiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW50ZXIoKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5zb25pYyA9IG5ldyBTb25pY09iamVjdCgpO1xuXG4gICAgICAgIHRoaXMuYWRkUm9vbU9iamVjdCh0aGlzLnNvbmljLCA0MDAsIDMwMCk7XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIiAvPlxuXG5leHBvcnQgY2xhc3MgVmVyYkJhciB7XG5cbiAgICBwcml2YXRlIGdhbWU6IFBoYXNlci5HYW1lO1xuICAgIHByaXZhdGUgdGV4dEJveDogUGhhc2VyLkJpdG1hcFRleHQ7XG5cbiAgICBjb25zdHJ1Y3RvcihnYW1lOiBQaGFzZXIuR2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEJveCA9IHRoaXMuZ2FtZS5hZGQuYml0bWFwVGV4dCh0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgNTYwLCBcIm9uZXNpemVcIiwgXCJcIiwgMjApO1xuICAgICAgICB0aGlzLnRleHRCb3guYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJUZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldFRleHQoXCJcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFRleHQodGV4dDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGV4dEJveC5zZXRUZXh0KHRleHQpO1xuICAgIH1cbn0iXX0=
