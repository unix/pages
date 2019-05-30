const pages = require('./pages')

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.url === '/') {
    req.url = '/wittbulter/pages'
  }
  
  if (!/(\/|=)[a-zA-Z0-9]+$/.test(req.url)) return ''
  const { url, dark } = pages.getQuery(req.url)
  
  const mdPath = pages.getFilePath(url)
  const hasFile = await pages.hasFile(mdPath)
  if (!hasFile) return 'not_found'
  
  const content = await pages.getContent(mdPath)
  return pages.translate(content, url, dark)
}
