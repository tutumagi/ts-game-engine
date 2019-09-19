import { IMessageHandler } from "./IMessageHandler";
import { Message, MessagePriority } from "./message";
import { MessageSubscriptionNode } from "./messageSubscriptionNode";

export class MessageBus {
    private static _subscriptions: {
        [code: string]: IMessageHandler[];
    } = {};

    private static _normalQueueMessagePerUpdate: number = 10;
    private static _normalMessageQueue: MessageSubscriptionNode[] = [];

    private constructor() {}

    public static addSubscription(code: string, handler: IMessageHandler) {
        if (MessageBus._subscriptions[code] === undefined) {
            MessageBus._subscriptions[code] = [];
        }
        if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
            console.warn(`Attemting to add a dupliacte handler to code ${code}. Subscription not added`);
        } else {
            MessageBus._subscriptions[code].push(handler);
        }
    }

    public static removeSubscription(code: string, handler: IMessageHandler) {
        if (MessageBus._subscriptions[code] === undefined) {
            console.warn(`Cannot unsubscribe handler from code: ${code} Because that code is not subscribed to`);
            return;
        }

        const nodeIndex = MessageBus._subscriptions[code].indexOf(handler);

        if (nodeIndex !== -1) {
            MessageBus._subscriptions[code].splice(nodeIndex, 1);
        }
    }

    public static post(message: Message) {
        console.log(`Message posted: `, message);
        const handlers = MessageBus._subscriptions[message.code];
        if (handlers === undefined) {
            return;
        }
        handlers.forEach((handler) => {
            if (message.priority === MessagePriority.HIGH) {
                handler.onMessage(message);
            } else {
                MessageBus._normalMessageQueue.push(new MessageSubscriptionNode(message, handler));
            }
        });
    }

    public update(delta: number) {
        const messageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._normalMessageQueue.length);
        if (messageLimit <= 0) {
            return;
        }

        MessageBus._normalMessageQueue.splice(0, messageLimit).forEach((node) => {
            node.handler.onMessage(node.message);
        });
    }
}
