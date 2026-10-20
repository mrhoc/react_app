import { useEffect, useState } from "react"
import { message } from 'antd';
interface Todo {
    id: number,
    title: string,
    completed: boolean
}
type todoFilter = "all" | "active" | "completed"

export function TodoList() {


    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [textSearch, setTextSearch] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<todoFilter>('all');
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
    const handleComplete = (id: number) => {
        setTodoList(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    }
    const filteredTodoList = todoList.filter(todo => {
        const matchTextSearch = todo.title.toLowerCase().includes(textSearch.toLowerCase());
        let matchesStatus = true;
        if (filterStatus === 'active') {
            matchesStatus = !todo.completed
        } else if (filterStatus === 'completed') {
            matchesStatus = todo.completed
        }
        let result = matchTextSearch && matchesStatus;

        return result;
    });

    const completeCount = todoList.filter(item => item.completed === true).length;
    const remainCount = todoList.filter(item => item.completed !== true).length;


    return (
        <>
            <form onSubmit={e => { e.preventDefault(); handleAddTodo() }}>
                <input placeholder="enter new todo" value={newTodo} onChange={(e) => { setNewTodo(e.target.value) }} type="text" />
                <button onClick={handleAddTodo}>add</button>
            </form>
            <form onSubmit={e => { e.preventDefault(); }}>
                <input placeholder="enter search text" value={textSearch} onChange={e => { setTextSearch(e.target.value) }} type="text" />
            </form>
            <select name="" id="" value={filterStatus} onChange={e => setFilterStatus(e.target.value as todoFilter)}>
                <option value="all">all</option>
                <option value="active">active</option>
                <option value="completed">completed</option>
            </select>
            <br></br>
            To do list:
            <ul>
                {filteredTodoList.length > 0 ? (
                    filteredTodoList.map((todo) => {
                        return <li key={todo.id}>
                            <input onChange={() => { handleComplete(todo.id) }} type="checkbox" checked={todo.completed} /> {todo.title} <button onClick={() => { handleRemoveTodo(todo.id) }}>X {todo.id}</button>
                        </li>
                    })) :
                    (
                        <p style={{ color: 'gray' }}>
                            {todoList.length === 0 ? "Chưa có công việc nào." : "Không tìm thấy công việc phù hợp..."}
                        </p>
                    )

                }
            </ul>

            Total: {todoList.length}<br />
            Completed:{completeCount}<br />
            remaining: {remainCount}

        </>
    )
}