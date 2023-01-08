import { Listener, Subjects, TicketUpdatedEvent } from "@loki-ticketing/common";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = "Ticketing service";
  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {
    console.log(`#${msg.getSequence()} Event data!`, data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    msg.ack();
  }
}
