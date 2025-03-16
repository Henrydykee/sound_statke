

import request from "supertest";
import jwt from "jsonwebtoken";
import connectDB, { closeDB } from "../src/config/db";
import User from "../src/models/User";
import app from "../src/server";

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
    password: "hashedpassword", // No need to hash since we're not testing login here
    preferredCurrency: "USD",
    isPasscodeset: true,
    role: "user",
    profilePicture: "https://example.com/profile.jpg",
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

describe("GET /api/auth/getUser", () => {
  // ✅ Should return user profile if authenticated
  it("should return the user profile if authenticated", async () => {
    const response = await request(app)
      .get("/api/auth/getUser")
      .set("Authorization", `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      username: user.username,
      nationality: user.nationality,
      preferredCurrency: user.preferredCurrency,
      isPasscodeset: user.isPasscodeset,
      role: user.role,
      profilePicture: user.profilePicture,
    });
  });

  // ❌ Should return 401 if no token is provided
  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/auth/getUser");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token provided. Access denied.");
  });

  // ❌ Should return 404 if user is not found
  it("should return 404 if the user does not exist", async () => {
    const fakeToken = jwt.sign(
      { id: "64d0d6e2fc13ae3a1f000011" }, // Non-existent user ID
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    const response = await request(app)
      .get("/api/auth/getUser")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found.");
  });
});
