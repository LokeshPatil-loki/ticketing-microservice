import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes properties
// that required to create new user
interface userAttrs {
  email: string;
  password: string;
}

// An interface that describe properties
// That user model has
interface UserModel extends mongoose.Model<UserDoc> {
  /** mongoose.Model<Document> **/
  build: (attrs: userAttrs) => UserDoc; // => Document
}

// An interface that describe properties
// That a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Hash Password before storing
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

//
userSchema.methods.validatePassword = async function validatePassword(password: string) {
  console.log(this.password);
};

// Add custom static methods to User model
userSchema.statics.build = (attrs: userAttrs) => {
  return new User(attrs);
};

// mongoose.mode<Document, Model>
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// // const buildUser =
// const user = User.build({
//   email: "test@test.com",
//   password: "password",
// });

export { User };
