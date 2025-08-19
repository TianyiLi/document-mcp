import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, CallToolRequest, ListToolsRequestSchema, ListToolsRequest } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface ComponentInfo {
  name: string;
  path: string;
  description: string;
  props: string;
  md5: string;
}

const InitComponentsArgsSchema = z.object({
  projectRoot: z.string().optional(),
});

const CalculateMd5ArgsSchema = z.object({
  filePath: z.string(),
});

const GetComponentInfoArgsSchema = z.object({
  componentName: z.string(),
  projectRoot: z.string().optional(),
});

const CompareMd5ArgsSchema = z.object({
  filePath: z.string(),
  expectedMd5: z.string(),
});

const UpdateComponentDescriptionArgsSchema = z.object({
  componentName: z.string(),
  description: z.string(),
  projectRoot: z.string().optional(),
});

const UpdateComponentPropsArgsSchema = z.object({
  componentName: z.string(),
  props: z.string(),
  projectRoot: z.string().optional(),
});

const UpdateComponentContentArgsSchema = z.object({
  componentName: z.string(),
  description: z.string().optional(),
  props: z.string().optional(),
  projectRoot: z.string().optional(),
});

export const server = new Server({
  name: "document-mcp", 
  version: "1.0.0",
  description: "A MCP server for component document generation",
}, {
  capabilities: {
    tools: {},
  },
});

