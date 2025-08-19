#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './server.js';

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Document MCP server running on stdio');
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main().catch(console.error);
}