import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("game")
      .where(`game.title ILIKE '%${param}%'`)
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const query = "SELECT COUNT(id) FROM games";
    return this.repository.query(query);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = (await this.repository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "users")
      .getOne()) as Game;

    return game.users;
  }
}
