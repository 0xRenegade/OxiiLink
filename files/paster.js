const pasteInput = document.getElementById('input')
const pasteSubmit = document.getElementById('paste')
const filetypeInput = document.getElementById('filetype')

function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// const hrefRegex = new RegExp(escapeRegExp(window.location.href));

let lock = false

pasteSubmit.addEventListener('click', ev => {
  make_paste(pasteInput.value)
})

const make_paste = async (paste) => {
  if (lock) return
  lock = true
    if (!filetypeRegex.test(filetypeInput.value)){
        filetypeInput.value = ""
        filetypeInput.classList.add("error")
        lock = false
        return
    }
  if (paste.length > 0) {
      if (hrefRegex.test(paste)) {
        pasteInput.classList.add('error')
      } else {

    pasteInput.value = ''
    pasteInput.placeholder = 'Generating paste...'
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body:
        paste,
      })
    if (response.ok) {
      pasteInput.classList.remove('error')
      let pasteData = await response.text()
        if (filetypeInput.value == "") {
            pasteData = pasteData
        } else {
            pasteData = pasteData+ "." + filetypeInput.value
        }
      pasteInput.value = pasteData
      pasteInput.placeholder = 'Data to paste...'
      pasteInput.select()
    } else {
      pasteInput.classList.add('error')
      pasteInput.value = ''
      pasteInput.placeholder = await response.text()
    }
      }
  } else {
    pasteInput.classList.add('error')
    pasteInput.value = ''
    pasteInput.placeholder = 'Cannot make an empty paste.'
  }
  lock = false
}

const linkInput = document.getElementById('input-info')
const linkSubmit = document.getElementById('submit-info')
const infoSplash = document.getElementById('splash')


const hrefRegex = new RegExp("^http(s)?:\/\/"+escapeRegExp(window.location.hostname.replace(/\/$/, "")) + "(:[\\d]+)?\\/(s\/)?[A-z\\d]{3}(\\.[A-z\\d]+)?$"); // if this regex matches, the URL is correct.
const shortRegex = new RegExp("^http(s)?:\/\/"+escapeRegExp(window.location.hostname.replace(/\/$/, "")) + "(:[\\d]+)?\\/s\/[A-z\\d]{3}(\\.[A-z\\d]+)?$"); // if this regex matches, the URL is correct.

let infoLock = false

linkInput.addEventListener('keyup', ev => {
  if (ev.key === 'Enter') {
    lookUpLink(linkInput.value)
  }
})

linkInput.addEventListener('paste', ev => {
  const paste = (ev.clipboardData || window.clipboardData).getData('text')
  lookUpLink(paste)
})

linkSubmit.addEventListener('click', ev => {
  lookUpLink(linkInput.value)
})

const lookUpLink = async (link) => {
  if (infoLock) return
  infoLock = true
  if (hrefRegex.test(link)) {
    console.log(`Getting info on ${link}`)
    linkInput.value = ''
    linkInput.placeholder = 'Looking up your link...'
    const anltcsLink = link.replace(/([A-z]*:\/\/([A-z\d\.:]?)*)/, "$1/a")
    const response = await fetch(anltcsLink)
    if (response.ok) {
      linkInput.classList.remove('error')
      const linkData = await response.text()
      linkInput.value = ''
      linkInput.placeholder = 'Link to look up...'
      const outRegex = /(Views: )?(\d*)[\n]?(Scrapes: )?(\d*)/
      var views = linkData.replace(outRegex, "$2")
      var scrapes = linkData.replace(outRegex, "$4")
      document.getElementById('results-table').classList.remove("hidden")
      document.getElementById('results').innerHTML += `<tr>
      <td>${link}</td>
      <td>${views}</td>
      <td>${scrapes}</td>
      </tr>`
      linkInput.select()
      infoSplash.className = "hidden"
    } else {
      linkInput.classList.add('error')
      linkInput.value = ''
      linkInput.placeholder = await response.text()
    }
  } else {
    linkInput.classList.add('error')
    linkInput.value = ''
    linkInput.placeholder = 'Are you absolutely sure that is a link?'
  }
  infoLock = false
}
