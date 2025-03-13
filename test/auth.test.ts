process.env.NODE_ENV = "test"; // Must be first

import mongoose from "mongoose";
import request from "supertest";
import app from "../src/server";
import connectDB, { closeDB } from "../src/config/db";
import User from "../src/models/User";




// Create a single connection for all tests
beforeAll(async () => {
  await connectDB();
});

// Clean database between tests but keep connection
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Close connection after all tests complete
afterAll(async () => {
  await closeDB();
});

describe("User Signup", () => {
  it("should successfully register a user", async () => {
    const response = await request(app)
      .post("/api/auth/user/signup")
      .send({
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        dob: "1995-08-10",
        nationality: "Nigerian",
        preferredCurrency: "NGN",
        password: "SecurePass123!",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("john@example.com");
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/user/signup")
      .send({
        email: "missing@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required.");
  });

  it("should return 409 if email or username is already in use", async () => {
    await User.create({
      name: "Jane Doe",
      email: "jane@example.com",
      username: "janedoe",
      dob: "1995-08-10",
      nationality: "Nigerian",
      preferredCurrency: "NGN", // Changed from USD to NGN for consistency
      password: "SecurePass123!",
    });

    const response = await request(app)
      .post("/api/auth/user/signup")
      .send({
        name: "Another User",
        email: "jane@example.com", // Existing email
        username: "uniqueuser",
        dob: "1995-08-10",
        nationality: "Nigerian",
        preferredCurrency: "NGN",
        password: "SecurePass123!",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email or username is already in use.");
  });

  it("should return 400 if preferred currency is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/user/signup") // Fixed endpoint path
      .send({
        name: "Invalid Currency",
        email: "invalid@example.com",
        username: "invaliduser",
        dob: "1995-08-10",
        nationality: "Nigerian",
        preferredCurrency: "EUR", // Invalid currency
        password: "SecurePass123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Preferred currency must be NGN or USD.");
  });
});