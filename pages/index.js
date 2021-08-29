import {v4} from 'uuid';
import React from 'react';
import Head from 'next/head';
import MyPeer from '../utils/my-peer';
import TodoItem from '../components/todo-item';

export default function Home() {
  const [peer, setPeer] = React.useState();
  const [todos, setTodos] = React.useState([]);
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    import('peerjs').then(({default: Peer}) => {
      const params = new URLSearchParams(window.location.search);
      const puid = params.get('puid');

      const myPeer = new MyPeer(Peer, puid);

      myPeer.stream.on('ADD_TODO', data => addTodo(data, false));
      myPeer.stream.on('REMOVE_TODO', data => removeTodo(data, false));
      myPeer.stream.on('SET_COMPLETED', data => setCompleted(data, false));

      setPeer(myPeer);
    });
  }, []);

  const onSubmit = event => {
    event.preventDefault();
    addTodo({id: v4(), completed: false, content});
  };

  const setCompleted = (id, emit = true) => {
    setTodos(todos => {
      return todos.map(todo => {
        if (todo.id !== id) return todo;
        return {...todo, completed: !todo.completed};
      });
    });
    if (emit) peer.sendEvent('SET_COMPLETED', id);
  };

  const removeTodo = (id, emit = true) => {
    setTodos(todos => todos.filter(i => i.id !== id));
    if (emit) peer.sendEvent('REMOVE_TODO', id);
  };

  const addTodo = (todo, emit = true) => {
    setTodos(todos => [...todos, todo]);
    if (emit) {
      peer.sendEvent('ADD_TODO', todo);
      setContent('');
    }
  };

  return (
    <main className="flex flex-col items-center m-auto w-full min-h-screen max-w-3xl p-5 sm:px-20">
      <Head>
        <title>peer-list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-5xl sm:text-6xl font-bold">
        <span className="text-primary">peer</span>-list
      </h1>

      <code className="mt-3 p-3 font-mono text-sm sm:text-lg bg-gray-100 rounded-md">
        collaborative distributed lists
      </code>

      <form onSubmit={onSubmit} className="mt-5 form-control w-full mx-auto">
        <div className="relative">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full pr-16 input input-primary"
          />
          <button
            type="submit"
            className="absolute top-0 right-0 rounded-l-none btn btn-primary"
          >
            Add Item
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center justify-around mt-3 w-full">
        {todos.map(({id, completed, content}) => (
          <TodoItem
            content={content}
            completed={completed}
            removeItem={() => removeTodo(id)}
            setCompleted={() => setCompleted(id)}
            key={`todo-${id}`}
          />
        ))}
      </div>
    </main>
  );
}
