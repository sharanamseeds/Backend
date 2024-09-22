var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Role from "../models/roles.model.js";
import User from "../models/users.model.js";
import { generatePassword } from "./auth.helpers.js";
import Languages from "../models/languages.model.js";
import Modules from "../models/modules.model.js";
import mongoose from "mongoose";
import Permissions from "../models/permission.model.js";
import { buildAccountCreatedHtml, buildWelcomeHtml, generateVerificationCodeHtml, sendMail, } from "./mail.helpers.js";
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
export const sendUserAccountCreatedMail = (userEmail, contact) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendMail({
        email: userEmail,
        subject: `Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}`,
        html: buildAccountCreatedHtml(userEmail, contact),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(rootDir, masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                    .primary_logo_path),
                cid: "companylogo", // same as the cid value in the html img src
            },
        ],
    });
});
export const sendUserOTPMail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendMail({
        email: email,
        subject: `Account Verification From ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}`,
        html: generateVerificationCodeHtml(code, masterConfig.authConfig.VerificationCodeExpires),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(rootDir, masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                    .primary_logo_path),
                cid: "companylogo", // same as the cid value in the html img src
            },
        ],
    });
});
export const sendUserAccountVerifiedMail = (userEmail, contact) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendMail({
        email: userEmail,
        subject: `Welcome to ${masterConfig.nodemailerConfig.emailTemplateConfig.company_details.company_name}`,
        html: buildWelcomeHtml(userEmail, contact),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(rootDir, masterConfig.nodemailerConfig.emailTemplateConfig.company_details
                    .primary_logo_path),
                cid: "companylogo", // same as the cid value in the html img src
            },
        ],
    });
});
const createModule = (moduleIndex, module) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = module.toLowerCase(); //.replace(/\s+/g, "_");
        let moduleDoc = yield Modules.findOne({ code });
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
            const moduleDoc = yield moduleCreate.save();
            // global.logger.info(`MODULE: ${module} Created ✔`);
            return moduleDoc;
        }
        else {
            // global.logger.info(`MODULE: ${module} Existed ✔`);
            return moduleDoc;
        }
    }
    catch (error) {
        global.logger.error(`Error creating module: ${module}`, error);
    }
});
const createModules = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const [moduleIndex, module,] of masterConfig.defaultDataConfig.defaultModules.entries()) {
            yield createModule(moduleIndex, module);
        }
    }
    catch (error) {
        global.logger.error(`Error at creating all modules`, error);
    }
});
const createSuperAdminPermissions = (roleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const [moduleIndex, module,] of masterConfig.defaultDataConfig.defaultModules.entries()) {
            const moduleDoc = yield createModule(moduleIndex, module);
            if (moduleDoc) {
                const permissionExists = yield Permissions.findOne({
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
                    yield permissionCreate.save();
                    // global.logger.info(
                    //   `PERMISSION: MODULE =>${module}, USER ${userId} Created ✔`
                    // );
                }
                else {
                    // global.logger.info(
                    //   `PERMISSION: MODULE =>${module}, USER ${userId} Existed ✔`
                    // );
                }
            }
            else {
                global.logger.error(`Error creating super admin permissions: ${module} not found`);
            }
        }
    }
    catch (error) {
        global.logger.error("Error creating super admin permissions:", error);
    }
});
const createSuperAdminRole = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superAdminRoleDoc = yield Role.findOne({
            identifier: makeIdentifier("Super Admin"),
        });
        if (!superAdminRoleDoc) {
            const superAdminRole = new Role({
                role_name: "Super Admin",
                identifier: makeIdentifier("Super Admin"),
                is_active: true,
            });
            yield superAdminRole.save();
            // global.logger.info("ROLE: Super Admin Created ✔");
            return superAdminRole;
        }
        else {
            // global.logger.info("ROLE: Super Admin Exists ✔");
            return superAdminRoleDoc;
        }
    }
    catch (error) {
        global.logger.error("Error creating super admin role", error);
    }
});
const createSuperAdmin = (roleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExisted = yield User.findOne({ role_id: roleId });
        if (!isExisted) {
            const { hash, salt } = generatePassword(masterConfig.superAdminConfig.password);
            const userData = {
                role_id: roleId,
                name: masterConfig.superAdminConfig.name,
                agro_name: masterConfig.superAdminConfig.agro_name,
                email: masterConfig.superAdminConfig.email,
                hash,
                salt,
                is_verified: true,
                contact_number: masterConfig.superAdminConfig.contact_number,
                gst_number: masterConfig.ownerCompanyDetails.billing_information.gst_number,
                billing_address: {
                    address_line: masterConfig.ownerCompanyDetails.contact_information.address_line,
                    city: masterConfig.ownerCompanyDetails.contact_information.city,
                    state: masterConfig.ownerCompanyDetails.contact_information.state,
                    pincode: masterConfig.ownerCompanyDetails.contact_information.pincode,
                    coordinates: masterConfig.ownerCompanyDetails.contact_information.coordinates,
                },
            };
            const superAdmin = new User(userData);
            yield superAdmin.save();
            // global.logger.info("USER: Super Admin Created ✔");
            // send email
            if (superAdmin.is_verified) {
                sendUserAccountVerifiedMail(superAdmin.email, superAdmin.contact_number);
            }
            else {
                sendUserAccountCreatedMail(superAdmin.email, superAdmin.contact_number);
            }
            return superAdmin;
        }
        else {
            // global.logger.info("USER: Super Admin Exists ✔");
            return isExisted;
        }
    }
    catch (error) {
        global.logger.error("Error creating super admin", error);
    }
});
const createDefaultLanguage = (lang_name, lang_code) => __awaiter(void 0, void 0, void 0, function* () {
    const englishLanguageDoc = yield Languages.findOne({
        lang_code: lang_code,
    });
    if (!englishLanguageDoc) {
        const languageData = {
            lang_name: lang_name,
            lang_code: lang_code,
            identifier: makeIdentifier(lang_name),
        };
        const englishDoc = new Languages(languageData);
        yield englishDoc.save();
        // global.logger.info(`LANGUAGE: ${lang_name} Created ✔`);
    }
    else {
        // global.logger.info(`LANGUAGE: ${lang_name} Exists ✔`);
    }
});
const getDefaultImagePath = (imageName) => {
    // Adjust the path to your default images directory
    return path.join(__dirname + "../../../", "default_images", imageName);
};
const convertToMulterFile = (fileDocument) => {
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
        encoding: "7bit",
        mimetype: fileDocument.mimetype,
        buffer: fileDocument.buffer,
        size: fileDocument.size,
        stream: bufferToStream(fileDocument.buffer),
        destination: "",
        filename: "",
        path: "", // Required if using diskStorage; empty if in-memory
    };
    return multerFile;
};
const createSuperAdminCompany = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let companyDoc = yield Company.findOne({ owner_id: adminId });
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
                    const savedFile = yield createDocument({
                        document: multerFile,
                        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
                        documentPath: masterConfig.fileStystem.folderPaths.COMPANY +
                            companyId.toString() +
                            "/" +
                            masterConfig.fileStystem.folderPaths.LOGO +
                            image.folder,
                    });
                    if (savedFile) {
                        // Assuming logoDetails is defined somewhere
                        logoDetails[`${image.type}`] = savedFile.path;
                    }
                }
                else {
                    console.error(`Image file not found: ${imagePath}`);
                }
            }
            let baseCompanyData = masterConfig.ownerCompanyDetails;
            baseCompanyData.logo = logoDetails;
            const company = new Company(Object.assign(Object.assign({ _id: companyId }, baseCompanyData), { owner_id: adminId, added_by: adminId, updated_by: adminId }));
            yield company.save();
        }
    }
    catch (error) {
        global.logger.error("Error creating super admin company", error);
    }
});
export const createDefaultDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create default modules
        yield createModules();
        // create default language
        const languages = masterConfig.defaultDataConfig.defaultLanguages;
        languages.forEach((language) => __awaiter(void 0, void 0, void 0, function* () {
            yield createDefaultLanguage(language.lang_name, language.lang_code);
        }));
        // create super_admin_role
        const superAdminRole = yield createSuperAdminRole();
        // create super_admin_user
        const superAdmin = yield createSuperAdmin(superAdminRole._id);
        // give super_admin_permission
        if (superAdmin.role_id) {
            yield createSuperAdminPermissions(superAdmin.role_id);
        }
        if (superAdmin._id) {
            yield createSuperAdminCompany(superAdmin._id);
        }
    }
    catch (error) {
        global.logger.error("Error creating default database:", error);
    }
});
export const makeIdentifier = (word) => {
    return word.toLowerCase().replace(/\s+/g, "_");
};
//# sourceMappingURL=common.helpers..js.map