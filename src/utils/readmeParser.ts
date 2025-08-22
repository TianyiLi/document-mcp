import { detectNewline } from 'detect-newline';

export interface FunctionSection {
  name: string;
  description: string;
  props: string[];
}
export interface ReadmeSectionItem {
  h1: string;
  description: string;
  functionSections: FunctionSection[];
}

const NEW_SECTION_SEPARATOR = '---'

export function parseReadme(readmeContent: string): ReadmeSectionItem[] {
  const sections = readmeContent.split(NEW_SECTION_SEPARATOR)
  
  const result = sections.map(section => {
    const trimmedSection = section.trim()
    if (!trimmedSection) return null
    
    return {
      h1: extractH1(trimmedSection),
      description: extractDescription(trimmedSection),
      functionSections: parseFunctionSections(trimmedSection),
    }
  }).filter(section => section !== null && section.h1)
  
  if (result.length === 0 && readmeContent.trim()) {
    // If no valid sections found but content exists, return a single section
    return [{
      h1: extractH1(readmeContent),
      description: extractDescription(readmeContent),
      functionSections: parseFunctionSections(readmeContent),
    }]
  }
  
  return result as ReadmeSectionItem[]
}

function extractH1(section: string): string {
  const lines = getLines(section)
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim()
    }
  }
  return ''
}

function extractDescription(section: string): string {
  const lines = getLines(section)
  let description = ''
  let foundH2 = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      foundH2 = true
      continue
    }
    if (foundH2 && trimmed.startsWith('### ')) {
      break
    }
    if (foundH2 && trimmed) {
      if (description) description += '\n'
      description += trimmed
    }
  }
  
  return description.trim()
}

function parseFunctionSections(section: string): FunctionSection[] {
  const lines = getLines(section)
  const functionSections: FunctionSection[] = []
  let currentFunction: Partial<FunctionSection> | null = null
  let collectingProps = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.startsWith('### ')) {
      if (currentFunction) {
        functionSections.push(currentFunction as FunctionSection)
      }
      currentFunction = {
        name: trimmed.substring(4).trim(),
        description: '',
        props: []
      }
      collectingProps = false
    } else if (currentFunction && trimmed === '- **Props**:') {
      collectingProps = true
    } else if (currentFunction && collectingProps && trimmed.startsWith('  - ')) {
      currentFunction.props!.push(trimmed.substring(4))
    } else if (currentFunction && !collectingProps && trimmed && !trimmed.startsWith('- **Props**:') && !trimmed.startsWith('### ')) {
      if (currentFunction.description) currentFunction.description += '\n'
      currentFunction.description += trimmed
    } else if (currentFunction && collectingProps && trimmed.startsWith('### ')) {
      // New function section, stop collecting props
      collectingProps = false
      if (currentFunction) {
        functionSections.push(currentFunction as FunctionSection)
      }
      currentFunction = {
        name: trimmed.substring(4).trim(),
        description: '',
        props: []
      }
    }
  }
  
  if (currentFunction) {
    functionSections.push(currentFunction as FunctionSection)
  }
  
  return functionSections
}

function getLines(content: string): string[] {
  const newlineSymbol = detectNewline(content)
  if (!newlineSymbol) {
    return content ? [content] : []
  }
  return content.split(newlineSymbol)
}
