DROP TABLE IF EXISTS questions;

CREATE type QuestionType as ENUM ('text', 'rating', 'select');


CREATE TABLE questions (
  id EntityId NOT NULL primary key,
  survey_id EntityId not null,
  label TEXT NOT NULL,
  type QuestionType NOT NULL,
  "order" SMALLINT NOT NULL,
  config JSON NULL,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  updated timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT fkSurvey
      FOREIGN KEY(survey_id) 
      REFERENCES surveys(id)
);