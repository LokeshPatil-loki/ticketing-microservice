import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Interface to define what are valid attributes required to create a Ticket Document
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Interface to describe what attrinutes a Ticket Document will have
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (attr: TicketAttrs) => TicketDoc;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      // ret: is object that is about to turn into json
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = (attr: TicketAttrs): TicketDoc => {
  return new Ticket(attr);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchema);

export { Ticket };
