import React, { useState, useEffect } from 'react';
import api from '../services/api-client';
import { BookOpen, MessageSquare, Image as ImageIcon } from 'lucide-react';

export default function SolvePage() {
  const [description, setDescription] = useState('');
  const [schoolExplanation, setSchoolExplanation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/ai/solve', {
        description,
        schoolExplanation,
        imageUrl: imagePreview,
      });

      setAnswer(response.data.answer);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при решении задачи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 flex items-center">
        <BookOpen className="mr-3" size={36} />
        Решить задачу
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSolve} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Описание задачи
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Опишите задачу..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Как объясняли в школе?
              </label>
              <textarea
                value={schoolExplanation}
                onChange={(e) => setSchoolExplanation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Напишите, как учитель объяснил эту тему..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <ImageIcon size={20} className="mr-2" />
                Фотография задачи
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-w-full h-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Удалить фото
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!description && !imageFile && !schoolExplanation)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
            >
              <MessageSquare size={20} className="mr-2" />
              {loading ? 'Решаю задачу...' : 'Получить решение'}
            </button>
          </form>
        </div>

        {/* Answer Section */}
        {answer && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Решение</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
