Open Truss uses nested composable configurations to define everything in the system. This allows for its users to share and build on each other's work and for the community to help create reusable configurations.

# Config Spec v0.0.1

## Key concepts
- **Frame**.
  - A grouping of pieces of configuration. It has all of the information necessary to be usable on its own.
  - Frames can specify:
    - (optional) **Name**.
    - (optional) **Description**.
    - (optional) **Data**.
      - A specification for how to retrieve data for a Frame.
      - Queries must specify their `type` (e.g. MYSQL, GRAPHQL, REST) and `source` (the URL or configured host to use).
      - A Frame can only have a single data configuration.
    - (optional) **Layout**.
      - Spec for `layout` is to be determined, but could probably start with some sort of Flexbox configuration.
  - Additionally, Frames can specify a view to render _or_ nested frames:
    - **View**.
      - A React component to render for this frame.
      - Components are automatically given their frame's query's results, if any.
      - Components may also have additional configuration, through a field called `props`.
    - **Frames**.
      - A frame can have other frames nested underneath it.
      - For example, a frame could define a webpage that has many frames on it.
      - Because of this, some frames will have no query nor components; they will only define a collection of frames.
- **Workflow**.
  - A 'top level' collection of Frames.
  - These are the main collections of Frames that are used in the system.
  - Their **Name** is required.
- **Global ID**.
  - Everything in Open Truss is automatically assigned a global identifier.
  - An Open Truss Global ID is a valid URI path.

## Sample configuration

```md
---
workflow:
  name: Accounts created on 2023-10-16
  description: Renders PageTitle, DataTable, and TotalCount components.
  layout: TBD

  frames:
    # This frame has no query. Its PageTitle component has its props set in the configuration.
    - frame:
      view:
        component: PageTitle
        props:
          title: Accounts created on 2023-10-16

    # This frame will execute a query and render its results in a DataTable
    # component and summarize those same results in a TotalCount component.
    - frame:
      data:
        query: select account_id, account_login from accounts where date(created_at) = '2023-10-16' order by id desc;
        type: MYSQL
        source: &some_reference_to_datasource_configs_or_client
      frames:
        - frame:
          view:
            component: DataTable
            props:
              showTooltips: false
        - frame:
          view:
            component: TotalCount
            # Components each get the query's results automatically.
            # TotalCount doesn't need any additional configuration, so we pass nothing in.
```

# Config Spec v0.0.2

<details>

<summary>details</summary>

## Key concepts

- **signals** - This is a global state store that can be accessed by all parts of the workflow.
  - This will allow us to easily share state across workflows, components, and data.
  - Workflows, components, and data declare what signals they need and we can validate at config compile time when the workflow is not configured with the needed signals. If a signal is is missing we can do things like show a warning to the user or auto-suggest adding signals to their config.
- **frameRender** - This is tells the render how to render the current level of frames.
  - By default it will render frames inline.
  - The `sequence` annotation tells the renderer to render only one frame at a time. We will pass in navigation functions into components which will allow them to tell the render to move to the next / prev frames. We can persist a cursor to local / server storage saying where the user is in the workflow and the renderer can use that to render the appropriate frame on page load.
- **storedQuery** - This data type tells the renderer to use stored queries to fetch results.
  - If the current url matches `/stored_queries/id/sessions/id`
    - it issues a GET request to fetch results from that url (it shows a loading indicator while results are being fetched by the stored query backend)
    - else if there are signals in the global store that match the parameters needed for the query
      - It sends a POST to create stored query, sets the cursor for the current location in the workflow, then redirects to the stored query url returned by the POST. The redirect will trigger the first part of this condition.
    - else redirect the user back to the beginning of the workflow.
  - The `pageSize` annotation sets how many results to show per page. Default 1.
  - Components will be given navigation functions. There will be a navigation function that moves to the next page of results (e.g. increments the pagination, fetches more results, and re-renders the frame).
- **Local / server store** - We can persist values to local storage or the server.
  - This is useful for persisting workflow and pagination cursors among other values.
  - For the server store, we can add a `store` column to the workflow sessions table to hold arbitrary json data.

## Sample configuration

```yaml
# Worfklow name: Get all issues for a given user
# This is a multi-stage workflow
# 1. Show input form to add account_id
# 2. User inputs account_id
# 3. Shows list of issues belonging to that account_id
workflow:
  version: 1
  signals:
    - account_id: number
  renderFrames: InSequence
  frames:
    - frame:
      view:
        component: OTInputForm
        props:
          fields:
            - :account_id
    - frame:
      data:
        query: >\n
          SELECT id AS issue_id
          FROM issues
          WHERE author_id = :account_id
        params:
          account_id: :account_id
        transforms:
          mapColumns:
            issue_id: issue_ids # TableOfContent
        type: StoredQuery
        pageSize: 50
        source: mysql1
      frames:
        - frame:
          view:
            component: OTStoredQueryToolbar
        - frame:
          view:
            component: TableOfContent
              content_ids: :issue_ids # example of argument aliasing
              content_type: issue
```

</details>
