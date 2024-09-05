const deepCopy = (obj) => {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(deepCopy);
    }
    const copiedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            copiedObj[key] = deepCopy(obj[key]);
        }
    }
    return copiedObj;
};
const removeEmptyFields = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object") {
            removeEmptyFields(obj[key]);
        }
        else if (obj[key] === "" || obj[key] === null) {
            delete obj[key];
        }
    });
    return obj;
};
const mergeLocalizedArray = (existingArray, newArray, lang_code) => {
    const updatedArray = deepCopy(existingArray);
    newArray.forEach((newItem) => {
        const index = updatedArray.findIndex((item) => item.lang_code === lang_code);
        if (index >= 0) {
            updatedArray[index] = Object.assign(Object.assign({}, updatedArray[index]), newItem);
        }
        else {
            updatedArray.push(newItem);
        }
    });
    return updatedArray;
};
const mergeField = (existingField, newField, lang_code) => {
    if (Array.isArray(existingField)) {
        return mergeLocalizedArray(existingField, newField, lang_code);
    }
    if (typeof existingField === "object" && existingField !== null) {
        for (const key in newField) {
            if (existingField[key]) {
                existingField[key] = mergeField(existingField[key], newField[key], lang_code);
            }
            else {
                existingField[key] = newField[key];
            }
        }
        return existingField;
    }
    return newField;
};
export const mergeLocalizedData = (existingData, newData, fields, lang_code) => {
    fields.forEach((field) => {
        const keys = field.split(".");
        let tempExisting = existingData;
        let tempNew = newData;
        for (let i = 0; i < keys.length; i++) {
            if (tempExisting[keys[i]] !== undefined) {
                if (i === keys.length - 1) {
                    if (Array.isArray(tempExisting[keys[i]])) {
                        if (Array.isArray(tempNew[keys[i]])) {
                            tempExisting[keys[i]] = mergeLocalizedArray(tempExisting[keys[i]], tempNew[keys[i]], lang_code);
                        }
                    }
                    else {
                        if (tempNew[keys[i]] !== undefined) {
                            tempExisting[keys[i]] = mergeField(tempExisting[keys[i]], tempNew[keys[i]], lang_code);
                        }
                    }
                }
                else {
                    if (!tempExisting[keys[i]]) {
                        tempExisting[keys[i]] = {};
                    }
                    tempExisting = tempExisting[keys[i]];
                    if (tempNew[keys[i]] !== undefined) {
                        tempNew = tempNew[keys[i]];
                    }
                    else {
                        break;
                    }
                }
            }
            else {
                break;
            }
        }
    });
    return existingData;
};
const formatField = (field, lang_code) => {
    if (typeof field === "string") {
        return [{ lang_code, value: field }];
    }
    if (Array.isArray(field)) {
        return field.map((item) => formatField(item, lang_code));
    }
    if (typeof field === "object" && field !== null) {
        const formattedObject = {};
        for (const key in field) {
            formattedObject[key] = formatField(field[key], lang_code);
        }
        return formattedObject;
    }
    return field;
};
export const formatLocalizedData = (data, fields, lang_code) => {
    const formattedData = deepCopy(data);
    fields.forEach((field) => {
        const keys = field.split(".");
        let tempData = data;
        let tempFormattedData = formattedData;
        keys.forEach((key, index) => {
            if (tempData[key] !== undefined) {
                if (Array.isArray(tempData[key])) {
                    if (!tempFormattedData[key]) {
                        tempFormattedData[key] = [];
                    }
                    tempData[key].forEach((item, idx) => {
                        if (!tempFormattedData[key][idx]) {
                            tempFormattedData[key][idx] = {};
                        }
                        const nestedField = keys.slice(index + 1).join(".");
                        if (nestedField) {
                            tempFormattedData[key][idx] = Object.assign(Object.assign({}, tempFormattedData[key][idx]), formatLocalizedData(item, [nestedField], lang_code));
                        }
                        else {
                            tempFormattedData[key][idx] = formatField(item, lang_code);
                        }
                    });
                    return;
                }
                else if (index === keys.length - 1) {
                    tempFormattedData[key] = formatField(tempData[key], lang_code);
                }
                else {
                    if (!tempFormattedData[key]) {
                        tempFormattedData[key] = {};
                    }
                    tempFormattedData = tempFormattedData[key];
                    tempData = tempData[key];
                }
            }
        });
    });
    return removeEmptyFields(formattedData);
};
export const transformFormData = (obj) => {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (key.includes("[") && key.endsWith("]")) {
                const baseKey = key.substring(0, key.indexOf("["));
                const indexStr = key.substring(key.indexOf("[") + 1, key.indexOf("]"));
                const index = parseInt(indexStr);
                if (!result[baseKey]) {
                    result[baseKey] = [];
                }
                if (key.includes(".")) {
                    const nestedKey = key.substring(key.indexOf("]") + 2);
                    if (!result[baseKey][index]) {
                        result[baseKey][index] = {};
                    }
                    result[baseKey][index][nestedKey] = obj[key];
                }
                else {
                    result[baseKey][index] = obj[key];
                }
            }
            else if (key.includes(".")) {
                const keys = key.split(".");
                keys.reduce((acc, part, index) => {
                    if (part.includes("[") && part.endsWith("]")) {
                        const baseKey = part.substring(0, part.indexOf("["));
                        const indexStr = part.substring(part.indexOf("[") + 1, part.indexOf("]"));
                        const arrayIndex = parseInt(indexStr);
                        if (!acc[baseKey]) {
                            acc[baseKey] = [];
                        }
                        if (!acc[baseKey][arrayIndex]) {
                            acc[baseKey][arrayIndex] = {};
                        }
                        acc = acc[baseKey][arrayIndex];
                    }
                    else {
                        if (index === keys.length - 1) {
                            acc[part] = obj[key];
                        }
                        else {
                            if (!acc[part]) {
                                acc[part] = {};
                            }
                            acc = acc[part];
                        }
                    }
                    return acc;
                }, result);
            }
            else {
                result[key] = obj[key];
            }
        }
    }
    return result;
};
export const updateField = (orignalDoc, updateDoc, key, lang_code) => {
    var _a;
    if (updateDoc[key]) {
        const existingKey = (_a = orignalDoc[key]) === null || _a === void 0 ? void 0 : _a.find((item) => item.lang_code === lang_code);
        if (existingKey) {
            existingKey.value = updateDoc[key];
        }
        else {
            const localizedLogoPath = {
                lang_code: lang_code,
                value: updateDoc[key],
            };
            if (!orignalDoc[key]) {
                orignalDoc[key] = [localizedLogoPath];
            }
            else {
                orignalDoc[key].push(localizedLogoPath);
            }
        }
    }
};
//# sourceMappingURL=language.management.helper.js.map