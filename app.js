import fs from 'fs';
import https from 'https';
import { handler as ssrHandler } from './dist/server/entry.mjs';

const app = ssrHandler;

const options = {
  key: fs.readFileSync('/etc/ssl/private/anfibiusrecursos.key'),
  cert: fs.readFileSync('/etc/ssl/certs/anfibiusrecursos.crt')
};

const server = https.createServer(options, app);
const port = 42069;

server.listen(port, () => {
  console.log(`Server app running on https://localhost:${port}`);
});
