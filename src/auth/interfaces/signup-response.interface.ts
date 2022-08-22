import { UserInterface } from '../../user/interfaces/user.interface';

export interface SignupResponse {
  readonly user: UserInterface;
  readonly accessToken: string;
}
