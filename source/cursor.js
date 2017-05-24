/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="./extension.ts" />
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
    return CursorExtension;
}(Extension));
