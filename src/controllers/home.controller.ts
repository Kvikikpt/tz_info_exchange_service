import { controller, httpGet } from 'inversify-express-utils';

@controller(`/`)
export class HomeController {
  @httpGet('')
  public async home(): Promise<string> {
    return 'Hello, i am working!!!';
  }
}
