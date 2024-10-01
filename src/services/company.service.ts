import mongoose, { Document } from "mongoose";
import Company, { typeCompany } from "../models/company.model.js";
import { typeUser } from "../models/users.model.js";
import { convertFiles, createDocument } from "../helpers/files.management.js";
import { masterConfig } from "../config/master.config.js";

const getCompanyList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: (Document<unknown, {}, typeCompany> | null)[];
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
      owner_id,
      brand_name,
      legal_name,
      slogan,
      industry,
      description,
      website,
      type,
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

    if (owner_id) {
      filterQuery.owner_id = new mongoose.Types.ObjectId(owner_id);
    }
    if (brand_name) {
      filterQuery.brand_name = brand_name;
    }
    if (legal_name) {
      filterQuery.legal_name = legal_name;
    }
    if (slogan) {
      filterQuery.slogan = slogan;
    }
    if (industry) {
      filterQuery.industry = { $in: [industry] };
    }
    if (description) {
      filterQuery.description = description;
    }
    if (website) {
      filterQuery.website = website;
    }
    if (type) {
      filterQuery.type = type;
    }

    const totalDocs = await Company.countDocuments(filterQuery);

    if (!pagination) {
      const companyDoc = await Company.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      });
      return {
        data: companyDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: companyDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const companyDoc = await Company.find(filterQuery)
      .sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: companyDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: companyDoc, meta };
  } catch (error) {
    throw error;
  }
};

const getCompany = async ({
  companyId,
  query,
}: {
  companyId: string;
  query?: any;
}): Promise<Document<unknown, {}, typeCompany> | null> => {
  try {
    const company = await Company.findById(companyId);
    return company;
  } catch (error) {
    throw error;
  }
};

const addCompany = async ({
  requestUser,
  req,
}: {
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeCompany> | null> => {
  try {
    const companyId = new mongoose.Types.ObjectId();

    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    let logoDetails = {
      primary: "",
      secondary: "",
      QR_code: "",
    };

    const files = convertFiles(req.files);
    const { primary_logo, secondary_logo, qr_code } = files;

    if (Array.isArray(primary_logo) && primary_logo.length > 0) {
      const savedFile = await createDocument({
        document: primary_logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.COMPANY +
          companyId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO +
          "PRIMARY/",
      });
      if (savedFile) {
        logoDetails.primary = savedFile.path;
      }
    }
    if (Array.isArray(secondary_logo) && secondary_logo.length > 0) {
      const savedFile = await createDocument({
        document: secondary_logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.COMPANY +
          companyId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO +
          "SECONDARY/",
      });
      if (savedFile) {
        logoDetails.secondary = savedFile.path;
      }
    }
    if (Array.isArray(qr_code) && qr_code.length > 0) {
      const savedFile = await createDocument({
        document: qr_code[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.COMPANY +
          companyId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO +
          "QR_CODE/",
      });
      if (savedFile) {
        logoDetails.QR_code = savedFile.path;
      }
    }

    const company = new Company({
      _id: companyId,
      ...bodyData,
      ...logoDetails,
      owner_id: bodyData.owner_id || requestUser?._id,
      added_by: requestUser?._id || null,
      updated_by: requestUser?._id || null,
    });

    const companyDoc = await company.save();
    return companyDoc;
  } catch (error) {
    throw error;
  }
};

const updateCompany = async ({
  companyId,
  requestUser,
  req,
}: {
  companyId: string;
  requestUser: typeUser | null;
  req?: any;
}): Promise<Document<unknown, {}, typeCompany> | null> => {
  try {
    let companyDoc = await Company.findById(companyId);
    if (!companyDoc) {
      throw new Error("Company Not Found");
    }
    let bodyData: any = {};
    if (req?.query?.payload && typeof req.query.payload === "string") {
      bodyData = JSON.parse(req.query.payload);
    }

    companyDoc = {
      ...companyDoc.toObject(),
      ...bodyData,
      updated_by: requestUser?._id || companyDoc.updated_by,
    };

    const files = convertFiles(req.files);
    const { primary_logo, secondary_logo, qr_code } = files;

    if (Array.isArray(primary_logo) && primary_logo.length > 0) {
      const savedFile = await createDocument({
        document: primary_logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.COMPANY +
          companyId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO +
          "PRIMARY/",
      });
      if (savedFile) {
        companyDoc.logo.primary = savedFile.path;
      }
    }
    if (Array.isArray(secondary_logo) && secondary_logo.length > 0) {
      const savedFile = await createDocument({
        document: secondary_logo[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.COMPANY +
          companyId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO +
          "SECONDARY/",
      });
      if (savedFile) {
        companyDoc.logo.secondary = savedFile.path;
      }
    }

    if (Array.isArray(qr_code) && qr_code.length > 0) {
      const savedFile = await createDocument({
        document: qr_code[0],
        documentType: masterConfig.fileStystem.fileTypes.IMAGE,
        documentPath:
          masterConfig.fileStystem.folderPaths.COMPANY +
          companyId +
          "/" +
          masterConfig.fileStystem.folderPaths.LOGO +
          "SECONDARY/",
      });
      if (savedFile) {
        companyDoc.logo.QR_code = savedFile.path;
      }
    }

    const updatedCompanyDoc = await Company.findByIdAndUpdate(
      companyId,
      companyDoc,
      { new: true }
    );
    return updatedCompanyDoc;
  } catch (error) {
    throw error;
  }
};

const deleteCompany = async ({
  companyId,
}: {
  companyId: string;
}): Promise<void> => {
  try {
    throw new Error("Company Can Not Be Deleted");
    await Company.findByIdAndDelete(companyId);
  } catch (error) {
    throw error;
  }
};

export const companyService = {
  getCompany,
  addCompany,
  getCompanyList,
  updateCompany,
  deleteCompany,
};
