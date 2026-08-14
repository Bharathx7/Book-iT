import request from "supertest";
import app from "../src/app.js";
import { jest } from "@jest/globals";

jest.setTimeout(10000);

describe("Auth API", () => {
  // 1. Registration - missing fields
  it("should reject registration when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(response.status).toBe(400);
  });

  // 2. Registration - duplicate email
  it("should reject registration when email already exists", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    const firstResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email,
        password: "Test@12345",
      });

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email,
        password: "Test@12345",
      });

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.message).toBe("User already exists");
  });

  // 3. Registration - successful
  it("should register a new user successfully", async () => {
    const email = `newuser-${Date.now()}@example.com`;

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "New Test User",
        email,
        password: "Test@12345",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Registration successful");

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe("New Test User");
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.role).toBe("USER");
  });

  // 4. Login - successful
  it("should login successfully with valid credentials", async () => {
    const email = `login-${Date.now()}@example.com`;
    const password = "Test@12345";

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login Test User",
        email,
        password,
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(response.status).toBe(200);

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe("Login Test User");
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.role).toBe("USER");

    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });

  // 5. Login - wrong password
  it("should reject login with wrong password", async () => {
    const email = `wrong-password-${Date.now()}@example.com`;
    const password = "Test@12345";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Wrong Password User",
        email,
        password,
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "WrongPassword@123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  // 6. Login - non-existing email
  it("should reject login with non-existing email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: `does-not-exist-${Date.now()}@example.com`,
        password: "Test@12345",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  // 7. Refresh token - successful
  it("should refresh access token with valid refresh token", async () => {
    const email = `refresh-${Date.now()}@example.com`;
    const password = "Test@12345";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Refresh Test User",
        email,
        password,
      });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.refreshToken).toBeDefined();

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({
        refreshToken: loginResponse.body.refreshToken,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

  // 8. Refresh token - missing
  it("should reject refresh when refresh token is missing", async () => {
    const response = await request(app)
      .post("/api/auth/refresh")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Refresh token is required");
  });

  // 9. Refresh token - invalid
  it("should reject refresh with an invalid refresh token", async () => {
    const response = await request(app)
      .post("/api/auth/refresh")
      .send({
        refreshToken: "invalid-refresh-token",
      });

    expect(response.status).toBe(400);
  });
});