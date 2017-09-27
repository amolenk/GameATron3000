/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/rx/ts/rx.d.ts" />

import { Action } from "./action"
import { Activity, DirectLine } from '../node_modules/botframework-directlinejs/built/directline';
import { SecretSettings } from "./settings-secrets"
import '../node_modules/rxjs/add/operator/concatMap';

export class BotClient {

    private directLine: DirectLine;
    private conversationId: string;

    constructor() {

        this.directLine = new DirectLine({
            secret: SecretSettings.BOT_DIRECT_LINE_SECRET,
            //domain: "europe.directline.botframework.com"
        });
    }

    public connect(onMessage: Function, onEvent: Function) {

        console.log("Connecting to Botty McBot...");
        
        this.directLine.activity$
            .filter(activity => (activity.type === "message" || activity.type === "event") && activity.from.id === "gameatron3000")
            .concatMap(async x => {

                var activity = <any>x;

                console.log(activity);

                if (activity.roomId) {
                    this.conversationId = activity.conversation.id;                    
                }

                if (activity.type == "message")
                {
                    await onMessage(activity);
                }
                else if (activity.type == "event")
                {
                    await onEvent(activity);
                }
            })
            .subscribe();
    }

    public async sendActionToBot(action: Action) {

        var text = action.getDisplayText();

        await this.sendMessageToBot(text);
    }

    public async sendMessageToBot(text: string) {
        
        console.log("Player: " + text);

        this.directLine.postActivity({
            from: { id: this.conversationId },
            type: "message",
            text: text
        })        
        .subscribe(
            // id => console.log("Posted activity, assigned ID ", id),
            // error => console.log("Error posting activity", error)
        );
    }
}