/**
 * quiz controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::quiz.quiz');

// export default factories.createCoreController('api::quiz.quiz', ({ strapi }) => {
//     return {
//         async findOne(ctx) {
//             const quizzes = await strapi.entityService.findMany('api::quiz.quiz', {
//                 populate: ['questions'],
//             });
//             return quizzes;
//         },
//     }
// });
