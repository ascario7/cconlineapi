import { UserInterface } from '../../user/interfaces/user.interface';

export interface SigninResponse {
  readonly user: UserInterface;
  readonly accessToken: string;
}
