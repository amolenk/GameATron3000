/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { BotClient } from "./botclient"
import { Settings } from "./settings"

export class ConversationUI {

    constructor(private game: Phaser.Game, private botClient: BotClient) {
    }

    public displaySuggestedActions(suggestedActions) {
        var options = [];
        var y = 460;

        // Render suggested actions.
        for (var action of suggestedActions) {

            var optionText = this.game.add.text(10, y, action.value, Settings.TEXTSTYLE_CONVERSATION_OPTION);
            optionText.inputEnabled = true;
            optionText.sendToBack(); // So the cursor stays on top.

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

                this.botClient.sendMessageToBot(selectedText);

            }, this);

            options.push(optionText);
            y += optionText.height;
        }
    }
}