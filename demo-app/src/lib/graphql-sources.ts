const sources = {
  'github-graphql-demo': {
    config: {
      uri: 'https://api.github.com/graphql',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  },
}

export default sources
