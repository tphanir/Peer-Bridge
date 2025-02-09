const courseResolvers = require('./resolvers/courseResolvers');
const experienceResolvers = require('./resolvers/experienceResolvers');
const resourceResolvers = require('./resolvers/skillResolvers');

const resolvers = {
  Query: {
    ...courseResolvers.Query,
    ...experienceResolvers.Query,
    ...resourceResolvers.Query,
  },
  Mutation: {
    ...courseResolvers.Mutation,
    ...experienceResolvers.Mutation,
    ...resourceResolvers.Mutation,
  },
};

module.exports = resolvers;
