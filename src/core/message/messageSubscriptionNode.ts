import { IMessageHandler } from "./IMessageHandler";
import { Message } from "./message";

export class MessageSubscriptionNode {
    public message: Message;
    public handler: IMessageHandler;

    public constructor(message: Message, hander: IMessageHandler) {
        this.message = message;
        this.handler = hander;
    }
}
