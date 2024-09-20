import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, "../..");

export const masterConfig = {
  server_type: "production",
  server_base_url: "https://sharanamagritech.com:8080/",
  authConfig: {
    ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
    REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
    VerificationCodeExpires: 180,
  },
  mongodbConfig: {
    url: "mongodb+srv://mvkotadiya50:ZRMSSg0DcSZoDEmg@cluster0.5pdns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    // url: "mongodb://admin:$ecureP4ssw0rd%402024@45.113.106.134:27017/",
    // url: "mongodb://localhost:27017/",
  },
  superAdminConfig: {
    email: "milank7376@gmail.com",
    password: "Admin@1234",
    name: "Super Admin",
    contact_number: "9537712126",
    agro_name: "Agro Name",
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
      "Company",
      "Language",
      "Ledger",
      "App Banner",
    ],
    languageConfig: {
      lang_name: "English",
      lang_code: "en",
    },
  },
  nodemailerConfig: {
    mailConfig: {
      email: "milank7376@gmail.com",
      password: "libl debu zpib ypqu",
      name: "Milan Kotadiya",
    },
    emailTemplateConfig: {
      email_template_info: {
        admin_web_app_link: "https://sharanamagritech.com/authentication/login",
        mobile_app_link: "https://sharanamagritech.com/authentication/login",
        app_store_link: "https://sharanamagritech.com/authentication/login",
      },
      company_details: {
        company_name: "Agroveda",
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
    invoiceFormat: "PREFIX-0001-MMYYYY",
  },
  ownerCompanyDetails: {
    brand_name: "Agroveda",
    legal_name: "Agroveda Private Limited",
    slogan: "Vedic Wisdom for Modern Farming",
    industry: ["Agriculture"],
    description: "",
    website: "www.agroveda.com",
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
      gst_number: "24A****0621H1ZW",
      business_model: "manufacturer",
    },
  },
  super_admin_bank_details: {
    bankName: "Yes Bank",
    accountNumber: "6789999222445",
    ifscCode: "YESBINB4467",
    branchName: "Somajiguda",
  },
};

// https://myaccount.google.com/apppasswords
