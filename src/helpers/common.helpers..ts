import Role from "../models/roles.model.js";
import User from "../models/users.model.js";
import { generatePassword } from "./auth.helpers.js";
import Languages from "../models/languages.model.js";
import Modules from "../models/modules.model.js";
import mongoose from "mongoose";
import Permissions from "../models/permission.model.js";
import {
  buildAccountCreatedHtml,
  buildWelcomeHtml,
  generateVerificationCodeHtml,
  sendMail,
} from "./mail.helpers.js";
import { masterConfig, rootDir } from "../config/master.config.js";
import Company from "../models/company.model.js";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createDocument } from "./files.management.js";
import mime from "mime";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendUserAccountCreatedMail = async (
  userEmail: string,
  contact: string
) => {
  await sendMail({
    email: userEmail,
    subject: `Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}`,
    html: buildAccountCreatedHtml(userEmail, contact),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(
          rootDir,
          masterConfig.nodemailerConfig.emailTemplateConfig.company_details
            .primary_logo_path
        ),
        cid: "companylogo", // same as the cid value in the html img src
      },
    ],
  });
};

export const sendUserOTPMail = async (email: string, code: string) => {
  await sendMail({
    email: email,
    subject: `Account Verification From ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}`,
    html: generateVerificationCodeHtml(
      code,
      masterConfig.authConfig.VerificationCodeExpires
    ),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(
          rootDir,
          masterConfig.nodemailerConfig.emailTemplateConfig.company_details
            .primary_logo_path
        ),
        cid: "companylogo", // same as the cid value in the html img src
      },
    ],
  });
};

export const sendUserAccountVerifiedMail = async (
  userEmail: string,
  contact: string
) => {
  await sendMail({
    email: userEmail,
    subject: `Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}`,
    html: buildWelcomeHtml(userEmail, contact),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(
          rootDir,
          masterConfig.nodemailerConfig.emailTemplateConfig.company_details
            .primary_logo_path
        ),
        cid: "companylogo", // same as the cid value in the html img src
      },
    ],
  });
};

const createModule = async (moduleIndex: number, module: string) => {
  try {
    const code = module.toLowerCase(); //.replace(/\s+/g, "_");
    let moduleDoc = await Modules.findOne({ code });

    if (!moduleDoc) {
      const moduleCreate = new Modules({
        icon: makeIdentifier(module),
        name: module,
        code: code,
        route: `/${makeIdentifier(module)}`,
        active_on: [`/${makeIdentifier(module)}`],
        childrens: [],
        parent_id: null,
        isForAdmin: true,
        isForUser: false,
        sort_order: moduleIndex + 1,
        is_default: true,
      });
      const moduleDoc = await moduleCreate.save();
      return moduleDoc;
    }
    return moduleDoc;
  } catch (error) {
    console.log(error?.message);
    global.logger.error(`Error creating module: ${module}`, error);
  }
};

const createModules = async () => {
  try {
    const modulePromises = masterConfig.defaultDataConfig.defaultModules.map(
      (module, moduleIndex) => createModule(moduleIndex, module)
    );
    await Promise.all(modulePromises);
    global.logger.info("All modules created successfully");
  } catch (error) {
    global.logger.error(`Error creating all modules`, error);
  }
};

const createSuperAdminPermissions = async (roleId: mongoose.Types.ObjectId) => {
  try {
    for (const [
      moduleIndex,
      module,
    ] of masterConfig.defaultDataConfig.defaultModules.entries()) {
      const moduleDoc = await createModule(moduleIndex, module);
      if (moduleDoc) {
        const permissionExists = await Permissions.findOne({
          role: roleId,
          module: moduleDoc._id,
        });

        if (!permissionExists) {
          const permissionCreate = new Permissions({
            role: new mongoose.Types.ObjectId(roleId),
            module: new mongoose.Types.ObjectId(moduleDoc._id),
            can_read: true,
            can_select: true,
            can_add: true,
            can_update: true,
            can_delete: true,
            can_upload: true,
            can_download: true,
          });

          await permissionCreate.save();
          // global.logger.info(
          //   `PERMISSION: MODULE =>${module}, USER ${userId} Created ✔`
          // );
        } else {
          // global.logger.info(
          //   `PERMISSION: MODULE =>${module}, USER ${userId} Existed ✔`
          // );
        }
      } else {
        global.logger.error(
          `Error creating super admin permissions: ${module} not found`
        );
      }
    }
  } catch (error) {
    global.logger.error("Error creating super admin permissions:", error);
  }
};

