#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createServer } from '../server';
import { logger } from '../utils/logger';
import { loadConfig } from '../utils/config';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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
        })
        .option('env-file', {
          describe: 'Path to .env file with Trello credentials',
          type: 'string',
          default: undefined,
        });
    },
    handler: (argv) => {
      // If a custom env file is specified, load it
      if (argv['env-file']) {
        const envFilePath = path.resolve(process.cwd(), argv['env-file']);
        if (fs.existsSync(envFilePath)) {
          logger.info(`Loading environment variables from ${envFilePath}`);
          dotenv.config({ path: envFilePath });
        } else {
          logger.error(`Environment file not found: ${envFilePath}`);
          process.exit(1);
        }
      }
      
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