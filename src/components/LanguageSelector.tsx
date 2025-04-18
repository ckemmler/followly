'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface LanguageSelectorProps {
  currentLang: string
  languages: string[]
}

export default function LanguageSelector({ currentLang, languages }: LanguageSelectorProps) {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState(currentLang)

  // Update the selected language when the currentLang prop changes
  useEffect(() => {
    setSelectedLang(currentLang)
  }, [currentLang])

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value
    setSelectedLang(newLang)
    router.push(`/${newLang}`)
  }

  // Map language codes to country codes for flags
  // Some languages don't map directly to country codes, so we use approximations
  const countryCodeMap: Record<string, string> = {
    bg: 'bg', cs: 'cz', da: 'dk', de: 'de', el: 'gr', en: 'gb',
    es: 'es', et: 'ee', fi: 'fi', fr: 'fr', ga: 'ie', hr: 'hr',
    hu: 'hu', it: 'it', lt: 'lt', lv: 'lv', mt: 'mt', nl: 'nl',
    pl: 'pl', pt: 'pt', ro: 'ro', sk: 'sk', sl: 'si', sv: 'se'
  }

  return (
    <select
      value={selectedLang}
      onChange={handleLanguageChange}
      className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {`${getFlagEmoji(countryCodeMap[lang] || lang)}  ${lang.toUpperCase()}`}
        </option>
      ))}
    </select>
  )
}

// Function to generate flag emoji from country code
function getFlagEmoji(countryCode: string) {
  // Convert country code to regional indicator symbols
  // These create flag emojis when paired together
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}