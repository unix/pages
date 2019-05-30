const fetch = require('node-fetch')

const getQuery = (url) => {
  if (!url.includes('?')) return { url }
  const [native, query] = url.split('?')
  if (!query.includes('=')) return { url: native }
  const isDark = query.includes('dark')
  const isCenter = query.includes('center')
  return { url: native, dark: isDark, center: isCenter }
}

const getFilePath = (url) => {
  return `https://raw.githubusercontent.com${url}/master/README.md`
}

const getRepoMessage = (url) => {
  return {
    git: `https://github.com${url}`,
    name: url.split('/').reverse()[0] || '',
  }
}

const hasFile = async filePath => {
  try {
    const res = await fetch(filePath, { method: 'HEAD' })
    return res && res.status === 200
  } catch (e) {
    return false
  }
}

const getContent = async filePath => {
  return await (await fetch(filePath)).text()
}

const translate = async (content, url, isDark = false, isCenter = false) => {
  const { git, name } = getRepoMessage(url)
  const hostname = `${git}/raw/master/`
  const md = require('markdown-it')({
    html: true,
    replaceLink: filename => {
      if (/http/.test(filename)) return filename
      return `${hostname}${filename}`
    }
  }).use(require('markdown-it-replace-link'))
  return `<html class="${isDark ? 'zi-dark-theme' : ''}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title><link rel="dns-prefetch" href="//pages.now.sh">
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/@zeit-ui/style@0.9.1/dist/style.css"><link rel="icon" href="favicon.ico"></head>
<body><div class="zi-layout zi-main ${isCenter ? 'zi-center' : ''}">${md.render(content)}<hr>This project is open-sourced on <a href="${git}">GitHub</a>.</div></body></html>`
}

module.exports = {
  getQuery,
  getFilePath,
  getRepoMessage,
  hasFile,
  getContent,
  translate,
}
