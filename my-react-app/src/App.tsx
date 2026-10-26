// import { TodoList } from "./components/TodoList"
import { UserList } from "./components/UserList"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient();

function App() {


  return (
    <QueryClientProvider client={queryClient}>
    <div className="min-h-screen">
      {/* <TodoList></TodoList> */}
      <UserList/>
    </div>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
