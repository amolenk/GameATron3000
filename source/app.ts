/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

class GameATron {

    private game: Phaser.Game;
    private extensions: Extension[];
    private cursor: Cursor;
    private room: Room;

    constructor() {
        this.game = new Phaser.Game(
            800,
            600,
            Phaser.AUTO, // Default renderer
            "content", // DOM element
            this,
            false, // transparent
            false); // anti-aliasing

        this.extensions = new Array<Extension>(
            new TestExtension(),
            new CursorExtension(),
        );

        this.cursor = new Cursor();

        this.room = new UfoRoom();
        this.room.initialize(this.game, this.cursor);
    }

    private preload() {

        this.room.preload();
        this.cursor.preload(this.game);
    }

    private create() {

        this.game.stage.smoothed = false;

        // Center game canvas on page
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;

        this.room.create();
        this.cursor.create(this.game);
    }

    private update() {
        this.room.update();
    }

    private render() {

//        this.game.debug.text(this.game.input.mouse.locked.toString(), 320, 32);
    }
}

window.onload = () => {
    let game = new GameATron();
};

abstract class Room {

    private game: Phaser.Game;
    private cursor: Cursor;
    private hitbox: Phaser.Sprite;
    private selectedObject: Phaser.Sprite;

    constructor(private name: string) {
    }

    public initialize(game: Phaser.Game, cursor: Cursor): void {
        this.game = game;
        this.cursor = cursor;
    }

    public preload(): void {

        this.game.load.image(this.name + "-room-background", "assets/backgrounds/" + this.name + ".png");

        // TODO Load other sprites.
    }

    public create(): void {

        this.game.add.sprite(0, 0, this.name + "-room-background");

        this.enter();
    }

    public update(): void {

        if (this.cursor.overlap(this.hitbox)) {

            if (this.hitbox !== this.selectedObject) {
                console.log("enter");
                this.selectedObject = this.hitbox;
            }
        } else if (this.selectedObject != null) {
            console.log("exit");
            this.selectedObject = null;
        }
    }

    public abstract enter(): void;

    protected addObject(): void {

        this.hitbox = this.game.add.sprite(500, 240, "ufo-room-background");
        this.hitbox.scale.setTo(0.05, 0.25);
        this.hitbox.inputEnabled = true;
        this.hitbox.renderable = false;
    }
}

class UfoRoom extends Room {

    constructor() {
        super("ufo");
    }

    public enter(): void {

        this.addObject();
    }
}

abstract class Extension {

    public abstract preload(game: Phaser.Game): void;

    public abstract create(game: Phaser.Game): void;

    public abstract render(game: Phaser.Game): void;
}

class TestExtension extends Extension {

    private hitbox: Phaser.Sprite;
    private textbox: Phaser.BitmapText;

    public preload(game: Phaser.Game): void {

        game.load.bitmapFont("onesize", "../fonts/font.png", "../fonts/font.fnt");
    }

    public create(game: Phaser.Game): void {

        //this.textbox = game.add.bitmapText(200, 560, "onesize", "...", 20);

        this.hitbox = game.add.sprite(500, 240, "ufo-room-background");
        this.hitbox.scale.setTo(0.05, 0.25);
        this.hitbox.inputEnabled = true;
        this.hitbox.renderable = false;

        this.hitbox.events.onEnterBounds.add(() => {

          //  this.textbox.text = "Look at fridge";
            // this.textbox.updateText();
        }, this);

        // if (sprite1.overlap(sprite2)) {  // do something...}

        // Print some test text.
        let text = game.add.bitmapText(200, 560, "onesize", "Talk to cleverly disguised Rolorob.", 20);
    }

    public render(game: Phaser.Game): void {
        //
    }
}

class CursorExtension extends Extension {

    private cursor: Phaser.Sprite;

    public preload(game: Phaser.Game): void {
        game.load.spritesheet("cursor", "assets/sprites/cursor58x58.png", 58, 58);
    }

    public create(game: Phaser.Game): void {

        // Create a sprite for the cursor.
        this.cursor = game.add.sprite(game.world.centerX, game.world.centerY, "cursor");

        console.log(this.cursor);

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

    public render(game: Phaser.Game): void {

        game.debug.body(this.cursor);
    }
}

class Cursor {

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
