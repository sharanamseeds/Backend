import mongoose, { Document } from "mongoose";
import User, { typeUser } from "../models/users.model.js";
import { createPassword, generatePassword } from "../helpers/auth.helpers.js";
import {
  convertFiles,
  createDocument,
  deleteDocument,
} from "../helpers/files.management.js";
import {
  sendUserAccountCreatedMail,
  sendUserAccountVerifiedMail,
} from "../helpers/common.helpers..js";
import { masterConfig } from "../config/master.config.js";
import Money from "../models/money.model.js";
import Ledger from "../models/ledger.model.js";

const calculateUserFinancials = async ({ userId }) => {
  const userDoc = await User.findById(userId);

  if (!userDoc) {
    throw new Error("Invalid user ID");
  }

  try {
    const totalMoneyAdded = await Money.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const ledgerData = await Ledger.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$payment_amount" },
        },
      },
    ]);

    let totalCredit = 0;
    let totalDebit = 0;

    ledgerData.forEach((item) => {
      if (item._id === "credit") {
        totalCredit = item.totalAmount;
      } else if (item._id === "debit") {
        totalDebit = item.totalAmount;
      }
    });

    const finalBalance =
      (totalMoneyAdded[0]?.total || 0) + totalCredit - totalDebit;

    const credits = await Money.find({
      user_id: new mongoose.Types.ObjectId(userId),
    });

    const ledgers = await Ledger.find({
      user_id: new mongoose.Types.ObjectId(userId),
    });

    return {
      totalMoneyAdded: totalMoneyAdded[0]?.total || 0,
      totalCredit,
      totalDebit,
      finalBalance,
      ledgers,
      credits,
    };
  } catch (error) {
    throw new Error(`Error calculating financials: ${error.message}`);
  }
};

