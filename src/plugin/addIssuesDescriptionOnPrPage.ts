import * as $ from 'jquery'
import * as marked from 'marked'
import { Issue } from './types'

// $(document).on('click', '.gwfp-issue-description-header', () => {
//   $('.gwfp-issue-description').toggleClass('visible')
// })

const appendIssueDescriptionBox = ({
  issueNumber,
  owner,
  repo,
}: {
  issueNumber: string
  owner: string
  repo: string
}) => {
  const issueDescriptionBox = $(`
    <div class='gwfp-issue-description issue-${issueNumber}'>
      <div class='gwfp-issue-description-header issue-${issueNumber}'>
        ISSUE DESCRIPTION <a href="/${owner}/${repo}/issues/${issueNumber}">#${issueNumber}</a>
        <span class='gwfp-issue-description-arrow-down'>▼</span>
        <span class='gwfp-issue-description-arrow-up'>▲</span>
      </div>
      <div class='gwfp-issue-description-content issue-${issueNumber} markdown-body markdown-format'>
        -
      </div>
    </div>
  `)
  $(`.gwfp-issue-description.issue-${issueNumber}`).remove()
  $('#discussion_bucket').prepend(issueDescriptionBox)
  const open = () => {
    $(`.gwfp-issue-description.issue-${issueNumber}`).toggleClass('visible')
  }
  $(`.gwfp-issue-description.issue-${issueNumber}`).on('click', {}, open)
}

const appendIssueDescription = (issue: Issue) => {
  const html = marked(issue.body)
  $(`.gwfp-issue-description-content.issue-${issue.number}`).html(html)
}

export default function({ owner, repo }: { owner: string; repo: string }) {
  chrome.storage.sync.get({ githubToken: '' }, ({ githubToken }) => {
    const apiBaseUrl = 'https://api.github.com/'
    const issues = $('.comment-body .issue-link')
    Array.from(issues).forEach((issue: HTMLElement) => {
      const issueNumber = issue.innerHTML.slice(1)
      const apiToken = githubToken as string | undefined
      if (apiToken && issueNumber) {
        appendIssueDescriptionBox({
          issueNumber,
          owner,
          repo,
        })
        $.get(
          `${apiBaseUrl}repos/${owner}/${repo}/issues/${issueNumber}?access_token=${apiToken}`,
          appendIssueDescription,
        )
      }
    })
  })
}
