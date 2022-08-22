import { Mailjet, MailjetSender, WebUrl } from '.';
import { UserInterface } from '../../user/interfaces/user.interface';

export const newUserMail = async (
  user: UserInterface,
  password: string,
  welcomeText: string,
  loginText: string,
  passwordText: string,
  subject: string,
) => {
  const options = {
    Messages: [
      {
        From: {
          Email: MailjetSender,
          Name: 'Sergio Carrillo',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        TemplateID: 1116732,
        TemplateLanguage: true,
        Subject: subject,
        Variables: {
          welcomeText,
          loginText,
          passwordText,
          name: user.name,
          password: password,
          url: WebUrl,
        },
      },
    ],
  };

  await Mailjet.post('send', { version: 'v3.1' }).request(options);
};

export const newUserVerify = (
  user: UserInterface,
  token: string,
  welcomeText: string,
  verifyText: string,
  verifyInfo: string,
) => {
  const options = {
    Messages: [
      {
        From: {
          Email: MailjetSender,
          Name: '',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: 'Please verify your account',
        TemplateID: 1308329,
        TemplateLanguage: true,
        Variables: {
          welcomeText,
          verifyText,
          verifyInfo,
          url: `${WebUrl}/verify-email/${token}`,
        },
      },
    ],
  };

  return Mailjet.post('send', { version: 'v3.1' }).request(options);
};

export const forgotPasswordMail = (
  user: UserInterface,
  token: string,
  subject: string,
  title: string,
  message: string,
) => {
  const options = {
    Messages: [
      {
        From: {
          Email: MailjetSender,
          Name: 'Sergio Carrillo',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: subject,
        TemplateID: 4032096,
        TemplateLanguage: true,
        Variables: {
          title,
          message,
          url: `${WebUrl}/auth/reset-password/${token}`,
        },
      },
    ],
  };

  Mailjet.post('send', { version: 'v3.1' }).request(options);
};

export const sendUserInvitation = (user: UserInterface, password: string) => {
  const options = {
    Messages: [
      {
        From: {
          Email: MailjetSender,
          Name: 'Sergio Carrillo',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        TemplateID: 1127522,
        TemplateLanguage: true,
        Subject: 'Welcome',
        Variables: {
          name: user.name,
          email: user.email,
          password: password,
          url: WebUrl,
        },
      },
    ],
  };

  Mailjet.post('send', { version: 'v3.1' }).request(options);
};

export const sendMailNotification = (
  users: UserInterface[],
  message: string,
) => {
  const to = users.map((u) => ({
    Email: u.email,
    Name: u.name,
  }));

  const options = {
    Messages: [
      {
        From: {
          Email: MailjetSender,
          Name: 'Sergio Carrillo',
        },
        To: to,
        TemplateID: 1127527,
        TemplateLanguage: true,
        Subject: 'Notification',
        Variables: {
          message: message,
          url: WebUrl,
        },
      },
    ],
  };

  Mailjet.post('send', { version: 'v3.1' }).request(options);
};
