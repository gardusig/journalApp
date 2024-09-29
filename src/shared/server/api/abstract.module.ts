import { DynamicModule, InjectionToken, Type } from "@nestjs/common";

interface GenericModuleOptions {
  controller: Type<any>;
  service: Type<any>;
  serviceToken: InjectionToken;
}

export class AbstractModule {
  static configure(options: GenericModuleOptions): DynamicModule {
    return {
      module: AbstractModule,
      controllers: [options.controller],
      providers: [
        {
          provide: options.serviceToken,
          useClass: options.service,
        },
      ],
      exports: [options.serviceToken],
    };
  }
}
