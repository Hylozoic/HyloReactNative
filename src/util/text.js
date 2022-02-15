import cheerio from 'cheerio'

// Replace any div tag with p. Note that this drops all attributes from the tag.
export function divToP (text) {
  if (!text || typeof text !== 'string') return ''
  const $ = cheerio.load(text, null, false)
  $('div').replaceWith(function () {
    return $('<p>' + $(this).html() + '</p>')
  })
  return $.html()
}
