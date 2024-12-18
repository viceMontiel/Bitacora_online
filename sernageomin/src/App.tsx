import { ReactNode } from 'react'
import './App.css'
import { NavBar, Footer } from './Components'
interface Props {
  children: ReactNode
}

function App({children}: Props) {

  return (
    <>
      <header><NavBar></NavBar></header>
      {children}
      <footer><Footer></Footer></footer>
      
    </>
  )
}

export default App
