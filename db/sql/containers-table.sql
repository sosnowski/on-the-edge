DROP TABLE IF EXISTS containers;

CREATE TABLE containers (
	id VARCHAR(30) NOT NULL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description VARCHAR(300),
	
	created timestamp with time zone default timezone('utc'::text, now()) not null,
	updated timestamp with time zone default timezone('utc'::text, now()) not null
);