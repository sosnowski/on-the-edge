DROP TABLE IF EXISTS surveys;

CREATE type SurveyDisplayType as ENUM ('fab', 'modal', 'toast');
CREATE type SurveyStatus as ENUM ('active', 'inactive');


CREATE TABLE surveys (
  id EntityId NOT NULL primary key,
  container_id EntityId not null,
  name TEXT NOT NULL,
  display_type SurveyDisplayType NOT NULL,
  status SurveyStatus NOT NULL,
  trigger_config JSON NOT NULL,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  updated timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT fkContainer
      FOREIGN KEY(container_id) 
      REFERENCES containers(id)
);