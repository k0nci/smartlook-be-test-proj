import { CollectionsService } from '../../services/Collections';
import { TokensService } from '../../services/Tokens';
import { UsersService } from '../../services/Users';

declare global {
  namespace Express {
    interface Application {
      services: {
        users: UsersService;
        collections: CollectionsService;
        tokens: TokensService;
      };
    }
  }
}
