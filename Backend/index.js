const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables
const db = require('./db'); // Import database connection
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


const listEndpoints = require('express-list-endpoints');

const userRoutes = require('./Routes/userRoutes'); // HTTP
const chatRoutes = require('./Routes/chatRoutes'); // HTTP
const skillRoutes = require('./Routes/skillRoutes');
const experienceRoutes = require('./Routes/experienceRoutes');
const courseRoutes = require('./Routes/courseRoutes');
const morgan = require('morgan');

const { typeDefs, resolvers } = require('./graphql/schema'); // Import GraphQL schema & resolvers

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// HTTP Routes (Users will remain RESTful)
const API_PREFIX = '/PeerBridge';
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/course`, courseRoutes);
app.use(`${API_PREFIX}/experience`, experienceRoutes);
app.use(`${API_PREFIX}/skills`, skillRoutes);
app.use(`${API_PREFIX}/chat`, chatRoutes);


// Apollo Server for GraphQL (Resources, Experiences, Courses)
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1];
        let user = null;

        if (token) {
          try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            user = decoded; // Attach user data to the context
          } catch (err) {
            console.error("JWT Verification Failed:", err.message);
          }
        }

        console.log(user);
        return { user }; // Return user (null if no token provided)
      }
    })
  );
}

startServer().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🔗 GraphQL API available at http://localhost:${PORT}/graphql`);
  });
});

