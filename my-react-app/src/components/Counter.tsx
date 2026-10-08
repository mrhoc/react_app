import { useEffect, useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);
    let status: string = 'Zezo';

    if (count === 0) {
        status = 'Zero'
    } else if (count > 0) {
        status = 'Positive'
    } else {
        status = 'Negative'
    }

    useEffect(() => {
        document.title = `Count:${count}`
    }, [count])

    const handleDecrease = () => {
        setCount(prevCount => prevCount - 1);
    }
    const handleIncrease = () => {
        setCount(prevCount => prevCount + 1);
    }
    const handleReset = () => {
        setCount(0);
    }
    return (
        <>
            Count: {count}
            <button className="btn btn-success" onClick={handleDecrease}>-</button>
            <button onClick={handleIncrease}>+</button>
            <button onClick={handleReset}>reset</button>
            <p>status: {status}</p>
        </>
    );
}