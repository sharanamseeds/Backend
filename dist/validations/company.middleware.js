import * as yup from "yup";
const addCompany = yup.object().shape({
    brand_name: yup.string().required("Brand name is required"),
    legal_name: yup.string().required("Legal name is required"),
    slogan: yup.string(),
    industry: yup.string().required("Industry is required"),
    description: yup.string().required("Description is required"),
    website: yup.string().url("Invalid URL format"),
    type: yup
        .string()
        .oneOf(["B2B", "B2C"], "Type must be either B2B or B2C")
        .required("Type is required"),
    // logo: yup.object().shape({
    //   primary: yup.string().required("Primary logo is required"),
    //   secondary: yup.string(),
    //   qr_code: yup.string(),
    // }),
    contact_information: yup.object().shape({
        address_line: yup.string(),
        city: yup.string(),
        state: yup.string(),
        pincode: yup.string(),
        type: yup.string().oneOf(["Point"]).default("Point"),
        coordinates: yup
            .array()
            .of(yup.number())
            .length(2, "Coordinates must have exactly 2 numbers"),
    }),
    billing_information: yup.object().shape({
        gst_number: yup.string().length(15).required("GST number is required"),
        business_model: yup.string().required("Business model is required"),
    }),
});
const updateCompany = yup.object().shape({
    brand_name: yup.string(),
    legal_name: yup.string(),
    slogan: yup.string(),
    industry: yup.string(),
    description: yup.string(),
    website: yup.string().url("Invalid URL format"),
    type: yup.string().oneOf(["B2B", "B2C"], "Type must be either B2B or B2C"),
    contact_information: yup.object().shape({
        address_line: yup.string(),
        city: yup.string(),
        state: yup.string(),
        pincode: yup.string(),
        type: yup.string().oneOf(["Point"]).default("Point"),
        coordinates: yup
            .array()
            .of(yup.number())
            .length(2, "Coordinates must have exactly 2 numbers"),
    }),
    billing_information: yup.object().shape({
        gst_number: yup.string().length(15),
        business_model: yup.string(),
    }),
});
export const companyMiddleware = {
    addCompany,
    updateCompany,
};
//# sourceMappingURL=company.middleware.js.map