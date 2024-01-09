[User Stories :woman_astronaut:] Abuse security analyst

## Biography

(There are many types of abuse security analysts with considerable nuance. Consider this painting with broad brushstrokes and not comprehensive.)

### Who are they?

They are tasked with protecting the platform from abuse, upholding the terms of service, and fostering a healthy environment for users.

### Motivations / Interests / Goals

- Preventing and removing content that is abusive or violates the TOS
- Protecting users from harmful or unwanted activity
- Having high impact while working sustainably

### Problems / Challenges

- The scale of activity and content is large and frequently changing, making it difficult to moderate.
- Abuse is sometimes adversarial and it can be a challenge contending with bad actors.
- Tools and capabilities are sometimes insufficient or scattered making usability difficult.

## Possible tools that could be built on Open Truss

(Consider the following workflows as illustrative. The point isn't the exact workflows, but to show how the problem could be solved in Open Truss. Further, what is important is that Open Truss should provide the framework for building tools / workflows quickly, reducing the time for experimentation and developing new workflows.)

- **Handling report abuse requests**
  - Scenario - A user reports another user as abusive.
  - Workflow - The analyst goes into the report abuse workflow which fetches open reports. They review the report and additional context (recent activity of the user and reporter, past reports made by the user and reporter, etc) then suspend the account or content.
- **Responding to spam campaigns**
  - Scenario - Bad actors are creating fake accounts and posting spam on the platform.
  - Workflow - The analyst goes into the spam workflow which fetches recently created users that have posted suspicious content. They review the user and additional context (recently created content, other users on the same IP, etc) then suspend the account or content.
- **Viewing and evaluating an abuse detection rule**
  - Scenario - Automated abuse detections need to be periodically reviewed.
  - Workflow - The analyst goes the rule dashboard which fetches rule performance metrics, associated zendesk false positive ticket write ins, rule definitions, relevant audit events (creation date, deploy dates, etc), matching content or accounts, etc. They review the detection to confirm it is still behaving as expected and if not disable the detection within the dashboard.
- **Handling DMCA requests**
  - Scenario - A user writes into Zendesk citing multiple pieces of content on the platform that violates copyright laws.
  - Workflow - The analyst goes into the DMCA ticket workflow which fetches open DMCA tickets from Zendesk. They review the content and additional context (user metadata, render of original content side by side, etc) then take down anything in violation. At the final stage, the workflow displays a summary, list of actions taken, the conversation history with the user, and the ability respond to and close the zendesk ticket.
- **Monitoring the launch of a new product**
  - Scenario - A new product is launched and we want a dashboard that monitors how it is being used and potentially abused.
  - Workflow - The analyst goes into the new product dashboard which fetches data from relevant sources. The dashboard could display recent zendesk tickets filtered by the product, most active users, recently created content or activity, log data from splunk, and trending topics from social media.
- **Gracefully reverting workflow changes**
  - Scenario - A team of abuse analysts share workflows to stay in sync. A teammate pushed a disruptive change that needs to be rolled back.
  - Workflow - The analyst reverts the change on the workflow or can individually use a previous version of the workflow. This flexibility reduces the disruption that can happen when tools change unexpectedly and makes it easier to move quickly and experiment with new changes.
