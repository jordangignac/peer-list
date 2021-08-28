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

      const myPeer = new MyPeer(Peer, puid, todos);

      myPeer.stream.on('ADD_TODO', data => addTodo(data, false));
      myPeer.stream.on('REMOVE_TODO', data => removeTodo(data, false));
      myPeer.stream.on('SET_COMPLETED', data => setCompleted(data, false));

      setPeer(myPeer);
    });
  }, []);

  const setCompleted = (id, emit) => {
    setTodos(todos =>
      todos.map(i => (i.id === id ? {...i, completed: !i.completed} : i))
    );
    if (emit) peer.sendEvent('SET_COMPLETED', id);
  };

  const removeTodo = (id, emit) => {
    setTodos(todos => todos.filter(i => i.id !== id));
    if (emit) peer.sendEvent('REMOVE_TODO', id);
  };

  const addTodo = (todo, emit) => {
    setTodos(todos => [...todos, todo]);
    if (emit) peer.sendEvent('ADD_TODO', todo);
    if (emit) setContent('');
  };

  const copyShareLink = () => {
    const shareString = 'localhost:3000?puid=' + peer.id;
    navigator.clipboard.writeText(shareString);
  };

  const onSubmit = (event, emit) => {
    const todo = {id: v4(), completed: false, content};
    event.preventDefault();
    addTodo(todo, emit);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>peer-list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold indicator">
          <div
            onClick={copyShareLink}
            className="indicator-item badge badge-secondary cursor-pointer"
          >
            share
          </div>
          peer-
          <span className="text-primary">list</span>
        </h1>

        <code className="mt-3 p-3 font-mono text-lg bg-gray-100 rounded-md">
          collaborative distributed lists
        </code>

        <form
          onSubmit={event => onSubmit(event, true)}
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
              removeItem={() => removeTodo(id, true)}
              setCompleted={() => setCompleted(id, true)}
              key={`todo-${id}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
