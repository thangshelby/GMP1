export function convertToString(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }

    return String(value);
}