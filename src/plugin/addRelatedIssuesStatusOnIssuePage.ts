import * as $ from 'jquery'
// import * as marked from 'marked'
import { Issue } from './types'

$(document).on('click', '.issue-page.gwfp-issue-description-header', () => {
  $('.gwfp-issue-description').toggleClass('visible')
})

const appendSubIssuesDescriptionBox = (issuesLength: number) => {
  const issueDescriptionBox = $(`
    <div class='issue-page gwfp-issue-description'>
      <div class='issue-page gwfp-issue-description-header'>
        RELATED ISSUES  |  ${issuesLength}
        <span class='gwfp-issue-description-arrow-down'>▼</span>
        <span class='gwfp-issue-description-arrow-up'>▲</span>
      </div>
      <div class='gwfp-issue-description-content markdown-body markdown-format'>
      </div>
    </div>
  `)
  $('.gwfp-issue-description').remove()
  $('#discussion_bucket').prepend(issueDescriptionBox)
}

const appendIssueDescription = ({ owner, repo }: { owner: string; repo: string }) => (
  issue: Issue,
) => {
  const issueLink = `<a href="/${owner}/${repo}/issues/${issue.number}">#${issue.number}</a>`

  const html = `
    <div class="subissue"> 
      <div>
      ${issue.title} - ${issueLink} 
      <span class="${issue.state}">${issue.state}</span>
      </div>
    </div>`

  $(`.gwfp-issue-description-content`).append(html)
}

export default function({ owner, repo }: { owner: string; repo: string }) {
  chrome.storage.sync.get({ githubToken: '' }, ({ githubToken }) => {
    const apiBaseUrl = 'https://api.github.com/'
    const issues = $('.discussion-item-ref-title .issue-num')
    const apiToken = githubToken as string | undefined
    if (apiToken && issues.length) {
      appendSubIssuesDescriptionBox(issues.length)
      Array.from(issues).forEach((issue: HTMLElement) => {
        const issueNumber = issue.innerHTML.slice(1)
        $.get(
          `${apiBaseUrl}repos/${owner}/${repo}/issues/${issueNumber}?access_token=${apiToken}`,
          appendIssueDescription({
            owner,
            repo,
          }),
        )
      })
    }
  })
}
