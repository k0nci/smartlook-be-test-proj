import { StoriesRepository } from '@smartlook/repositories/stories';
import { CommentsRepository } from '@smartlook/repositories/Comments';
import { HNApiClient } from '@smartlook/api-clients/hn';
import { Story } from '@smartlook/models/Story';
import { Comment } from '../../../repositories/node_modules/@smartlook/models/Comment';
import { ItemType } from '@smartlook/api-clients/hn/models/Item';

export class SyncCommentsJob {
  readonly JOB_NAME = 'sync-comments';
  readonly JOB_ENABLED = process.env.SYNC_COMMENTS_ENABLED ?? true;
  readonly JOB_CRON = process.env.SYNC_COMMENTS_CRON ?? '* * * * *';

  constructor(
    private hnApiClient: HNApiClient,
    private storiesRepo: StoriesRepository,
    private commentsRepo: CommentsRepository,
  ) {}

  async run(): Promise<void> {
    // TODO: Change to get stories in batches
    const stories = await this.storiesRepo.getAll();
    const syncResults = await Promise.allSettled(stories.map(async (one) => this.syncStoryComments(one)));

    let succSyncedStories = 0;
    let succfullySyncedComments = 0;
    for (const syncRes of syncResults) {
      if (syncRes.status === 'fulfilled') {
        succSyncedStories++;
        succfullySyncedComments += syncRes.value;
      } else {
        console.log(syncRes.reason);
      }
    }
    console.log(`Successfully synced ${succfullySyncedComments} comments of ${succSyncedStories} stories`);
  }

  async syncStoryComments(story: Story): Promise<number> {
    if (story.kids.length === 0) {
      return 0;
    }
    const commentsFound = await this.fetchStoryCommets(story);

    const tx = await this.commentsRepo.initTransaction();
    try {
      await this.commentsRepo.deleteAll({ parent: story.id }, tx);
      await this.commentsRepo.insertAll(commentsFound, tx);
      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }
    return commentsFound.length;
  }

  async fetchStoryCommets(story: Story): Promise<Comment[]> {
    const comments = await Promise.all(story.kids.map(async (commentId) => this.hnApiClient.getItemById(commentId)));
    const commentsFound: Comment[] = [];
    for (const comment of comments) {
      if (comment && !comment.deleted && comment.type === ItemType.COMMENT) {
        commentsFound.push({
          id: comment.id,
          author: comment.by,
          content: comment.text ?? '',
          createdAt: comment.time,
          parent: comment.parent ?? story.id,
          kids: comment.kids ?? [],
        });
      }
    }
    return commentsFound;
  }
}
