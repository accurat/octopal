import '../manifest.json'
import './styles/plugin.scss'
import * as $ from 'jquery'

import addSubIssueButton from './addSubIssueButton'
import addIssueDescriptionOnPrPage from './addIssueDescriptionOnPrPage'

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
    }
  } catch (err) {
    console.error(err)
  }

  return true
})
