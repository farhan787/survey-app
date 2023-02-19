const { authenticateUser } = require('../auth/authenticate');
const { surveyResultDto } = require('../dto/survey');
const {
  createSurvey,
  getSurveyResult,
  submitSurvey,
} = require('../services/Survey');

const CreateSurvey = async ({ input }, context) => {
  try {
    const { userId } = authenticateUser(context);

    const { title, questions } = input;
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

const SubmitSurvey = async ({ input }, context) => {
  try {
    authenticateUser(context);

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

const GetSurveyResult = async ({ surveyId }, context) => {
  try {
    authenticateUser(context);

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
