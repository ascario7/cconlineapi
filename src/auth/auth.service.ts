import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SigninResponse } from './interfaces/signin-response.interface';
import { SignUpDto } from './dto/sign-up.dto';
import { SignupResponse } from './interfaces/signup-response.interface';
import { UserInterface } from '../user/interfaces/user.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokenTypeEnum } from './enums/token-type.enum';
import { forgotPasswordMail } from '../common/mailjet/user';
import { AccessToken } from './interfaces/access-token.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  validateUser(username: string, password: string): Promise<any> {
    return null;
  }

  public async signIn(signInDto: SignInDto): Promise<SigninResponse> {
    const dbUser = await this.userService.findOneByEmailWithPassword(
      signInDto.email.toLowerCase(),
    );
    if (!dbUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const match = await bcrypt.compare(signInDto.password, dbUser.password);
    if (!match) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    await dbUser.set({ lastLogin: new Date() }).save();

    const user = { ...dbUser.toJSON() };

    delete user.password;
    return {
      user: user,
      accessToken: this.createAccessTokenFromUser(dbUser),
    };
  }

  public async signUp(signUpDto: SignUpDto): Promise<SignupResponse> {
    const findUser = await this.userService.findOneByEmail(
      signUpDto.email.toLowerCase(),
    );
    if (findUser) {
      throw new BadRequestException('Email existente');
    }
    // get database user and validate password
    const dbUser = await this.userService.signUp(signUpDto);

    // generate an access token for immediate usage as well
    const accessToken = this.createAccessTokenFromUser(dbUser);

    return { accessToken, user: dbUser };
  }

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<boolean> {
    const dbUser = await this.userService.findOneByEmail(
      forgotPasswordDto.email.toLowerCase(),
    );
    if (!dbUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const accessToken = this.createAccessTokenFromUser(
      dbUser,
      TokenTypeEnum.recoveryPassword,
      '1m',
    );

    forgotPasswordMail(
      dbUser,
      accessToken,
      'Recuperación de contraseña',
      `${
        dbUser.userType === 'person'
          ? `${dbUser.name} ${dbUser.lastName}`
          : dbUser.companyName
      }`,
      'Para restablecer su contraseña, haga clic en el botón',
    );

    return true;
  }

  public async resetPassword(
    token: AccessToken,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    const dbUser = await this.userService.findOneByEmail(token.sub);
    if (!dbUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    dbUser.set({
      password: resetPasswordDto.password,
    });
    await dbUser.save();

    return true;
  }

  public createAccessTokenFromUser(
    user: UserInterface,
    type: TokenTypeEnum = TokenTypeEnum.client,
    expiration = '1y',
  ): string {
    const payload = {
      type,
      uid: user._id,
      sub: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, { expiresIn: expiration });
  }
}
