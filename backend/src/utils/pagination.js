/**
 * Generates Prisma-compatible pagination options from query params.
 * @param {object} query - Express req.query
 * @param {number} [defaultLimit=10]
 * @returns {{ skip: number, take: number, page: number, limit: number }}
 */
const paginate = (query, defaultLimit = 10) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || defaultLimit);
    const skip = (page - 1) * limit;
    return { skip, take: limit, page, limit };
};

/**
 * Wraps paginated results with metadata.
 * @param {Array} data
 * @param {number} total - total count from DB
 * @param {{ page: number, limit: number }} pagination
 */
const paginatedResponse = (data, total, { page, limit }) => ({
    results: data.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data
});

module.exports = { paginate, paginatedResponse };
