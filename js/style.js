const fs = require('fs'),
  minifier = require('csso')
fs.readFile('dev/community.css', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
  } else {
    fs.writeFile('docs/dist/css/community.min.css', minifier.minify(data).css, err => {
      if (err) {
        console.error(err)
      } else {
        console.log('wrote minified css to docs/dist/css/community.min.css')
      }
    })
  }
})
