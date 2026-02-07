
import React, { useState } from 'react';

interface AddTodoProps {
  onAdd: (text: string, date: string, time: string) => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, date, time);
    setText('');
    setDate('');
    setTime('');
    setShowOptions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white rounded-3xl shadow-lg border border-indigo-100 p-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-6 py-4 text-lg bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
        />
        
        <div className="flex items-center gap-2 px-2 pb-2 md:pb-0">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${showOptions ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">{date ? 'Edit Schedule' : 'Schedule'}</span>
          </button>

          <button
            type="submit"
            disabled={!text.trim()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Add Task
          </button>
        </div>
      </div>

      {showOptions && (
        <div className="p-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top duration-300">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Due Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default AddTodo;
