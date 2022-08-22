import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';

import { TokenRequirements } from '../common/decorators/token-requirements.decorator';
import { TokenTypeEnum } from '../auth/enums/token-type.enum';
import { UserService } from './user.service';
import { UserInterface } from './interfaces/user.interface';
import { TokenGuard } from '../auth/guards/token.guard';
import { AccessToken } from '../auth/interfaces/access-token.interface';
import { Token } from '../common/decorators/token.decorator';
import { PaginateResult } from 'mongoose';
import { ProfileDto } from './dto/profile.dto';

@Controller('api/user')
@UseGuards(TokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @TokenRequirements([TokenTypeEnum.client])
  public async searchCompanies(
    @Token() token: AccessToken,
    @Req() request,
  ): Promise<PaginateResult<UserInterface>> {
    return this.userService.searchCompanies(token.uid, request);
  }

  @Get(':_id')
  @TokenRequirements([TokenTypeEnum.client])
  public async getCompany(@Param('_id') _id: string): Promise<UserInterface> {
    return this.userService.getCompany(_id);
  }

  @Put('profile')
  @TokenRequirements([TokenTypeEnum.client])
  public async profile(
    @Token() token: AccessToken,
    @Body() body: ProfileDto,
  ): Promise<UserInterface> {
    return this.userService.profile(token.uid, body);
  }
}
