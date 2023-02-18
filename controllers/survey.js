const { surveyResultDto } = require('../dto/survey');
const {
  createSurvey,
  getSurveyResult,
  submitSurvey,
} = require('../services/Survey');

const CreateSurvey = async ({ input }) => {
  try {
    const { title, questions } = input;

    // TODO: fetch createdBy/userId from jwt token
    const userId = 124;

    const surveyId = await createSurvey({ title, userId, questions });
    return {
      success: true,
      surveyId,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: err.message,
    };
  }
};

const SubmitSurvey = async ({ input }) => {
  try {
    const { surveyId, questionIdsResponses } = input;

    await submitSurvey({ surveyId, questionIdsResponses });
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

const GetSurveyResult = async ({ surveyId }) => {
  try {
    const surveyResultDbData = await getSurveyResult(surveyId);
    return {
      success: true,
      data: surveyResultDto(surveyResultDbData),
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = { CreateSurvey, GetSurveyResult, SubmitSurvey };