const createSuperAdminRole = async () => {
  try {
    const superAdminRoleDoc = await Role.findOne({
      identifier: makeIdentifier("Super Admin"),
    });
    if (!superAdminRoleDoc) {
      const superAdminRole = new Role({
        role_name: "Super Admin",
        identifier: makeIdentifier("Super Admin"),
        is_active: true,
      });
      await superAdminRole.save();
      // global.logger.info("ROLE: Super Admin Created ✔");
      return superAdminRole;
    } else {
      // global.logger.info("ROLE: Super Admin Exists ✔");
      return superAdminRoleDoc;
    }
  } catch (error) {
    global.logger.error("Error creating super admin role", error);
  }
};

const createSuperAdmin = async (roleId: any) => {
  try {
    const isExisted = await User.findOne({ role_id: roleId });
    if (!isExisted) {
      const { hash, salt } = generatePassword(
        masterConfig.superAdminConfig.password
      );
      const userData = {
        role_id: roleId,
        name: masterConfig.superAdminConfig.name,
        agro_name: masterConfig.superAdminConfig.agro_name,
        email: masterConfig.superAdminConfig.email,
        hash,
        salt,
        is_verified: true,
        contact_number: masterConfig.superAdminConfig.contact_number,
        gst_number:
          masterConfig.ownerCompanyDetails.billing_information.gst_number,
        billing_address: {
          address_line:
            masterConfig.ownerCompanyDetails.contact_information.address_line,
          city: masterConfig.ownerCompanyDetails.contact_information.city,
          state: masterConfig.ownerCompanyDetails.contact_information.state,
          pincode: masterConfig.ownerCompanyDetails.contact_information.pincode,
          coordinates:
            masterConfig.ownerCompanyDetails.contact_information.coordinates,
        },
      };

      const superAdmin = new User(userData);
      await superAdmin.save();
      // global.logger.info("USER: Super Admin Created ✔");
      // send email
      if (superAdmin.is_verified) {
        sendUserAccountVerifiedMail(
          superAdmin.email,
          superAdmin.contact_number
        );
      } else {
        sendUserAccountCreatedMail(superAdmin.email, superAdmin.contact_number);
      }
      return superAdmin;
    } else {
      // global.logger.info("USER: Super Admin Exists ✔");
      return isExisted;
    }
  } catch (error) {
    global.logger.error("Error creating super admin", error);
  }
};

const createDefaultLanguage = async (lang_name: string, lang_code: string) => {
  const englishLanguageDoc = await Languages.findOne({
    lang_code: lang_code,
  });
  if (!englishLanguageDoc) {
    const languageData = {
      lang_name: lang_name,
      lang_code: lang_code,
      identifier: makeIdentifier(lang_name),
    };
    const englishDoc = new Languages(languageData);
    await englishDoc.save();
    // global.logger.info(`LANGUAGE: ${lang_name} Created ✔`);
  } else {
    // global.logger.info(`LANGUAGE: ${lang_name} Exists ✔`);
  }
};

const getDefaultImagePath = (imageName) => {
  // Adjust the path to your default images directory
  return path.join(__dirname + "../../../", "default_images", imageName);
};

const convertToMulterFile = (fileDocument: {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}) => {
  function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Indicate end of the stream
    return stream;
  }

  // Create a mock object resembling an Express.Multer.File
  const multerFile = {
    fieldname: "file",
    originalname: fileDocument.originalname,
    encoding: "7bit", // Default encoding used by Multer
    mimetype: fileDocument.mimetype,
    buffer: fileDocument.buffer,
    size: fileDocument.size,
    stream: bufferToStream(fileDocument.buffer),
    destination: "", // Required if using diskStorage; empty if in-memory
    filename: "", // Required if using diskStorage; empty if in-memory
    path: "", // Required if using diskStorage; empty if in-memory
  };

  return multerFile;
};

