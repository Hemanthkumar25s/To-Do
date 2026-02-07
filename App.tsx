
import React, { useState, useEffect, useCallback } from 'react';
import { Todo, FilterType } from './types';
import AddTodo from './components/AddTodo';
import TodoItem from './components/TodoItem';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('zenplan_todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('zenplan_todos', JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const handleAddTodo = (text: string, date: string, time: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      date,
      time,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleAddSubtasks = (id: string, subtasks: string[]) => {
    setTodos(todos.map(t => t.id === id ? { ...t, subtasks } : t));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      <header className="pt-12 pb-24 bg-gradient-to-br from-indigo-600 to-violet-700 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 flex items-center justify-center gap-3">
            <span className="p-2 bg-white/20 rounded-2xl backdrop-blur-lg">
              <svg className="w-8 h-8 text-indigo-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            ZenPlan
          </h1>
          <p className="text-indigo-100 text-lg opacity-90 max-w-lg mx-auto">
            Your mindful AI task companion. Organize your life with precision and intelligence.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto -mt-16 px-4">
        <AddTodo onAdd={handleAddTodo} />

        <div className="mt-12 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex gap-4">
              {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all capitalize
                    ${filter === f 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-indigo-600 hover:bg-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500 hidden sm:block">
              {activeCount} items left
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={handleToggleTodo} 
                  onDelete={handleDeleteTodo}
                  onAddSubtasks={handleAddSubtasks}
                />
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="inline-flex items-center justify-center p-6 bg-white rounded-full shadow-sm text-slate-200">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-400">All clear!</h3>
                  <p className="text-slate-400">Enjoy your productive day.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg">
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/20 flex items-center justify-around gap-2">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</p>
            <p className="text-xl font-bold text-slate-800">{todos.length}</p>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Done</p>
            <p className="text-xl font-bold text-indigo-600">{todos.filter(t => t.completed).length}</p>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Boosts</p>
            <p className="text-xl font-bold text-violet-600">{todos.filter(t => t.subtasks).length}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
