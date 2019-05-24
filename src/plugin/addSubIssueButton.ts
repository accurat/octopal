import * as $ from 'jquery'
import * as querystring from 'query-string'

export default function addSubIssueButton({ owner, repo }: { owner: string; repo: string }) {
  const newIssueURL = `/${owner}/${repo}/issues/new`
  const parentIssueTitle = $('span.js-issue-title').text()
  const [, topic = undefined] = parentIssueTitle.match(/\[(.+)\]/) || []

  const sideBar = $('#partial-discussion-sidebar')

  const newSubIssueButton = $(`
    <div class="discussion-sidebar-item" style="padding-top: 0;">
      <a
        class="btn btn-sm accurat-new-sub-issue-button"
        style="margin-top: 2px; width: 100%; text-align: center;"
      >
        <span class="octicon octicon-tasklist"></span>
        New sub-issue
      </a>
    </div>
  `)

  const needTopicMessage = $(`
    <div
      class="reason text-small text-muted accurat-need-topic-message"
      style="margin-top: 6px;"
    >
      You need to add a topic to the issue title to add a sub-issue
      (then please reload the page)
    </div>
  `)

  // CLEAN
  $('.accurat-new-sub-issue-button')
    .parent()
    .remove()
  $('.accurat-new-sub-issue-button').remove()
  $('.accurat-need-topic-message').remove()

  sideBar.prepend(newSubIssueButton)

  if (!topic) {
    newSubIssueButton
      .children()
      .first()
      .addClass('disabled')
      .prop('disabled', true)
    needTopicMessage.insertAfter($('.accurat-new-sub-issue-button'))
  }

  $('.accurat-new-sub-issue-button').on('click', () => {
    if ($('.accurat-new-sub-issue-button').hasClass('disabled')) {
      return
    }
    const milestone = $('.milestone-name').prop('title')
    const parentIssueNumber = $('.gh-header-number')
      .text()
      .replace('#', '')
    const labels = $('.labels > .IssueLabel > span')
      .toArray()
      .map(x => x.innerHTML)
      .filter(x => x !== 'macro')

    const query = {
      milestone,
      labels,
      parentIssueNumber,
      topic,
      project: repo,
      t: 'subIssue',
    }
    const url = `https://nemobot.our.buildo.io/templates?${querystring.stringify(query)}` // this is temporary
    $.get(url, res => {
      window.location.href = `${newIssueURL}?${res.subIssue.computedQuery}`
    })
  })
}
