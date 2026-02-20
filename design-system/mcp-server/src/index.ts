#!/usr/bin/env node

/**
 * Syncrofy Design System MCP Server
 *
 * Provides AI tools with access to design tokens, component metadata,
 * code generation, and migration assistance via the Model Context Protocol.
 *
 * Transport: stdio (for use with Cursor, Claude Desktop, and other local MCP clients)
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerResources } from './resources.js';
import { registerTools } from './tools.js';
import { registerPrompts } from './prompts.js';

const server = new McpServer(
  {
    name: 'syncrofy-design-system',
    version: '1.0.4',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
      logging: {},
    },
  }
);

// Register all resources, tools, and prompts
registerResources(server);
registerTools(server);
registerPrompts(server);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
