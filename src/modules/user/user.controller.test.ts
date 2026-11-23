import { describe, expect, it, mock, beforeEach } from "bun:test";
import { StatusCodes } from "http-status-codes";

//Mock user service dependencies
const register = mock();
const login = mock();
const me = mock();
const refresh = mock();

mock.module("./user.service", () => ({
  default: {
    register,
    login,
    me,
    refresh,
  },
}));

//Mock response helper
const success = mock();
const created = mock();
const error = mock();

mock.module("../../utils/response", () => ({
  response: {
    success,
    created,
    error,
  },
}));

import userController from "./user.controller";
import { UserRole } from "@prisma/client";

describe("User Controller Unit Test", () => {
  beforeEach(() => {
    register.mockReset();
    login.mockReset();
    me.mockReset();
    refresh.mockReset();

    success.mockReset();
    created.mockReset();
    error.mockReset();
  });

  function createMockResponse() {
    const res: any = {};

    res.status = mock(() => res);
    res.json = mock(() => res);
    res.send = mock(() => res);

    return res;
  }

  describe("register()", () => {
    it("should register user successfully)", async () => {
      const req: any = {
        body: {
          name: "John Doe",
          email: "john_doe@example.com",
          password: "password123",
        },
      };
      const res = createMockResponse();
      const next = mock();

      const mockResult = {
        user: {
          name: "John Doe",
          email: "john_doe@example.com",
          role: UserRole.CASHIER,
        },
      };

      register.mockResolvedValue(mockResult);

      await userController.register(req, res, next);

      expect(register).toHaveBeenCalledWith(req.body);
      expect(created).toHaveBeenCalledWith(
        res,
        mockResult,
        "User registered successfully",
      );

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("login()", () => { 
    it("should login user successfully", async () => {
      const req: any = {
        body: {
          email: "john_doe@example.com",
          password: "password123",
        }
      };
      const res = createMockResponse();
      const next = mock();

      const mockResult = {
        user: {
          name: "John Doe",
          email: "john_doe@example.com",
          role: UserRole.CASHIER,
        },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      login.mockResolvedValue(mockResult);

      await userController.login(req, res, next);

      expect(login).toHaveBeenCalledWith(req.body);
      expect(success).toHaveBeenCalledWith(
        res,
        mockResult,
        "User logged in successfully",
      );

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("me()", () => {
    it("should fetch user data successfully", async () => {
      const req: any = {
        user: {
          id: 1,
          role: UserRole.CASHIER,
        }
      };
      const res = createMockResponse();
      const next = mock();

      const mockResult = {
        user: {
          name: "John Doe",
          email: "john_doe@example.com",
          role: UserRole.CASHIER,
        }
      };

      me.mockResolvedValue(mockResult);

      await userController.me(req, res, next);

      expect(me).toHaveBeenCalledWith(req.user.id);
      expect(success).toHaveBeenCalledWith(
        res,
        mockResult,
        "User fetched successfully",
      );

      expect(next).not.toHaveBeenCalled();

    });

    it("should return unauthorized when user ID is missing", async () => {
      const req: any = {
        user: undefined
      };
      const res = createMockResponse();
      const next = mock();


      await userController.me(req, res, next);

      expect(error).toHaveBeenCalledWith(
        res,
        "Unauthorized",
        StatusCodes.UNAUTHORIZED,
        "User not authenticated",
      );
      expect(me).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      
    });
  });

  describe("refresh()", () => {
    it("should refresh token successfully", async () => {
      const req: any = {
        user: {
          id: 1,
          refreshToken: "old-refresh-token"
        }
      };

      const res = createMockResponse();
      const next = mock();

      const mockResult = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token"
      }
      
      refresh.mockResolvedValue(mockResult);

      await userController.refresh(req, res, next);

      expect(refresh).toHaveBeenCalledWith(req.user.id, req.user.refreshToken);
      expect(success).toHaveBeenCalledWith(
        res,
        mockResult,
        "Token refreshed successfully",
      );

      expect(next).not.toHaveBeenCalled();

    });

    it("should return unauthorized when user ID is missing", async () => {
      const req: any = {
        user: {
          refreshToken: "old-refresh-token"
        }
      };

      const res = createMockResponse();
      const next = mock();

      await userController.refresh(req, res, next);

      expect(error).toHaveBeenCalledWith(
        res,
        "Unauthorized",
        StatusCodes.UNAUTHORIZED,
        "User not authenticated",
      );
      expect(refresh).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should return unauthorized when refresh token is missing", async () => {
      const req: any = {
        user: {
          id: 1,
          refreshToken: undefined
        }
      };

      const res = createMockResponse();
      const next = mock();

      await userController.refresh(req, res, next);

      expect(error).toHaveBeenCalledWith(
        res,
        "Unauthorized",
        StatusCodes.UNAUTHORIZED,
        "Refresh token is missing",
      );
      expect(refresh).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();

    });

  });

});
