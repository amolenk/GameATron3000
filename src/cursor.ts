/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class Cursor {

    private cursor: Phaser.Sprite;

    public preload(game: Phaser.Game): void {
        game.load.spritesheet("cursor", "assets/sprites/cursor58x58.png", 58, 58);
    }

    public create(game: Phaser.Game): void {

        // Create a sprite for the cursor.
        this.cursor = game.add.sprite(game.world.centerX, game.world.centerY, "cursor");

        let cursorBlink = this.cursor.animations.add("blink");

        this.cursor.animations.play("blink", 6, true);

        // Lock the pointer on mousedown.
        game.canvas.addEventListener("mousedown", () => {
            game.input.mouse.requestPointerLock();
        });

        // Register a move callback to render our own cursor.
        game.input.addMoveCallback((pointer, x, y, click) => {

            // If the cursor is locked to the game, and the callback was not fired from a 'click' event
            // (such as a mouse click or touch down) - as then it might contain incorrect movement values
            if (game.input.mouse.locked && !click) {
                this.cursor.x += game.input.mouse.event.movementX;
                this.cursor.y += game.input.mouse.event.movementY;
            }
        }, this);
    }

    public overlap(sprite: Phaser.Sprite) {
        return this.cursor.overlap(sprite);
    }
}