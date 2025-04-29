import { getAllKeys } from "./getAllKeys";
import { getFieldValue } from "./getFieldValue";
import { convertToString } from "./convertToString";
export function search(options) {
    const { fields, matchType } = options;

    return (data, query) => {
        const trimmedQuery = String(query).trim().toLowerCase();

        if (!trimmedQuery) return data;

        return data.filter((item) => {
            const fieldsArray = fields
                ? Array.isArray(fields)
                    ? fields
                    : [fields]
                : getAllKeys(item);

            return fieldsArray.some((field) => {
                const fieldValue = getFieldValue(item, field);
                if (fieldValue == null) return false;

                const stringValue = convertToString(fieldValue).toLowerCase();

                switch (matchType) {
                    case "exact":
                        return stringValue === trimmedQuery;
                    case "startsWith":
                        return stringValue.startsWith(trimmedQuery);
                    case "endsWith":
                        return stringValue.endsWith(trimmedQuery);
                    case "contains":
                        return stringValue.includes(trimmedQuery);
                    default:
                        throw new Error(`Unsupported match type: ${matchType}`);
                }
            });
        });
    };
}


