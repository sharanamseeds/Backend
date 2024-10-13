import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = "/home/milan";

const domain = "https://sharanamagritech.com";

export const masterConfig = {
  server_type: "production",
  server_base_url: `${domain}:8080/`,
  authConfig: {
    ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
    REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
    VerificationCodeExpires: 90,
  },
  mongodbConfig: {
    url: "mongodb://admin:%24ecureP4sssw0rd%232024@82.112.238.3:27017/?tls=false",
  },
  superAdminConfig: {
    email: "sharanamseeds@gmail.com",
    password: "Admin@1234",
    name: "Khetiwala",
    contact_number: "9537712126",
    agro_name: "Khetiwala",
  },
  defaultDataConfig: {
    defaultModules: [
      "Role",
      "Dashboard",
      "User",
      "Brand",
      "Category",
      "Product",
      "Order",
      "Bill",
      "Offer",
      "Permissions",
      "Language",
      "Ledger",
      "App Banner",
      "Purchase Order",
      "Vendors",
    ],
    languageConfig: {
      lang_name: "English",
      lang_code: "en",
    },
    defaultLanguages: [
      {
        lang_name: "English",
        lang_code: "en",
      },
      {
        lang_name: "Gujarati",
        lang_code: "gu",
      },
      {
        lang_name: "Hindi",
        lang_code: "hi",
      },
    ],
  },
  nodemailerConfig: {
    mailConfig: {
      email: "sharanamseeds@gmail.com",
      password: "vfqi qcsg uwhw dzcc",
      name: "Khetiwala",
    },
    emailTemplateConfig: {
      email_template_info: {
        admin_web_app_link: `${domain}/authentication/login`,
        mobile_app_link: `${domain}/authentication/login`,
        app_store_link: `${domain}/authentication/login`,
      },
      company_details: {
        company_name: "Khetiwala",
        company_slogan: "Vedic Wisdom for Modern Farming",
        qr_code_path: "default_images/qr-code.png",
        primary_logo_path: "default_images/1.png",
        secondary_logo_path: "default_images/1.png",
        signature: "default_images/signature.png",
      },
    },
  },
  fileStystem: {
    folderPaths: {
      BASE_FOLDER: "uploads/",
      DEFAULT_FOLDER: "default_images/",
      PURCHSE_ORDER: "purchse_orders/",
      DOCUMENTS: "documents/",
      USER: "users/",
      PRODUCTS: "products/",
      LOGO: "logo/",
      IMAGES: "images/",
      BRANDS: "brands/",
      BILLS: "bills/",
      OFFERS: "offers/",
      CATEGORY: "category/",
      COMPANY: "company/",
      NOTIFICATON: "notification/",
      TEMP: "temp/",
      APP_BANNERS: "banners/",
    },
    fileTypes: {
      IMAGE: "jpeg|jpg|png|gif",
      PDF: "pdf",
      DOCUMENT: "doc|docx|ppt|pptx|xls|xlsx",
      VIDEO: "mp4|avi|mov|wmv",
      AUDIO: "mp3|wav|ogg",
      TEXT: "txt|md|json|xml",
      ARCHIVE: "zip|rar|tar|gz",
      CSV: "csv",
    },
  },
  billingConfig: {
    invoicePrefix: "AGV",
    poInvoicePrefix: "PO",
    invoiceFormat: "PREFIX-0001-MMYYYY",
  },
  ownerCompanyDetails: {
    brand_name: "Khetiwala",
    legal_name: "Khetiwala Private Limited",
    slogan: "Vedic Wisdom for Modern Farming",
    industry: ["Agriculture"],
    description: "",
    website: "khetiwala.com",
    type: "B2B",
    logo: {
      primary: "",
      secondary: "",
      QR_code: "",
    },
    contact_information: {
      address_line: "Mendarda",
      city: "Mendarda",
      state: "Gujarat",
      pincode: "362260",
      type: "Point",
      coordinates: [70.4417, 21.3206],
    },
    billing_information: {
      gst_number: "24DCUPP7026Q1ZM",
      business_model: "manufacturer",
    },
  },
  super_admin_bank_details: {
    bankName: "Axis Bank",
    accountNumber: "923020023452363",
    ifscCode: "UTIB0004734",
    branchName: "MENDARDA",
  },
};

// https://myaccount.google.com/apppasswords
// New MongoDB Details:
// Host IP: 82.112.238.3
// Username: admin
// Password: $ecureP4ssw0rd#2024
// URL: mongodb://admin:%24ecureP4sssw0rd%232024@82.112.238.3:27017/?tls=false
