export function paginate(options) {
    const { page = 1, pageSize = 10 } = options;

    return (data, query) => {
        // Query is not used here; it’s only for compatibility with our hook.
        const startIndex = (page - 1) * pageSize;

        return data.slice(startIndex, startIndex + pageSize);
    };
}