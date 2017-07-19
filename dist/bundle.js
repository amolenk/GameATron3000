(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var cursor_1 = require("./cursor");
var narrator_1 = require("./narrator");
var room_ufo_1 = require("./room-ufo");
var GameATron = (function () {
    function GameATron() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, // Default renderer
        "content", // DOM element
        this, false, // transparent
        false); // anti-aliasing
        this.cursor = new cursor_1.Cursor();
        this.narrator = new narrator_1.Narrator();
        this.narrator.initialize(this.game);
        this.room = new room_ufo_1.UfoRoom();
        this.room.initialize(this.game, this.cursor);
    }
    GameATron.prototype.preload = function () {
        this.game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");
        this.room.preload();
        this.cursor.preload(this.game);
    };
    GameATron.prototype.create = function () {
        this.game.stage.smoothed = false;
        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;
        this.room.create();
        this.cursor.create(this.game);
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

},{"./cursor":2,"./narrator":3,"./room-ufo":4}],2:[function(require,module,exports){
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
    Narrator.prototype.say = function (text) {
        console.log('narrator created');
        var textbox = this.game.add.bitmapText(200, 160, "onesize", text, 20);
        //           //  this.textbox.text = "Look at fridge";
        //             // this.textbox.updateText();
        //         }, this);
        //         // Print some test text.
        //         let text = game.add.bitmapText(200, 560, "onesize", "Talk to cleverly disguised Rolorob.", 20);
    };
    return Narrator;
}());
exports.Narrator = Narrator;

},{}],4:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
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
var room_1 = require("./room");
var UfoRoom = (function (_super) {
    __extends(UfoRoom, _super);
    function UfoRoom() {
        return _super.call(this, "ufo") || this;
    }
    UfoRoom.prototype.enter = function () {
        this.addObject();
    };
    return UfoRoom;
}(room_1.Room));
exports.UfoRoom = UfoRoom;

},{"./room":5}],5:[function(require,module,exports){
"use strict";
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var Room = (function () {
    function Room(name) {
        this.name = name;
    }
    Room.prototype.initialize = function (game, cursor) {
        this.game = game;
        this.cursor = cursor;
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
        if (this.cursor.overlap(this.hitbox)) {
            if (this.hitbox !== this.selectedObject) {
                console.log("enter");
                this.selectedObject = this.hitbox;
            }
        }
        else if (this.selectedObject != null) {
            console.log("exit");
            this.selectedObject = null;
        }
    };
    Room.prototype.addObject = function () {
        this.hitbox = this.game.add.sprite(500, 240, "ufo-room-background");
        this.hitbox.scale.setTo(0.05, 0.25);
        this.hitbox.inputEnabled = true;
        this.hitbox.renderable = false;
    };
    return Room;
}());
exports.Room = Room;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLnRzIiwic3JjL2N1cnNvci50cyIsInNyYy9uYXJyYXRvci50cyIsInNyYy9yb29tLXVmby50cyIsInNyYy9yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLHNFQUFzRTs7QUFFdEUsbUNBQWlDO0FBQ2pDLHVDQUFxQztBQUVyQyx1Q0FBb0M7QUFFcEM7SUFPSTtRQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUN2QixHQUFHLEVBQ0gsR0FBRyxFQUNILE1BQU0sQ0FBQyxJQUFJLEVBQUUsbUJBQW1CO1FBQ2hDLFNBQVMsRUFBRSxjQUFjO1FBQ3pCLElBQUksRUFDSixLQUFLLEVBQUUsY0FBYztRQUNyQixLQUFLLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtRQUU1QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7UUFFM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGtCQUFPLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sMkJBQU8sR0FBZjtRQUVJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUUvRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJ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VSxHQUFHLEtBQUssQ0FBQztJQUNuQyxDQUFDO0lBQ0wsV0FBQztBQUFELENBcERBLEFBb0RDLElBQUE7QUFwRHFCLG9CQUFJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIiAvPlxuXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tICcuL2N1cnNvcidcbmltcG9ydCB7IE5hcnJhdG9yIH0gZnJvbSAnLi9uYXJyYXRvcidcbmltcG9ydCB7IFJvb20gfSBmcm9tICcuL3Jvb20nXG5pbXBvcnQgeyBVZm9Sb29tIH0gZnJvbSAnLi9yb29tLXVmbydcblxuY2xhc3MgR2FtZUFUcm9uIHtcblxuICAgIHByaXZhdGUgZ2FtZTogUGhhc2VyLkdhbWU7XG4gICAgcHJpdmF0ZSBjdXJzb3I6IEN1cnNvcjtcbiAgICBwcml2YXRlIG5hcnJhdG9yOiBOYXJyYXRvcjtcbiAgICBwcml2YXRlIHJvb206IFJvb207XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gbmV3IFBoYXNlci5HYW1lKFxuICAgICAgICAgICAgODAwLFxuICAgICAgICAgICAgNjAwLFxuICAgICAgICAgICAgUGhhc2VyLkFVVE8sIC8vIERlZmF1bHQgcmVuZGVyZXJcbiAgICAgICAgICAgIFwiY29udGVudFwiLCAvLyBET00gZWxlbWVudFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGZhbHNlLCAvLyB0cmFuc3BhcmVudFxuICAgICAgICAgICAgZmFsc2UpOyAvLyBhbnRpLWFsaWFzaW5nXG5cbiAgICAgICAgdGhpcy5jdXJzb3IgPSBuZXcgQ3Vyc29yKCk7XG5cbiAgICAgICAgdGhpcy5uYXJyYXRvciA9IG5ldyBOYXJyYXRvcigpO1xuICAgICAgICB0aGlzLm5hcnJhdG9yLmluaXRpYWxpemUodGhpcy5nYW1lKTtcblxuICAgICAgICB0aGlzLnJvb20gPSBuZXcgVWZvUm9vbSgpO1xuICAgICAgICB0aGlzLnJvb20uaW5pdGlhbGl6ZSh0aGlzLmdhbWUsIHRoaXMuY3Vyc29yKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByZWxvYWQoKSB7XG5cbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYml0bWFwRm9udChcIm9uZXNpemVcIiwgXCIuLi9mb250cy9mb250LnBuZ1wiLCBcIi4uL2ZvbnRzL2ZvbnQuZm50XCIpO1xuXG4gICAgICAgIHRoaXMucm9vbS5wcmVsb2FkKCk7XG4gICAgICAgIHRoaXMuY3Vyc29yLnByZWxvYWQodGhpcy5nYW1lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcblxuICAgICAgICB0aGlzLmdhbWUuc3RhZ2Uuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgICAgICAvLyBDZW50ZXIgZ2FtZSBjYW52YXMgb24gcGFnZVxuICAgICAgICAvLyB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgLy8gdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIC8vIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnJvb20uY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuY3Vyc29yLmNyZWF0ZSh0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMubmFycmF0b3Iuc2F5KCdZb3UgYXJlIGluIHNvbWUga2luZCBvZiBhd2Vzb21lIHBpeGVsYXRlZCBzcGFjZXNoaXAnKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5yb29tLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xuXG4vLyAgICAgICAgdGhpcy5nYW1lLmRlYnVnLnRleHQodGhpcy5nYW1lLmlucHV0Lm1vdXNlLmxvY2tlZC50b1N0cmluZygpLCAzMjAsIDMyKTtcbiAgICB9XG59XG5cbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgbGV0IGdhbWUgPSBuZXcgR2FtZUFUcm9uKCk7XG59OyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIiAvPlxuXG5leHBvcnQgY2xhc3MgQ3Vyc29yIHtcblxuICAgIHByaXZhdGUgY3Vyc29yOiBQaGFzZXIuU3ByaXRlO1xuXG4gICAgcHVibGljIHByZWxvYWQoZ2FtZTogUGhhc2VyLkdhbWUpOiB2b2lkIHtcbiAgICAgICAgZ2FtZS5sb2FkLnNwcml0ZXNoZWV0KFwiY3Vyc29yXCIsIFwiYXNzZXRzL3Nwcml0ZXMvY3Vyc29yNTh4NTgucG5nXCIsIDU4LCA1OCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZShnYW1lOiBQaGFzZXIuR2FtZSk6IHZvaWQge1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIHNwcml0ZSBmb3IgdGhlIGN1cnNvci5cbiAgICAgICAgdGhpcy5jdXJzb3IgPSBnYW1lLmFkZC5zcHJpdGUoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksIFwiY3Vyc29yXCIpO1xuXG4gICAgICAgIGxldCBjdXJzb3JCbGluayA9IHRoaXMuY3Vyc29yLmFuaW1hdGlvbnMuYWRkKFwiYmxpbmtcIik7XG5cbiAgICAgICAgdGhpcy5jdXJzb3IuYW5pbWF0aW9ucy5wbGF5KFwiYmxpbmtcIiwgNiwgdHJ1ZSk7XG5cbiAgICAgICAgLy8gTG9jayB0aGUgcG9pbnRlciBvbiBtb3VzZWRvd24uXG4gICAgICAgIGdhbWUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKCkgPT4ge1xuICAgICAgICAgICAgZ2FtZS5pbnB1dC5tb3VzZS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgYSBtb3ZlIGNhbGxiYWNrIHRvIHJlbmRlciBvdXIgb3duIGN1cnNvci5cbiAgICAgICAgZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2soKHBvaW50ZXIsIHgsIHksIGNsaWNrKSA9PiB7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBjdXJzb3IgaXMgbG9ja2VkIHRvIHRoZSBnYW1lLCBhbmQgdGhlIGNhbGxiYWNrIHdhcyBub3QgZmlyZWQgZnJvbSBhICdjbGljaycgZXZlbnRcbiAgICAgICAgICAgIC8vIChzdWNoIGFzIGEgbW91c2UgY2xpY2sgb3IgdG91Y2ggZG93bikgLSBhcyB0aGVuIGl0IG1pZ2h0IGNvbnRhaW4gaW5jb3JyZWN0IG1vdmVtZW50IHZhbHVlc1xuICAgICAgICAgICAgaWYgKGdhbWUuaW5wdXQubW91c2UubG9ja2VkICYmICFjbGljaykge1xuICAgICAgICAgICAgICAgIHRoaXMuY3Vyc29yLnggKz0gZ2FtZS5pbnB1dC5tb3VzZS5ldmVudC5tb3ZlbWVudFg7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJzb3IueSArPSBnYW1lLmlucHV0Lm1vdXNlLmV2ZW50Lm1vdmVtZW50WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIG92ZXJsYXAoc3ByaXRlOiBQaGFzZXIuU3ByaXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnNvci5vdmVybGFwKHNwcml0ZSk7XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIiAvPlxuXG5leHBvcnQgY2xhc3MgTmFycmF0b3Ige1xuXG4gICAgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0aWFsaXplKGdhbWU6IFBoYXNlci5HYW1lKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgfVxuXG4gICAgcHVibGljIHNheSh0ZXh0OiBzdHJpbmcpOiB2b2lkIHtcblxuICAgICAgICBjb25zb2xlLmxvZygnbmFycmF0b3IgY3JlYXRlZCcpO1xuXG4gICAgICAgIGxldCB0ZXh0Ym94ID0gdGhpcy5nYW1lLmFkZC5iaXRtYXBUZXh0KDIwMCwgMTYwLCBcIm9uZXNpemVcIiwgdGV4dCwgMjApO1xuXG4vLyAgICAgICAgICAgLy8gIHRoaXMudGV4dGJveC50ZXh0ID0gXCJMb29rIGF0IGZyaWRnZVwiO1xuLy8gICAgICAgICAgICAgLy8gdGhpcy50ZXh0Ym94LnVwZGF0ZVRleHQoKTtcbi8vICAgICAgICAgfSwgdGhpcyk7XG5cblxuLy8gICAgICAgICAvLyBQcmludCBzb21lIHRlc3QgdGV4dC5cbi8vICAgICAgICAgbGV0IHRleHQgPSBnYW1lLmFkZC5iaXRtYXBUZXh0KDIwMCwgNTYwLCBcIm9uZXNpemVcIiwgXCJUYWxrIHRvIGNsZXZlcmx5IGRpc2d1aXNlZCBSb2xvcm9iLlwiLCAyMCk7XG5cbiAgICB9XG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9waGFzZXIvdHlwZXNjcmlwdC9waGFzZXIuZC50c1wiIC8+XG5cbmltcG9ydCB7IFJvb20gfSBmcm9tICcuL3Jvb20nXG5cbmV4cG9ydCBjbGFzcyBVZm9Sb29tIGV4dGVuZHMgUm9vbSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJ1Zm9cIik7XG4gICAgfVxuXG4gICAgcHVibGljIGVudGVyKCk6IHZvaWQge1xuXG4gICAgICAgIHRoaXMuYWRkT2JqZWN0KCk7XG4gICAgfVxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvcGhhc2VyL3R5cGVzY3JpcHQvcGhhc2VyLmQudHNcIiAvPlxuXG5pbXBvcnQgeyBDdXJzb3IgfSBmcm9tICcuL2N1cnNvcidcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJvb20ge1xuXG4gICAgcHJpdmF0ZSBnYW1lOiBQaGFzZXIuR2FtZTtcbiAgICBwcml2YXRlIGN1cnNvcjogQ3Vyc29yO1xuICAgIHByaXZhdGUgaGl0Ym94OiBQaGFzZXIuU3ByaXRlO1xuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3Q6IFBoYXNlci5TcHJpdGU7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5hbWU6IHN0cmluZykge1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0aWFsaXplKGdhbWU6IFBoYXNlci5HYW1lLCBjdXJzb3I6IEN1cnNvcik6IHZvaWQge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJlbG9hZCgpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZSh0aGlzLm5hbWUgKyBcIi1yb29tLWJhY2tncm91bmRcIiwgXCJhc3NldHMvYmFja2dyb3VuZHMvXCIgKyB0aGlzLm5hbWUgKyBcIi5wbmdcIik7XG5cbiAgICAgICAgLy8gVE9ETyBMb2FkIG90aGVyIHNwcml0ZXMuXG4gICAgfVxuXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcblxuICAgICAgICB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLm5hbWUgKyBcIi1yb29tLWJhY2tncm91bmRcIik7XG5cbiAgICAgICAgdGhpcy5lbnRlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMuY3Vyc29yLm92ZXJsYXAodGhpcy5oaXRib3gpKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhpdGJveCAhPT0gdGhpcy5zZWxlY3RlZE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdCA9IHRoaXMuaGl0Ym94O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJleGl0XCIpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgZW50ZXIoKTogdm9pZDtcblxuICAgIHByb3RlY3RlZCBhZGRPYmplY3QoKTogdm9pZCB7XG5cbiAgICAgICAgdGhpcy5oaXRib3ggPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSg1MDAsIDI0MCwgXCJ1Zm8tcm9vbS1iYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLmhpdGJveC5zY2FsZS5zZXRUbygwLjA1LCAwLjI1KTtcbiAgICAgICAgdGhpcy5oaXRib3guaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oaXRib3gucmVuZGVyYWJsZSA9IGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==
