import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    ConfigModule,
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre('save', async function () {
            const password = this.get('password');
            const name = this.get('name');
            const lastName = this.get('lastName');

            if (name) {
              this.set(
                'name',
                name
                  .split(' ')
                  .map(
                    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                  )
                  .join(' '),
              );
            }

            if (lastName) {
              this.set(
                'lastName',
                lastName
                  .split(' ')
                  .map(
                    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                  )
                  .join(' '),
              );
            }

            if (password && this.isModified('password')) {
              const hash = await bcrypt.hash(password, 10);
              this.set('password', hash);
            }
          });

          schema.index({
            name: 'text',
            lastName: 'text',
            companyName: 'text',
          });

          schema.virtual('fullName').get(function () {
            return this.userType === 'person'
              ? `${this.name} ${this.lastName}`
              : this.companyName;
          });

          schema.plugin(mongoosePaginate);

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
