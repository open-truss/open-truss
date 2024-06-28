const sources = {
  'rest-demo': {
    config: {
      uri: 'https://api.github.com',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  },
  'auth-github-demo': {
    config: {
      uri: 'https://api.github.com',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  },
}

export default sources
