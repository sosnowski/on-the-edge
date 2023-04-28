DROP TABLE IF EXISTS questions;

CREATE type QuestionType as ENUM ('text', 'rating', 'select');


CREATE TABLE questions (
  id VARCHAR(30) NOT NULL primary key,
  survey_id VARCHAR(30) not null,
  label VARCHAR(200) NOT NULL,
  type QuestionType NOT NULL,
  "order" SMALLINT NOT NULL,
  config JSON NULL,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  updated timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT fkSurvey
      FOREIGN KEY(surveyId) 
      REFERENCES surveys(id)
);