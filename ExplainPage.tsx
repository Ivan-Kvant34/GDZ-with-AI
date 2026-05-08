import React, { useState, useEffect } from 'react';
import api from '../services/api-client';
import { BookOpen, MessageSquare, Lightbulb } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description?: string;
}

export default function ExplainPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCountries();
    loadGrades();
  }, []);

  const loadCountries = async () => {
    try {
      const response = await api.get('/textbooks/countries');
      setCountries(response.data);
    } catch (err) {
      console.error('Error loading countries:', err);
    }
  };

  const loadGrades = async () => {
    try {
      const response = await api.get('/textbooks/grades');
      setGrades(response.data);
    } catch (err) {
      console.error('Error loading grades:', err);
    }
  };

  const loadSubjects = async (countryId: string, gradeId: string) => {
    try {
      const response = await api.get('/textbooks/subjects', {
        params: { countryId, gradeId },
      });
      setSubjects(response.data);
    } catch (err) {
      console.error('Error loading subjects:', err);
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      const response = await api.get('/textbooks/topics', {
        params: { subjectId },
      });
      setTopics(response.data);
    } catch (err) {
      console.error('Error loading topics:', err);
    }
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedGrade('');
    setSelectedSubject('');
    setSelectedTopic('');
    setTopics([]);
  };

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedSubject('');
    setSelectedTopic('');
    setTopics([]);
    if (selectedCountry) {
      loadSubjects(selectedCountry, gradeId);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic('');
    loadTopics(subjectId);
  };

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/ai/explain', {
        topicId: selectedTopic,
        additionalContext,
      });

      setAnswer(response.data.answer);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при объяснении темы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 flex items-center">
        <Lightbulb className="mr-3" size={36} />
        Объяснить тему
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleExplain} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Страна
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Выберите страну</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Класс
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => handleGradeChange(e.target.value)}
                disabled={!selectedCountry}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Выберите класс</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Предмет
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                disabled={!selectedGrade}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Выберите предмет</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Тема
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedSubject}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">Выберите тему</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Дополнительный контекст (опционально)
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Добавьте деталей для лучшего объяснения..."
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedTopic}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
            >
              <MessageSquare size={20} className="mr-2" />
              {loading ? 'Объясняю...' : 'Получить объяснение'}
            </button>
          </form>
        </div>

        {/* Answer Section */}
        {answer && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Объяснение темы
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
