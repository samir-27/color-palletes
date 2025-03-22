import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ColorPaletteApp from './components/ColorPaletteApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ColorPaletteApp />

    </>
  )
}

export default App
