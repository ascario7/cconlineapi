import { Body, Controller, Post, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SigninResponse } from './interfaces/signin-response.interface';
import { SignUpDto } from './dto/sign-up.dto';
import { SignupResponse } from './interfaces/signup-response.interface';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokenRequirements } from '../common/decorators/token-requirements.decorator';
import { TokenTypeEnum } from './enums/token-type.enum';
import { TokenGuard } from './guards/token.guard';
import { Token } from '../common/decorators/token.decorator';
import { AccessToken } from './interfaces/access-token.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() signInDto: SignInDto): Promise<SigninResponse> {
    return this.authService.signIn(signInDto);
  }

  @Post('register')
  async register(@Body() signUpDto: SignUpDto): Promise<SignupResponse> {
    return this.authService.signUp(signUpDto);
  }

  @Post('forgot-password')
  @TokenRequirements([TokenTypeEnum.recoveryPassword])
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<boolean> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @UseGuards(TokenGuard)
  @TokenRequirements([TokenTypeEnum.recoveryPassword])
  async resetPassword(
    @Token() token: AccessToken,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    return await this.authService.resetPassword(token, resetPasswordDto);
  }
}
