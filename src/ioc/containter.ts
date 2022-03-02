/* eslint-disable import/first,import/newline-after-import */
import 'reflect-metadata';
import { Container, inject } from 'inversify';
import { autoProvide, provide, buildProviderModule } from 'inversify-binding-decorators';

export * from './decorators';

/**
 * Creates container that will contain all dependencies
 */
const container = new Container({ skipBaseClassChecks: true });

import './loader'; // load files with "require()"

container.load(buildProviderModule()); // load "@provide" services

export { container, autoProvide, inject, provide };
