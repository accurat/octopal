import * as $ from "jquery";
import * as marked from "marked";

$(document).on("click", ".gwfp-issue-description-header", () => {
  $(".gwfp-issue-description").toggleClass("visible");
});

const appendIssueDescriptionBox = ({
  associatedIssueNumber,
  owner,
  repo
}: {
  associatedIssueNumber: string;
  owner: string;
  repo: string;
}) => {
  const issueDescriptionBox = $(`
    <div class='gwfp-issue-description'>
      <div class='gwfp-issue-description-header'>
        ISSUE DESCRIPTION <a href="/${owner}/${repo}/issues/${associatedIssueNumber}">#${associatedIssueNumber}</a>
        <span class='gwfp-issue-description-arrow-down'>▼</span>
        <span class='gwfp-issue-description-arrow-up'>▲</span>
      </div>
      <div class='gwfp-issue-description-content markdown-body markdown-format'>
        -
      </div>
    </div>
  `);
  $(".gwfp-issue-description").remove();
  $("#discussion_bucket").prepend(issueDescriptionBox);
};

interface Issue {
  body: string;
}

const appendIssueDescription = (issue: Issue) => {
  const html = marked(issue.body);
  $(".gwfp-issue-description-content").html(html);
};

export default function({ owner, repo }: { owner: string; repo: string }) {
  chrome.storage.sync.get({ githubToken: "" }, ({ githubToken }) => {
    const apiBaseUrl = "https://api.github.com/";
    const prTitle = $(".js-issue-title").text();
    const getIssueNumberRE = /.*\(closes\s#(\d+)\).*/;
    const [, associatedIssueNumber = undefined] =
      prTitle.match(getIssueNumberRE) || [];
    const apiToken = githubToken as string | undefined;
    if (apiToken && associatedIssueNumber) {
      appendIssueDescriptionBox({
        associatedIssueNumber,
        owner,
        repo
      });
      $.get(
        `${apiBaseUrl}repos/${owner}/${repo}/issues/${associatedIssueNumber}?access_token=${apiToken}`,
        appendIssueDescription
      );
    }
  });
}
