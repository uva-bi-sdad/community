const fs = require('fs')
fs.copyFile('docs/dist/css/community.min.css', 'docs/dist/css/community.v1.min.css', err => {
  if (err) {
    console.error(err)
  } else {
    console.log('copied minified dev css to docs/dist/css/community.v1.min.css')
  }
})
