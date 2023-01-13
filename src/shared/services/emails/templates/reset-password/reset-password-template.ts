import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
    const { username, email, ipaddress, date } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
      username,
      email,
      ipaddress,
      date,
      image_url: 'https://cdn.icon-icons.com/icons2/1603/PNG/512/security-protection-protect-lock-open-secure_108583.png'
    });
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
