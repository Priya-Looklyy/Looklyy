const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});


