import '../manifest.json'
import './styles/plugin.scss'
import * as $ from 'jquery'

import addSubIssueButton from './addRelatedIssueButton'
import addIssueDescriptionOnPrPage from './addIssuesDescriptionOnPrPage'
import addRelatedIssuesStatusOnIssuePage from './addRelatedIssuesStatusOnIssuePage'

chrome.runtime.onMessage.addListener(({ onIssuePage, onPRPage, owner, repo }) => {
  try {
    const isGithubLoading = !!$('.is-context-loading').length

    if (isGithubLoading) {
      return
    }

    if (onPRPage) {
      addIssueDescriptionOnPrPage({ owner, repo })
    }

    if (onIssuePage) {
      addSubIssueButton({ owner, repo })
      addRelatedIssuesStatusOnIssuePage({ owner, repo })
    }
  } catch (err) {
    console.error(err)
  }

  return true
})
