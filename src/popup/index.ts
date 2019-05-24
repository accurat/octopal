import '../icons/icon16.png'
import '../icons/icon48.png'
import '../icons/icon128.png'
import './popup.scss'

const getElements = () => ({
  form: document.getElementById('form') as HTMLFormElement,
  githubToken: document.getElementById('github_token') as HTMLInputElement,
  urlPatterns: document.getElementById('url_patterns') as HTMLInputElement,
})

const update = () => {
  const { urlPatterns, githubToken } = getElements()

  chrome.storage.sync.get({ accessToken: '', urlPatterns: 'accurat*', githubToken: '' }, items => {
    githubToken.value = items.githubToken
    urlPatterns.value = items.urlPatterns
  })
}

const save = (cb: () => void) => {
  const { urlPatterns, githubToken } = getElements()
  chrome.storage.sync.set(
    {
      githubToken: githubToken.value,
      urlPatterns: urlPatterns.value,
    },
    cb,
  )
}

document.addEventListener('DOMContentLoaded', () => {
  update()

  getElements().form.onsubmit = e => {
    e.preventDefault()
    save(update)
  }
})