// 註冊 init 工具 - 掃描 components 並產生 JSON
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "init_components": {
      const validatedArgs = InitComponentsArgsSchema.parse(args || {});
      const projectRoot = validatedArgs.projectRoot || process.cwd();
      const componentsPath = path.join(projectRoot, 'components');
      
      if (!fs.existsSync(componentsPath)) {
        throw new Error("Components directory not found");
      }

      const components: ComponentInfo[] = [];
      const componentDirs = fs.readdirSync(componentsPath).filter(item => 
        fs.statSync(path.join(componentsPath, item)).isDirectory()
      );

      for (const dir of componentDirs) {
        const componentPath = path.join(componentsPath, dir);
        const readmePath = path.join(componentPath, 'README.md');
        
        if (fs.existsSync(readmePath)) {
          const content = fs.readFileSync(readmePath, 'utf-8');
          const md5Hash = crypto.createHash('md5').update(content).digest('hex');
          
          components.push({
            name: dir,
            path: path.relative(projectRoot, componentPath),
            description: extractDescription(content),
            props: extractProps(content),
            md5: md5Hash
          });
        }
      }

      return {
        content: [{ type: "text", text: JSON.stringify(components, null, 2) }]
      };
    }

    case "calculate_md5": {
      const validatedArgs = CalculateMd5ArgsSchema.parse(args);
      const filePath = validatedArgs.filePath;
      if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const md5Hash = crypto.createHash('md5').update(content).digest('hex');

      return {
        content: [{ type: "text", text: md5Hash }]
      };
    }

    case "get_component_info": {
      const validatedArgs = GetComponentInfoArgsSchema.parse(args);
      const componentName = validatedArgs.componentName;
      const projectRoot = validatedArgs.projectRoot || process.cwd();

      const componentPath = path.join(projectRoot, 'components', componentName);
      const readmePath = path.join(componentPath, 'README.md');

      if (!fs.existsSync(readmePath)) {
        throw new Error(`Component ${componentName} not found`);
      }

      const content = fs.readFileSync(readmePath, 'utf-8');
      const md5Hash = crypto.createHash('md5').update(content).digest('hex');

      const componentInfo: ComponentInfo = {
        name: componentName,
        path: path.relative(projectRoot, componentPath),
        description: extractDescription(content),
        props: extractProps(content),
        md5: md5Hash
      };

      return {
        content: [{ type: "text", text: JSON.stringify(componentInfo, null, 2) }]
      };
    }

    case "compare_md5": {
      const validatedArgs = CompareMd5ArgsSchema.parse(args);
      const filePath = validatedArgs.filePath;
      const expectedMd5 = validatedArgs.expectedMd5;

      if (!fs.existsSync(filePath)) {
        throw new Error("File not found");
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const currentMd5 = crypto.createHash('md5').update(content).digest('hex');
      const isMatch = currentMd5 === expectedMd5;

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            currentMd5,
            expectedMd5,
            isMatch,
            hasChanged: !isMatch
          }, null, 2) 
        }]
      };
    }

    case "update_component_description": {
      const validatedArgs = UpdateComponentDescriptionArgsSchema.parse(args);
      const componentName = validatedArgs.componentName;
      const newDescription = validatedArgs.description;
      const projectRoot = validatedArgs.projectRoot || process.cwd();

      const componentPath = path.join(projectRoot, 'components', componentName);
      const readmePath = path.join(componentPath, 'README.md');

      if (!fs.existsSync(readmePath)) {
        throw new Error(`Component ${componentName} not found`);
      }

      const content = fs.readFileSync(readmePath, 'utf-8');
      const updatedContent = updateDescriptionInContent(content, newDescription);
      
      fs.writeFileSync(readmePath, updatedContent, 'utf-8');
      const newMd5 = crypto.createHash('md5').update(updatedContent).digest('hex');

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            componentName,
            updated: "description",
            newMd5,
            success: true
          }, null, 2) 
        }]
      };
    }

    case "update_component_props": {
      const validatedArgs = UpdateComponentPropsArgsSchema.parse(args);
      const componentName = validatedArgs.componentName;
      const newProps = validatedArgs.props;
      const projectRoot = validatedArgs.projectRoot || process.cwd();

      const componentPath = path.join(projectRoot, 'components', componentName);
      const readmePath = path.join(componentPath, 'README.md');

      if (!fs.existsSync(readmePath)) {
        throw new Error(`Component ${componentName} not found`);
      }

      const content = fs.readFileSync(readmePath, 'utf-8');
      const updatedContent = updatePropsInContent(content, newProps);
      
      fs.writeFileSync(readmePath, updatedContent, 'utf-8');
      const newMd5 = crypto.createHash('md5').update(updatedContent).digest('hex');

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            componentName,
            updated: "props",
            newMd5,
            success: true
          }, null, 2) 
        }]
      };
    }

    case "update_component_content": {
      const validatedArgs = UpdateComponentContentArgsSchema.parse(args);
      const componentName = validatedArgs.componentName;
      const newDescription = validatedArgs.description;
      const newProps = validatedArgs.props;
      const projectRoot = validatedArgs.projectRoot || process.cwd();

      const componentPath = path.join(projectRoot, 'components', componentName);
      const readmePath = path.join(componentPath, 'README.md');

      if (!fs.existsSync(readmePath)) {
        throw new Error(`Component ${componentName} not found`);
      }

      let content = fs.readFileSync(readmePath, 'utf-8');
      let updatedSections: string[] = [];

      if (newDescription) {
        content = updateDescriptionInContent(content, newDescription);
        updatedSections.push("description");
      }

      if (newProps) {
        content = updatePropsInContent(content, newProps);
        updatedSections.push("props");
      }

      if (updatedSections.length === 0) {
        throw new Error("No content provided to update");
      }
      
      fs.writeFileSync(readmePath, content, 'utf-8');
      const newMd5 = crypto.createHash('md5').update(content).digest('hex');

      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            componentName,
            updated: updatedSections,
            newMd5,
            success: true
          }, null, 2) 
        }]
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 註冊工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "init_components",
        description: "掃描 components 資料夾並產生所有組件的 JSON 格式資訊",
        inputSchema: {
          type: "object",
          properties: {
            projectRoot: {
              type: "string",
              description: "專案根目錄路徑（可選，預設為當前工作目錄）"
            }
          }
        }
      },
      {
        name: "calculate_md5",
        description: "計算指定檔案的 MD5 雜湊值",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "要計算 MD5 的檔案路徑"
            }
          },
          required: ["filePath"]
        }
      },
      {
        name: "get_component_info",
        description: "取得特定組件的詳細資訊",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "組件名稱"
            },
            projectRoot: {
              type: "string", 
              description: "專案根目錄路徑（可選，預設為當前工作目錄）"
            }
          },
          required: ["componentName"]
        }
      },
      {
        name: "compare_md5",
        description: "比較檔案當前 MD5 值與預期值",
        inputSchema: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "要檢查的檔案路徑"
            },
            expectedMd5: {
              type: "string",
              description: "預期的 MD5 雜湊值"
            }
          },
          required: ["filePath", "expectedMd5"]
        }
      },
      {
        name: "update_component_description",
        description: "更新組件的描述部分，節省 token 的精準更新",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "組件名稱"
            },
            description: {
              type: "string",
              description: "新的組件描述"
            },
            projectRoot: {
              type: "string",
              description: "專案根目錄路徑（可選，預設為當前工作目錄）"
            }
          },
          required: ["componentName", "description"]
        }
      },
      {
        name: "update_component_props",
        description: "更新組件的 Props 部分，節省 token 的精準更新",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "組件名稱"
            },
            props: {
              type: "string",
              description: "新的 Props 內容（支援 Markdown 格式）"
            },
            projectRoot: {
              type: "string",
              description: "專案根目錄路徑（可選，預設為當前工作目錄）"
            }
          },
          required: ["componentName", "props"]
        }
      },
      {
        name: "update_component_content",
        description: "批量更新組件的描述和/或 Props，支援部分更新",
        inputSchema: {
          type: "object",
          properties: {
            componentName: {
              type: "string",
              description: "組件名稱"
            },
            description: {
              type: "string",
              description: "新的組件描述（可選）"
            },
            props: {
              type: "string",
              description: "新的 Props 內容（可選）"
            },
            projectRoot: {
              type: "string",
              description: "專案根目錄路徑（可選，預設為當前工作目錄）"
            }
          },
          required: ["componentName"]
        }
      }
    ]
  };
});

