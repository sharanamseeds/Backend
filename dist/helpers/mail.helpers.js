var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from "nodemailer";
import { masterConfig, rootDir } from "../config/master.config.js";
import path from "path";
import fs from "fs";
export const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
            else {
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
            text: options === null || options === void 0 ? void 0 : options.message,
            html: options.html,
            attachments: (options === null || options === void 0 ? void 0 : options.attachments) || [],
        };
        // send mail
        const info = yield transporter.sendMail(mailOptions);
        if (info) {
            global.logger.info("Mail Sent ✔");
        }
    }
    catch (error) {
        global.logger.error(error.message);
    }
});
const getLocalImageB64 = (imagePath) => {
    const basePath = path.join(rootDir, imagePath);
    const imageBuffer = fs.readFileSync(basePath);
    const imageBase64 = imageBuffer.toString("base64");
    const imageMimeType = "image/png";
    return { b64Data: imageBase64, mimeType: imageMimeType };
};
export const buildWelcomeHtml = (emailId, contact) => `<!DOCTYPE html>
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
      <p><strong>App Store :</strong> <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.mobile_app_link}" class="button visit">Download Now</a></p>
      <p><strong>Google Play Store :</strong> <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.app_store_link}" class="button visit">Download Now</a></p>

      <p>${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_slogan}</p>
    </div>
    <div class="cta">
      <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info.admin_web_app_link}" class="button">Visit Our Website</a>
    </div>
  </div>
</body>
</html>`;
export const buildAccountCreatedHtml = (emailId, contact) => `<!DOCTYPE html>
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
export const generateVerificationCodeHtml = (verificationCode, expireTime) => `
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
export const generateLedgerCodeHtml = (ledgerItems, //typeLedger[],
customerName) => `
<!DOCTYPE html>
<html>
<head>
  <title>${masterConfig.nodemailerConfig.emailTemplateConfig.company_details
    .company_name} - Ledger Statement</title>
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
      <h2>${masterConfig.nodemailerConfig.emailTemplateConfig.company_details
    .company_name} - Ledger Statement</h2>
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
    .map((item) => `
          <tr>
            <td>${new Date(item.createdAt).toLocaleDateString()}</td>
            <td>${item.description}</td>
            <td>${item.type}</td>
            <td>${item.bill_amount.toFixed(2)}</td>
            <td>${item.payment_amount.toFixed(2)}</td>
            <td>${item.invoice_id}</td>
          </tr>`)
    .join("")}
        </tbody>
      </table>
      <p>For any queries, feel free to contact us.</p>
    </div>
    <div class="cta">
      <a href="${masterConfig.nodemailerConfig.emailTemplateConfig.email_template_info
    .admin_web_app_link}" class="button">Visit Our Website</a>
    </div>
  </div>
</body>
</html>
`;
// ${
//   isReturnBill
//     ? `<div class="return-notice">
//          <span><strong>Note:</strong> This is a return bill.</span>
//        </div>`
//     : ""
// }
export const generateBillCodeHtml = (bill, isForMail = true, isReturnBill = true) => `
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
      margin: 5px; /* Add some space between elements */
    }
    .company p {
      margin: 5px; /* Add some space between elements */
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
    .total{
    margin: 10px;
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
      <img src=${isForMail
    ? "cid:companylogo"
    : "data:" +
        getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig.company_details
            .primary_logo_path).mimeType +
        ";base64," +
        getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig.company_details
            .primary_logo_path).b64Data} alt="Company Logo" />
      <h1>${isReturnBill ? "Return Bill" : "Tax Invoice"}</h1>
    </div>

    <!-- Add Invoice Number -->
    <p><strong>Invoice No:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.invoice_id) || ""}</p>

    <div class="details">
      <div class="company">
        <p><strong>Seller Details:</strong></p>
        <p><strong>Name:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.sellerName) || ""}</p>
        <p><strong>Address:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.sellerAddress) || ""}</p>
        <p><strong>Email:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.sellerEmail) || ""}</p>
        <p><strong>Phone:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.sellerPhone) || ""}</p>
        <p><strong>GST No:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.sellerGST) || ""}</p>
      </div>
      <div class="buyer">
        <p><strong>Buyer Details:</strong></p>
        <p><strong>Name:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.buyerName) || ""}</p>
        <p><strong>Address:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.buyerAddress) || ""}</p>
        <p><strong>Email:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.buyerEmail) || ""}</p>
        <p><strong>Phone:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.buyerPhone) || ""}</p>
        <p><strong>GST No:</strong> ${(bill === null || bill === void 0 ? void 0 : bill.buyerGST) || ""}</p>
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
    .map((item) => `
        <tr>
          <td>${(item === null || item === void 0 ? void 0 : item.product_name) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.product_code) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.manufacture_date) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.expiry_date) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.quantity) || 0}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.rate) || 0}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.gstRate) || 0}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.gstAmount) || 0}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.discount) || 0}</td>
        </tr>
        `)
    .join("")}
      </tbody>
    </table>

    <div class="gst-summary">
      <p class="total"><strong>Order Amount:</strong> ₹ ${(bill === null || bill === void 0 ? void 0 : bill.order_amount) || 0}</p>
      <p class="total"><strong>Discount Amount:</strong> ₹ ${(bill === null || bill === void 0 ? void 0 : bill.discount_amount) || 0}</p>
      <p class="total"><strong>Tax Amount:</strong> ₹ ${(bill === null || bill === void 0 ? void 0 : bill.tax_amount) || 0}</p>
      <p class="total">
        <strong>${isReturnBill ? "Refund Amount" : "Billing Amount"}:</strong> ₹ ${(bill === null || bill === void 0 ? void 0 : bill.billing_amount) || 0}
      </p>
    </div>

    <div class="bank-details">
      <div class="bank-info">
        <p><strong>Bank Details:</strong></p>
        <p><strong>Bank:</strong>${bill.sellerBankDetails.bankName || ""}</p>
        <p><strong>Account No:</strong>${bill.sellerBankDetails.accountNumber || ""}</p>
        <p><strong>IFSC:</strong>${bill.sellerBankDetails.ifscCode || ""}</p>
        <p><strong>Branch:</strong>${bill.sellerBankDetails.branchName || ""}</p>
      </div>
      <div class="qr-code">
        <p><strong>Pay using UPI:</strong></p>
        <img src=${isForMail
    ? "cid:QrCode"
    : "data:" +
        getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig
            .company_details.qr_code_path).mimeType +
        ";base64," +
        getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig
            .company_details.qr_code_path).b64Data} alt="QR Code" style="max-width: 130px;"/>
      </div>
    </div>

    <div class="terms-conditions">
      <h3>Terms and Conditions:</h3>
      <ul>
        ${isReturnBill
    ? "<li>Refunds will be processed within 7 business days.</li>"
    : ""}
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
export const generateLedgerPdfCodeHtml = (userDoc, ledgerStaticData, isForMail = true) => {
    var _a;
    return `
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
      margin: 5px; /* Add some space between elements */
    }
    .company p {
      margin: 5px; /* Add some space between elements */
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
    .total{
    margin: 10px;
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
  <title>Statement</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src=${isForMail
        ? "cid:companylogo"
        : "data:" +
            getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                .primary_logo_path).mimeType +
            ";base64," +
            getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                .primary_logo_path).b64Data} alt="Company Logo" />
      <h1>Statement</h1>
    </div>

    <div class="details">
      <div class="company"> 
      </div>
      <div class="buyer">
        <p><strong>Customer Details:</strong></p>
        <p><strong>Name:</strong> ${(userDoc === null || userDoc === void 0 ? void 0 : userDoc.agro_name) || ""}</p>
        <p><strong>Email:</strong> ${(userDoc === null || userDoc === void 0 ? void 0 : userDoc.email) || ""}</p>
        <p><strong>Phone:</strong> ${(userDoc === null || userDoc === void 0 ? void 0 : userDoc.contact_number) || ""}</p>
        <p><strong>GST No:</strong> ${(userDoc === null || userDoc === void 0 ? void 0 : userDoc.gst_number) || ""}</p>
      </div>
    </div>

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Amount</th>
      <th>Type</th>
      <th>Invoice No</th>
    </tr>
      </thead>
        <tbody>
          ${(_a = ledgerStaticData === null || ledgerStaticData === void 0 ? void 0 : ledgerStaticData.groupedData) === null || _a === void 0 ? void 0 : _a.map((group) => {
        var _a, _b;
        return `
              ${(_a = group === null || group === void 0 ? void 0 : group.ledgers) === null || _a === void 0 ? void 0 : _a.map((ledger) => `
                <tr>
                  <td>
                    ${(ledger === null || ledger === void 0 ? void 0 : ledger.createdAt)
            ? new Date(ledger.createdAt).toLocaleDateString("en-GB")
            : new Date().toLocaleDateString("en-GB")}
                  </td>
                  <td>${(ledger === null || ledger === void 0 ? void 0 : ledger.payment_amount) || 0}</td>
                  <td>${(ledger === null || ledger === void 0 ? void 0 : ledger.type) || "N/A"}</td>
                  <td>${(ledger === null || ledger === void 0 ? void 0 : ledger.invoice_id) || "N/A"}</td>
                </tr>
              `).join("")}
              ${(_b = group === null || group === void 0 ? void 0 : group.credits) === null || _b === void 0 ? void 0 : _b.map((credit) => `
                <tr>
                  <td>
                    ${(credit === null || credit === void 0 ? void 0 : credit.createdAt)
            ? new Date(credit.createdAt).toLocaleDateString("en-GB")
            : new Date().toLocaleDateString("en-GB")}
                  </td>
                  <td>${(credit === null || credit === void 0 ? void 0 : credit.amount) || 0}</td>
                  <td>Payment</td>
                  <td>-</td>
                </tr>
              `).join("")}
            `;
    }).join("")}
        </tbody>
      </table>

    <div class="gst-summary">
      <p class="total"><strong>Total Money Added:</strong> ₹ ${(ledgerStaticData === null || ledgerStaticData === void 0 ? void 0 : ledgerStaticData.totalMoneyAdded) || 0}</p>
      <p class="total"><strong>Total Credit Entry Amount:</strong> ₹ ${(ledgerStaticData === null || ledgerStaticData === void 0 ? void 0 : ledgerStaticData.totalCredit) || 0}</p>
      <p class="total"><strong>Total Debit Entry Amount:</strong> ₹ ${(ledgerStaticData === null || ledgerStaticData === void 0 ? void 0 : ledgerStaticData.totalDebit) || 0}</p>
      <p class="total">
        <strong>Available Credit Limit:</strong> ₹ ${(ledgerStaticData === null || ledgerStaticData === void 0 ? void 0 : ledgerStaticData.availableCreditLimit) || 0}
      </p>
    </div>

  </div>
