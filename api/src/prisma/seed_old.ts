import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Quiz Categories
  const categories = [
    { name: 'Math' },
    { name: 'Science' },
    { name: 'History' },
    { name: 'Geography' },
    { name: 'Counseling & Academic' },
  ];

  for (const category of categories) {
    await prisma.quizCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("Categories seeded successfully");

  // Find or create the "Counseling & Academic" category for quizzes
  const counselingCategory = await prisma.quizCategory.findUnique({
    where: { name: "Counseling & Academic" },
  });

  if (counselingCategory) {
    // Define quizzes for the "Counseling & Academic" category
    const quizzes = [
      {
        questionText: "How many hours do you spend studying each day?",
        answers: [
          { text: "1-2 hours", isCorrect: false },
          { text: "3-4 hours", isCorrect: false },
          { text: "5-6 hours", isCorrect: false },
          { text: "7+ hours", isCorrect: false },
        ],
      },
      {
        questionText: "What time of day do you find yourself most focused?",
        answers: [
          { text: "Morning", isCorrect: false },
          { text: "Afternoon", isCorrect: false },
          { text: "Evening", isCorrect: false },
          { text: "Night", isCorrect: false },
        ],
      },
      {
        questionText: "What is your preferred learning style?",
        answers: [
          { text: "Visual (seeing)", isCorrect: false },
          { text: "Auditory (hearing)", isCorrect: false },
          { text: "Reading/Writing", isCorrect: false },
          { text: "Kinesthetic (hands-on)", isCorrect: false },
        ],
      },
      {
        questionText: "How organized is your study space?",
        answers: [
          { text: "Very organized", isCorrect: false },
          { text: "Somewhat organized", isCorrect: false },
          { text: "Not very organized", isCorrect: false },
          { text: "I don't have a dedicated study space", isCorrect: false },
        ],
      },
    ];

    for (const quiz of quizzes) {
      // Create the quiz with its associated questions and answers
      const createdQuiz = await prisma.quiz.create({
        data: {
          category: {
            connect: { id: counselingCategory.id },
          },
          questions: {
            create: [
              {
                text: quiz.questionText,
                answers: {
                  create: quiz.answers.map((answer) => ({
                    text: answer.text,
                    isCorrect: answer.isCorrect,
                  })),
                },
              },
            ],
          },
        },
      });

      console.log(`Quiz with question "${quiz.questionText}" created successfully.`);
    }
  }

  const lessonCategories = [
    {
      name: "academicskills"
    },
    {
      name: "competitiveexams"
    },
    {
      name: "collegetrivia"
    },
    {
      name: "careeraptitude"
    },
    {
      name: "studyhabits"
    },
    {
      name: "socialskills"
    },
    {
      name: "criticalthinking"
    },
    {
      name: "personalgrowth"
    }
  ]
  await prisma.lesson.upsert({
    where: { id: 1 },
    update: {
      category: "academicskills",
      categoryTitle: "Academic Skills",
      title: "Lesson 1's Title",
      description: "Lesson 1's Description",
      no: 1,
    },
    create: {
      category: "academicskills",
      categoryTitle: "Academic Skills",
      title: "Lesson 1's Title",
      description: "Lesson 1's Description",
      no: 1,
    },
  }).then(async (lesson) => {
    await prisma.lessonContent.create({
      data: {
        lessonId: lesson.id,
        sbh1: "Goal Setting",
        p1: "Lorem ipsum dolor sit amet...",
        sbh2: "Stress Management",
        p2: "Lorem ipsum dolor sit amet...",
        sbh3: "Effective Reading",
        p3: "Lorem ipsum dolor sit amet...",
        sbh4: "Collaboration and Group Study",
        p4: "Lorem ipsum dolor sit amet...",
      },
    });

    const createdQuiz = await prisma.quiz.create({
      data: {
        category: {
          connect: { id: counselingCategory.id },
        },
        lesson: {
          connect: { id: lesson.id },
        },
        questions: {
          create: [
            {
              text: "How many hours do you spend studying each day?",
              answers: {
                create: [
                  {
                    text: "Answer 1",
                    isCorrect: true,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log("Academic Skills Lesson 1 and Quiz seeded successfully");
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });