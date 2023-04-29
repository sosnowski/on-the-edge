DROP TABLE IF EXISTS containers;

CREATE TYPE EntityId as VARCHAR(30);

CREATE TABLE containers (
	id EntityId NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	domains TEXT[] NOT NULL,
	description TEXT,
	
	created timestamp with time zone default timezone('utc'::text, now()) not null,
	updated timestamp with time zone default timezone('utc'::text, now()) not null
);