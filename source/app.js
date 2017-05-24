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
var GameATron = (function () {
    function GameATron() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, // Default renderer
        "content", // DOM element
        this, false, // transparent
        false); // anti-aliasing
        this.extensions = new Array(new TestExtension(), new CursorExtension());
        this.cursor = new Cursor();
        this.room = new UfoRoom();
        this.room.initialize(this.game, this.cursor);
    }
    GameATron.prototype.preload = function () {
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
var UfoRoom = (function (_super) {
    __extends(UfoRoom, _super);
    function UfoRoom() {
        return _super.call(this, "ufo") || this;
    }
    UfoRoom.prototype.enter = function () {
        this.addObject();
    };
    return UfoRoom;
}(Room));
var Extension = (function () {
    function Extension() {
    }
    return Extension;
}());
var TestExtension = (function (_super) {
    __extends(TestExtension, _super);
    function TestExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestExtension.prototype.preload = function (game) {
        game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");
    };
    TestExtension.prototype.create = function (game) {
        //this.textbox = game.add.bitmapText(200, 560, "onesize", "...", 20);
        this.hitbox = game.add.sprite(500, 240, "ufo-room-background");
        this.hitbox.scale.setTo(0.05, 0.25);
        this.hitbox.inputEnabled = true;
        this.hitbox.renderable = false;
        this.hitbox.events.onEnterBounds.add(function () {
            //  this.textbox.text = "Look at fridge";
            // this.textbox.updateText();
        }, this);
        // if (sprite1.overlap(sprite2)) {  // do something...}
        // Print some test text.
        var text = game.add.bitmapText(200, 560, "onesize", "Talk to cleverly disguised Rolorob.", 20);
    };
    TestExtension.prototype.render = function (game) {
        //
    };
    return TestExtension;
}(Extension));
var CursorExtension = (function (_super) {
    __extends(CursorExtension, _super);
    function CursorExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CursorExtension.prototype.preload = function (game) {
        game.load.spritesheet("cursor", "assets/sprites/cursor58x58.png", 58, 58);
    };
    CursorExtension.prototype.create = function (game) {
        var _this = this;
        // Create a sprite for the cursor.
        this.cursor = game.add.sprite(game.world.centerX, game.world.centerY, "cursor");
        console.log(this.cursor);
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
    CursorExtension.prototype.render = function (game) {
        game.debug.body(this.cursor);
    };
    return CursorExtension;
}(Extension));
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
