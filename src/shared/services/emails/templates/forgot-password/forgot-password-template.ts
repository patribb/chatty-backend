import fs from 'fs'
import ejs from 'ejs'

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf8'), {
      username: username,
      resetLink: resetLink,
      image_url: 'https://cdn.icon-icons.com/icons2/1286/PNG/512/61_85304.png'
    })
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate()
