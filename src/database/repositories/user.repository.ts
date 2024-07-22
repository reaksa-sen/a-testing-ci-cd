import { NotFoundError } from "@/src/errors/error";
import { IUser, User } from "../models/user.model";
import { UserCreationRepoParams } from "@/src/types/interface";

class UserRepository {
  public async getUser(useId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(useId).exec();
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async createUser(newInfo: UserCreationRepoParams) {
    const nweUser =  await User.create(newInfo);
    return nweUser;
  }

  public async getUsers(
    page?: number,
    limit?: number,
    sort?: string,
    //  age?: number
    gender?: string,
    minAge?: number,
    maxAge?: number
  ): Promise<IUser[]> {
    const query = User.find();

    if (minAge !== undefined || maxAge !== undefined) {
      query.where("age");
      if (minAge !== undefined) query.gte(minAge);
      if (maxAge !== undefined) query.lte(maxAge);
    }

    if (gender) {
      query.where('gender').equals(gender);
    }

    // if(age){
    //   query.where('age').gt(age)
    // }

    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    if (sort) {
      query.sort(sort);
    }

    return query.exec();
  }

  public async updateUser(
    UserId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(UserId, data, { new: true }).exec();
  }

  public async deleteUser(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }
}

export default new UserRepository();
