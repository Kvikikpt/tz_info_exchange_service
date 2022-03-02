import {
  Container,
  format,
  Logform,
  Logger as WinstonLogger,
  LoggerOptions,
  transports,
} from 'winston';

const textFormat = format.printf(({ level, message }) => {
  return `[${new Date()}]${level}: ${message}`;
});

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
