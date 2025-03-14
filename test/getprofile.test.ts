

import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../src/models/User";
import app from "../src/server";
import connectDB from "../src/config/db";



beforeAll(async () => {
  await connectDB();
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'testsecret';
  await User.create(mockUser); // Insert mock user into the test database
});


// Mock user data

const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  email: "test@example.com",
  name: "John Doe",
  password: "testpassword",
  username: "johndoe",
  dob: "1995-05-15",
  nationality: "USA",
  preferredCurrency: "USD",
  isPasscodeset: true,
  role: "user",
  profilePicture: "https://example.com/profile.jpg",
};

// Generate a valid token for authentication
const token = jwt.sign({ id: mockUser._id, role: mockUser.role },  process.env.JWT_SECRET as string, { expiresIn: "1h" });

describe("GET /api/auth/getUser", () => {


  afterAll(async () => {
    await mongoose.connection.close(); // Close DB connection after tests
  });

  it("should return the user profile if authenticated", async () => {
    const response = await request(app)
      .get("/api/auth/getUser")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      id: mockUser._id.toString(),
      email: mockUser.email,
      name: mockUser.name,
      
      username: mockUser.username,
      nationality: mockUser.nationality,
      preferredCurrency: mockUser.preferredCurrency,
      isPasscodeset: mockUser.isPasscodeset,
      role: mockUser.role,
      profilePicture: mockUser.profilePicture,
    });
  });


  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/auth/getUser");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token provided. Access denied.");
  });
});
