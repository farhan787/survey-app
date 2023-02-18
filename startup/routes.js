const { graphqlHTTP } = require('express-graphql');

const graphqlRootResolver = require('../graphql/rootResolver');
const graphqlSchema = require('../graphql/schema');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: graphqlSchema,
      rootValue: graphqlRootResolver,
      graphiql: { headerEditorEnabled: true },
    })
  );

  app.use(error);
};
