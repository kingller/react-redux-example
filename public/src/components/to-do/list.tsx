import React from 'react';
import Todo from './item';

const TodoList = ({
    toDos,
    onTodoClick,
}: {
    toDos: { id: number; text: string; completed: boolean }[];
    onTodoClick: (index: number) => void;
}) => (
    <ul>
        {toDos.map((todo, index) => (
            <Todo key={index} {...todo} onClick={() => onTodoClick(index)} />
        ))}
    </ul>
);

export default TodoList;
