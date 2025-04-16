import type { EditorContextData, EditorLanguage, LanguageDefinition } from '../types'
import { dbmlLanguage } from './dbml'
import { jsonLanguage } from './json'
import { pgsqlLanguage } from './pgsql'

export const languages: Record<EditorLanguage, LanguageDefinition> = {
  pgsql: pgsqlLanguage,
  json: jsonLanguage,
  dbml: dbmlLanguage,
} as const

export function createLanguageSupport(language: EditorLanguage, contextData?: EditorContextData) {
  const languageDefinition = languages[language]
  return {
    ...languageDefinition,
    completions: languageDefinition.createCompletions(contextData),
    validate: languageDefinition.validator,
    format: languageDefinition.formatter,
  }
}

export type SupportedLanguage = keyof typeof languages
