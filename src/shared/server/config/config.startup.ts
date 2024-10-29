import serverlessExpress from "@codegenie/serverless-express";
import { INestApplication, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Callback, Context, Handler } from "aws-lambda";

import { configureSwagger } from "../docs/swagger";

let lambdaHandler: Handler | undefined = undefined;

export async function bootstrap(appModule: Type<any>): Promise<void> {
  console.log("creating app");
  const app = await NestFactory.create(appModule, {
    logger: ["verbose"],
  });
  const configService = app.get(ConfigService);
  const isLambda = configService.get<string>("AWS_LAMBDA_FUNCTION_NAME");
  app.setGlobalPrefix("api");
  configureSwagger(app);
  if (isLambda) {
    lambdaHandler = createLambdaHandler(app);
    return;
  }
  await bootstrapLocal(app);
}

async function bootstrapLocal(app: INestApplication<any>): Promise<void> {
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);
  await app.listen(port);
}

function createLambdaHandler(app: INestApplication<any>): Handler {
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!lambdaHandler) {
    throw new Error(
      "Handler has not been initialized. Ensure bootstrap() has been called.",
    );
  }
  return lambdaHandler(event, context, callback);
};
