

import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../src/models/User";
import app from "../src/server";

// Mock JWT Secret
const JWT_SECRET = "testsecret";

// Mock user data
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  email: "test@example.com",
  name: "John Doe",
  username: "johndoe",
  dob: "1995-05-15",
  nationality: "USA",
  preferredCurrency: "USD",
  isPasscodeset: true,
  role: "user",
  profilePicture: "https://example.com/profile.jpg",
};

// Generate a valid token for authentication
const token = jwt.sign({ id: mockUser._id }, JWT_SECRET, { expiresIn: "1h" });

describe("GET /api/user/profile", () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'testsecret';
    await User.create(mockUser); // Insert mock user into the test database
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close DB connection after tests
  });

  it("should return the user profile if authenticated", async () => {
    const response = await request(app)
      .get("/api/user/getUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      id: mockUser._id.toString(),
      email: mockUser.email,
      name: mockUser.name,
      username: mockUser.username,
      dob: mockUser.dob,
      nationality: mockUser.nationality,
      preferredCurrency: mockUser.preferredCurrency,
      isPasscodeset: mockUser.isPasscodeset,
      role: mockUser.role,
      profilePicture: mockUser.profilePicture,
    });
  });

  it("should return 404 if user is not found", async () => {
    const invalidToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, JWT_SECRET, { expiresIn: "1h" });

    const response = await request(app)
      .get("/api/user/getUser")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found.");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/user/getUser");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should return 500 on server error", async () => {
    jest.spyOn(User, "findById").mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app)
      .get("/api/user/getUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error. Please try again later.");
  });
});
