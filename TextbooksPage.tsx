import React, { useState, useEffect } from 'react';
import api from '../services/api-client';
import { BookOpen, Heart } from 'lucide-react';

interface Textbook {
  id: string;
  title: string;
  author?: string;
  year?: number;
  subject: { name: string };
  country: { name: string };
  grade: { name: string };
}

export default function TextbooksPage() {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadTextbooks();
    }
  }, [selectedCountry]);

  const loadCountries = async () => {
    try {
      const response = await api.get('/textbooks/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  };

  const loadTextbooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/textbooks', {
        params: { countryId: selectedCountry },
      });
      setTextbooks(response.data);
    } catch (err) {
      console.error('Error loading textbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 flex items-center">
        <BookOpen className="mr-3" size={36} />
        Учебники
      </h1>

      <div className="mb-8">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Выберите страну</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Загрузка...</p>
        </div>
      ) : textbooks.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            {selectedCountry
              ? 'Учебники не найдены'
              : 'Выберите страну для просмотра учебников'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {textbooks.map((textbook) => (
            <div
              key={textbook.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden"
            >
              <div className="bg-blue-100 h-40 flex items-center justify-center">
                <BookOpen size={60} className="text-blue-600" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {textbook.title}
                </h3>
                {textbook.author && (
                  <p className="text-sm text-gray-600 mb-1">
                    Автор: {textbook.author}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-1">
                  Предмет: {textbook.subject.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {textbook.country.name} · {textbook.grade.name}
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center">
                  <Heart size={18} className="mr-2" />
                  Добавить в избранное
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
