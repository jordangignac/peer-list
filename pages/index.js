import {v4} from 'uuid';
import React from 'react';
import Head from 'next/head';
import TodoItem from '../components/todo-item';

export default function Home() {
  const [todos, setTodos] = React.useState([]);
  const [content, setContent] = React.useState('');

  const removeTodo = id => () => {
    setTodos(todos => todos.filter(i => i.id !== id));
  };

  const setCompleted = id => completed => {
    setTodos(todos => todos.map(i => (i.id === id ? {...i, completed} : i)));
  };

  const addTodo = content => {
    setTodos(todos => [...todos, {id: v4(), completed: false, content}]);
    setContent('');
  };

  const onSubmit = event => {
    event.preventDefault();
    addTodo(content);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>peer-list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          peer-<span className="text-primary">list</span>
        </h1>

        <code className="mt-3 p-3 font-mono text-lg bg-gray-100 rounded-md">
          collaborative distributed lists
        </code>

        <form
          onSubmit={onSubmit}
          className="mt-6 max-w-2xl form-control w-3/4 mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full pr-16 input input-primary input-bordered"
            />
            <button
              type="submit"
              className="absolute top-0 right-0 rounded-l-none btn btn-primary"
            >
              Add Item
            </button>
          </div>
        </form>

        <div className="flex flex-col items-center justify-around max-w-4xl mt-6 w-full">
          {todos.map(({id, completed, content}) => (
            <TodoItem
              content={content}
              completed={completed}
              removeItem={removeTodo(id)}
              setCompleted={setCompleted(id)}
              key={`todo-${id}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
