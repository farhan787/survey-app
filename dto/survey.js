// Converts Get Survey Result DB data into graphql response format
const surveyResultDto = (dbRows) => {
  // sum up all votes for all question ids
  const questionsResponseVotes = {};
  dbRows.forEach((row) => {
    if (questionsResponseVotes[row.question_id] === undefined) {
      questionsResponseVotes[row.question_id] = {};
    }

    if (questionsResponseVotes[row.question_id][row.response] === undefined) {
      questionsResponseVotes[row.question_id][row.response] = 0;
    }
    questionsResponseVotes[row.question_id][row.response] += row.counter;
  });

  // convert into final response with yes/no and no. of votes to each question
  const response = [];
  for (const questionId in questionsResponseVotes) {
    const resp = { questionId: parseInt(questionId), result: {} };
    for (const voteKey in questionsResponseVotes[questionId]) {
      const resultKey = voteKey === '0' ? 'no' : 'yes';
      resp.result[resultKey] = questionsResponseVotes[questionId][voteKey];
    }
    response.push(resp);
  }
  return response;
};

module.exports = { surveyResultDto };
