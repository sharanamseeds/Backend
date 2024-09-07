import nodemailer, { TransportOptions } from "nodemailer";
import { masterConfig } from "../config/master.config.js";
import path from "path";
import fs from "fs";

interface MailOptions {
  email: string;
  subject: string;
  message?: string;
  html?: string;
  attachments?: any[];
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  try {
    // create gmail account
    const gmailConfig = {
      service: "gmail",
      auth: {
        user: masterConfig.nodemailerConfig.mailConfig.email,
        pass: masterConfig.nodemailerConfig.mailConfig.password,
      },
    };
    // create transporter
    const transporter = nodemailer.createTransport(gmailConfig);

    // verify transporter
    transporter.verify(function (error, success) {
      if (error) {
        global.logger.error(`Error At Create Mail Transport ${error}`);
      } else {
        global.logger.info("Mail Transport is ready to take our messages ✔");
      }
    });

    // create mail option
    const mailOptions = {
      from: {
        name: masterConfig.nodemailerConfig.mailConfig.name,
        address: masterConfig.nodemailerConfig.mailConfig.email,
      },
      to: [options.email],
      subject: options.subject,
      text: options?.message,
      html: options.html,
      attachments: options?.attachments || [],
    };

    // send mail
    const info = await transporter.sendMail(mailOptions);
    if (info) {
      global.logger.info("Mail Sent ✔");
    }
  } catch (error) {
    global.logger.error(error);
  }
};

const getLocalImageB64 = (imagePath: string) => {
  const basePath = path.join(process.cwd(), imagePath);

  const imageBuffer = fs.readFileSync(basePath);
  const imageBase64 = imageBuffer.toString("base64");
  const imageMimeType = "image/png";
  return { b64Data: imageBase64, mimeType: imageMimeType };
};

export const buildWelcomeHtml = (
  emailId: string,
  contact: string
) => `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}!</title>
  <style>
    /* Your email styling here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      padding: 20px;
    }
    .container {
      background-color: #fff;
    }
    .header {
      text-align: center;
    }
    .logo {
      max-width: 200px;
    }
    .content {
    }
    .cta {
      text-align: center;
      padding: 20px;
    }
    .button {
      background-color: #4CAF50;
      color: white !important;
      padding: 15px 25px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
    }
    .visit {
        padding: 5px 10px;
    }
    .ii a[href]{
        color:white;
        font-weight:500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:companylogo" alt="company logo" class="logo"/>
    </div>
    <div class="content">
      <h2>Welcome to the ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name} family!</h2>
      <p>We're excited to have you join us!</p>
      <p>Your account has been successfully verified.</p>
      <p><strong>Login Details:</strong></p>
      <p><strong>Email :</strong> ${emailId}</p>
      <p><strong>Contact Number :</strong> ${contact}</p>

      <p>Start exploring our amazing products and enjoy a seamless shopping experience.</p>
      <p><strong>Download our app for a convenient shopping experience:</strong></p>
      <p><strong>App Store :</strong> <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.mobile_app_link}" class="button visit">Visit Now</a></p>
      <p><strong>Google Play Store :</strong> <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.app_store_link}" class="button visit">Visit Now</a></p>

      <p>${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_slogan}</p>
    </div>
    <div class="cta">
      <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.admin_web_app_link}" class="button">Visit Our Website</a>
    </div>
  </div>
</body>
</html>`;

export const buildAccountCreatedHtml = (
  emailId: string,
  contact: string
) => `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}!</title>
  <style>
    /* Your email styling here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
    }
    .header {
      text-align: center;
    }
    .logo {
      max-width: 200px;
    }
    .content {
      
    }
    .cta {
      text-align: center;
      padding: 20px;
    }
    .button {
      background-color: #4CAF50;
      color: white !important;
      padding: 15px 25px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
    }
    .visit {
        padding: 5px 10px;
    }
    .ii a[href]{
        color:white;
        font-weight:500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:companylogo" alt="company logo" class="logo"/>
    </div>
    <div class="content">
      <h2>Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}!</h2>
      <p>Thank you for creating an account with us!</p>
      <p>Your account is currently under review. We will notify you once your account is verified.</p>
      <p><strong>Your Account Details:</strong></p>
      <p><strong>Email :</strong> ${emailId}</p>
      <p><strong>Contact Number :</strong> ${contact}</p>

      <p>We appreciate your patience.</p>
    </div>
    <div class="cta">
      <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.admin_web_app_link}" class="button">Visit Our Website</a>
    </div>
  </div>
</body>
</html>`;

