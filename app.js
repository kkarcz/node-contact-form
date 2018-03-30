const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'smtp.gmail.com';
const portz = process.env.PORTZ || 465;
const mail = process.env.MAIL || 'krzyskarcz@gmail.com';
const password = process.env.PASSWORD || 'srajda55';

app.engine('handlebars', exphbs());
app.set ('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details:</h3>
  <ul>
    <li>Name: ${req.body.name} </li>
    <li>Surname: ${req.body.surname}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
  </ul>
  <h3>Message:</h3>
  <p>${req.body.message}</p>
  `;

  let transporter = nodemailer.createTransport({
    host: host,
    port: portz,
    secure: true,
    auth: {
        user: mail,
        pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
      from: '"Nodemailer Contact" <krzyskarcz@gmail.com>',
      to: 'krzyskarcz@gmail.com, kkarcz@poczta.onet.pl',
      subject: 'Node Contact Request',
      text: 'Hello world?',
      html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg: 'Email has been sent'});
  });
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});