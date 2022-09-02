const nodeMailer = require('nodemailer');
const ApiError = require('../exceptions/api-error');
const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
} = require('../settings');

class MailService {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: `TimeSelector ${SMTP_USER}`,
                to,
                subject: 'Активация аккаунта на TimeSelector',
                text: '',
                html: `
                <div>
                    <h1>
                    Для активации перейдите по 
                        <button>
                            <a href="${link}">ссылке</a>
                        </button>
                    </h1>
                </div>
                    `,
            });

            return true;
        } catch (e) {
            throw ApiError.BadRequest(
                'Ошибка при отправке письма с подтверждением',
            );
        }
    }

    async sendNotification(to, time, filename, path, place = null) {
        try {
            await this.transporter.sendMail({
                from: `TimeSelector ${SMTP_USER}`,
                to,
                subject: 'Итоги голосования TimeSelector',
                text: '',
                attachments: [
                    {
                        filename,
                        path,
                    },
                ],
                html: `
                <div>
                    <h1>
                        Мероприятие пройдет в ${time}.
                        ${place && `Место проведения ${place}`}
                    </h1>
                </div>
                    `,
            });
            return true;
        } catch (e) {
            throw ApiError.BadRequest(
                'Ошибка при отправке письма с подтверждением',
            );
        }
    }
}

module.exports = new MailService();
