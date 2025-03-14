

import request from "supertest";
import app from "../src/server";
import User from "../src/models/User"; 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB, { closeDB } from "../src/config/db";
import { closeRedis } from "../src/utils/redisClient";

let user: any;
let token: string;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'testsecret';
  await connectDB();
});


// Close connection after all tests complete
afterAll(async () => {
  await closeDB();
  await closeRedis();
});

beforeAll(async () => {
  // Create a test user
  user = new User({
    name: "Test User",
    username: "testuser",
    dob: "1990-01-01",
    nationality: "US",
    email: "testuser@example.com",
    password: await bcrypt.hash("password123", 10),
    role: "user",
  });

  await user.save();

  // Generate a valid JWT token
  token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  // ✅ Test Login with Email & Password
  it("should log in successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  it("should return 400 for incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should return 400 for missing email or password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  // ✅ Test Setting Passcode
  it("should set passcode successfully", async () => {
    const res = await request(app)
      .post("/api/auth/set-passcode")
      .set("Authorization", `Bearer ${token}`)
      .send({ passcode: "1234" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Passcode set successfully.");

    // Verify passcode is stored
    const updatedUser = await User.findById(user._id);
    expect(updatedUser?.isPasscodeset).toBe(true);
  });

  it("should return 400 if passcode is missing", async () => {
    const res = await request(app)
      .post("/api/auth/set-passcode")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Passcode is required.");
  });

  // ✅ Test Login with Passcode
  it("should log in with passcode successfully", async () => {
    const res = await request(app).post("/api/auth/login-passcode").send({
      email: "testuser@example.com",
      passcode: "1234",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  it("should return 400 for incorrect passcode", async () => {
    const res = await request(app).post("/api/auth/login-passcode").send({
      email: "testuser@example.com",
      passcode: "0000",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid passcode.");
  });

  it("should return 404 if user does not exist", async () => {
    const res = await request(app).post("/api/auth/login-passcode").send({
      email: "nonexistent@example.com",
      passcode: "1234",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found or passcode not set.");
  });
});