const getUserList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeUser> | null)[];
  meta: {
    docsFound: number;
    docsInResponse: number;
    limit: number;
    total_pages: number;
    currentPage: number;
  };
}> => {
  try {
    let {
      limit,
      page,
      pagination = true,
      sortBy = "createdAt",
      sortOrder = "asc",
      role_id,
      is_verified,
      is_blocked,
      name,
      is_email_verified,
      contact_number,
      gst_number,
      email,
      search,
    } = query;

    if (typeof limit === "string") {
      limit = Number(limit);
    }
    if (!limit || isNaN(limit)) {
      limit = 50;
    }

    if (typeof page === "string") {
      page = Number(page);
    }
    if (!page || isNaN(page)) {
      page = 1;
    }

    if (typeof pagination === "string") {
      pagination = pagination === "true";
    }

    let filterQuery: any = {};

    if (role_id) {
      filterQuery.role_id = new mongoose.Types.ObjectId(role_id);
    }
    if (is_verified !== undefined) {
      filterQuery.is_verified = is_verified;
    }
    if (is_blocked !== undefined) {
      filterQuery.is_blocked = is_blocked;
    }
    if (name) {
      filterQuery.name = name;
    }
    if (email) {
      filterQuery.email = email;
    }
    if (is_email_verified !== undefined) {
      filterQuery.is_email_verified = is_email_verified;
    }
    if (contact_number) {
      filterQuery.contact_number = contact_number;
    }
    if (gst_number) {
      filterQuery.gst_number = gst_number;
    }

    // Apply search logic
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contact_number: { $regex: search, $options: "i" } },
      ];
    }

    const totalDocs = await User.countDocuments(filterQuery);

    if (!pagination) {
      const userDoc = await User.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      }); // Sorting logic
      return {
        data: userDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: userDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const userDoc = await User.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 }) // Sorting logic
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: userDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: userDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getUser = async ({
  userId,
  query,
}: {
  userId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeUser> | null> => {
  try {
    const userDoc = await User.findById(userId);
    return userDoc;
  } catch (error) {
    throw error;
  }
};

const addUser = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeUser> | null> => {
  try {
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    const { password } = bodyData;
    let saltData;
    let hashData;

    if (password) {
      const { hash, salt } = generatePassword(password);
      saltData = salt;
      hashData = hash;
      delete bodyData.password;
    } else {
      const generatedPassword = createPassword();
      const { hash, salt } = generatePassword(generatedPassword);
      saltData = salt;
      hashData = hash;
    }

    const userId = new mongoose.Types.ObjectId();

    let userData: any = {
      _id: new mongoose.Types.ObjectId(userId),
      added_by: new mongoose.Types.ObjectId(requestUser._id),
      updated_by: new mongoose.Types.ObjectId(requestUser._id),
      gst_number: new mongoose.Types.ObjectId(userId),
      hash: hashData,
      salt: saltData,
    };

    const files = convertFiles(req.files);

    const {
      profile,
      aadhar_card,
      gst_certificate,
      other_document,
      bank_details,
    } = files;

    if (profile && profile.length > 0) {
      const savedLogoFile = await createDocument({
        document: profile[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.IMAGES,
      });
      if (savedLogoFile) {
        userData.profile = savedLogoFile.path;
      }
    }

    if (aadhar_card && aadhar_card.length > 0) {
      const savedAadharCardFile = await createDocument({
        document: aadhar_card[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.DOCUMENTS,
      });
      if (savedAadharCardFile) {
        userData.aadhar_card = savedAadharCardFile.path;
      }
    }

    if (gst_certificate && gst_certificate.length > 0) {
      const savedGstCertificateFile = await createDocument({
        document: gst_certificate[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.DOCUMENTS,
      });
      if (savedGstCertificateFile) {
        userData.gst_certificate = savedGstCertificateFile.path;
      }
    }

    if (other_document && other_document.length > 0) {
      for (const otherFile of other_document) {
        const savedOtherFile = await createDocument({
          document: otherFile,
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.USER +
            userData._id +
            "/" +
            masterConfig.fileStystem.folderPaths.DOCUMENTS,
        });
        if (savedOtherFile) {
          userData.other_document = savedOtherFile.path;
        }
      }
    }

    if (bank_details && bank_details.length > 0) {
      const savedBankDetailsFile = await createDocument({
        document: bank_details[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userData._id +
          "/" +
          masterConfig.fileStystem.folderPaths.DOCUMENTS,
      });
      if (savedBankDetailsFile) {
        userData.bank_details = savedBankDetailsFile.path;
      }
    }

    Object.assign(userData, { ...bodyData });

    const user = new User({ ...userData });
    const userDoc = await user.save();

    if (userDoc.is_verified) {
      sendUserAccountVerifiedMail(userDoc.email, userDoc.contact_number);
    } else {
      sendUserAccountCreatedMail(userDoc.email, userDoc.contact_number);
    }

    return userDoc;
  } catch (error) {
    throw error;
  }
};

const updateUser = async ({
  userId,
  requestUser,
  req,
}: {
  userId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeUser> | null> => {
  try {
    const userOriginal = await User.findById(userId);
    let userDoc = await User.findByIdAndUpdate(userId);
    if (!userOriginal) {
      throw new Error("User Not Found");
    }

    let body: any = {};

    if (req?.query?.payload && typeof req.query.payload === "string") {
      body = JSON.parse(req.query.payload);
    }

    if (
      "role_id" in body ||
      "gst_number" in body ||
      "is_verified" in body ||
      "is_blocked" in body
    ) {
      if (requestUser._id === userDoc._id) {
        throw new Error("Only Admin Can Verified Your Account Status");
      }
      if (
        body.is_verified &&
        body.is_verified === true &&
        !userDoc.role_id &&
        !body.role_id
      ) {
        throw new Error("Please Assign Role For User");
      }
    }

    const { password } = req.body;

    let saltData;
    let hashData;

    if (password) {
      const { hash, salt } = generatePassword(password);
      saltData = salt;
      hashData = hash;
    } else {
      saltData = userDoc.salt;
      hashData = userDoc.hash;
    }

    const userData = {
      updated_by: requestUser._id,
      hash: hashData,
      salt: saltData,
      ...body,
    };

    delete userData.password;

    Object.assign(userDoc, { ...userData });

    const files = convertFiles(req.files);

    const {
      profile,
      aadhar_card,
      gst_certificate,
      other_document,
      bank_details,
    } = files;

    if (profile && profile.length > 0) {
      const savedLogoFile = await createDocument({
        document: profile[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userDoc._id +
          "/" +
          masterConfig.fileStystem.folderPaths.IMAGES,
        oldPath: userDoc.profile,
      });
      if (savedLogoFile) {
        userDoc.profile = savedLogoFile.path;
      }
    }

    if (aadhar_card && aadhar_card.length > 0) {
      const savedAadharCardFile = await createDocument({
        document: aadhar_card[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userDoc._id +
          "/" +
          masterConfig.fileStystem.folderPaths.DOCUMENTS,
        oldPath: userDoc.aadhar_card,
      });
      if (savedAadharCardFile) {
        userDoc.aadhar_card = savedAadharCardFile.path;
      }
    }

    if (gst_certificate && gst_certificate.length > 0) {
      const savedGstCertificateFile = await createDocument({
        document: gst_certificate[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userDoc._id +
          "/" +
          masterConfig.fileStystem.folderPaths.DOCUMENTS,
        oldPath: userDoc.gst_certificate,
      });
      if (savedGstCertificateFile) {
        userDoc.gst_certificate = savedGstCertificateFile.path;
      }
    }

    if (other_document && other_document.length > 0) {
      for (const otherFile of other_document) {
        const savedOtherFile = await createDocument({
          document: otherFile,
          documentType: masterConfig.fileStystem.fileTypes.IMAGE,
          documentPath:
            masterConfig.fileStystem.folderPaths.USER +
            userDoc._id +
            "/" +
            masterConfig.fileStystem.folderPaths.DOCUMENTS,
          oldPath: userDoc.other_document,
        });
        if (savedOtherFile) {
          userDoc.other_document = savedOtherFile.path;
        }
      }
    }

    if (bank_details && bank_details.length > 0) {
      const savedBankDetailsFile = await createDocument({
        document: bank_details[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.USER +
          userDoc._id +
          "/" +
          masterConfig.fileStystem.folderPaths.DOCUMENTS,
        oldPath: userDoc.bank_details,
      });
      if (savedBankDetailsFile) {
        userDoc.bank_details = savedBankDetailsFile.path;
      }
    }

    const updatedUser = await userDoc.save();

    if (userDoc.is_verified !== userOriginal.is_verified) {
      if (userDoc.is_verified) {
        sendUserAccountVerifiedMail(userDoc.email, userDoc.contact_number);
      }
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async ({ userId }: { userId: string }): Promise<void> => {
  try {
    await User.findByIdAndDelete(userId);
    const documentPath =
      masterConfig.fileStystem.folderPaths.BASE_FOLDER +
      masterConfig.fileStystem.folderPaths.USER +
      userId;

    await deleteDocument({
      documentPath: documentPath,
    });
  } catch (error) {
    throw error;
  }
};

export const userService = {
  getUser,
  addUser,
  getUserList,
  updateUser,
  deleteUser,
  calculateUserFinancials,
};
