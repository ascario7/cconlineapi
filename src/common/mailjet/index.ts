import { CustomConfigService } from '../custom-config/custom-config.service';

const configService = new CustomConfigService('.env');

export const Mailjet = require('node-mailjet').connect(
  configService.get('MJ_APIKEY_PUBLIC'),
  configService.get('MJ_APIKEY_PRIVATE'),
);

export const MailjetSender = configService.get('MAIL_SENDER');

export const WebUrl = configService.get('WEB_URL');
