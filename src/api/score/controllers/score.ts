/**
 * score controller
 */

import { factories } from '@strapi/strapi'

function calculateScore(score) {
    let question;
    let scoreTotal = 0;

    score.answers.map((userAnswer) => {
        question = userAnswer.question;

        if (question.answer == userAnswer.value) {
            userAnswer.correct = true;
            scoreTotal += 1;
        } else {
            userAnswer.correct = false;
        }

        userAnswer.correctValue = question.answer;
        delete userAnswer.question;

        return userAnswer;
    });

    const questionCount = score.quiz.questions.length;
    delete score.quiz.questions;

    let resp = {
        questionCount,
        scoreTotal,
        quiz: score.quiz
    };

    delete score.quiz;

    return { ...resp, score };
}

export default factories.createCoreController('api::score.score', ({ strapi }) => {
    return {
        async create(ctx) {
            let { answers } = ctx.request.body;
            const quizId = ctx.request.body.quiz.id;
            try {
                let quiz = await strapi.service('api::quiz.quiz').findOne(quizId, { populate: ['questions'] });
                let score = await strapi.service('api::score.score').create({
                    data: {
                        quiz: quizId,
                        user: ctx.state.user.id
                    }
                });
                let question, userAnswer;
                let scoreTotal = 0;

                score.answers = [];

                for (let i = 0; i < answers.length; i++) {
                    userAnswer = answers[i];

                    question = quiz.questions.find((qst) => qst.documentId === userAnswer.question.id);
                    console.log("question", question);
                    if (question) {
                        const answersapi = await strapi.service('api::answer.answer').create({
                            data: {
                                question: question.id,
                                score: score.id,
                                value: userAnswer.value
                            }
                        });

                        if (question.answer === userAnswer.value) {
                            userAnswer.correct = true;
                            scoreTotal += 1;
                        } else {
                            userAnswer.correct = false;
                        }
                        userAnswer.correctValue = question.answer;
                    }
                    score.answers.push(userAnswer);
                }
                const questionCount = quiz.questions.length;
                delete quiz.questions;

                return { questionCount, scoreTotal, quiz, score };
            } catch {
                ctx.response.status = 500;
                return { error: { message: 'There was a problem scoring your answers' } };
            }

        },
        async findOne(ctx) {
            const { id } = ctx.params;

            try {
                let score = await strapi.service('api::score.score').findOne(id, {
                    filters: { user: ctx.state.user.id },
                    populate: {
                        answers: { populate: ['question'] },
                        quiz: { populate: ['questions'] }
                    }
                });

                return calculateScore(score);
            }
            catch {
                ctx.response.status = 500;
                return { error: { message: 'There was a problem fetching your score.' } };
            }
        },
        async find(ctx) {
            try {
                const { query } = ctx;

                let scores = await strapi.service('api::score.score').find({
                    filters: { user: ctx.state.user.id },
                    populate: {
                        answers: { populate: ['question'] },
                        quiz: { populate: ['questions'] }
                    },
                    ...query
                });

                return scores.results.map(calculateScore);
            } catch {
                ctx.response.status = 500;
                return { error: { message: 'There was a problem fetching your scores.' } };
            }
        },
    }
});
