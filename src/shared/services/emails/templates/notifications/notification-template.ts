import fs from 'fs';
import ejs from 'ejs';
import { INotificationTemplate } from '@notification/interfaces/notification.interface';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/notification.ejs', 'utf8'), {
      username,
      header,
      message,
      image_url: 'https://cdn.icon-icons.com/icons2/1283/PNG/512/1497619898-jd24_85173.png'
    });
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate();