export const generateVerificationCodeHtml = (
  verificationCode: string,
  expireTime: number
) => `
<!DOCTYPE html>
<html>
<head>
  <title>Verification Code</title>
  <style>
    /* Your email styling here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
    }
    .header {
      text-align: center;
    }
    .logo {
      max-width: 200px;
    }
    .content {
      font-size: 16px;
      line-height: 1.5;
    }
    .cta {
      text-align: center;
      padding: 20px;
    }
    .button {
      background-color: #4CAF50;
      color: white !important;
      padding: 15px 25px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:companylogo" alt="company logo" class="logo"/>
    </div>
    <div class="content">
      <h2>Hi there,</h2>
      <p>We're excited to have you join us!</p>
      <p>To verify your account, please enter the following verification code:</p>
      <h3 style="text-align: center;">${verificationCode}</h3>
      <p>This code will expire in ${expireTime / 60} minutes.</p>
      <p>If you have any issues or need assistance, please don't hesitate to contact our support team.</p>
    </div>
  </div>
</body>
</html>`;

export const generateLedgerCodeHtml = (
  ledgerItems: {
    createdAt: Date;
    description: string;
    type: string;
    bill_amount: number;
    payment_amount: number;
    invoice_id: string;
  }[], //typeLedger[],
  customerName: string
) => `
<!DOCTYPE html>
<html>
<head>
  <title>${
    masterConfig.nodemailerConfig.emailTemplateConfig.company_details
      .company_name
  } - Ledger Statement</title>
  <style>
    /* Your email styling here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
    }
    .header {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #ccc;
    }
    .logo {
      max-width: 200px;
    }
    .content {
      padding: 20px;
    }
    .ledger-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .ledger-table th, .ledger-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .ledger-table th {
      background-color: #f2f2f2;
    }
    .cta {
      text-align: center;
      padding: 20px;
    }
    .button {
      background-color: #4CAF50;
      color: white !important;
      padding: 15px 25px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
    }
    .visit {
      padding: 5px 10px;
    }
    .ii a[href] {
      color: white;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="cid:companylogo" alt="company logo" class="logo"/>
    </div>
    <div class="content">
      <h2>${
        masterConfig.nodemailerConfig.emailTemplateConfig.company_details
          .company_name
      } - Ledger Statement</h2>
      <p>Dear ${customerName},</p>
      <p>Below is the ledger statement for your account.</p>
      <table class="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Bill Amount</th>
            <th>Payment Amount</th>
            <th>Invoice ID</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through ledger items here -->
          ${ledgerItems
            .map(
              (item) => `
          <tr>
            <td>${new Date(item.createdAt).toLocaleDateString()}</td>
            <td>${item.description}</td>
            <td>${item.type}</td>
            <td>${item.bill_amount.toFixed(2)}</td>
            <td>${item.payment_amount.toFixed(2)}</td>
            <td>${item.invoice_id}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p>For any queries, feel free to contact us.</p>
    </div>
    <div class="cta">
      <a href="${
        masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info
          .admin_web_app_link
      }" class="button">Visit Our Website</a>
    </div>
  </div>