const createSuperAdminCompany = async (adminId) => {
  try {
    let companyDoc = await Company.findOne({ owner_id: adminId });
    if (!companyDoc) {
      const companyId = new mongoose.Types.ObjectId();
      let logoDetails = {
        primary: "",
        secondary: "",
        QR_code: "",
      };

      const defaultImages = [
        { name: "2.png", type: "primary", folder: "PRIMARY/" },
        { name: "1.png", type: "secondary", folder: "SECONDARY/" },
        { name: "qr-code.png", type: "QR_code", folder: "QR_CODE/" },
      ];

      for (const image of defaultImages) {
        const imagePath = getDefaultImagePath(image.name);

        if (fs.existsSync(imagePath)) {
          const fileData = fs.readFileSync(imagePath);
          const stats = fs.statSync(imagePath);
          const fileDocument = {
            buffer: fileData,
            originalname: image.name,
            mimetype: mime.lookup(imagePath) || "application/octet-stream",
            size: stats.size,
          };
          const multerFile = convertToMulterFile(fileDocument);
          const savedFile = await createDocument({
            document: multerFile,
            documentType: masterConfig.fileStystem.fileTypes.IMAGE, // Adjust based on your masterConfig
            documentPath:
              masterConfig.fileStystem.folderPaths.COMPANY +
              companyId.toString() +
              "/" +
              masterConfig.fileStystem.folderPaths.LOGO +
              image.folder,
          });

          if (savedFile) {
            // Assuming logoDetails is defined somewhere
            logoDetails[`${image.type}`] = savedFile.path;
          }
        } else {
          console.error(`Image file not found: ${imagePath}`);
        }
      }

      let baseCompanyData = masterConfig.ownerCompanyDetails;
      baseCompanyData.logo = logoDetails;
      const company = new Company({
        _id: companyId,
        ...baseCompanyData,
        owner_id: adminId,
        added_by: adminId,
        updated_by: adminId,
      });

      await company.save();
    }
  } catch (error) {
    global.logger.error("Error creating super admin company", error);
  }
};

export const createDefaultDatabase = async () => {
  try {
    // create default modules
    await createModules();
    // create default language
    const languages = masterConfig.defaultDataConfig.defaultLanguages;
    languages.forEach(async (language) => {
      await createDefaultLanguage(language.lang_name, language.lang_code);
    });
    // create super_admin_role
    const superAdminRole = await createSuperAdminRole();
    // create super_admin_user
    const superAdmin = await createSuperAdmin(superAdminRole._id);
    // give super_admin_permission
    if (superAdmin.role_id) {
      await createSuperAdminPermissions(superAdmin.role_id);
    }
    if (superAdmin._id) {
      await createSuperAdminCompany(superAdmin._id);
    }
  } catch (error) {
    global.logger.error("Error creating default database:", error);
  }
};

export const makeIdentifier = (word: string) => {
  return word.toLowerCase().replace(/\s+/g, "_");
};

export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// cron
// const cron = require('node-cron');
// const backupService = require('../services/admin/db_backup.service')

// // Schedule daily backup at 2 AM
// cron.schedule('0 2 * * *', async () => {
//   console.log('Starting daily backup...');
//   await backupService.addBackup()
// });

// clear
// export const clear = async () => {
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.drop();
//   }
// };

// pupetter create pdf
// Launch Puppeteer and generate the PDF
// const browser = await puppeteer.launch({
//   headless: true,
//   args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   timeout: 600000,
// });
// const page = await browser.newPage();
// await page.setContent(htmlTemplate, { waitUntil: "load" });

// const pdfBuffer = await page.pdf({
//   format: "A4",
//   landscape: true,
//   printBackground: true,
//   displayHeaderFooter: true,
//   headerTemplate: headerTemplate,
//   footerTemplate: footerTemplate,
//   margin: {
//     top: "300px",
//     bottom: "90px",
//     left: "12px",
//   },
// });

// // Set the response headers to indicate a PDF file
// res.set({
//   "Content-Type": "application/pdf",
//   "Content-Disposition": attachment; filename=shipment_${shipmentId}.pdf,
//   "Content-Length": pdfBuffer.length,
// });

// await browser.close();
// // Send the PDF file as a response
// res.end(pdfBuffer);

// download pdf
// const downloadShipmentPdf = async (id) => {
//   try {
//     const response = await axios.get(DOWNLOAD_PDF_SHIPMENT_ID + id, {
//       responseType: 'blob' // Important for downloading files
//     })

//     // Create a new Blob object using the response data
//     const blob = new Blob([response.data], { type: 'application/pdf' })

//     // Create a link element
//     const link = document.createElement('a')

//     // Create a URL for the blob and set it as the href
//     const url = window.URL.createObjectURL(blob)
//     link.href = url

//     // Set the download attribute with the desired file name
//     link.download = shipment_${id}.pdf

//     // Append the link to the document
//     document.body.appendChild(link)

//     // Programmatically click the link to trigger the download
//     link.click()

//     // Remove the link from the document
//     link.parentNode.removeChild(link)

//     // Release the object URL to free up memory
//     window.URL.revokeObjectURL(url)
//   } catch (error) {
//     toast.error(error?.message)
//   }
// }

// onerror load image
//          <img
//           className={classnames({
//             [imgClassName]: imgClassName
//           })}
//           src={img}
//           alt="avatar"
//           onError={(e) => {
//             e.target.onerror = null
//             e.target.src =
//               require('../../../assets/images/avatars/avatar-blank.png').default
//           }}
//           height={imgHeight && !size ? imgHeight : 32}
//           width={imgWidth && !size ? imgWidth : 32}
//         />
