import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создать страны
  const countries = await Promise.all([
    prisma.country.create({
      data: { name: 'Россия', code: 'RU' },
    }),
    prisma.country.create({
      data: { name: 'Беларусь', code: 'BY' },
    }),
    prisma.country.create({
      data: { name: 'Казахстан', code: 'KZ' },
    }),
    prisma.country.create({
      data: { name: 'Киргизия', code: 'KG' },
    }),
    prisma.country.create({
      data: { name: 'Украина', code: 'UA' },
    }),
  ]);

  // Создать классы
  const grades = await Promise.all(
    Array.from({ length: 11 }, (_, i) =>
      prisma.grade.create({
        data: { level: i + 1, name: `${i + 1} класс` },
      })
    )
  );

  // Создать предметы
  const subjects = [
    { name: 'Математика', code: 'MATH' },
    { name: 'Русский язык', code: 'RU_LANG' },
    { name: 'Физика', code: 'PHYSICS' },
    { name: 'Химия', code: 'CHEMISTRY' },
    { name: 'История', code: 'HISTORY' },
    { name: 'География', code: 'GEOGRAPHY' },
    { name: 'Биология', code: 'BIOLOGY' },
    { name: 'Английский язык', code: 'EN_LANG' },
    { name: 'Литература', code: 'LITERATURE' },
    { name: 'Информатика', code: 'COMPUTER_SCIENCE' },
  ];

  const createdSubjects = await Promise.all(
    subjects.map((subject) =>
      prisma.subject.create({
        data: {
          ...subject,
          gradeId: grades[0].id,
          countryId: countries[0].id,
        },
      })
    )
  );

  // Создать учебники
  const textbooks = [
    {
      title: 'Математика 1 класс',
      author: 'М.И. Моро',
      publisher: 'Просвещение',
      year: 2023,
      isbn: '978-5-09-101401-4',
      subjectId: createdSubjects[0].id,
      gradeId: grades[0].id,
      countryId: countries[0].id,
    },
    {
      title: 'Русский язык 5 класс',
      author: 'Т.А. Ладыженская',
      publisher: 'Просвещение',
      year: 2023,
      isbn: '978-5-09-105649-8',
      subjectId: createdSubjects[1].id,
      gradeId: grades[4].id,
      countryId: countries[0].id,
    },
    {
      title: 'Физика 7 класс',
      author: 'А.В. Перышкин',
      publisher: 'Дрофа',
      year: 2023,
      isbn: '978-5-358-19988-8',
      subjectId: createdSubjects[2].id,
      gradeId: grades[6].id,
      countryId: countries[0].id,
    },
  ];

  const createdTextbooks = await Promise.all(
    textbooks.map((tb) =>
      prisma.textbook.create({
        data: tb,
      })
    )
  );

  // Создать главы для учебников
  for (let i = 0; i < createdTextbooks.length; i++) {
    const textbook = createdTextbooks[i];
    for (let j = 1; j <= 5; j++) {
      await prisma.chapter.create({
        data: {
          title: `Глава ${j}`,
          number: j,
          content: `Содержание главы ${j} из учебника "${textbook.title}"`,
          textbookId: textbook.id,
        },
      });
    }
  }

  // Создать темы
  const topics = [
    {
      title: 'Введение в числа',
      description: 'Понимание натуральных чисел и основных операций',
      subjectId: createdSubjects[0].id,
      order: 1,
    },
    {
      title: 'Сложение и вычитание',
      description: 'Базовые арифметические операции',
      subjectId: createdSubjects[0].id,
      order: 2,
    },
    {
      title: 'Части речи',
      description: 'Изучение основных частей русского языка',
      subjectId: createdSubjects[1].id,
      order: 1,
    },
    {
      title: 'Кинематика',
      description: 'Движение тел и основные кинематические понятия',
      subjectId: createdSubjects[2].id,
      order: 1,
    },
  ];

  await Promise.all(
    topics.map((topic) => prisma.topic.create({ data: topic }))
  );

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
