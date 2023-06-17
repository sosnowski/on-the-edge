
CREATE TABLE tags (
  id EntityId NOT NULL primary key,
  container_id EntityId not null,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  updated timestamp with time zone default timezone('utc'::text, now()) not null,

  CONSTRAINT fkContainer
      FOREIGN KEY(container_id) 
      REFERENCES containers(id)
);

CREATE TABLE tags_responses (
  tag_id EntityId not null,
  response_id bigint not null,

  PRIMARY KEY (tag_id, response_id),

  CONSTRAINT fkTag
	  FOREIGN KEY(tag_id) 
	  REFERENCES tags(id),

	CONSTRAINT fkResponse
	  FOREIGN KEY(response_id) 
	  REFERENCES responses(id)
);
