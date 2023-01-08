import nats, { Message } from "node-nats-streaming";
import { Listener, TicketCreatedEvent, Subjects } from "@loki-ticketing/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log(`#${msg.getSequence()} Event data!`, data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    msg.ack();
  }
}
