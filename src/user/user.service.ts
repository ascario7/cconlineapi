import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserInterface } from './interfaces/user.interface';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { ProfileDto } from './dto/profile.dto';
import { UserTypeEnum } from './enums/user-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneById(_id: string): Promise<UserDocument> {
    const dbUser = await this.userModel.findOne({ _id }).exec();
    return dbUser;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    const dbUser = await this.userModel.findOne({ email }).exec();
    return dbUser;
  }

  async findOneByEmailWithPassword(email: string): Promise<UserDocument> {
    const dbUser = await this.userModel
      .findOne({ email }, ['+password'])
      .exec();
    return dbUser;
  }

  async signUp(signUpDto: SignUpDto): Promise<UserInterface> {
    const createdUser = new this.userModel({
      ...signUpDto,
    });
    return createdUser.save();
  }

  async searchCompanies(
    _id: string,
    req: any,
  ): Promise<PaginateResult<UserInterface>> {
    const { query } = req;

    const options: PaginateOptions = {
      limit: query.limit ? parseInt(query.limit) : 24,
      page: query.page ? parseInt(query.page) : 1,
    };
    const search = query.query;

    if (!search) {
      throw new BadRequestException('Debe incluir un criterio de búsqueda');
    }

    const dbUsers = await this.userModel
      // .find({
      //   $or: [{ $text: { $search: query } }, { 'plans.amount': { $gte: 10 } }],
      //   _id: { $ne: _id },
      // })
      .paginate(
        {
          $or: [
            { companyName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            {
              $and: [
                // { 'plans.amount': { $gte: parseInt(search) || 0 } },
                { 'plans.amount': { $lte: parseInt(search) || 0 } },
              ],
            },
          ],
        },
        options,
      );

    return dbUsers;
  }

  async getCompany(_id: string): Promise<UserInterface> {
    const dbUser = await this.userModel.findOne({ _id }).exec();

    if (!dbUser) {
      throw new BadRequestException('Empresa no encontrada');
    }

    return dbUser;
  }

  async profile(_id: string, body: ProfileDto): Promise<UserInterface> {
    console.log('req ::: ', body);
    const dbUser = await this.userModel.findOne({ _id }).exec();
    if (!dbUser) {
      throw new BadRequestException('Usiario no encontrada');
    }

    if (
      dbUser.userType === UserTypeEnum.person &&
      (!body.name || !body.lastName)
    ) {
      throw new BadRequestException('Falta nombre y/o apellido');
    }

    if (dbUser.userType === UserTypeEnum.company && !body.companyName) {
      throw new BadRequestException('Falta razón social');
    }

    return dbUser;
  }
}
