# Document MCP Server

A Model Context Protocol (MCP) server designed to efficiently manage component documentation with AI-powered updates and token optimization.

## Features

- **🚀 Component Scanning**: Automatically scan project `components` folder and generate structured information  
- **🔐 MD5 Hashing**: Generate MD5 hashes for files to track changes
- **📋 Component Queries**: Quickly retrieve specific component details
- **✏️ Precision Updates**: Update only description or props sections, saving significant tokens
- **🤖 AI-Friendly**: Structured updates prevent AI hallucinations and unnecessary modifications
- **📊 Token Optimization**: Save ~75% tokens compared to traditional full-file regeneration

## Installation

### NPM Package

```bash
# Install globally
npm install -g @tianyi-li/document-mcp

# Install as project dependency
npm install @tianyi-li/document-mcp
```

### Development Setup

```bash
# Clone and setup
git clone https://github.com/TianyiLi/document-mcp.git
cd document-mcp
pnpm install
pnpm run build
```

## Quick Start

### 1. Basic Usage

```bash
# Run the MCP server
document-mcp

# Or use npx/pnpx
npx @tianyi-li/document-mcp
```

### 2. IDE Integration

#### Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "document-mcp": {
      "command": "npx",
      "args": ["@tianyi-li/document-mcp"]
    }
  }
}
```

#### Claude Code

##### Option 1: Through Claude Desktop (Automatic)
Claude Code automatically detects MCP servers configured in Claude Desktop - no additional setup required.

##### Option 2: Direct CLI Configuration
Configure directly via Claude Code CLI:

```bash
# Using npx (recommended)
claude mcp add document-mcp -- npx @tianyi-li/document-mcp

# Using global installation
claude mcp add document-mcp -- document-mcp

# List configured servers
claude mcp list

# Remove if needed
claude mcp remove document-mcp
```

##### Project Documentation (CLAUDE.md)
Add to your project's `CLAUDE.md` for team reference:

```markdown
# Document MCP Server

This project uses Document MCP Server for efficient component documentation management.

## Setup
```bash
# Quick setup
npm install -g @tianyi-li/document-mcp
claude mcp add document-mcp -- document-mcp
```

## Available Tools
- `init_components` - Scan all project components  
- `get_component_info` - Get specific component details
- `update_component_description` - Update description only (saves ~75% tokens)
- `update_component_props` - Update props only (saves ~75% tokens)
- `update_component_content` - Batch update multiple sections
- `compare_md5` - Verify file changes

