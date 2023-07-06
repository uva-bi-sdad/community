'use strict'
onmessage = function(m){
  const f = new XMLHttpRequest()
  f.onreadystatechange = function () {
    if (4 === f.readyState) {
      m.data.status = f.status
      m.data.response = f.responseText
      postMessage(m.data)
    }
  }
  f.open('GET', m.data.url, true)
  f.send()
}

