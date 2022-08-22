import { Module } from '@nestjs/common';
import { CustomConfigService } from './custom-config.service';

@Module({
  providers: [
    {
      provide: CustomConfigService,
      useValue: new CustomConfigService('.env'),
    },
  ],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
