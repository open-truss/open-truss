Open Truss uses nested composable configurations to define everything in the system. This allows for its users to share and build on each other's work and for the community to help create reusable configurations.

## Key concepts
- **Workflow**.
  - A grouping of pieces of configuration. It has all of the information necessary to be usable on its own.
  - Workflows have a name and optionally a description.
  - Workflows also include some combination of the following:
    - **Query**.
      - A specification for how to retrieve data for a workflow.
      - Queries must specify their `type` (e.g. MYSQL, GRAPHQL, REST) and `source` (the URL or configured host to use).
      - A workflow can only have a single query.
    - **Components**.
      - A list of React components to render for this workflow.
      - Each component is automatically given its workflow's query's results.
      - Components may also have additional configuration, through a field called `props`.
    - **Workflows**.
      - A workflow can have other workflows nested underneath it.
      - For example, a workflow could define a webpage that has many workflows on it.
      - Because of this, some workflows will have no query nor components; they will only define a collection of workflows.
- **Global ID**.
  - Everything in Open Truss is automatically assigned a global identifier.
  - An Open Truss Global ID is a valid URL path.

## Sample configuration

```md
---
# List of all workflows
workflows:
  - workflow: &umgkhFraz+rYZ15xkUa6gw==
    # Randomly generated ID of workflow. Set as anchor for reuse.
    # omitting details for brevity

  - workflow:
    # This top-level workflow has no query or components itself. Instead, it only
    # defines the name and description and then renders additional workflows underneath it.
    name: Accounts created on 2023-10-16
    description: Renders PageTitle, DataTable, and TotalCount components.
    - layout: AccountDashboard
    - component_layout:
      # We'll need to figure out what yaml / string readable datastructure makes sense
      # to represent the orientation of components on a page. This of course should be
      # mostly transparent to the user and their experience should be mostly drag and drop.
      # It would be nice if the strings are readable enough to where it isn't too onerous to
      # modify this directly, similar to datadot json configs.

    - component: PageTitle
      # This workflow has no query. Its PageTitle component has its props set in the configuration.
      props:
        title: Accounts created on 2023-10-16

    - component: <<: *umgkhFraz+rYZ15xkUa6gw==
      # This entire workflow is reused.
      - layout: inherit
        # ignore the default layout. perhaps this can be done automatically without an annotation

    - component:
      # This workflow will execute a query and render its results in a DataTable
      # component and summarize those same results in a TotalCount component.
      - query:
        query: select account_id, account_login from accounts where date(created_at) = '2023-10-16' order by id desc;
        type: MYSQL
        datasource: &some_reference_to_a_database
        - component: DataTable
          # Props are defined by components. In this case `columnConfiguration` is an object
          # whose keys map to column headers from the query and defines how to render a
          # specialized component for each row's value for that column.
          props:
            columnConfiguration:
              account_id:
                component: Link
                props:
                  url_format: "/accounts/:account_id"
                  hotkey: "g a"

        - component: TotalCount
          # Components each get the query's results automatically.
          # TotalCount doesn't need any additional configuration, so we pass nothing in.
```
