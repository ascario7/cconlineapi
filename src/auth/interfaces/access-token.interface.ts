import { TokenTypeEnum } from '../enums/token-type.enum';

export interface AccessToken {
  readonly uid: string;
  readonly sub: string;
  readonly type: TokenTypeEnum;
  readonly rs: string[];
}
