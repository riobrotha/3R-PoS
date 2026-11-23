import {describe, expect, it, mock, beforeEach} from "bun:test";

//Mock repository dependency
const findByEmail = mock(async (_email: string): Promise<any> => null)
const findById = mock(async (_id: number): Promise<any> => null)
const updateRefreshToken = mock(async (_userId: number, _refreshToken: string): Promise<any> => ({}))
const create = mock(async (_data: any): Promise<any> => ({}))

//Mock password utility functions
const hashPassword = mock(async (_plainPassword: string): Promise<string> => "hashed-password")
const comparePassword = mock(async (_plainPassword: string, _hashedPassword: string): Promise<boolean> => true)

//Mock JWT utility functions
const generateToken = mock((_payload: any): string => "access-token")
const generateRefreshToken = mock((_payload: any): string => "refresh-token")

//Register Module Mocks before importing the service module 
mock.module("./user.repository", () => ({
  default: {
    findByEmail,
    findById,
    updateRefreshToken,
    create
  }
}));

mock.module("../../utils/password", () => ({
  hashPassword,
  comparePassword
}));

mock.module("../../utils/jwt", () => ({
  generateToken,
  generateRefreshToken
}));


// Now import the service module after mocking its dependencies
import userService from "./user.service";
import { UserRole } from "@prisma/client";

