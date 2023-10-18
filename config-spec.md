Open Truss uses nested composable configurations to define everything in the system. This allows for its users to share and build on each other's work and for the community to help create reusable configurations.

## Key concepts
- **Workflow**.
  - A grouping of pieces of configuration. It has all of the information necessary to be usable on its own.
  - Workflows have optional names and descriptions.
  - Workflows can specify a **Query**.
    - **Query**.
      - A specification for how to retrieve data for a workflow.
      - Queries must specify their `type` (e.g. MYSQL, GRAPHQL, REST) and `source` (the URL or configured host to use).
      - A workflow can only have a single query.
  - Workflows can either specify a component to render or nested workflows:
    - **Component**.
      - A React component to render for this workflow.
      - Components are automatically given their workflow's query's results, if any.
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
# This top-level workflow has no query or components itself. Instead, it only
# defines the name and description and then renders additional workflows underneath it.
name: Accounts created on 2023-10-16
description: Renders PageTitle, DataTable, and TotalCount components.

workflows:
  # This workflow has no query. Its PageTitle component has its props set in the configuration.
  - name: First Workflow
    component:
      component: PageTitle
      props:
        title: Accounts created on 2023-10-16

  # This workflow will execute a query and render its results in a DataTable
  # component and summarize those same results in a TotalCount component.
  - name: Second Workflow
    query:
      query: select account_id, account_login from accounts where date(created_at) = '2023-10-16' order by id desc;
      type: MYSQL
      host: some-server
    workflows:
      - component:
          component: DataTable
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

      - component:
          component: TotalCount
          # Components each get the query's results automatically.
          # TotalCount doesn't need any additional configuration, so we pass nothing in.
```
