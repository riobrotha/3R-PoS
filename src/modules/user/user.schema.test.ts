
import { describe, it, expect } from "bun:test";
import { createUserSchema, loginUserSchema } from "./user.schema";

describe("User Schema Unit Tests", () => {

  describe("createUserSchema", () => {

    it("should accept valid registration data", () => {
      const payload = {
        name: "user",
        email: "user@example.com",
        password: "password123",
      };

      const result = createUserSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const payload = {
        name: "user",
        email: "invalid-email",
        password: "password123",
      };

      const result = createUserSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it("should reject password shorter than 6 characters", () => {
      const payload = {
        name: "user",
        email: "user@example.com",
        password: "123",
      };

      const result = createUserSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it("should not allow client to assign ADMIN role", () => {
      const payload = {
        name: "user",
        email: "user@example.com",
        password: "password123",
        role: "ADMIN",
      };

      const result = createUserSchema.safeParse(payload);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).not.toHaveProperty("role");
      }
    });

  });

  describe("loginUserSchema", () => {

    it("should accept valid login data", () => {
      const payload = {
        email: "user@example.com",
        password: "password123",
      };

      const result = loginUserSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });

    it("should reject invalid login email", () => {
      const payload = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginUserSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

  });

});
