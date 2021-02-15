
module.exports = {
    // Target must be serverless
    target: "serverless",

    // https://nextjs.org/docs/api-reference/next.config.js/redirects
    async redirects() {
      return [
        {
          source: '/about',
          destination: '/',
          permanent: true,
        },
      ]
    },
  }