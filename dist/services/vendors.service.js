var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Vendor from "../models/verdors.model.js";
import { escapeRegex } from "../helpers/common.helpers..js";
const getVendor = ({ vendorId, query, }) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield Vendor.findById(vendorId);
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    return vendor;
});
const getVendorList = ({ query, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit, page, pagination = true, sortBy = "createdAt", sortOrder = "asc", agro_name, contact_number, gst_number, email, name, search, } = query;
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
        let filterQuery = {};
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
        const totalDocs = yield Vendor.countDocuments(filterQuery);
        if (!pagination) {
            const vendorDoc = yield Vendor.find(filterQuery).sort({
                [sortBy]: sortOrder === "asc" ? 1 : -1,
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
        const vendorDoc = yield Vendor.find(filterQuery)
            .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 }) // Sorting logic
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
    }
    catch (error) {
        throw error;
    }
});
const updateVendor = ({ vendorId, req, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let bodyData = {};
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const vendor = yield Vendor.findByIdAndUpdate(vendorId, bodyData, {
        new: true,
        runValidators: true,
    });
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    return vendor;
});
const addVendor = ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let bodyData = {};
    if (((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.payload) && typeof req.query.payload === "string") {
        bodyData = JSON.parse(req.query.payload);
    }
    const newVendor = new Vendor(bodyData);
    yield newVendor.save();
    return newVendor;
});
const deleteVendor = ({ vendorId }) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield Vendor.findByIdAndDelete(vendorId);
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    return vendor;
});
export const vendorService = {
    getVendor,
    getVendorList,
    updateVendor,
    addVendor,
    deleteVendor,
};
//# sourceMappingURL=vendors.service.js.map