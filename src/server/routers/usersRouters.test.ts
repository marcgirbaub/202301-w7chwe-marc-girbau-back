import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDataBase from "../../database/connectDataBase";
import User from "../../database/models/User";
import { type UserCredentials, type UserRegisterCredentials } from "../types";
import { app } from "..";
import { upload } from "./utils";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDataBase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST `/users/login` endpoint", () => {
  const loginUrl = "/users/login";
  const mockUser: UserCredentials = {
    password: "ronaldinho10",
    username: "ronaldinho",
  };

  describe("When it receives a request with username `ronaldinho` and password `ronaldinho10`", () => {
    test("Then it should respond with a status 200 and with an object in its body with a property `token`", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "asdfasdfasdfgsadf3242345",
      }));
      const expectedStatus = 200;
      const hashedpassword = await bcrypt.hash(mockUser.password, 10);

      await User.create({
        ...mockUser,
        password: hashedpassword,
        email: "asdfadsf",
      });

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with a non-registered username `Róman` and password `roman1234`", () => {
    beforeAll(async () => {
      await User.create({ ...mockUser, email: "sadf" });
    });

    test("Then it should response with a status 401 and and error with a message `Wrong credentials`", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const mockRomanUser: UserCredentials = {
        username: "Róman",
        password: "roman1234",
      };

      const expectedStatus = 401;

      const response = await request(app)
        .post(loginUrl)
        .send(mockRomanUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});

describe("Given a POST /users/register endpoint", () => {
  const registerUrl = "/users/register";

  describe("When it receives a request with a user to register properly", () => {
    test("Then it should response with a message `The user has been created`", async () => {
      const newUser: UserRegisterCredentials = {
        passwordConfirmation: "assdsddafasda",
        email: "asdfasdf",
        username: "sadfsdf",
        password: "assdsddafasda",
        location: "sadfsadf",
        age: "sadfsadf",
        avatar: "asdfasdf",
      };

      const expectedStatus = 201;

      const response = await request(app)
        .post(registerUrl)
        .type("multipart/form-data")
        .field("username", newUser.username)
        .field("email", newUser.email)
        .field("password", newUser.password)
        .field("passwordConfirmation", newUser.passwordConfirmation)
        .field("location", newUser.location)
        .field("age", newUser.age)
        .attach("avatar", Buffer.from("avatarinho", "utf-8"), {
          filename: "avatarinho.jpg",
        })
        .expect(expectedStatus);
    });
  });
});
