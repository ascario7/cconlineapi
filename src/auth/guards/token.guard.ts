import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { UserService } from '../../user/user.service';
import { AccessToken } from '../interfaces/access-token.interface';
import { TokenRequirementsHelper } from '../../common/decorators/token-requirements.decorator';

@Injectable()
export class TokenGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // validate token
    const req = context.switchToHttp().getRequest();
    if (
      req.headers.authorization &&
      (req.headers.authorization as string).split(' ')[0] === 'Bearer'
    ) {
      const token = (req.headers.authorization as string).split(' ')[1];
      let decodedToken;
      try {
        decodedToken = jwt.verify(
          token,
          this.configService.get('JWT_SECRET'),
        ) as AccessToken;
      } catch (error) {
        throw new UnauthorizedException('Token expirado');
      }

      req.user = decodedToken;

      // const findUser = await this.userService.findOneByEmail(decodedToken.sub);

      // if (findUser.status === UserStatusEnum.inactive) {
      //   throw new UnauthorizedException({
      //     message: await this.i18n.translate('auth.userDisabled'),
      //   });
      // }

      // check if decorator is present
      const tokenRequirements = this.reflector.get<TokenRequirementsHelper>(
        'tokenrequirements',
        context.getHandler(),
      );

      if (!tokenRequirements) {
        // no token requirements
        return true;
      }

      // check if token is of the right type
      if (!tokenRequirements.tokenIsOfType(decodedToken.type)) {
        throw new UnauthorizedException(
          'No tiene autorización para ejecutar esta acción',
        );
      }

      return true;
    }
    return false;
  }
}
