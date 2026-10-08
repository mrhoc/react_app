import { useState } from "react"

interface Todo {
    id: number,
    title: string,
    completed: boolean
}

export function TodoList() {


    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

    const getMaxId = (list: Todo[]): number => {
        if (list.length === 0) return 0;
        return Math.max(...list.map(item => item.id));
    };
    const handleAddTodo = () => {
        if (!newTodo.trim()) return;
        setTodoList(prevTodoList => [...prevTodoList, { id: getMaxId(prevTodoList) + 1, title: newTodo, completed: false }])
        setNewTodo('');
    }
    const handleRemoveTodo = (id: number) => {
        // const newListTodo = todoList.filter(todo => todo.id !== id);
        setTodoList(prev => prev.filter(todo => todo.id !== id));
    }
    const handleComplete = (id : number)=>{        
        setTodoList(prev => prev.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo))
    }
    return (
        <>
            <input value={newTodo} onChange={(e) => { setNewTodo(e.target.value) }} type="text" />
            <button onClick={handleAddTodo}>add</button>
            <br></br>
            To do list:
            <ul>
                {
                    todoList.map((todo) => {
                        return <li key={todo.id}>
                            <input onChange={()=>{handleComplete(todo.id)}} type="checkbox" checked={todo.completed} /> {todo.title} <button onClick={() => { handleRemoveTodo(todo.id) }}>X {todo.id}</button>
                        </li>
                    })
                }
            </ul>

        </>
    )
}