const parseQuery = (query) => {
    const parsedQuery = {};
    for (const key in query) {
        // Check if the key contains brackets
        if (key.includes('[') && key.includes(']')) {
            const [mainKey,
                subKey] = key.split(/\[|\]/).filter(Boolean);
            if (!parsedQuery[mainKey]) {
                parsedQuery[mainKey] = {};
            }
            parsedQuery[mainKey][subKey] = query[key];
        }
    }
    return JSON.parse(JSON.stringify(parsedQuery).replace(/\b(gte|gt|lte|lt)\b/, (value)=>`$${value}`))
};

module.exports = parseQuery;