const { graphqlHTTP } = require('express-graphql');

const graphqlRootResolver = require('../graphql/rootResolver');
const graphqlSchema = require('../graphql/schema');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(
    '/graphql',
    graphqlHTTP((req) => ({
      schema: graphqlSchema,
      rootValue: graphqlRootResolver,
      graphiql: true,
      context: { accessToken: req.headers['access-token'] },
    }))
  );

  app.use(error);
};
