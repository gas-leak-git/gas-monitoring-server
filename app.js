const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASS;
const receiverEmail = process.env.RECEIVER_EMAIL;

console.log("Email:", email);
console.log("Receiver Email:", receiverEmail);
console.log("Email Password:", emailPassword);

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: email,
		pass: emailPassword,
	},
});

const weightTemplate = () => {
	return `
   <!DOCTYPE html>
<html
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:o="urn:schemas-microsoft-com:office:office"
	lang="en"
>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Gas Level Warning</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background-color: #f7f7f7;
				margin: 0;
				padding: 0;
			}
			.email-container {
				max-width: 600px;
				margin: 20px auto;
				background-color: #ffffff;
				border: 1px solid #dddddd;
				padding: 20px;
				border-radius: 8px;
			}
			.header {
				background-color: #d9534f;
				color: white;
				padding: 10px 20px;
				border-radius: 6px 6px 0 0;
				text-align: center;
				font-size: 20px;
			}
			.content {
				padding: 20px;
				font-size: 16px;
				color: #333333;
			}
			.footer {
				padding: 10px 20px;
				font-size: 12px;
				color: #888888;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<div class="email-container">
			<div class="header">⚠️ Gas Level Warning</div>
			<div class="content">
				<p>
					<strong>Warning:</strong> The gas level has dropped to
					<strong>10%</strong>.
				</p>
				<p>
					Please contact the nearest gas supplier immediately to arrange for a
					replacement and avoid any service interruption.
				</p>
			</div>
			<div class="footer">
				This is an automated message. Please do not reply directly to this
				email.
			</div>
			<p style="text-align: center; align-self: center; color: grey">
				Powered by JaCy
			</p>
		</div>
	</body>
</html>

  `;
};

const gasLeakTemplate = () => {
	return `
   <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gas Leak Alert</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #c9302c;
      color: #ffffff;
      padding: 20px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      color: #333333;
      line-height: 1.5;
    }
    .content strong {
      color: #c9302c;
    }
    .footer {
      padding: 15px 20px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      ⚠️ ALERT
    </div>
    <div class="content">
      <p><strong>Warning: Gas leak detected!</strong></p>
    </div>
    <div class="footer">
      This message was generated automatically. Do not reply to this email.
    </div>
<p style="text-align: center; align-self: center; color: grey">
				Powered by JaCy
			</p>
  </div>
</body>
</html>
`;
};

app.get("/", (req, res) => {
	return res.send(
		"Server is running! Use /api/weight-warning or /api/gas-leak-warning to send test emails."
	);
});

app.get("/api/weight-warning", async (req, res) => {
	const mailOptions = {
		from: `"Gas Monitor" ${email}`,
		to: receiverEmail,
		subject: "🚨 Warning",
		html: weightTemplate(),
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: "Email sent successfully" });
	} catch (err) {
		console.error("Error sending email:", err);
		res.status(500).json({ error: "Failed to send email" });
	}
});

app.get("/api/gas-leak-warning", async (req, res) => {
	const mailOptions = {
		from: `"Gas Monitor" ${email}`,
		to: receiverEmail,
		subject: "🚨 Warning",
		html: gasLeakTemplate(),
	};

	try {
		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: "Email sent successfully" });
	} catch (err) {
		console.error("Error sending email:", err);
		res.status(500).json({ error: "Failed to send email" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
