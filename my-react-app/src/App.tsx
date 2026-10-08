import './App.css'
import BIMViewer from './components/BIMViewer'
import { Counter } from './components/Counter'
import { TodoList } from './components/TodoList'
function App() {


  return (
    <div style={{ width: '100vw', height: '100vh' }}>    
      {/* <BIMViewer /> */}
      {/* <Counter></Counter> */}
      <TodoList></TodoList>
    </div>
  )
}

export default App
