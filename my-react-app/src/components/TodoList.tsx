import { useEffect, useState } from "react"
import { message } from 'antd';
interface Todo {
    id: number,
    title: string,
    completed: boolean,
    isEdit?: boolean
}
type TodoFilter = "all" | "active" | "completed"

export function TodoList() {


    const [todoList, setTodoList] = useState<Todo[]>(() => {
        try {
            const savedTodos = localStorage.getItem('todoList');
            return savedTodos ? JSON.parse(savedTodos) : []; 
        } catch (error) {
            console.error("Lỗi đọc localStorage:", error);
            return []; 
        }
    });
    const [newTodo, setNewTodo] = useState<string>('');
    const [textEdit, setTextEdit] = useState<string>('');
    const [textSearch, setTextSearch] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<TodoFilter>('all');

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
    const handleEditTodo = (id: number) => {
        let todoEdit = todoList.filter(todo => todo.id === id);
        setTextEdit(todoEdit[0].title);
        setTodoList(prev => prev.map(todo => todo.id === id ? { ...todo, isEdit: true } : { ...todo, isEdit: false }))
    }
    const handleCancle = () => {
        setTodoList(prev => prev.map(todo => ({ ...todo, isEdit: false })));
        setTextEdit('')
    }
    const hanldeSave = (id: number) => {
        let text = textEdit.trim();
        if (!text) {
            message.error('title is not empty')
            return;
        }
        setTodoList(prev => prev.map(todo => todo.id === id ? { ...todo, title: textEdit, isEdit: false } : todo));
        setTextEdit('');
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

    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(todoList))
    }, [todoList])

    const completeCount = todoList.filter(item => item.completed === true).length;
    const remainCount = todoList.filter(item => item.completed !== true).length;


    return (
        <>
            <form onSubmit={e => { e.preventDefault(); handleAddTodo() }}>
                <input placeholder="enter new todo" value={newTodo} onChange={(e) => { setNewTodo(e.target.value) }} type="text" />
                <button type="submit">add</button>

            </form>
            <form onSubmit={e => { e.preventDefault(); }}>
                <input placeholder="enter search text" value={textSearch} onChange={e => { setTextSearch(e.target.value) }} type="text" />
            </form>
            <select name="" id="" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TodoFilter)}>
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

                            {todo.isEdit ?
                                (
                                    <>
                                        <input value={textEdit} onChange={e => setTextEdit(e.target.value)} type="text" />
                                        <button type="button" onClick={() => { hanldeSave(todo.id) }}>save</button>
                                        <button type="button" onClick={handleCancle}>cancel</button>
                                    </>
                                ) :
                                (
                                    <>
                                        <input onChange={() => { handleComplete(todo.id) }} type="checkbox" checked={todo.completed} />
                                        {todo.title}
                                        <button type="button" onClick={() => { handleRemoveTodo(todo.id) }}>remove</button>
                                        <button type="button" onClick={() => { handleEditTodo(todo.id) }}>edit</button>
                                    </>
                                )}

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