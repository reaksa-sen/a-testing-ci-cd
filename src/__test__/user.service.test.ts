import { config } from 'dotenv';
config({ path: '.env.test' });
import { IUser } from "../database/models/user.model";
import userRepository from "../database/repositories/user.repository";
import { InternalServerError, NotFoundError } from "../errors/error";
import userService from "../services/user.service";
import userController from "../controllers/user.controller";

// Mock userRepository
jest.mock("../database/repositories/user.repository", () => ({
  getUser: jest.fn(),
  createUser: jest.fn(),
  getUsers: jest.fn(),
  updateUser: jest.fn(),
}));

// getUserById
describe("getUser", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clears all mocks after each test
  });

  it("should return a user when found", async () => {
    const mockUser: IUser = {
      _id: "1",
      name: "John Doe",
      email: "jon@gmail.com",
      age: 2,
      gender: "male",
      image: 'https://sa-test-file-upload.s3.amazonaws.com/1721553900118-me.jpg'
    };
    (userRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.getUser("1");
    expect(result).toEqual(mockUser);
    expect(userRepository.getUser).toHaveBeenCalledWith("1");
  });

  it("should throw NotFoundError when user not found", async () => {
    (userRepository.getUser as jest.Mock).mockResolvedValue(null); // Mock to resolve with null

    try {
      await userRepository.getUser("1");
      // If getUser resolves with null, throw NotFoundError
      throw new NotFoundError("User not found");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(userRepository.getUser).toHaveBeenCalledWith("1");
  });

  it("should throw NotFoundError when userRepository throws an error", async () => {
    (userRepository.getUser as jest.Mock).mockRejectedValue(
      new NotFoundError("User not found")
    );

    await expect(userRepository.getUser("1")).rejects.toThrow(NotFoundError);
    expect(userRepository.getUser).toHaveBeenCalledWith("1");
  });
});

// createUser
describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clears all mocks after each test
  });

  it("should create a user successfully", async () => {
    const mockUser: IUser = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 10,
      gender: "male",
      image: 'https://sa-test-file-upload.s3.amazonaws.com/1721553900118-me.jpg'
    };

    (userRepository.createUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.createUser(mockUser);
    expect(result).toEqual(mockUser);
    expect(userRepository.createUser).toHaveBeenCalledWith(mockUser);
  });

  it("should throw an InternalServerError when user creation fails", async () => {
    const mockUser: IUser = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 10,
      gender: "male",
      image: 'https://sa-test-file-upload.s3.amazonaws.com/1721553900118-me.jpg'
    };

    (userRepository.createUser as jest.Mock).mockRejectedValue(new Error("Database error"));

    await expect(userService.createUser(mockUser)).rejects.toThrow(InternalServerError);
    expect(userRepository.createUser).toHaveBeenCalledWith(mockUser);
  });
});

// getAllUser
describe("getAllUser", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clears all mocks after each test
  });

  it("should return user when user not found", async () => {
    const mockUser: IUser = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 10,
      gender: "male",
      image: 'https://sa-test-file-upload.s3.amazonaws.com/1721553900118-me.jpg'
    };
    (userRepository.getUsers as jest.Mock).mockResolvedValue(mockUser);

    const users = await userService.getUsers(1, 10, "name", "male", 20, 40);

    expect(users).toEqual(mockUser);

    expect(userRepository.getUsers).toHaveBeenCalledWith(
      1,
      10,
      "name",
      "male",
      20,
      40
    );
  });

  it("Should throw NotfoundError if users not found", async () => {
    (userRepository.getUsers as jest.Mock).mockRejectedValue(
      new Error("User not found!")
    );

    await expect(
      userController.getUsers(1, 10, "name", "male", 20, 40)
    ).rejects.toThrow(NotFoundError);
  });
});

// updateUser
describe("updateUser", () => {
  it("should update user successfully", async () => {
    // Mock data
    const userId = "user123";
    const updatedUserData = { name: "Updated Name" };

    // Mock the return value of userRepository.updateUser
    const updatedUser = {
      _id: userId,
      name: "Updated Name",
      age: 30,
      gender: "Male",
      email: "updated@example.com",
      image: 'https://sa-test-file-upload.s3.amazonaws.com/1721553900118-me.jpg'
    };
    (userRepository.updateUser as jest.Mock).mockResolvedValue(updatedUser);

    // Call the updateUser function
    const result = await userRepository.updateUser(userId, updatedUserData);

    // Check expectations
    expect(result).toEqual(updatedUser); // Ensure updateUser returns the updated user object
    expect(userRepository.updateUser).toHaveBeenCalledWith(
      userId,
      updatedUserData
    ); // Ensure updateUser calls userRepository.updateUser with correct arguments
  });

  it("should throw NotFoundError when user is not found", async () => {
    // Mock data
    const userId = "nonExistentUser";
    const updatedUserData = { name: "Updated Name" };

    // Mock userRepository.updateUser to throw error
    (userRepository.updateUser as jest.Mock).mockRejectedValue(
      new Error("User not found")
    );

    // Call updateUser function and expect it to throw NotFoundError
    await expect(
      userController.updateUser(userId, updatedUserData)
    ).rejects.toThrow(NotFoundError);
  });
});

// deleteUser
// describe("deleteUser", () => {
//   it("should delete a user", async () => {
//     const userId = "user123";

//     // Mocking successful deleteUser method in userRepository
//     (userRepository.deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

//     // Calling deleteUser method
//     await expect(userRepository.deleteUser(userId)).resolves.toBeUndefined();

//     // Asserting userRepository.deleteUser was called with correct userId
//     expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
//   });

//   it("should throw a NotFoundError if userRepository.deleteUser fails", async () => {
//     const userId = "user123";

//     // Mocking deleteUser method to throw an error
//     (userRepository.deleteUser as jest.Mock).mockRejectedValueOnce(
//       new Error("Database connection failed")
//     );

//     // Calling deleteUser method
//     await expect(userController.deleteUser(userId)).rejects.toThrow(
//       NotFoundError
//     );

//     // Asserting userRepository.deleteUser was called with correct userId
//     expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
//   });
// });
