const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = 5000;


const storage = multer.memoryStorage();
const upload = multer({ storage });


app.use(cors());
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


app.post('/send-email', upload.single('resume'), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const { name, email, phone, jobRole, message } = req.body;
  const resume = req.file;


  if (!name || !email || !phone || !jobRole || !message || !resume) {
    console.log('Missing fields:', { name, email, phone, jobRole, message, resume });
    return res.status(400).send('All fields are required');
  }

  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL, 
    subject: 'New Career Opportunity Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nJob Role: ${jobRole}\nMessage: ${message}`,
    attachments: [
      {
        filename: resume.originalname,
        content: resume.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});


//contact
app.post('/contact', upload.single('resume'), (req, res) => {
  console.log('Request body:', req.body);
 
  const { firstname, email, phone, lastname, message } = req.body;
  

  if (!firstname || !email || !phone || !lastname || !message) {
    console.log('Missing fields:', { firstname, email, phone, lastname, message });
    return res.status(400).send('All fields are required');
  }

  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'New Contact Form Submission',
    text: `FirstName: ${firstname}\nEmail: ${email}\nPhone: ${phone}\nLastName: ${lastname}\nMessage: ${message}`,
   
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
