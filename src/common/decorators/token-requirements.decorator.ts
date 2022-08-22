import { SetMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '../../auth/enums/token-type.enum';

export const TokenRequirements = (requiredTokenType: TokenTypeEnum[]) =>
  SetMetadata(
    'tokenrequirements',
    new TokenRequirementsHelper(requiredTokenType),
  );

export class TokenRequirementsHelper {
  private requiredTokenType: TokenTypeEnum[];

  constructor(requiredTokenType: TokenTypeEnum[]) {
    this.requiredTokenType = requiredTokenType;
  }

  public tokenIsOfType(tokenType: TokenTypeEnum): boolean {
    return this.requiredTokenType.some(
      (requiredType) => tokenType === requiredType,
    );
  }
}
