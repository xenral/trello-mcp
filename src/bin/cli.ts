#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createServer } from '../server';
import { logger } from '../utils/logger';
import { loadConfig } from '../utils/config';

// Parse command line arguments
yargs(hideBin(process.argv))
  .command({
    command: 'start',
    describe: 'Start the Trello MCP server',
    builder: (yargs) => {
      return yargs
        .option('port', {
          describe: 'Port to run the server on',
          type: 'number',
          default: undefined,
        });
    },
    handler: (argv) => {
      const config = loadConfig();
      const port = argv.port || config.PORT || 3000;
      
      const server = createServer();
      
      server.listen(port, () => {
        logger.info(`🚀 Trello MCP server started at http://localhost:${port}`);
        logger.info(`Using board ID: ${config.TRELLO_BOARD_ID || 'Not set'}`);
      });
    },
  })
  .command({
    command: 'version',
    describe: 'Show version information',
    handler: () => {
      // Read package.json to get version
      const pkg = require('../../package.json');
      console.log(`Trello MCP Server v${pkg.version}`);
    },
  })
  .demandCommand(1, 'Please specify a command')
  .help()
  .argv; 