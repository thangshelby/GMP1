
export function getAllKeys(item, prefix = "") {
    if (!item || typeof item !== "object") {
        return [];
    }

    const fields = [];

    for (const key of Object.keys(item)) {
        const value = item[key];
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (Array.isArray(value)) {
            value.forEach((arrayItem, index) => {
                if (
                    arrayItem &&
                    typeof arrayItem === "object" &&
                    !(arrayItem instanceof Date)
                ) {
                    fields.push(...getAllKeys(arrayItem, `${fieldPath}[${index}]`));
                } else {
                    fields.push(`${fieldPath}[${index}]`);
                }
            });
        } else if (value instanceof Date) {
            fields.push(fieldPath);
        } else if (value && typeof value === "object") {
            fields.push(...getAllKeys(value, fieldPath));
        } else {
            fields.push(fieldPath);
        }
    }

    return fields;
}