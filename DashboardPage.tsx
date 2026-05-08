import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, BookOpen, MessageSquare, Lightbulb } from 'lucide-react';

export default function DashboardPage() {
  const features = [
    {
      icon: <Lightbulb className="w-12 h-12 text-yellow-500" />,
      title: 'Объяснить тему',
      description: 'ИИ объяснит любую школьную тему простыми словами',
      link: '/explain',
    },
    {
      icon: <BookOpen className="w-12 h-12 text-blue-500" />,
      title: 'Решить задачу',
      description: 'Загрузите фото или описание задачи и получите пошаговое решение',
      link: '/solve',
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-green-500" />,
      title: 'Чат с ИИ',
      description: 'Задавайте вопросы по школьным предметам',
      link: '/textbooks',
    },
    {
      icon: <Zap className="w-12 h-12 text-purple-500" />,
      title: 'Быстрые решения',
      description: 'Быстрый доступ к популярным учебникам',
      link: '/textbooks',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Добро пожаловать в GDZ AI
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Решайте домашние задания с помощью ИИ. Объясняйте сложные темы простыми словами.
          Получайте помощь по всем предметам школьной программы.
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Как это работает?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              to={feature.link}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Выберите нужный учебник, предмет и тему. Получите помощь ИИ в решении задач и объяснении сложных тем.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/explain"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition"
            >
              Объяснить тему
            </Link>
            <Link
              to="/solve"
              className="bg-blue-800 hover:bg-blue-900 font-bold py-3 px-8 rounded-lg transition"
            >
              Решить задачу
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
            <p className="text-gray-600">Стран поддерживается</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">11</div>
            <p className="text-gray-600">Классов (1-11)</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
            <p className="text-gray-600">Учебников в БД</p>
          </div>
        </div>
      </section>
    </div>
  );
}
