Open Truss uses nested composable configurations to define everything in the system. This allows for its users to share and build on each other's work and for the community to help create reusable configurations.

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
