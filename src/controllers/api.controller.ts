import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { API_PREFIX, TYPES } from '../constants';
import { ClearResponse } from '../responses';
import { inject } from 'inversify';
import { ClearCodeService, DataService } from '../services';
import { ClearValidator } from '../validators/clear.validator';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { ClearCodeRepository } from '../repositories/mongo';

@controller(`${API_PREFIX}`)
export class ApiController {
  @inject(TYPES.DataService)
  private readonly dataService!: DataService;

  @inject(TYPES.ClearCodeService)
  private readonly clearCodeService!: ClearCodeService;

  @inject(TYPES.ClearCodeService)
  private readonly clearCodeRepository!: ClearCodeRepository;

  @httpPost('/clear')
  public async clear(@requestBody() body: unknown): Promise<ClearResponse> {
    const { code } = await ClearValidator.validate(body);
    const foundOldClearCode = await this.clearCodeRepository.findOneByFilters({
      code,
    });
    if (!foundOldClearCode) {
      throw new HttpError('Clear code not found', HttpStatusCode.NotFound);
    }
    await this.dataService.deleteAll();
    return {
      code: await this.clearCodeService.updateClearCode(code),
    };
  }
}
