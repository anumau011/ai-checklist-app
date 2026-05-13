export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.message === 'Unauthorized') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (err.message === 'Not found') {
    return res.status(404).json({ message: 'Not found' })
  }

  res.status(500).json({ message: 'Internal server error', error: err.message })
}
