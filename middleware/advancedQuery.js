const advancedQuery = (model, populate) => async (req, res, next) => {
  // copy req.query
  const reqQuery = { ...req.query }
  // exclude fields from req.query
  const removeFields = ['select', 'sort', 'page', 'limit']
  removeFields.forEach(param => delete reqQuery[param])

  // create query string
  let str = JSON.stringify(reqQuery)

  str = str.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  let query = model.find(JSON.parse(str))
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }
  // sort fields
  if (req.query.sort) {
    const val = req.query.sort.split(',').join(' ')
    console.log(query.sort(val))
    query = query.sort(val)
  } else {
    query = query.sort('-createdAt')
  }
  // Pagination
  const total = await model.countDocuments()
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const startIdx = (page - 1) * limit
  const endIdx = page * limit
  query = query.skip(startIdx).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }
  const results = await query

  // pagination result
  const pagination = {}

  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if (startIdx > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    }
  }
  res.advancedQuery = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next()
}

module.exports = advancedQuery
