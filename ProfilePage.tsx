import React, { useState, useEffect } from 'react';
import api from '../services/api-client';
import { useAuthStore } from '../store/auth';
import { User, LogOut, History } from 'lucide-react';

interface Explanation {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/history');
      setExplanations(response.data.data);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <User size={40} />
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center"
        >
          <LogOut size={20} className="mr-2" />
          Выйти
        </button>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <History size={28} className="mr-2" />
          История запросов
        </h2>

        {loading ? (
          <p className="text-gray-600">Загрузка...</p>
        ) : explanations.length === 0 ? (
          <p className="text-gray-600">У вас еще нет запросов</p>
        ) : (
          <div className="space-y-6">
            {explanations.map((exp) => (
              <div key={exp.id} className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {exp.question}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                  {exp.answer}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(exp.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
