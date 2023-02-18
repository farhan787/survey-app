const SurveyController = require('../controllers/survey');

const graphqlRootResolver = {
  surveyResult: SurveyController.GetSurveyResult,
  authenticate: ({ username, password }) => {
    console.log(`username: ${username}, password: ${password}`);
    return {
      token: 'xX!-34lfjakd342je;fd;aljr2l4l;d&^#12fd',
    };
  },

  // Mutations below
  createSurvey: SurveyController.CreateSurvey,
  submitSurvey: SurveyController.SubmitSurvey,
};

module.exports = graphqlRootResolver;
