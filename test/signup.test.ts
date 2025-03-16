process.env.NODE_ENV = "test"; // Must be first

import mongoose from "mongoose";
import request from "supertest";
import app from "../src/server";
import connectDB, { closeDB } from "../src/config/db";
import User from "../src/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create a single connection for all tests
beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "testsecret";
  await connectDB();
});

// Cleanup after tests
afterAll(async () => {
  await closeDB();
});

describe("Authentication Tests", () => {
  let token: string;
  let userId: string;
  let passcode: string = "123456";

  it("should successfully register a user", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "John Doe",
      email: "john@example.com",
      username: "johndoe",
      dob: "1995-08-10",
      nationality: "Nigerian",
      preferredCurrency: "NGN",
      password: "SecurePass123!",
    });
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    userId = response.body.data.id;
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "missing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required.");
  });

  it("should return 409 if email or username is already in use", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      name: "Jane Doe",
      email: "john@example.com", // Existing email
      username: "anotheruser",
      dob: "1995-08-10",
      nationality: "Nigerian",
      preferredCurrency: "NGN",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email or username is already in use.");
  });

  it("should return 400 if preferred currency is invalid", async () => {
    const response = await request(app).post("/api/auth/signup").send({
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

  it("should successfully log in a user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john@example.com",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("token");
    token = response.body.data.token;
  });

  it("should return 400 for invalid login credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("should successfully set a passcode", async () => {
    const response = await request(app)
      .post("/api/auth/set-passcode")
      .set("Authorization", `Bearer ${token}`)
      .send({ passcode });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Passcode set successfully.");

    // Ensure passcode is actually set
    const user = await User.findById(userId);
    expect(user?.isPasscodeset).toBe(true);
  });

  it("should return 400 if passcode is missing", async () => {
    const response = await request(app)
      .post("/api/auth/set-passcode")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Passcode is required.");
  });

  it("should successfully log in with a passcode", async () => {
    // Manually setting passcode since it's hashed
    await User.findByIdAndUpdate(userId, { passcode: await bcrypt.hash(passcode, 10) });

    const response = await request(app).post("/api/auth/login-passcode").send({
      email: "john@example.com",
      passcode,
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("should return 400 for incorrect passcode", async () => {
    const response = await request(app).post("/api/auth/login-passcode").send({
      email: "john@example.com",
      passcode: "wrongpasscode",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid passcode.");
  });

  it("should retrieve user profile", async () => {
    const response = await request(app)
      .get("/api/auth/getUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("email", "john@example.com");
  });
});