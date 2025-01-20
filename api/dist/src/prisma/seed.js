"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const careersSeedData_1 = require("./careersSeedData");
const prisma = new client_1.PrismaClient();
const seedData = {
    quizCategories: [
        // { name: 'Math' },
        // { name: 'Science' },
        // { name: 'History' },
        // { name: 'Geography' },
        { name: 'Counseling & Academic' },
        { name: 'Career Exploration' },
    ],
    lessonsAndQuizzes: [
        {
            // Lesson data
            category: "academicskills",
            categoryTitle: "Academic Skills",
            title: "Effective Study Techniques",
            description: "Learn proven study methods to improve your academic performance",
            no: 1,
            // Lesson content
            sbh1: "Time Management",
            p1: "The Pomodoro Technique is a time management method that uses a timer to break work into focused 25-minute intervals, separated by short breaks. This technique helps maintain concentration and prevent mental fatigue. Research shows it can significantly improve productivity and retention of study material.",
            sbh2: "Active Learning Strategies",
            p2: "Active learning involves engaging with the material through methods like summarization, self-testing, and teaching others. The Cornell Method is particularly effective, dividing notes into main ideas, details, and summaries. This structured approach improves comprehension and retention by 40% compared to passive reading.",
            sbh3: "Note-Taking Methods",
            p3: "Mind mapping is a powerful visual note-taking technique that connects ideas through branches and sub-branches. It helps in understanding relationships between concepts and improves memory recall by up to 32% compared to linear notes. The key to effective mind mapping is starting with a central concept and branching out to related ideas.",
            sbh4: "Review and Practice",
            p4: "Spaced repetition is a review technique where information is revisited at gradually increasing intervals. Studies show this method can improve long-term retention by up to 80% compared to cramming. The optimal spacing schedule is: review after 1 day, 3 days, 7 days, and then 21 days.",
            // Quiz data
            quizCategory: "Counseling & Academic",
            quizQuestions: [
                {
                    questionText: "How long is each focused work interval in the Pomodoro Technique?",
                    answers: [
                        { text: "25 minutes", isCorrect: true },
                        { text: "45 minutes", isCorrect: false },
                        { text: "15 minutes", isCorrect: false },
                        { text: "30 minutes", isCorrect: false }
                    ]
                },
                {
                    questionText: "According to the lesson, by what percentage can mind mapping improve memory recall compared to linear notes?",
                    answers: [
                        { text: "22%", isCorrect: false },
                        { text: "32%", isCorrect: true },
                        { text: "42%", isCorrect: false },
                        { text: "52%", isCorrect: false }
                    ]
                }
            ]
        },
        {
            // Lesson data
            category: "criticalthinking",
            categoryTitle: "Critical Thinking",
            title: "Analytical Problem Solving",
            description: "Develop strong analytical and critical thinking skills",
            no: 2,
            // Lesson content
            sbh1: "Problem Analysis Framework",
            p1: "The IDEAL problem-solving framework consists of five steps: Identify the problem, Define the context, Explore strategies, Act on strategies, and Look back to evaluate. This systematic approach ensures thorough problem analysis and increases solution success rates by 75% compared to unstructured approaches.",
            sbh2: "Decision Making Process",
            p2: "The rational decision-making model follows six key steps: identify the problem, gather information, identify alternatives, weigh evidence, choose among alternatives, and take action. Research shows that following this structured process leads to 40% better outcomes than intuitive decision-making.",
            sbh3: "Logical Reasoning",
            p3: "Deductive reasoning moves from general principles to specific conclusions, while inductive reasoning does the opposite. The scientific method primarily uses hypothetico-deductive reasoning, combining both approaches. Studies show that understanding these reasoning types improves problem-solving accuracy by 45%.",
            sbh4: "Creative Problem Solving",
            p4: "Lateral thinking techniques, such as reverse thinking and random word association, can increase solution generation by 60%. The Disney Method uses three perspectives: the dreamer, the realist, and the critic, to evaluate solutions comprehensively.",
            // Quiz data
            quizCategory: "Counseling & Academic",
            quizQuestions: [
                {
                    questionText: "What are the five steps in the IDEAL problem-solving framework?",
                    answers: [
                        { text: "Identify, Define, Explore, Act, Look back", isCorrect: true },
                        { text: "Investigate, Develop, Execute, Analyze, Learn", isCorrect: false },
                        { text: "Input, Design, Evaluate, Adjust, List", isCorrect: false },
                        { text: "Implement, Direct, Examine, Apply, Log", isCorrect: false }
                    ]
                },
                {
                    questionText: "By what percentage does the rational decision-making model improve outcomes compared to intuitive decision-making?",
                    answers: [
                        { text: "30%", isCorrect: false },
                        { text: "35%", isCorrect: false },
                        { text: "40%", isCorrect: true },
                        { text: "45%", isCorrect: false }
                    ]
                }
            ]
        },
        {
            // Lesson data
            category: "studyhabits",
            categoryTitle: "Study Habits",
            title: "Building Effective Study Routines",
            description: "Create and maintain productive study habits",
            no: 3,
            // Lesson content
            sbh1: "Study Environment",
            p1: "Research shows that a dedicated study space with proper lighting (500-1000 lux) and minimal noise (below 50 decibels) can improve concentration by 35%. Temperature also plays a crucial role, with 20-22°C (68-72°F) being optimal for cognitive performance.",
            sbh2: "Study Schedule",
            p2: "The 'spacing effect' research indicates that distributing study sessions across multiple days leads to 200% better retention compared to cramming. The optimal study session length is 50 minutes, followed by a 10-minute break to maintain peak cognitive performance.",
            sbh3: "Break Management",
            p3: "Active breaks, involving light physical activity, improve subsequent study session effectiveness by 25% compared to passive breaks. The optimal break length is 10-15 minutes for every 50 minutes of focused study, with a longer 30-minute break every 3 hours.",
            sbh4: "Progress Tracking",
            p4: "Using a study journal to track progress increases goal achievement by 42%. The most effective tracking method includes recording study time, topics covered, and self-assessment of understanding on a 1-5 scale.",
            // Quiz data
            quizCategory: "Counseling & Academic",
            quizQuestions: [
                {
                    questionText: "What is the optimal temperature range for cognitive performance according to the lesson?",
                    answers: [
                        { text: "18-20°C", isCorrect: false },
                        { text: "20-22°C", isCorrect: true },
                        { text: "22-24°C", isCorrect: false },
                        { text: "24-26°C", isCorrect: false }
                    ]
                },
                {
                    questionText: "How much better is distributed practice compared to cramming, according to spacing effect research?",
                    answers: [
                        { text: "100% better", isCorrect: false },
                        { text: "150% better", isCorrect: false },
                        { text: "200% better", isCorrect: true },
                        { text: "250% better", isCorrect: false }
                    ]
                }
            ]
        }
    ]
};
// Rest of the seeding logic remains the same
async function main() {
    try {
        // Seed Quiz Categories
        console.log('Seeding quiz categories...');
        for (const category of seedData.quizCategories) {
            await prisma.quizCategory.upsert({
                where: { name: category.name },
                update: {},
                create: category,
            });
        }
        console.log('Quiz categories seeded successfully');
        // Seed Lessons and Quizzes
        console.log('Seeding lessons and quizzes...');
        for (const row of seedData.lessonsAndQuizzes) {
            // Find the quiz category
            const quizCategory = await prisma.quizCategory.findUnique({
                where: { name: row.quizCategory },
            });
            if (!quizCategory) {
                throw new Error(`Quiz category ${row.quizCategory} not found`);
            }
            // Create the lesson
            const lesson = await prisma.lesson.upsert({
                where: { id: row.no },
                update: {
                    category: row.category,
                    categoryTitle: row.categoryTitle,
                    title: row.title,
                    description: row.description,
                    no: row.no,
                },
                create: {
                    category: row.category,
                    categoryTitle: row.categoryTitle,
                    title: row.title,
                    description: row.description,
                    no: row.no,
                },
            });
            // Create lesson content
            await prisma.lessonContent.create({
                data: {
                    lessonId: lesson.id,
                    sbh1: row.sbh1,
                    p1: row.p1,
                    sbh2: row.sbh2,
                    p2: row.p2,
                    sbh3: row.sbh3,
                    p3: row.p3,
                    sbh4: row.sbh4,
                    p4: row.p4,
                },
            });
            // Create quiz with questions and answers
            const quiz = await prisma.quiz.create({
                data: {
                    category: {
                        connect: { id: quizCategory.id },
                    },
                    lesson: {
                        connect: { id: lesson.id },
                    },
                    questions: {
                        create: row.quizQuestions.map(q => ({
                            text: q.questionText,
                            answers: {
                                create: q.answers.map(answer => ({
                                    text: answer.text,
                                    isCorrect: answer.isCorrect,
                                })),
                            },
                        })),
                    },
                },
            });
            console.log(`Lesson "${row.title}" and its quiz seeded successfully`);
        }
        console.log('Seeding careers...');
        const createCareers = async () => {
            for (const careerCategory of careersSeedData_1.careersSeedData.careers) {
                let category = await prisma.careerCategory.findUnique({
                    where: { category: careerCategory.category },
                });
                if (!category) {
                    category = await prisma.careerCategory.create({
                        data: { category: careerCategory.category },
                    });
                }
                for (const career of careerCategory.careers) {
                    await prisma.career.upsert({
                        where: { title: career.title },
                        update: {
                            title: career.title,
                            field: career.field,
                            potential: career.potential,
                            trend: career.trend,
                            salary: career.salary,
                            skills: career.skills,
                            education: career.education,
                            icon: career.icon,
                            growth: career.growth,
                            satisfaction: career.satisfaction,
                            description: career.description,
                            progression: career.progression,
                            resources: career.resources,
                            category: { connect: { category: category.category } },
                        },
                        create: {
                            onetCode: career.onetCode,
                            title: career.title,
                            field: career.field,
                            potential: career.potential,
                            trend: career.trend,
                            salary: career.salary,
                            skills: career.skills,
                            education: career.education,
                            icon: career.icon,
                            growth: career.growth,
                            satisfaction: career.satisfaction,
                            description: career.description,
                            progression: career.progression,
                            resources: career.resources,
                            category: { connect: { category: category.category } },
                        },
                    }).then(() => console.log(`Career ${career.title} added`));
                }
            }
        };
        createCareers()
            .then(() => console.log('Careers and categories seeded successfully'))
            .catch((error) => console.error('Error seeding careers data:', error));
        console.log('All seed data created successfully');
    }
    catch (error) {
        console.error('Error seeding data:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcmlzbWEvc2VlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUE4QztBQUM5Qyx1REFBb0Q7QUFHcEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7QUFFbEMsTUFBTSxRQUFRLEdBQUc7SUFDYixjQUFjLEVBQUU7UUFDWixvQkFBb0I7UUFDcEIsdUJBQXVCO1FBQ3ZCLHVCQUF1QjtRQUN2Qix5QkFBeUI7UUFDekIsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7UUFDakMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7S0FDakM7SUFDRCxpQkFBaUIsRUFBRTtRQUNmO1lBQ0ksY0FBYztZQUNkLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsYUFBYSxFQUFFLGlCQUFpQjtZQUNoQyxLQUFLLEVBQUUsNEJBQTRCO1lBQ25DLFdBQVcsRUFBRSxpRUFBaUU7WUFDOUUsRUFBRSxFQUFFLENBQUM7WUFDTCxpQkFBaUI7WUFDakIsSUFBSSxFQUFFLGlCQUFpQjtZQUN2QixFQUFFLEVBQUUsbVRBQW1UO1lBQ3ZULElBQUksRUFBRSw0QkFBNEI7WUFDbEMsRUFBRSxFQUFFLG9VQUFvVTtZQUN4VSxJQUFJLEVBQUUscUJBQXFCO1lBQzNCLEVBQUUsRUFBRSxvVkFBb1Y7WUFDeFYsSUFBSSxFQUFFLHFCQUFxQjtZQUMzQixFQUFFLEVBQUUsOFJBQThSO1lBQ2xTLFlBQVk7WUFDWixZQUFZLEVBQUUsdUJBQXVCO1lBQ3JDLGFBQWEsRUFBRTtnQkFDWDtvQkFDSSxZQUFZLEVBQUUsbUVBQW1FO29CQUNqRixPQUFPLEVBQUU7d0JBQ0wsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7d0JBQ3ZDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO3dCQUN4QyxFQUFFLElBQUksRUFBRSxZ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