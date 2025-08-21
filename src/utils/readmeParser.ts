import { detectNewline } from 'detect-newline';

interface FunctionSection {
  name: string;
  description: string;
  props: string[];
}
interface ReadmeSectionItem {
  fileName: string;
  description: string;
  functionSections: FunctionSection[];
}

export function parseReadme(readmeContent: string) {
  
}

function extractReadmeSection(readmeContent: string) {
  const sections:FunctionSection[] = []
  const indicator = detectNewline(readmeContent)
  if (!indicator && !readmeContent) {
    return []
  }
  if (!indicator && readmeContent) {
    if (!readmeContent.startsWith('## ')) {
      return []
    }
    return [
      {
        name: readmeContent.replace('## ', ''),
      }
    ]
  }
    
  const raw = readmeContent.split(indicator!)
  return sections.map((section) => {
    const [name, ...content] = section.split('\n');
    return { name, content: content.join('\n') };
  });
}
