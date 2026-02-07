
import React, { useState } from 'react';
import { Todo } from '../types';
import { getSubtasks } from '../services/geminiService';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtasks: (id: string, subtasks: string[]) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onAddSubtasks }) => {
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAISuggestions = async () => {
    if (loadingAI || todo.subtasks?.length) return;
    setLoadingAI(true);
    const suggestions = await getSubtasks(todo.text);
    onAddSubtasks(todo.id, suggestions);
    setLoadingAI(false);
  };

  const isPastDue = () => {
    if (!todo.date) return false;
    const taskDate = new Date(`${todo.date}T${todo.time || '00:00'}`);
    return taskDate < new Date() && !todo.completed;
  };

  return (
    <div className={`group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md ${todo.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
              ${todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'}`}
          >
            {todo.completed && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-medium transition-all ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {todo.text}
            </h3>
            
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
              {todo.date && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${isPastDue() ? 'bg-red-50 text-red-600 font-semibold' : 'bg-slate-50'}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {todo.date}
                </div>
              )}
              {todo.time && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {todo.time}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!todo.completed && !todo.subtasks?.length && (
            <button
              onClick={handleAISuggestions}
              disabled={loadingAI}
              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
              title="Generate subtasks with AI"
            >
              {loadingAI ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {todo.subtasks && todo.subtasks.length > 0 && (
        <div className="mt-4 pl-10 space-y-2 border-l-2 border-indigo-100 ml-3">
          {todo.subtasks.map((sub, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-300 shrink-0"></div>
              {sub}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
