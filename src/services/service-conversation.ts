// This is the extension point to integrate with Bot Framework.
// The code here is already somewhat modeled to match the Bot REST API's.
// Bot Framework API reference:
// https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-api-reference#create-conversation
export class ConversationService {

    private hardcodedActions = [
        "Any treasure around these parts?",
        "Ken sent me",
        "I'm selling these fine plastic action figures!",
        "Nevermind" ];

    public constructor(private onReceivedReply: Function, private onConversationEnded: Function) {
    }

    public createConversation(topicName: string): string {

        // Create a conversation: POST /v3/conversations

        // Maybe set type to 'conversationUpdate' to signal the bot that it
        // has been added to the conversation. It can then send back an activity
        // of type 'message' to be the first to say something.

        // Use a dummy conversation id for now.
        var conversationId = "foo";

        // For now, simulate an incoming call from the Bot.
        setTimeout(() => {
            this.processBotEvent({
                "conversationId": conversationId,
                "type": "message",
                "text": "Hi!",
                "suggestedActions": this.hardcodedActions
            });
        }, 250);

        return conversationId;
    }

    public sendMessage(conversationId: string, text: string): void {

        // TODO Actually send back the reply to the Bot service.

        // Simulate a second call from the Bot after we've send our reply.
        setTimeout(() => {
            if (text == "Any treasure around these parts?") {
                this.processBotEvent({
                    "conversationId": conversationId,
                    "type": "message",
                    "text": "There's not much left actually.\n"
                        + "I did have this expensive mint condition Sonic action figure.\n"
                        + "I was planning to sell it on BootyBay™\n"
                        + "But I seem to have lost it...",
                    "suggestedActions": this.hardcodedActions
                });
            }
            else if (text == "Ken sent me") {
                this.processBotEvent({
                    "conversationId": conversationId,
                    "type": "message",
                    "text": "Wrong game.",
                    "suggestedActions": this.hardcodedActions
                });
            }
            else if (text == "I'm selling these fine plastic action figures!") {
                this.processBotEvent({
                    "conversationId": conversationId,
                    "type": "message",
                    "text": "Me too!\nUntil I lost my merchandise...",
                    "suggestedActions": this.hardcodedActions
                });
            }
            else {
                this.processBotEvent({
                    "conversationId": conversationId,
                    "type": "endOfConversation",
                    "text": "Let me know if you find my Sonic action figure!"
                });
            }
        }, 250);
    }

    public processBotEvent(event: any): void {
        if (event.type == "message") {
            this.onReceivedReply(event.text, event.suggestedActions);
        }
        else if (event.type == "endOfConversation") {
            this.onConversationEnded(event.text);
        }
    }
}