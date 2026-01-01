using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Dtos.MessageDtos
{
    public  class Message
    {
        public IEnumerable<MailboxAddress> To { get; }
        public string Subject { get; }
        public string Content { get; }

        public Message(string[] to, string subject, string content)
        {
            To = to.Select(x => new MailboxAddress("", x));
            Subject = subject;
            Content = content;
        }
    }
}
