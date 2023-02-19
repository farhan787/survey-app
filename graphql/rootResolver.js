const AuthController = require('../controllers/auth');
const SurveyController = require('../controllers/survey');

const graphqlRootResolver = {
  surveyResult: SurveyController.GetSurveyResult,
  authenticate: AuthController.Authenticate,

  // Mutations below
  createSurvey: SurveyController.CreateSurvey,
  submitSurvey: SurveyController.SubmitSurvey,
};

module.exports = graphqlRootResolver;
