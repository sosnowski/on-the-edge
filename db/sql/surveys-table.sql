DROP TABLE IF EXISTS surveys;

CREATE TABLE IF NOT EXISTS surveys (
  surveyId SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM ('fixed', 'modal') NOT NULL,
  display ENUM ('always', 'user', 'session') NOT NULL,
  status ENUM ('active', 'inactive') NOT NULL,
  triggerConfig JSON NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW(),
  updated TIMESTAMP NOT NULL DEFAULT NOW()
);