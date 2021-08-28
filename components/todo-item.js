export default function TodoItem(props) {
  const {content, completed, setCompleted, removeItem} = props;
  return (
    <div className="p-6 mt-3 text-left border w-full rounded-xl">
      <div className="flex justify-between">
        <p className="text-xl font-bold">{content}</p>
        <div className="flex">
          <input
            type="checkbox"
            checked={completed}
            onChange={setCompleted}
            className="checkbox checkbox-primary"
          />
          <button
            onClick={removeItem}
            className="ml-3 btn btn-outline btn-circle btn-xs"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block w-4 h-4 stroke-current"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
