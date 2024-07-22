import { IUser } from "../database/models/user.model";
import userRepository from "../database/repositories/user.repository";
import { InternalServerError, NotFoundError } from "../errors/error";
import { UserCreationRepoParams } from "../types/interface";

class UserService {
  public async getUser(useId: string): Promise<IUser | null> {
    try {
      const user = await userRepository.getUser(useId); 
      return user;
    } catch {
      throw new NotFoundError("User Not Found!");
    }
  }

  public async createUser(newInfo: UserCreationRepoParams): Promise<IUser> { 
    try {
      const users = await userRepository.createUser(newInfo);
      return users;
    } catch (error) {
      throw new InternalServerError("Failed to create user");
    }
  }

  public async getUsers(
    page?: number,
    limit?: number,
    sort?: string,
    gender?: string,
    // age?: number
    minAge?: number,
    maxAge?: number
  ): Promise<IUser[]> {
    try {
      const users = await userRepository.getUsers(
        page,
        limit,
        sort,
        // age,
        gender,
        minAge,
        maxAge
      );
      return users;
    } catch (error) {
      throw new NotFoundError("User not found");
    }
  }

  public async updateUser(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const users = await userRepository.updateUser(userId, data);
      return users;
    } catch (error) {
      throw new NotFoundError("User not found");
    }
  }

  public async deleteUser(userId: string): Promise<void> {
    try {
      return await userRepository.deleteUser(userId);
    } catch (error) {
      throw new NotFoundError("Failed to delete user");
    }
  }

}

export default new UserService();
