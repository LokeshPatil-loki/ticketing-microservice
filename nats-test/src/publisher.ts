import nats from "node-nats-streaming";
import { Subjects } from "./events/subjects";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

console.clear();

stan.on("connect", () => {
  console.log("Publisher connected to NATS");
  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: "zjkjakwj",
    title: "Loki Event",
    price: 86,
  });
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // stan.publish(Subjects.TicketCreated, data, () => {
  //   console.log("Event publish");
  // });
});
