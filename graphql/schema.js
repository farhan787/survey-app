const { buildSchema } = require('graphql');

const graphqlSchema = buildSchema(`
    input CreateSurveyInput {
        title: String!
        questions: [String]!
    }
    
    input SubmitSurveyInput {
        surveyId: Int!
        questionIdsResponses: [QuestionResponseType]
    }

    input QuestionResponseType {
        questionId: Int!
        response: Boolean!
    }

    type AuthenticateResponse {
        token: String!
    }

    type SurveyResultType {
        success: Boolean!
        data: [SurveyQuestionResultType]
        message: String
    }

    type SurveyQuestionResultType {
        questionId: Int
        result: QuestionResultType
    }

    type QuestionResultType {
        yes: Int
        no: Int
    }

    type SurveyCreatedDataType {
        surveyId: Int
        firstQuestionId: Int
        lastQuestionId: Int
    }

    type SurveyCreatedType {
        success: Boolean!
        message: String
        data: SurveyCreatedDataType
    }

    type SuccessResponseType {
        success: Boolean!
        message: String
    }

    type Query {
        surveyResult(surveyId: Int!): SurveyResultType
        authenticate(userName: String!, password: String!): AuthenticateResponse
    }

    type Mutation {
        createSurvey(input: CreateSurveyInput): SurveyCreatedType
        submitSurvey(input: SubmitSurveyInput): SuccessResponseType
    }
`);

module.exports = graphqlSchema;
