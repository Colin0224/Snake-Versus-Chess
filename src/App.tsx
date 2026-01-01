import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Chess } from 'chess.js'
import {Board} from './components/Board'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Board ></Board>
    </>
  )
}

export default App
