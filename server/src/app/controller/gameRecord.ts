import { Inject, Controller, Post, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/web';
import BaseController from '../../lib/baseController';
import { IPlayerService } from '../../interface/IPlayer';
import { ICommandRecord, ICommandRecordService } from '../../interface/ICommandRecord';
import { IGameService } from '../../interface/IGame';
import { EGameOverType } from '../core/PokerGame';

interface IFindGameRecord {
  gameId: number;
  winners: string;
  commandList: ICommandRecord[];
}

@Provide()
@Controller('/node/game/record')
export class GameRecordController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject('PlayerRecordService')
  playerService: IPlayerService;

  @Inject('GameService')
  gameService: IGameService;

  @Inject('CommandRecordService')
  commandService: ICommandRecordService;

  @Post('/find/commandRecord')
  async find() {
    try {
      const { body } = this.getRequestBody();
      const state = this.ctx.state;
      const commandList = await this.commandService.findByGameID(body.gameId);
      const gameList = await this.gameService.findByRoomNumber(body.roomNumber);
      let result: IFindGameRecord;
      console.log(state, 'user');
      gameList.forEach((g) => {
        if (g.status === EGameOverType.GAME_OVER) {
          const winner = JSON.parse(g.winners || '')[0][0];
          delete winner.handCard;
          g.winners = JSON.stringify([[winner]]);
        }
      });
      commandList.forEach((c) => {
        if (c.userId !== state.user.user.userId) {
          c.handCard = '';
        }
      });
      result = {
        commandList,
        winners: gameList.find((g) => g.id === body.gameId)?.winners || '',
        gameId: body.gameId,
      };
      this.success({
        ...result,
      });
    } catch (e) {
      this.fail('invalid game record');
      console.log(e);
    }
  }

  @Post('/find/selfPast7DayGame')
  async selfPast7DayGame() {
    try {
      const { body } = this.getRequestBody();
      const gameIDList = await this.commandService.findPast7DayGameIDsByUserID(body.userID);

      if (!gameIDList.length) {
        this.success([]);
        return;
      }
      const gameList = await this.gameService.findByIDs(gameIDList);
      const commandList = await this.commandService.findByGameIDs(gameIDList);

      const result: any = [];
      gameList.forEach((g) => {
        if (g.status === EGameOverType.GAME_OVER) {
          const winner = JSON.parse(g.winners || '')[0][0];
          delete winner.handCard;
          g.winners = JSON.stringify([[winner]]);
        }

        const gameCommandList = commandList.filter((c) => {
          return c.gameId === g.id;
        });

        // 过滤其他人手牌
        gameCommandList.forEach((c) => {
          if (c.userId !== this.ctx.state.user.user.userId) {
            c.handCard = '';
          }
        });

        result.push({
          gameCommandList,
          winners: g.winners,
          gameId: g.id,
        });
      });
      this.success(result);
    } catch (e) {
      this.fail('find self command record error');
      console.log(e);
    }
  }

  @Post('/find/gameRecord')
  async index() {
    try {
      const { body } = this.getRequestBody();
      const gameList = await this.gameService.findByRoomNumber(body.roomNumber);
      const result = gameList.map((g) => Object.assign({}, {}, { gameId: g.id }));
      this.success({
        ...result,
      });
    } catch (e) {
      this.fail('create room error');
      console.log(e);
    }
  }
}
