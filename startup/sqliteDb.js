const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const createSurveyTableQuery = `
  CREATE TABLE IF NOT EXISTS surveys (
    survey_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    is_deleted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime'))
  )
`;

const createSurveyQuestionsTableQuery = `
  CREATE TABLE IF NOT EXISTS survey_questions (
    question_id INTEGER PRIMARY KEY,
    survey_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime')),

    FOREIGN KEY (survey_id)
        REFERENCES surveys(survey_id)
        ON DELETE CASCADE
  )
  `;
const suveyQuestionsIndexQuery = `CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);`;

const createQuestionsResponsesTableQuery = `
  CREATE TABLE IF NOT EXISTS questions_responses (
    question_id INTEGER NOT NULL,
    response INTEGER DEFAULT NULL,
    counter INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now','localtime')),
    updated_at DATETIME DEFAULT (datetime('now','localtime')),

    UNIQUE (question_id, response),
    FOREIGN KEY (question_id)
        REFERENCES survey_questions(question_id)
        ON DELETE CASCADE
  )
`;

class Database {
  constructor(dbFilePath) {
    const filePath = path.resolve(__dirname, dbFilePath);

    this.dbInstance = new sqlite3.Database(
      filePath,
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
      }
    );

    this.initialise();
  }

  initialise() {
    this.createTables();
    this.createIndexes();
  }

  destoryConnection() {
    this.dbInstance.close();
  }

  createTables() {
    this.dbInstance.serialize(() => {
      this.dbInstance.run(createSurveyTableQuery);
      this.dbInstance.run(createSurveyQuestionsTableQuery);
      this.dbInstance.run(createQuestionsResponsesTableQuery);
    });
  }

  createIndexes() {
    this.dbInstance.run(suveyQuestionsIndexQuery);
  }
}

const db = new Database('../database/survey.db');
module.exports = db.dbInstance;
