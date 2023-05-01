import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('game')
      .where('game.title ILIKE :param', { param: `%${param}%` })
      .leftJoinAndSelect('game.users', 'user')
      .leftJoinAndSelect('game.platforms', 'platform')
      .leftJoinAndSelect('game.categories', 'category')
      .orderBy('game.title', 'ASC')
      .addOrderBy('game.id', 'ASC')
      .getMany();
    return games;
  }
  

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(*) as count FROM games;');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(id)
      .loadMany();
    return users;
  }
  
  
}
