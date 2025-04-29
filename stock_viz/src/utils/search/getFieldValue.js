export function getFieldValue(item, field) {
    const keys = field.split(/[\.\[\]]/).filter(Boolean);
    let value = item;

    for (const key of keys) {
        if (value == null) {
            return null;
        }
        value = value[key];
    }

    return value;
}