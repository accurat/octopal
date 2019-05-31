import * as $ from 'jquery'
import * as querystring from 'query-string'

export default function addRelatedIssueButton({ owner, repo }: { owner: string; repo: string }) {
  const newIssueURL = `/${owner}/${repo}/issues/new`
  const parentIssueTitle = $('span.js-issue-title').text()
  const [, topic = undefined] = parentIssueTitle.match(/\[(.+)\]/) || []

  const sideBar = $('#partial-discussion-sidebar')

  const newRelatedIssueButton = $(`
    <div class="discussion-sidebar-item" style="padding-top: 0;">
      <a
        class="btn btn-sm accurat-new-related-issue-button"
        style="margin-top: 2px; width: 100%; text-align: center;"
      >
        <span class="octicon octicon-tasklist"></span>
        New related issue
      </a>
    </div>
  `)

  const needTopicMessage = $(`
    <div
      class="reason text-small text-muted accurat-need-topic-message"
      style="margin-top: 6px;"
    >
      You need to add a [topic] to the issue title (text surrounded by square brackets) in order to add a related issue
      (then refresh the page)
    </div>
  `)

  // CLEAN
  $('.accurat-new-related-issue-button')
    .parent()
    .remove()
  $('.accurat-new-related-issue-button').remove()
  $('.accurat-need-topic-message').remove()

  sideBar.prepend(newRelatedIssueButton)

  if (!topic) {
    newRelatedIssueButton
      .children()
      .first()
      .addClass('disabled')
      .prop('disabled', true)
    needTopicMessage.insertAfter($('.accurat-new-related-issue-button'))
  }

  $('.accurat-new-related-issue-button').on('click', () => {
    if ($('.accurat-new-related-issue-button').hasClass('disabled')) {
      return
    }
    const milestone = $('.milestone-name').prop('title')
    const parentIssueNumber = $('.gh-header-number').html()
    console.log(parentIssueNumber)
    const labels = $('.labels > .IssueLabel > span')
      .toArray()
      .map(x => x.innerHTML)
      .join()

    const query = {
      milestone,
      labels,
      body: `< ${parentIssueNumber}`,
      title: `[${topic}] <issue_title>`,
    }

    window.open(`${newIssueURL}?${querystring.stringify(query)}`)
  })
}
