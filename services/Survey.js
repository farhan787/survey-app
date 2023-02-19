const _ = require('lodash');

const db = require('../startup/sqliteDb');
const { INVALID_SURVEY } = require('../common/errorMessages');

const checkSurveyExist = (surveyId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT survey_id FROM surveys WHERE survey_id = ?`,
      [surveyId],
      function (err, rows) {
        if (err) {
          reject(err);
        }

        if (!rows || !Object.keys(rows).length || rows.survey_id !== surveyId) {
          resolve(false);
        }
        resolve(true);
      }
    );
  });
};

const getSurveyQuestionsInfo = ({ surveyId, fieldsToFetch }) => {
  let fetchQuery = `SELECT `;
  if (fieldsToFetch.includes('question_id')) fetchQuery += `question_id`;
  if (fieldsToFetch.includes('survey_id')) fetchQuery += `, survey_id`;
  if (fieldsToFetch.includes('text')) fetchQuery += `, text`;
  fetchQuery += ` FROM survey_questions WHERE survey_id = ?;`;

  return new Promise((resolve, reject) => {
    db.all(fetchQuery, [surveyId], function (err, rows) {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

const createSurvey = ({ title, userId, questions }) => {
  return new Promise((resolve, reject) => {
    // Create survey entry
    db.run(
      'INSERT INTO surveys(title, created_by) VALUES (?, ?)',
      [title, userId],
      function (err) {
        if (err) {
          reject(err);
        }

        // Insert survey questions
        const surveyQuestionsPlaceholders = questions
          .map(() => '(?, ?)')
          .join(',');
        const surveyQuestionsInsertQuery =
          'INSERT INTO survey_questions(survey_id, text) VALUES ' +
          surveyQuestionsPlaceholders;

        const surveyId = this.lastID;
        const surveyQuestionsValues = [];
        questions.forEach((question) => {
          surveyQuestionsValues.push(surveyId, question);
        });

        db.run(
          surveyQuestionsInsertQuery,
          surveyQuestionsValues,
          function (err) {
            if (err) {
              reject(err);
            }

            const lastQuestionId = this.lastID;
            resolve({
              surveyId,
              firstQuestionId: lastQuestionId - questions.length + 1,
              lastQuestionId,
            });
          }
        );
      }
    );
  });
};

const submitSurvey = async ({ surveyId, questionIdsResponses }) => {
  const surveyExist = await checkSurveyExist(surveyId);
  if (!surveyExist) {
    throw new Error(INVALID_SURVEY);
  }

  const surveyQuestionsInfo = await getSurveyQuestionsInfo({
    surveyId,
    fieldsToFetch: ['question_id'],
  });
  const surveyQuestionsIds = _.map(surveyQuestionsInfo, 'question_id');

  return new Promise((resolve, reject) => {
    // create query for inserting survey questions
    const queryInsertValues = [];
    let questionsResponsesPlaceholders = [];

    questionIdsResponses.forEach((questionIdResponse) => {
      if (surveyQuestionsIds.includes(questionIdResponse.questionId)) {
        questionsResponsesPlaceholders.push('(?,?)');
        queryInsertValues.push(
          parseInt(questionIdResponse.questionId),
          +questionIdResponse.response
        );
      } else {
        console.warn(
          `Warning::submitSurvey::Question id ${questionIdResponse.questionId} does not belong to suvey id ${surveyId}`
        );
      }
    });
    questionsResponsesPlaceholders = questionsResponsesPlaceholders.join(',');

    if (!queryInsertValues.length) {
      reject(new Error('Question ids do not belong to this survey'));
    }

    const questionsResponsesInsertQuery = `
  INSERT INTO questions_responses(question_id, response) VALUES ${questionsResponsesPlaceholders} 
  ON CONFLICT(question_id, response) DO UPDATE SET counter = counter + 1`;

    db.run(questionsResponsesInsertQuery, queryInsertValues, function (err) {
      if (err) {
        reject(err);
      }
      resolve(null);
    });
  });
};

const getSurveyResult = async (surveyId) => {
  const surveyExist = await checkSurveyExist(surveyId);
  if (!surveyExist) {
    throw new Error(INVALID_SURVEY);
  }

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT question_id FROM survey_questions WHERE survey_id = ?`,
      [surveyId],
      function (err, rows) {
        if (err) {
          reject(err);
        }

        const questionsIds = rows.map((row) => row.question_id);
        const questionIdsPlaceholder = Array.from(
          { length: questionsIds.length },
          (v, k) => '?'
        );

        db.all(
          `SELECT question_id, response, counter FROM questions_responses WHERE question_id IN (${questionIdsPlaceholder})`,
          questionsIds,
          function (err, rows) {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      }
    );
  });
};

module.exports = { createSurvey, getSurveyResult, submitSurvey };
