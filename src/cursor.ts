/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export class Cursor {

    private sprite: Phaser.Sprite;

    constructor(private game: Phaser.Game, private onCursorLock: Function) {
    }

    public preload() {
        this.game.load.spritesheet("cursor", "assets/sprites/cursor58x58.png", 58, 58);
    }

    public create(group: Phaser.Group) {

        // Create a sprite for the cursor.
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cursor");
        this.sprite.anchor.set(0.5);

        group.add(this.sprite);

        let cursorBlink = this.sprite.animations.add("blink");

        this.sprite.animations.play("blink", 6, true);

        // Lock the pointer on mousedown.
        this.game.canvas.addEventListener("mousedown", () => {
            this.onCursorLock();
        });

        // Register a move callback to render our own cursor.
        this.game.input.addMoveCallback((pointer, x, y, click) => {
            if (!click) {
                this.sprite.x = this.game.input.x;
                this.sprite.y = this.game.input.y;
            }
        }, this);
    }

    public bringToTop() {
        this.sprite.bringToTop();
    }
}