import { getId } from "../../test/testUtils";
import { Ticket } from "../tickets";

it("Implements Optimistic Concurrency Control", async () => {
  // Create an instance of Ticket
  const ticket = Ticket.build({ title: "concert", price: 5, userId: getId() });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInsatance = await Ticket.findById(ticket.id);
  const secondInsatance = await Ticket.findById(ticket.id);

  // Make two seperate changes to ticket we fetched
  firstInsatance!.set({ price: 10 });
  secondInsatance!.set({ price: 15 });

  // Save the first fetched ticket
  await firstInsatance!.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInsatance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("Increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({ title: "concert", price: 5, userId: getId() });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