describe("User Service Unit Test", () => {
    beforeEach(() => {
        // Reset all mocks before each test
        findByEmail.mockClear();
        findById.mockClear();
        updateRefreshToken.mockClear();
        create.mockClear();
        hashPassword.mockClear();
        comparePassword.mockClear();
        generateToken.mockClear();
        generateRefreshToken.mockClear();
    });

    describe("register", () => {
        it("should register user successfully", async () => {

            //Arrange
            const payload = {
                name: "jason",
                email: "jason@example.com",
                password: "password123"
            };

            findByEmail.mockResolvedValue(null); // No existing user
            create.mockImplementation(async (data: any) => ({
                id: 1,
                ...data,
                password: "hashed-password"
            }));

            //Act
            const result = await userService.register(payload);

            //Assert
            expect(findByEmail).toHaveBeenCalledWith(payload.email);
            expect(hashPassword).toHaveBeenCalledWith(payload.password);
            expect(create).toHaveBeenCalled();
            expect(create.mock.calls[0][0].password).toBe("hashed-password");
            expect(create.mock.calls[0][0].role).toBe(UserRole.CASHIER);
            expect(result.user).not.toHaveProperty("password");
            expect(result.user).not.toHaveProperty("id");

        });

        it("should reject registration if email already exists", async () => {
            //Arrange
            const payload = {
                name: "jason",
                email: "jason@example.com",
                password: "password123"
            };

            findByEmail.mockResolvedValue({
                id: 1,
                email: payload.email,
            });

            //Act & Assert
            await expect(
                userService.register(payload)
            ).rejects.toMatchObject({
                message: "Email already in use",
                statusCode: 409
            });

            expect(hashPassword).not.toHaveBeenCalled();
            expect(create).not.toHaveBeenCalled();

        });
    });

    describe("login", () => {
        const mockUser = {
            id: 1,
            name: "jason",
            email: "jason@example.com",
            password: "hashed-password",
            role: UserRole.CASHIER,
            refreshToken: null
        };

        it("should login successfully with valid credentials", async () => {
            //Arrange
            findByEmail.mockResolvedValue(mockUser as any);
            comparePassword.mockResolvedValue(true);

            //Act
            const result = await userService.login({
                email: "jason@example.com",
                password: "password123",
            });

            //Assert
            expect(findByEmail).toHaveBeenCalledWith("jason@example.com");
            expect(comparePassword).toHaveBeenCalledWith("password123", "hashed-password");
            expect(generateToken).toHaveBeenCalled();
            expect(generateRefreshToken).toHaveBeenCalled();
            expect(updateRefreshToken).toHaveBeenCalledWith(1, "refresh-token");

            expect(result).toHaveProperty("user");
            expect(result.accessToken).toBe("access-token");
            expect(result.refreshToken).toBe("refresh-token");

            expect(result.user).not.toHaveProperty("password");
            expect(result.user).not.toHaveProperty("refreshToken");
            expect(result.user).not.toHaveProperty("id");
        });

        it("should reject login when user does not exist", async () => {
            //Arrange
            findByEmail.mockResolvedValue(null);

            //Act & Assert
            await expect(
                userService.login({
                    email: "unknown@example.com",
                    password: "password123",
                })
            ).rejects.toMatchObject({
                message: "Invalid email or password",
                statusCode: 401
            });

            expect(comparePassword).not.toHaveBeenCalled();
        });

        it("should reject login when password is incorrect", async () => {
            //Arrange
            findByEmail.mockResolvedValue(mockUser as any);
            comparePassword.mockResolvedValue(false);

            //Act & Assert
            await expect(
                userService.login({
                    email: "jason@example.com",
                    password: "wrong-password",
                })
            ).rejects.toMatchObject({
                message: "Invalid email or password",
                statusCode: 401
            });

            expect(comparePassword).toHaveBeenCalledWith("wrong-password", "hashed-password");
            expect(generateToken).not.toHaveBeenCalled();
            expect(generateRefreshToken).not.toHaveBeenCalled();
        });
    });

    describe("me", () => {
        it("should return user details without sensitive information", async () => {
            //Arrange
            findById.mockResolvedValue({
                id: 1,
                name: "jason",
                email: "jason@example.com",
                password: "hashed-password",
                role: UserRole.CASHIER,
                refreshToken: "refresh-token"
            } as any);

            //Act
            const result = await userService.me(1);

            //Assert
            expect(findById).toHaveBeenCalledWith(1);
            expect(result.user).not.toHaveProperty("password");
            expect(result.user).not.toHaveProperty("id");
            expect(result.user).not.toHaveProperty("refreshToken");
            expect(result.user.email).toBe("jason@example.com");
        });

        it("should throw an error if user is not found", async () => {
            //Arrange
            findById.mockResolvedValue(null);

            //Act & Assert
            await expect(userService.me(999)).rejects.toMatchObject({
                message: "User not found",
                statusCode: 404
            });
        });
    });

    describe("refresh", () => {
        const mockUser = {
            id: 1,
            name: "jason",
            email: "jason@example.com",
            password: "hashed-password",
            role: UserRole.CASHIER,
            refreshToken: "old-refresh-token"
        }

        it("should refresh tokens successfully", async () => {
            //Arrange
            findById.mockResolvedValue(mockUser as any);

            //Act
            const result = await userService.refresh(1, "old-refresh-token");

            //Assert
            expect(findById).toHaveBeenCalledWith(1);
            expect(generateToken).toHaveBeenCalled();
            expect(generateRefreshToken).toHaveBeenCalled();
            expect(updateRefreshToken).toHaveBeenCalledWith(1, "refresh-token");
            expect(result.accessToken).toBe("access-token");
            expect(result.refreshToken).toBe("refresh-token");
        });

        it("should reject when user does not exist", async () => {
            //Arrange
            findById.mockResolvedValue(null);

            //Act & Assert
            await expect(
                userService.refresh(999, "some-refresh-token")
            ).rejects.toMatchObject({
                message: "User not found",
                statusCode: 404
            });
        });

        it("should reject when refresh token is invalid", async () => {
            //Arrange
            findById.mockResolvedValue(mockUser as any);

            //Act & Assert
            await expect(
                userService.refresh(1, "invalid-refresh-token")
            ).rejects.toMatchObject({
                message: "Invalid refresh token",
                statusCode: 401
            });

            expect(generateToken).not.toHaveBeenCalled();
            expect(generateRefreshToken).not.toHaveBeenCalled();
            expect(updateRefreshToken).not.toHaveBeenCalled();
        });
    });
});
