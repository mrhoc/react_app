import { useState } from "react"

interface Todo {
        id: number,
        title: string
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
        setTodoList(prevTodoList => [...prevTodoList, { id: getMaxId(prevTodoList), title: newTodo }])
        setNewTodo('');
    }
    const handleRemoveTodo = (id: number) =>{
        const newListTodo = todoList.filter(todo => todo.id !== id);
        setTodoList(newListTodo);
    }
    
    return (
        <>
            <input value={newTodo} onChange={(e)=>{setNewTodo(e.target.value)}} type="text" />
            <button onClick={handleAddTodo}>add</button>
            <br></br>
            To do list:

            {
                todoList.map((todo) => {
                    return <div key={todo.id}>
                        {todo.title} <button onClick={()=>{handleRemoveTodo(todo.id)}}>X</button>
                    </div>
                })
            }
        </>
    )
}