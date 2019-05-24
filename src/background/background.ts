import flatten from 'lodash-es/flatten'

interface Message {
  owner?: string
  repo?: string
  issueNumber?: string
  pullRequestNumber?: string
  onPRPage?: boolean
  onIssuePage?: boolean
  onIssuesPage?: boolean
  onNewIssuePage?: boolean
}

const state: { message?: Message; tabId?: number } = {}

const githubUrls = ['github.com']

const sendMessage = ({ tabId, message }: { tabId?: number; message?: Message | undefined }) =>
  tabId && message && chrome.tabs.sendMessage(tabId, message)

// init token
chrome.storage.sync.get({ urlPatterns: 'accurat*' }, ({ urlPatterns }) => {
  const cleanedUrlPatterns = (urlPatterns as string)
    .split(',')
    .map(s => s.trim())
    .filter(s => !!s)

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    const tabUrl = tab.url || ''

    const isRepoEnabled = (url: string) => {
      return RegExp(
        githubUrls
          .map(githubUrl =>
            cleanedUrlPatterns.map(urlPattern => `^https?://${githubUrl}/${urlPattern}`).join('|'),
          )
          .join('|'),
      ).test(url)
    }

    if (changeInfo.status !== 'complete' || !isRepoEnabled(tabUrl)) {
      return
    }

    const genericGithubPrefix = '^https?://[^/]+/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+'

    const issuesPageRegex = RegExp(
      `${genericGithubPrefix}/issues/$|${genericGithubPrefix}/issues/\\?.+|${genericGithubPrefix}/issues$|${genericGithubPrefix}/issues\\?.+`,
    )
    const issuePageRegex = RegExp(`${genericGithubPrefix}/issues/\\d+`)
    const newIssuePageRegex = RegExp(`${genericGithubPrefix}/issues/new`)
    const pullRequestPageRegex = RegExp(`${genericGithubPrefix}/pull/.*`)

    const [, , , owner, repo, , number] = tabUrl.split('/')

    const getMessage = (): Message | undefined => {
      if (issuesPageRegex.test(tabUrl)) {
        return { owner, repo, onIssuesPage: true }
      }
      if (issuePageRegex.test(tabUrl)) {
        return { owner, repo, issueNumber: number, onIssuePage: true }
      }
      if (newIssuePageRegex.test(tabUrl)) {
        return { owner, repo, onNewIssuePage: true }
      }
      if (pullRequestPageRegex.test(tabUrl)) {
        return { owner, repo, pullRequestNumber: number, onPRPage: true }
      }
      return undefined
    }

    const message = getMessage()
    if (message) {
      // update shared state
      state.message = message
      state.tabId = tab.id

      sendMessage(state)
    }
  })

  const onCompleted = ({ url }: { url: string }) => {
    if (url.match(/partial/)) {
      sendMessage(state)
    }
  }

  const urls = flatten(
    githubUrls.map(githubUrl =>
      cleanedUrlPatterns.map(urlPattern => `https://${githubUrl}/${urlPattern}`),
    ),
  )

  chrome.webRequest.onCompleted.addListener(onCompleted, { urls }, ['responseHeaders'])
})
