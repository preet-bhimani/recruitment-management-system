using System.Net;
using System.Net.Mail;

namespace server.Services
{
    public class EmailService
    {
        private readonly IConfiguration config;

        public EmailService(IConfiguration config)
        {
            this.config = config;
        }

        // Senf email
        public async Task SendEmail(string toEmail, string subject, string body)
        {
            var host = config["SMTP:Host"];
            var port = int.Parse(config["SMTP:Port"]);
            var enableSSL = bool.Parse(config["SMTP:EnableSSL"]);
            var userName = config["SMTP:UserName"];
            var password = config["SMTP:Password"];

            var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSSL,
                Credentials = new NetworkCredential(userName, password)
            };

            var mail = new MailMessage()
            {
                From = new MailAddress(userName, "Roima recruitment"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            await client.SendMailAsync(mail);
        }

        // Send email with attachment
        public async Task SendEmailWithAttachment(string toEmail, string subject, string body, string attachmentPath)
        {
            var host = config["SMTP:Host"];
            var port = int.Parse(config["SMTP:Port"]);
            var enableSSL = bool.Parse(config["SMTP:EnableSSL"]);
            var userName = config["SMTP:UserName"];
            var password = config["SMTP:Password"];

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSSL,
                Credentials = new NetworkCredential(userName, password)
            };

            using var mail = new MailMessage()
            {
                From = new MailAddress(userName, "Roima Recruitment"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            // Attach the generated Offer Letter PDF
            if (File.Exists(attachmentPath))
            {
                mail.Attachments.Add(new Attachment(attachmentPath));
            }

            await client.SendMailAsync(mail);
        }

    }
}