// 輔助函數 - 從 README 內容提取描述
function extractDescription(content: string): string {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#')) {
      // 找到下一行非空白內容作為描述
      for (let j = i + 1; j < lines.length; j++) {
        const descLine = lines[j].trim();
        if (descLine && !descLine.startsWith('#')) {
          return descLine;
        }
      }
    }
  }
  return 'No description found';
}

// 輔助函數 - 從 README 內容提取 props
function extractProps(content: string): string {
  const propsMatch = content.match(/## Props?([\s\S]*?)(?=##|$)/i);
  if (propsMatch) {
    return propsMatch[1].trim();
  }
  return 'No props information found';
}

// 輔助函數 - 更新文件中的描述部分
function updateDescriptionInContent(content: string, newDescription: string): string {
  const lines = content.split('\n');
  let updatedLines: string[] = [];
  let foundTitle = false;
  let descriptionUpdated = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 找到第一個標題
    if (line.trim().startsWith('#') && !foundTitle) {
      foundTitle = true;
      updatedLines.push(line);
      
      // 跳過空行
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') {
        updatedLines.push(lines[j]);
        j++;
      }
      
      // 跳過舊的描述直到下一個標題或空行區塊
      while (j < lines.length && !lines[j].trim().startsWith('#') && lines[j].trim() !== '') {
        j++;
      }
      
      // 插入新描述
      updatedLines.push('');
      updatedLines.push(newDescription);
      updatedLines.push('');
      
      descriptionUpdated = true;
      i = j - 1; // 調整索引
    } else {
      updatedLines.push(line);
    }
  }

  // 如果沒有找到標題，創建一個基本結構
  if (!foundTitle) {
    const componentName = path.basename(path.dirname(content));
    return `# ${componentName}\n\n${newDescription}\n\n${content}`;
  }

  return updatedLines.join('\n');
}

// 輔助函數 - 更新文件中的 Props 部分
function updatePropsInContent(content: string, newProps: string): string {
  // 尋找現有的 Props 區塊
  const propsRegex = /## Props?([\s\S]*?)(?=##|$)/i;
  
  if (propsRegex.test(content)) {
    // 替換現有的 Props 區塊
    return content.replace(propsRegex, `## Props\n\n${newProps}\n\n`);
  } else {
    // 如果沒有 Props 區塊，在文件末尾添加
    return content.trim() + `\n\n## Props\n\n${newProps}\n`;
  }
}

// 輔助函數 - 創建標準的組件文件模板
function createComponentTemplate(componentName: string, description?: string, props?: string): string {
  const template = `# ${componentName}

${description || '組件描述待補充'}

## Props

${props || '| 參數名 | 類型 | 必填 | 預設值 | 描述 |\n|--------|------|------|--------|------|\n| - | - | - | - | 待補充 |'}

## 使用範例

\`\`\`tsx
// 使用範例待補充
\`\`\`

## 注意事項

- 待補充
`;
  
  return template;
}