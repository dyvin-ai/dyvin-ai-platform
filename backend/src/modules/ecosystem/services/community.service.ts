import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  async getPosts() {
    return [
      { id: 'post-1', title: 'Best practices for multi-agent workflows', upvotes: 142 },
      { id: 'post-2', title: 'How we improved GEO visibility by 340%', upvotes: 289 },
    ];
  }

  async getEvents() {
    return [
      { id: 'evt-1', title: 'Dyvin AI v1.0 GA Keynote & Live Demo', eventType: 'WEBINAR', scheduledAt: new Date() },
    ];
  }
}
