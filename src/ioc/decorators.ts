import { fluentProvide } from 'inversify-binding-decorators';

export const provideSingleton = (identifier: string | symbol): any =>
  fluentProvide(identifier).inSingletonScope().done(true);
