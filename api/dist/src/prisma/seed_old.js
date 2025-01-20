"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
    ];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZF9vbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJpc21hL3NlZWRfb2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQThDO0FBRTlDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO0FBRWxDLEtBQUssVUFBVSxJQUFJO0lBQ2pCLHVCQUF1QjtJQUN2QixNQUFNLFVBQVUsR0FBRztRQUNqQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDaEIsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO1FBQ25CLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUNuQixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7UUFDckIsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7S0FDbEMsQ0FBQztJQUVGLEtBQUssTUFBTSxRQUFRLElBQUksVUFBVSxFQUFFLENBQUM7UUFDbEMsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUMvQixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRTtZQUM5QixNQUFNLEVBQUUsRUFBRTtZQUNWLE1BQU0sRUFBRSxRQUFRO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFFOUMsa0VBQWtFO0lBQ2xFLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUM5RCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7S0FDekMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ3ZCLDBEQUEwRDtRQUMxRCxNQUFNLE9BQU8sR0FBRztZQUNkO2dCQUNFLFlBQVksRUFBRSxnREFBZ0Q7Z0JBQzlELE9BQU8sRUFBRTtvQkFDUCxFQUFFLElBQUksRUFBRSxXQUFX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