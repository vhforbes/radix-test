import { Module } from '@nestjs/common';
import { ManageModule } from './manage/manage.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [ManageModule, ContentModule]
})
export class CommunityModule {}
