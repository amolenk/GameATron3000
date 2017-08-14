/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Actor } from "./actor"
import { ConversationService } from "./services/service-conversation"
import { Settings } from "./settings"

export class ConversationUI {

    private conversationService: ConversationService;
    private game: Phaser.Game;

    private currentActor: Actor;
    private currentConversationId: string;
    private currentPromiseResolver: Function;

    constructor() {
        this.conversationService = new ConversationService(
            (text, suggestedActions) => this.onReceivedReply(text, suggestedActions),
            (text) => this.onConversationEnded(text));
    }

    public preload(game: Phaser.Game) {
        this.game = game;
    }

    public create(game: Phaser.Game): void {
    }

    public startConversation(topicName: string, actor: Actor) {

        this.currentActor = actor;
        this.currentConversationId = this.conversationService.createConversation(topicName);

        // Return a Promise that completes when the conversation has ended.
        return new Promise((resolve) => {
            this.currentPromiseResolver = resolve;
        });
    }

    protected async onReceivedReply(text: string, suggestedActions: string[]) {
        
        await this.currentActor.say(text);

        var options = [];
        var y = 460;

        // Render suggested actions.
        for (var action of suggestedActions) {

            var optionText = this.game.add.text(10, y, action, Settings.TEXTSTYLE_CONVERSATION_OPTION);
            optionText.inputEnabled = true;

            optionText.events.onInputOver.add((option) => {
                option.addColor("Yellow", 0); // TODO GET FROM SETTINGS
            }, this);

            optionText.events.onInputOut.add((option) => {
                option.addColor("", 0);
            }, this);

            optionText.events.onInputUp.add((option) => {
                var selectedText = option.text;

                // Destroy text objects used to display options.
                for (var optionToDestroy of options) {
                    optionToDestroy.destroy();
                }

                this.conversationService.sendMessage(this.currentConversationId, selectedText);
            }, this);

            options.push(optionText);
            y += optionText.height;
        }
    }

    protected async onConversationEnded(text: string) {
        
        await this.currentActor.say(text);
        
        this.currentPromiseResolver();
    }
}