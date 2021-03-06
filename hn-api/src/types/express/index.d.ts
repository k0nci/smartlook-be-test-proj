import { UsersService } from "../../services/Users";

declare global {
  namespace Express {
    interface Application {
      services: {
        users: UsersService;
      };
    }
  }
}
