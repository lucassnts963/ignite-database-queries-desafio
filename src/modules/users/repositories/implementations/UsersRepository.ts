import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({
      relations: ["games"],
      where: { id: user_id },
    });

    return user as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const sql = "SELECT * FROM users ORDER BY first_name ASC";
    return this.repository.query(sql); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const sql = `SELECT * FROM users WHERE first_name ~*'${first_name}' AND last_name ~*'${last_name}'`;

    const users: User[] = await this.repository.query(sql); // Complete usando raw query

    return users;
  }
}
