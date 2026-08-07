import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchEngineService } from './services/search-engine.service';

@Module({
  controllers: [SearchController],
  providers: [SearchEngineService],
  exports: [SearchEngineService],
})
export class SearchModule {}
