import Vendor, { typeVendor } from "../models/verdors.model.js";
import { escapeRegex } from "../helpers/common.helpers..js";

const getVendor = async ({
  vendorId,
  query,
}: {
  vendorId: string;
  query: any;
}) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return vendor;
};
const getVendorList = async ({
  query,
}: {
  query?: any;
}): Promise<{
  data: typeVendor[];
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
      agro_name,
      contact_number,
      gst_number,
      email,
      name,
      search,
    } = query;

    // Convert limit and page to numbers
    if (typeof limit === "string") {
      limit = Number(limit);
    }
    if (!limit || isNaN(limit)) {
      limit = 50; // Default limit
    }

    if (typeof page === "string") {
      page = Number(page);
    }
    if (!page || isNaN(page)) {
      page = 1; // Default page
    }

    if (typeof pagination === "string") {
      pagination = pagination === "true";
    }

    let filterQuery: any = {};

    // Apply filters based on query params
    if (agro_name) {
      filterQuery.agro_name = agro_name;
    }
    if (name) {
      filterQuery.name = name;
    }
    if (contact_number) {
      filterQuery.contact_number = contact_number;
    }
    if (gst_number) {
      filterQuery.gst_number = gst_number;
    }
    if (email) {
      filterQuery.email = email;
    }

    // Apply search logic for multiple fields
    if (search) {
      filterQuery.$or = [
        { name: { $regex: escapeRegex(search), $options: "i" } },
        { email: { $regex: escapeRegex(search), $options: "i" } },
        { contact_number: { $regex: escapeRegex(search), $options: "i" } },
        { agro_name: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }

    const totalDocs = await Vendor.countDocuments(filterQuery);

    if (!pagination) {
      const vendorDoc = await Vendor.find(filterQuery).sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
        _id: 1,
      }); // Sorting logic
      return {
        data: vendorDoc,
        meta: {
          docsFound: totalDocs,
          docsInResponse: vendorDoc.length,
          limit,
          total_pages: 1,
          currentPage: 1,
        },
      };
    }

    const vendorDoc = await Vendor.find(filterQuery)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1, _id: 1 }) // Sorting logic
      .skip((page - 1) * limit)
      .limit(limit);

    const total_pages = Math.ceil(totalDocs / limit);

    const meta = {
      docsFound: totalDocs,
      docsInResponse: vendorDoc.length,
      limit,
      total_pages,
      currentPage: page,
    };

    return { data: vendorDoc, meta };
  } catch (error) {
    throw error;
  }
};

const updateVendor = async ({
  vendorId,
  req,
}: {
  vendorId: string;
  req: any;
}) => {
  let bodyData: any = {};
  if (req?.query?.payload && typeof req.query.payload === "string") {
    bodyData = JSON.parse(req.query.payload);
  }

  const vendor = await Vendor.findByIdAndUpdate(vendorId, bodyData, {
    new: true,
    runValidators: true,
  });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return vendor;
};

const addVendor = async ({ req }: { req: any }) => {
  let bodyData: any = {};
  if (req?.query?.payload && typeof req.query.payload === "string") {
    bodyData = JSON.parse(req.query.payload);
  }

  const newVendor = new Vendor(bodyData);

  await newVendor.save();
  return newVendor;
};

const deleteVendor = async ({ vendorId }: { vendorId: string }) => {
  const vendor = await Vendor.findByIdAndDelete(vendorId);

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  return vendor;
};

export const vendorService = {
  getVendor,
  getVendorList,
  updateVendor,
  addVendor,
  deleteVendor,
};
