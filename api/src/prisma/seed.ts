import { PrismaClient } from '@prisma/client';
import { careersSeedData } from './careersSeedData';
import { objectEnumNames } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

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
            for (const careerCategory of careersSeedData.careers) {
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
    } catch (error) {
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