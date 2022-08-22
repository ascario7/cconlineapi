import { LocationInterface } from './location.interface';
import { PlanInterface } from './plan.interface';

export interface UserInterface {
  _id?: string;
  name?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  password?: string;
  passwordChange?: boolean;
  phone?: string;
  photo?: string;
  userType?: string;
  role?: string;
  location?: LocationInterface;
  plans?: PlanInterface[];
  lastLogin?: Date;
}