</body>
</html>
`;
};
const formatAddress = (address) => {
    const { address_line, city, state, pincode } = address;
    // Create an array of available values
    const parts = [];
    if (address_line)
        parts.push(address_line);
    if (city)
        parts.push(city);
    if (state)
        parts.push(state);
    if (pincode)
        parts.push(pincode);
    // Join the parts with a comma and return
    return parts.length > 0 ? parts.join(", ") : "";
};
const formatDate = (date) => {
    if (!date)
        return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};
// export const generatePurchaseOrderCodeHtml = (
//   purchaseOrder: typePurchaseOrder,
//   vendor: typeVendor,
//   admin: typeUser,
//   modifiedProducts: {
//     product_id: mongoose.Types.ObjectId;
//     quantity: number;
//     offer_discount: number;
//     total_amount: number;
//     gst_rate: number;
//     purchase_price: number;
//     gst_amount: number;
//     manufacture_date: string;
//     expiry_date: string;
//     lot_no: string;
//     product_name: string;
//     product_code: string;
//   }[]
// ) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style>
//     /* Base styles */
//     body {
//       font-family: Arial, sans-serif;
//       margin: 0;
//       padding: 0;
//       color: #333;
//     }
//     .container {
//       padding: 20px;
//     }
//     /* Header styles */
//     .header {
//       display: table;
//       width: 100%;
//       margin-bottom: 20px;
//     }
//     .header img {
//       max-width: 150px; /* Adjust logo size */
//       vertical-align: middle;
//     }
//     .header h1 {
//       display: table-cell;
//       vertical-align: middle;
//       text-align: right;
//       margin: 0;
//       font-size: 24px;
//     }
//     /* Details section styles */
//     .details {
//       display: table;
//       width: 100%;
//       margin-bottom: 20px;
//     }
//     .details .company,
//     .details .buyer {
//       display: table-cell;
//       width: 50%; /* Adjust width for even distribution */
//       vertical-align: top;
//     }
//     .details p {
//       margin: 5px; /* Add some space between elements */
//     }
//     .company p {
//       margin: 5px; /* Add some space between elements */
//     }
//     /* Table styles */
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 20px;
//     }
//     th, td {
//       padding: 10px;
//       border: 1px solid #ddd;
//       text-align: left;
//     }
//     th {
//       font-weight: bold;
//     }
//     /* Summary and Bank Details styles */
//     .total,
//     .gst-summary {
//       text-align: right;
//       font-size: 18px;
//       font-weight: bold;
//       margin-bottom: 10px;
//     }
//     .total{
//     margin: 10px;
//     }
//     .bank-details {
//       display: table;
//       width: 100%;
//       margin-top: 20px;
//     }
//     .bank-details .bank-info,
//     .bank-details .qr-code {
//       display: table-cell;
//       width: 50%;
//       vertical-align: top;
//     }
//     .bank-details .qr-code {
//       text-align: right;
//     }
//     /* Signature and Page Break styles */
//     .signature {
//       text-align: right;
//       margin-top: 40px;
//     }
//     .page-break {
//       page-break-before: always;
//     }
//     /* Return bill notice */
//     .return-notice {
//       background-color: #f8d7da;
//       color: #721c24;
//       padding: 10px;
//       margin-bottom: 20px;
//       border: 1px solid #f5c6cb;
//     }
//   </style>
//   <title>Purchase Order Tax Invoice</title>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <img src=${
//         "data:" +
//         getLocalImageB64(
//           masterConfig.nodemailerConfig.emailTemplateConfig.company_details
//             .primary_logo_path
//         ).mimeType +
//         ";base64," +
//         getLocalImageB64(
//           masterConfig.nodemailerConfig.emailTemplateConfig.company_details
//             .primary_logo_path
//         ).b64Data
//       } alt="Company Logo" />
//       <h1>Purchase Order Tax Invoice</h1>
//     </div>
//     <!-- Add Invoice Number -->
//     <p><strong>Invoice No:</strong> ${purchaseOrder?.invoice_no || ""}</p>
//     <div class="details">
//       <div class="company">
//         <p><strong>Seller Details:</strong></p>
//         <p><strong>Name:</strong> ${vendor?.agro_name || ""}</p>
//         <p><strong>Address:</strong> ${formatAddress(vendor?.address) || ""}</p>
//         <p><strong>Email:</strong> ${vendor?.email || ""}</p>
//         <p><strong>Phone:</strong> ${vendor?.contact_number || ""}</p>
//         <p><strong>GST No:</strong> ${vendor?.gst_number || ""}</p>
//       </div>
//       <div class="buyer">
//         <p><strong>Buyer Details:</strong></p>
//         <p><strong>Name:</strong> ${admin?.agro_name || ""}</p>
//         <p><strong>Address:</strong> ${
//           formatAddress(admin?.billing_address) || ""
//         }</p>
//         <p><strong>Email:</strong> ${admin?.email || ""}</p>
//         <p><strong>Phone:</strong> ${admin?.contact_number || ""}</p>
//         <p><strong>GST No:</strong> ${admin?.gst_number || ""}</p>
//       </div>
//     </div>
//     <table>
//       <thead>
//         <tr>
//             <th>Item Name</th>
//             <th>Product Code</th>
//             <th>Man. Date</th>
//             <th>Exe. Date</th>
//             <th>Quantity</th>
//             <th>Rate</th>
//             <th>GST Rate</th>
//             <th>GST Amount</th>
//             <th>Discount</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${modifiedProducts
//           // product_id: Types.ObjectId;
//           // quantity: number;
//           // offer_discount: number;
//           // total_amount: number;
//           // gst_rate: number;
//           // purchase_price: number;
//           // gst_amount: number;
//           // manufacture_date: Date;
//           // expiry_date: Date;
//           // lot_no: string;
//           .map(
//             (item) => `
//         <tr>
//           <td>${item?.product_name || ""}</td>
//           <td>${item?.product_code || ""}</td>
//           <td>${item?.manufacture_date || ""}</td>
//           <td>${item?.expiry_date || ""}</td>
//           <td>${item?.quantity || ""}</td>
//           <td>${item?.purchase_price || ""}</td>
//           <td>${item?.gst_rate || ""}</td>
//           <td>${item?.gst_amount || ""}</td>
//           <td>${item?.offer_discount || ""}</td>
//         </tr>
//         `
//           )
//           .join("")}
//       </tbody>
//     </table>
//     <div class="gst-summary">
//        <p class="total"><strong>Advance Payment:</strong> ₹ ${
//          purchaseOrder?.advance_payment_amount || "0"
//        }</p>
//       <p class="total"><strong>Order Amount:</strong> ₹ ${
//         purchaseOrder?.order_amount || "0"
//       }</p>
//       <p class="total"><strong>Discount Amount:</strong> ₹ ${
//         purchaseOrder?.discount_amount || "0"
//       }</p>
//       <p class="total"><strong>Tax Amount:</strong> ₹ ${
//         purchaseOrder?.tax_amount || "0"
//       }</p>
//       <p class="total">
//         <strong>Billing Amount:</strong> ₹ ${
//           purchaseOrder?.billing_amount || "0"
//         }
//       </p>
//        <p class="total">
//         <strong>Final Amount:</strong> ₹ ${
//           purchaseOrder?.billing_amount -
//             purchaseOrder?.advance_payment_amount || "0"
//         }
//       </p>
//     </div>
//     <div class="bank-details">
//       <div class="bank-info">
//         <p><strong>Bank Details:</strong></p>
//         <p><strong>Bank:</strong>${vendor.bank_details.bankName || ""}</p>
//         <p><strong>Account No:</strong>${
//           vendor.bank_details.accountNumber || ""
//         }</p>
//         <p><strong>IFSC:</strong>${vendor.bank_details.ifscCode || ""}</p>
//         <p><strong>Branch:</strong>${vendor.bank_details.branchName || ""}</p>
//       </div>
//       <div class="qr-code">
//       </div>
//     </div>
//   </div>
// </body>
// </html>
// `;
export const generatePurchaseOrderCodeHtml = (purchaseOrder, vendor, admin, modifiedProducts) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header img {
      max-width: 150px;
    }
    .header h1 {
      font-size: 24px;
      text-align: right;
    }

    .details {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .details div {
      width: 48%;
    }

    .details p {
      margin: 5px 0;
    }

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

    .terms {
      margin-top: 20px;
    }

    .footer {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .signature {
      text-align: right;
    }
  </style>
  <title>Purchase Order</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src=${"data:" +
    getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig.company_details
        .primary_logo_path).mimeType +
    ";base64," +
    getLocalImageB64(masterConfig.nodemailerConfig.emailTemplateConfig.company_details
        .primary_logo_path).b64Data} alt="Company Logo" />
      <h1>Purchase Order</h1>
    </div>

      <div>
      <h3 style="margin:8px 0px;text-align:center;">${(admin === null || admin === void 0 ? void 0 : admin.agro_name) || ""}</h3>
        <p style="margin:8px 0px;text-align:center;margin-top:0px;">${formatAddress(admin === null || admin === void 0 ? void 0 : admin.billing_address) || ""}</p>
        <p style="margin:8px 0px;text-align:center;margin-top:0px;">Phone: ${(admin === null || admin === void 0 ? void 0 : admin.contact_number) || ""}</p>
      </div>


    <div class="details">
      <div>
        <p><strong>Vendor Details:</strong></p>
        <p>Name: ${(vendor === null || vendor === void 0 ? void 0 : vendor.agro_name) || ""}</p>
        <p>Address: ${formatAddress(vendor === null || vendor === void 0 ? void 0 : vendor.address) || ""}</p>
        <p>Phone No.: ${(vendor === null || vendor === void 0 ? void 0 : vendor.contact_number) || ""}</p>
        <p>GST Number : ${(vendor === null || vendor === void 0 ? void 0 : vendor.gst_number) || ""}</p>
        <p>PAN: ${(vendor === null || vendor === void 0 ? void 0 : vendor.pan_number) || ""}</p>
      </div>
      <div>
        <p><strong>Purchase Order Details:</strong></p>
        <p>PO No: ${(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.invoice_no) || ""}</p>
        <p>PO Date: ${formatDate(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchase_date) || ""}</p>
        <p>Contact Person Name: ${(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.contact_name) || ""}</p>
        <p>Contact Person Phone : ${(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.contact_number) || ""}</p>
        <p>Bill To: ${formatAddress(admin === null || admin === void 0 ? void 0 : admin.billing_address) || ""}</p>
        <p>Ship To: ${formatAddress(admin === null || admin === void 0 ? void 0 : admin.shipping_address) ||
    formatAddress(admin === null || admin === void 0 ? void 0 : admin.billing_address) ||
    "-"}</p>
      </div>
    </div>

      <div>
        <p style="margin:8px 0px;">Dear Sir/Madam,</p>
        <p style="margin:8px 0px;margin-top:0px;">We are pleased to award this order for supplying following items as per terms and conditions mentioned below:</p>
      </div>

    <table>
      <thead>
        <tr>
          <th>Product Code</th>
          <th>Product Name</th>
          <th>Delivery Date</th>
          <th>Quantity</th>
          <th>UoM</th>
          <th>Quantity (in Kg/Ltr)</th>
        </tr>
      </thead>
      <tbody>
        ${modifiedProducts
    .map((item) => `
        <tr>
          <td>${(item === null || item === void 0 ? void 0 : item.product_code) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.product_name) || ""}</td>
          <td>${formatDate(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchase_date) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.quantity) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.uom) || ""}</td>
          <td>${(item === null || item === void 0 ? void 0 : item.final_quantity) || ""}</td>
        </tr>
        `)
    .join("")}
      </tbody>
    </table>

    <div class="terms">
      <p><strong>Other Terms & Conditions:</strong></p>
      <p style="margin-top:0px;">1) The PO should be valid for the next 4 days from the creation date of PO.</p>
      <p style="margin-top:0px;">2) Any consignment, damaged during the transportation or failing quality checks, will be returned to the supplier.</p>
    </div>

    <div class="footer">
      <p class="signature">Authorized Signatory</p>
    </div>
  </div>
</body>
</html>
`;
//# sourceMappingURL=mail.helpers.js.map