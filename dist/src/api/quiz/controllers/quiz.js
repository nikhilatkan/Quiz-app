"use strict";
/**
 * quiz controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::quiz.quiz');
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
