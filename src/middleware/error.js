export default (err, req, res, next) => {
  console.error('API error:', err)
  if (process.env.NODE_ENV === 'development') {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error.',
      stack: err.stack,
    })
  } else {
    res.status(err.status || 500).json({
      success: false,
      message: err.status && err.status < 500 ? err.message : 'Internal server error.',
    })
  }
}