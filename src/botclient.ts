/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/rx/ts/rx.d.ts" />

import { Action } from "./action"
import { ActionUI } from "./ui-action"
import { Actor } from "./actor"
import { ConversationUI } from "./ui-conversation"
import { Cursor } from "./cursor"
import { Activity, DirectLine } from '../node_modules/botframework-directlinejs/built/directline';
import { InventoryItem } from "./inventory-item"
import { InventoryUI } from "./ui-inventory"
import { Narrator } from "./narrator"
import { Room } from "./room"
import { RoomObject } from "./room-object"
import { SecretSettings } from "./settings-secrets"
import { Settings } from "./settings"
import { VerbsUI } from "./ui-verbs"

// import { Observable } from "../node_modules/rxjs/Observable";
// import { fromPromise } from '../node_modules/rxjs/observable/fromPromise';
// import '../node_modules/rxjs/add/observable/concatAll';
// import '../node_modules/rxjs/add/observable/empty';
// import '../node_modules/rxjs/add/observable/return';


import { AjaxResponse, AjaxRequest } from '../node_modules/rxjs/observable/dom/AjaxObservable';
import { BehaviorSubject } from '../node_modules/rxjs/BehaviorSubject';
import { Observable } from '../node_modules/rxjs/Observable';
import { Subscriber } from '../node_modules/rxjs/Subscriber';
import { Subscription } from '../node_modules/rxjs/Subscription';

import '../node_modules/rxjs/add/operator/catch';
import '../node_modules/rxjs/add/operator/combineLatest';
import '../node_modules/rxjs/add/operator/count';
import '../node_modules/rxjs/add/operator/concat';
import '../node_modules/rxjs/add/operator/concatMap';
import '../node_modules/rxjs/add/operator/delay';
import '../node_modules/rxjs/add/operator/do';
import '../node_modules/rxjs/add/operator/filter';
import '../node_modules/rxjs/add/operator/map';
import '../node_modules/rxjs/add/operator/mergeMap';
import '../node_modules/rxjs/add/operator/retryWhen';
import '../node_modules/rxjs/add/operator/share';
import '../node_modules/rxjs/add/operator/take';

import '../node_modules/rxjs/add/observable/dom/ajax';
import '../node_modules/rxjs/add/observable/empty';
import '../node_modules/rxjs/add/observable/from';
import '../node_modules/rxjs/add/observable/interval';
import '../node_modules/rxjs/add/observable/of';
import '../node_modules/rxjs/add/observable/throw';

import '../node_modules/rxjs/add/observable/defer';

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