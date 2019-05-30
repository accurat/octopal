import * as $ from 'jquery'
import * as marked from 'marked'

$(document).on('click', '.gwfp-issue-description-header', () => {
  $('.gwfp-issue-description').toggleClass('visible')
})

const appendIssueDescriptionBox = ({
  associatedIssueNumber,
  owner,
  repo,
}: {
  associatedIssueNumber: string
  owner: string
  repo: string
}) => {
  const issueDescriptionBox = $(`
    <div class='gwfp-issue-description issue-${associatedIssueNumber}'>
      <div class='gwfp-issue-description-header'>
        ISSUE DESCRIPTION <a href="/${owner}/${repo}/issues/${associatedIssueNumber}">#${associatedIssueNumber}</a>
        <span class='gwfp-issue-description-arrow-down'>▼</span>
        <span class='gwfp-issue-description-arrow-up'>▲</span>
      </div>
      <div class='gwfp-issue-description-content issue-${associatedIssueNumber} markdown-body markdown-format'>
        -
      </div>
    </div>
  `)
  $(`.gwfp-issue-description.issue-${associatedIssueNumber}`).remove()
  $('#discussion_bucket').prepend(issueDescriptionBox)
}

interface Issue {
  body: string
  number: number
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
      const associatedIssueNumber = issue.innerHTML.slice(1)
      const apiToken = githubToken as string | undefined
      if (apiToken && associatedIssueNumber) {
        appendIssueDescriptionBox({
          associatedIssueNumber,
          owner,
          repo,
        })
        $.get(
          `${apiBaseUrl}repos/${owner}/${repo}/issues/${associatedIssueNumber}?access_token=${apiToken}`,
          appendIssueDescription,
        )
      }
    })
  })
}
