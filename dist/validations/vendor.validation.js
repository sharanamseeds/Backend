import Joi from "joi";
const addVendorSchema = Joi.object({
    name: Joi.string().required(),
    agro_name: Joi.string().required(),
    contact_number: Joi.string().length(10).required(),
    pesticide_license_no: Joi.string(),
    seed_license_no: Joi.string(),
    fertilizer_license_no: Joi.string(),
    gst_number: Joi.string().length(15),
    pan_number: Joi.string().length(10),
    email: Joi.string().email().required(),
    address: Joi.object({
        address_line: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        pincode: Joi.string(),
        coordinates: Joi.array().items(Joi.number()).length(2),
    }),
    bank_details: Joi.object({
        bankName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        ifscCode: Joi.string().required(),
        branchName: Joi.string(),
    }).required(),
});
const updateVendorSchema = Joi.object({
    name: Joi.string(),
    agro_name: Joi.string(),
    contact_number: Joi.string().length(10),
    pesticide_license_no: Joi.string(),
    seed_license_no: Joi.string(),
    fertilizer_license_no: Joi.string(),
    gst_number: Joi.string().length(15),
    pan_number: Joi.string().length(10),
    email: Joi.string().email(),
    address: Joi.object({
        address_line: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        pincode: Joi.string(),
        coordinates: Joi.array().items(Joi.number()).length(2),
    }),
    bank_details: Joi.object({
        bankName: Joi.string(),
        accountNumber: Joi.string(),
        ifscCode: Joi.string(),
        branchName: Joi.string(),
    }),
});
export const vendorMiddlewareSchemas = {
    addVendorSchema,
    updateVendorSchema,
};
//# sourceMappingURL=vendor.validation.js.map