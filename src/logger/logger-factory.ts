import { inspect } from 'util';

import {
  format,
  Logform,
  transports,
  Container,
  Logger as WinstonLogger,
  LoggerOptions,
} from 'winston';

const textFormat = format.printf(
  ({ level, message, label, timestamp, stack, metadata }) => {
    let msg = `${timestamp} [${label}] ${level}: ${message}`;
    if (metadata && Object.keys(metadata).length > 0) {
      msg = `${msg} ${inspect(metadata, { depth: 5, colors: true })}`;
    }
    if (stack) {
      msg = `${msg}\nstack: ${stack}`;
    }

    return msg;
  }
);

const createNewLogger = (format: Logform.Format): LoggerOptions => {
  return {
    format: format,
    transports: [new transports.Console()],
    exitOnError: false,
  };
};

export class LoggerFactory {
  private static container: Container = new Container();

  public static getLogger(name = 'default'): WinstonLogger {
    if (this.container.has(name)) {
      return this.container.get(name);
    }

    return this.container.add(name, createNewLogger(textFormat));
  }
}