</body>
</html>
`;

export const generateBillCodeHtml = (
  bill: {
    invoice_id: string;
    sellerName: string;
    sellerAddress: string;
    sellerEmail: string;
    sellerPhone: string;
    sellerGST: string;
    buyerName: string;
    buyerAddress: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerGST: string;
    items: {
      product_name: string;
      product_code: string;
      quantity: number;
      rate: number;
      taxableValue: number;
      gstRate: number;
      gstAmount: number;
      discount: number;
      manufacture_date: string;
      expiry_date: string;
    }[];
    order_amount: number;
    discount_amount: number;
    tax_amount: number;
    billing_amount: number;
    sellerBankDetails: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      branchName: string;
    };
  },
  isForMail: boolean = true,
  isReturnBill: boolean = true
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Base styles */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    /* Header styles */
    .header {
      display: table;
      width: 100%;
      margin-bottom: 20px;
    }
    .header img {
      max-width: 150px; /* Adjust logo size */
      vertical-align: middle;
    }
    .header h1 {
      display: table-cell;
      vertical-align: middle;
      text-align: right;
      margin: 0;
      font-size: 24px;
    }

    /* Details section styles */
    .details {
      display: table;
      width: 100%;
      margin-bottom: 20px;
    }
    .details .company,
    .details .buyer {
      display: table-cell;
      width: 50%; /* Adjust width for even distribution */
      vertical-align: top;
    }
    .details p {
      margin-top: 5px; /* Add some space between elements */
    }

    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      font-weight: bold;
    }

    /* Summary and Bank Details styles */
    .total,
    .gst-summary {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .bank-details {
      display: table;
      width: 100%;
      margin-top: 20px;
    }
    .bank-details .bank-info,
    .bank-details .qr-code {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }
    .bank-details .qr-code {
      text-align: right;
    }

    /* Signature and Page Break styles */
    .signature {
      text-align: right;
      margin-top: 40px;
    }
    .page-break {
      page-break-before: always;
    }

    /* Return bill notice */
    .return-notice {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
    }
  </style>
  <title>${isReturnBill ? "Return Bill" : "Tax Invoice"}</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src=${
        isForMail
          ? "cid:companylogo"
          : "data:" +
            getLocalImageB64(
              masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                .primary_logo_path
            ).mimeType +
            ";base64," +
            getLocalImageB64(
              masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                .primary_logo_path
            ).b64Data
      } alt="Company Logo" />
      <h1>${isReturnBill ? "Return Bill" : "Tax Invoice"}</h1>
    </div>

    <!-- Add Invoice Number -->
    <p><strong>Invoice No:</strong> ${bill.invoice_id}</p>

    ${
      isReturnBill
        ? `<div class="return-notice">
             <span><strong>Note:</strong> This is a return bill.</span>
           </div>`
        : ""
    }

    <div class="details">
      <div class="company">
        <p><strong>Seller Details:</strong></p>
        <p><strong>Name:</strong> ${bill.sellerName}</p>
        <p><strong>Address:</strong> ${bill.sellerAddress}</p>
        <p><strong>Email:</strong> ${bill.sellerEmail}</p>
        <p><strong>Phone:</strong> ${bill.sellerPhone}</p>
        <p><strong>GST No:</strong> ${bill.sellerGST}</p>
      </div>
      <div class="buyer">
        <p><strong>Buyer Details:</strong></p>
        <p><strong>Name:</strong> ${bill.buyerName}</p>
        <p><strong>Address:</strong> ${bill.buyerAddress}</p>
        <p><strong>Email:</strong> ${bill.buyerEmail}</p>
        <p><strong>Phone:</strong> ${bill.buyerPhone}</p>
        <p><strong>GST No:</strong> ${bill.buyerGST}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
            <th>Item Name</th>
            <th>Product Code</th>
            <th>Man. Date</th>
            <th>Exe. Date</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>GST Rate</th>
            <th>GST Amount</th>
            <th>Discount</th>
        </tr>
      </thead>
      <tbody>
        ${bill.items
          .map(
            (item) => `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.product_code}</td>
          <td>${item.manufacture_date}</td>
          <td>${item.expiry_date}</td>
          <td>${item.quantity}</td>
          <td>${item.rate}</td>
          <td>${item.gstRate}</td>
          <td>${item.gstAmount}</td>
          <td>${item.discount}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="gst-summary">
      <p class="total"><strong>Order Amount:</strong> ₹ ${bill.order_amount}</p>
      <p><strong>Discount Amount:</strong> ₹ ${bill.discount_amount}</p>
      <p><strong>Tax Amount:</strong> ₹ ${bill.tax_amount}</p>
      <p class="total">
        <strong>${
          isReturnBill ? "Refund Amount" : "Billing Amount"
        }:</strong> ₹ ${bill.billing_amount}
      </p>
    </div>

    <div class="bank-details">
      <div class="bank-info">
        <p><strong>Bank Details:</strong></p>
        <p><strong>Bank:</strong>${bill.sellerBankDetails.bankName}</p>
        <p><strong>Account No:</strong>${
          bill.sellerBankDetails.accountNumber
        }</p>
        <p><strong>IFSC:</strong>${bill.sellerBankDetails.ifscCode}</p>
        <p><strong>Branch:</strong>${bill.sellerBankDetails.branchName}</p>
      </div>
      <div class="qr-code">
        <p><strong>Pay using UPI:</strong></p>
        <img src=${
          isForMail
            ? "cid:QrCode"
            : "data:" +
              getLocalImageB64(
                masterConfig.nodemailerConfig.emailTemplateConfig
                  .company_details.qr_code_path
              ).mimeType +
              ";base64," +
              getLocalImageB64(
                masterConfig.nodemailerConfig.emailTemplateConfig
                  .company_details.qr_code_path
              ).b64Data
        } alt="QR Code" style="max-width: 130px;"/>
      </div>
    </div>

    <div class="terms-conditions">
      <h3>Terms and Conditions:</h3>
      <ul>
        ${
          isReturnBill
            ? "<li>Refunds will be processed within 7 business days.</li>"
            : "<li>Payment is due within 30 days.</li>"
        }
        <li>Goods once sold will not be taken back.</li>
      </ul>
    </div>

    <div class="signature">
      <p>Authorized Signatory</p>
    </div>
  </div>
</body>
</html>
`;
