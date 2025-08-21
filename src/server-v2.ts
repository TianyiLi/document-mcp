import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fg from 'fast-glob';
import path from 'path';
import * as R from 'ramda';
import fs from 'fs';
import { detectNewline } from 'detect-newline';

export const server = new McpServer(
  {
    name: 'document-mcp',
    version: '1.0.0',
    description: 'A MCP server for component document generation',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

function getRepoPath(componentAbsPath: string) {
  return {
    repoPath: path.dirname(componentAbsPath),
    componentName: path.basename(componentAbsPath).replace('.tsx', ''),
  }
}

const persisReadmeCache = new Map<string, ReadmeSectionItem[]>();

export async function initializeProcess() {
  const currentPWD = process.cwd();
  const entries = await fg.glob(`${currentPWD}/components/**/README.md`);
  for (const entry of entries) {
    const readmeContent = fs.readFileSync(entry, 'utf-8');
  }
}

const NEW_SECTION_SEPARATOR = '---'


server.tool(
  'query-component',
  `Get component description already in */components/**/Readme.md, and return component with their description, props, and md5`,
  {
    componentAbsPath: z.string().endsWith('.tsx').describe('The absolute path of the component'),
  },
  async ({ componentAbsPath }) => {
    const { repoPath, componentName } = getRepoPath(componentAbsPath);
    const readmePath = path.join(repoPath, 'components', componentName, 'README.md');
    
    return {
      content: [{ type: 'text', text: 'Hello, world!' }],
    };
  }
);
