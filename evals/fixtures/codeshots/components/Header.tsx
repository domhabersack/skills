'use client'

import { useState } from 'react'

export function Header() {
  const [dark, setDark] = useState(false)

  return (
    <header className={dark ? 'dark' : undefined}>
      <a href="/">codeshots</a>
      <button type="button" onClick={() => setDark(!dark)}>
        {dark ? 'Light mode' : 'Dark mode'}
      </button>
    </header>
  )
}
