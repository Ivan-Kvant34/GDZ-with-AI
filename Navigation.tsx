import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { BookOpen, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
          <BookOpen size={28} />
          <span>GDZ AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/textbooks"
            className="hover:text-blue-200 transition"
          >
            Учебники
          </Link>
          <Link
            to="/explain"
            className="hover:text-blue-200 transition"
          >
            Объяснить тему
          </Link>
          <Link
            to="/solve"
            className="hover:text-blue-200 transition"
          >
            Решить задачу
          </Link>
          <Link
            to="/profile"
            className="hover:text-blue-200 transition flex items-center space-x-1"
          >
            <User size={18} />
            <span>{user?.username}</span>
          </Link>
          <button
            onClick={logout}
            className="hover:text-red-200 transition flex items-center space-x-1"
          >
            <LogOut size={18} />
            <span>Выход</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2 space-y-2">
          <Link
            to="/textbooks"
            className="block py-2 hover:bg-blue-600 px-2 rounded"
          >
            Учебники
          </Link>
          <Link
            to="/explain"
            className="block py-2 hover:bg-blue-600 px-2 rounded"
          >
            Объяснить тему
          </Link>
          <Link
            to="/solve"
            className="block py-2 hover:bg-blue-600 px-2 rounded"
          >
            Решить задачу
          </Link>
          <Link
            to="/profile"
            className="block py-2 hover:bg-blue-600 px-2 rounded"
          >
            Профиль: {user?.username}
          </Link>
          <button
            onClick={logout}
            className="w-full text-left py-2 hover:bg-red-600 px-2 rounded"
          >
            Выход
          </button>
        </div>
      )}
    </nav>
  );
}
