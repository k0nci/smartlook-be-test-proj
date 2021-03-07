import { Collection } from './Collection';
import { Story } from './Story';

export interface CollectionWithStories extends Collection {
  stories: Story[];
}
