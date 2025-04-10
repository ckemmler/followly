// components/LocalizedSlugInput.tsx
import { Card, Flex, Select, Stack, TextInput } from '@sanity/ui'
import { ChangeEvent, useState } from 'react'
import { set, unset } from 'sanity'

interface LocalizedSlugInputProps {
  value?: Record<string, any>
  onChange: (event: any) => void
  schemaType: any
}

const SUPPORTED_LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'fr', title: 'Français' },
  { id: 'de', title: 'Deutsch' },
  { id: 'nl', title: 'Nederlands' },
  { id: 'es', title: 'Español' },
]

export function LocalizedSlugInput({ value = {}, onChange, schemaType }: LocalizedSlugInputProps) {
  const [selectedLang, setSelectedLang] = useState('en')

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLang(e.target.value)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value
    if (!nextValue) {
      onChange(unset([selectedLang]))
    } else {
      onChange(set({ ...value, [selectedLang]: { current: nextValue } }))
    }
  }

  return (
    <Stack space={3}>
      <Flex>
        <Select value={selectedLang} onChange={handleLangChange}>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.title} {value?.[lang.id]?.current ? '✓' : ''}
            </option>
          ))}
        </Select>
      </Flex>
      <Card padding={3} tone="transparent" border>
        <TextInput
          type="text"
          value={value?.[selectedLang]?.current || ''}
          onChange={handleChange}
          placeholder={`Slug for ${selectedLang}`}
        />
      </Card>
    </Stack>
  )
}