## Workflow
1. `init_components` → Understand project structure
2. `update_component_*` → Make targeted updates
3. `compare_md5` → Verify changes
```

## API Reference

### Reading Tools

#### `init_components`
Scan components folder and generate structured JSON data.

**Parameters:**
- `projectRoot` (optional): Project root path, defaults to current directory

**Returns:**
```json
[
  {
    "name": "Button",
    "path": "components/Button", 
    "description": "A reusable button component",
    "props": "Props information",
    "md5": "a1b2c3d4e5f6..."
  }
]
```

#### `get_component_info`
Get detailed information for a specific component.

**Parameters:**
- `componentName` (required): Component name
- `projectRoot` (optional): Project root path

**Returns:** Single component JSON object

### Update Tools ⭐ Core Value

#### `update_component_description`
Precisely update component description section - **best choice for token saving**.

**Parameters:**
- `componentName` (required): Component name
- `description` (required): New component description
- `projectRoot` (optional): Project root path

**Usage:** AI agents can update only the description section without regenerating entire files

#### `update_component_props`
Precisely update component Props section with Markdown table support.

**Parameters:**
- `componentName` (required): Component name
- `props` (required): New Props content (supports Markdown format)
- `projectRoot` (optional): Project root path

**Example Props Format:**
```markdown
| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| variant | "primary" \| "secondary" | No | "primary" | Button style |
| size | "small" \| "medium" \| "large" | No | "medium" | Button size |
| disabled | boolean | No | false | Whether disabled |
```

#### `update_component_content`
Batch update component description and/or Props with partial update support.

**Parameters:**
- `componentName` (required): Component name
- `description` (optional): New component description
- `props` (optional): New Props content
- `projectRoot` (optional): Project root path

**Usage:** Can update multiple sections simultaneously or individually

### Validation Tools

#### `calculate_md5`
Calculate MD5 hash for specified file.

**Parameters:**
- `filePath` (required): File path for MD5 calculation

**Returns:** MD5 hash string

#### `compare_md5`
Compare current file MD5 with expected value.

**Parameters:**
- `filePath` (required): File path to check
- `expectedMd5` (required): Expected MD5 hash value

**Returns:**
```json
{
  "currentMd5": "current file MD5",
  "expectedMd5": "expected MD5", 
  "isMatch": true/false,
  "hasChanged": true/false
}
```

## Use Cases

### Reading Phase
1. **Automated Documentation Management**: AI agents quickly understand project component structure
2. **Component Information Queries**: Avoid scanning entire project structure, saving tokens
3. **File Change Tracking**: Ensure document content consistency through MD5 comparison

### Update Phase ⭐ Core Value
4. **Precision Document Updates**: Update only necessary parts (description or Props), dramatically saving tokens
5. **Prevent AI Hallucinations**: Structured updates avoid AI adding/removing unnecessary items
6. **Incremental Maintenance**: Modify based on existing content rather than complete rewrites
7. **Consistency Guarantee**: Use standard templates and formats for unified document style

### Workflow Example
```
1. init_components          → Understand all components
2. get_component_info       → Get specific component current state
3. update_component_description → Update only description section
4. compare_md5              → Verify update success
```

### Token Savings
- **Traditional Method**: AI reads full file + regenerates complete file = ~2000 tokens
- **Using This Tool**: Get existing info + precise partial updates = ~500 tokens  
- **Savings Rate**: ~75% token reduction

## Project Structure

This tool assumes your project has the following structure:

```
project-root/
├── components/
│   ├── Button/
│   │   └── README.md
│   ├── Input/
│   │   └── README.md
│   └── ...
└── ...
```

Each component folder should contain a `README.md` file with component description and props information.

## Configuration Examples

### Using pnpx/npx (Recommended)

```json
{
  "mcpServers": {
    "document-mcp": {
      "command": "pnpx",
      "args": ["@tianyi-li/document-mcp"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

### Direct Binary Execution

```json
{
  "mcpServers": {
    "document-mcp": {
      "command": "/path/to/node_modules/.bin/document-mcp"
    }
  }
}
```

### Global Installation

```bash
# Install globally
npm install -g @tianyi-li/document-mcp

# Use in Claude Desktop config
{
  "mcpServers": {
    "document-mcp": {
      "command": "document-mcp"
    }
  }
}
```

## Development

### Build from Source

```bash
git clone https://github.com/TianyiLi/document-mcp.git
cd document-mcp
pnpm install
pnpm run build
```

### Available Scripts

```bash
pnpm run build    # Compile TypeScript
pnpm run dev      # Watch mode compilation
pnpm start        # Run the server
```

### Best Practices

1. **First Use**: Run `init_components` to scan project components
2. **Change Tracking**: Use `compare_md5` to check for file modifications  
3. **Specific Queries**: Use `get_component_info` for individual component details
4. **Regular Sync**: Periodically run `init_components` to keep data current
5. **Token Optimization**: Use precise update tools instead of full rewrites

## Requirements

- Node.js >= 18.0.0
- Components organized in `/components` folder structure
- Each component should have a `README.md` file

## License

ISC License

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/TianyiLi/document-mcp).

## Repository

- **Homepage**: [https://github.com/TianyiLi/document-mcp](https://github.com/TianyiLi/document-mcp)
- **Issues**: [https://github.com/TianyiLi/document-mcp/issues](https://github.com/TianyiLi/document-mcp/issues)
- **NPM**: [@tianyi-li/document-mcp](https://www.npmjs.com/package/@tianyi-li/document-mcp)