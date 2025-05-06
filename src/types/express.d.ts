import { IJwtPayload } from 'src/modules/auth/interface/auth.interface';

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}
