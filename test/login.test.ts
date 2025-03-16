

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
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "testsecret";
  await connectDB();

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
  token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
});

afterAll(async () => {
  await closeDB();
});



describe("Auth - Login", () => {


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
    });

  // ✅ Successful Login
  it("should log in successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "john@example.com",
      password: "SecurePass123!",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful.");
    expect(res.body.data).toHaveProperty("token");
  });

  // ❌ Invalid Email or Password
  it("should return 400 for incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email or password.");
  });

  // ❌ Missing Fields
  it("should return 400 for missing email or password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email and password are required.");
  });

});
