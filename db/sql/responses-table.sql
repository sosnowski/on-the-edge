
DROP TABLE IF EXISTS responses;

CREATE type FieldType as ENUM ('text', 'number');

CREATE TABLE responses (
	responseId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	surveyId INT NOT NULL,
	fieldId INT NOT NULL,
	sessionToken CHAR(30) NOT NULL,
	fieldType FieldType NOT NULL,
	content TEXT NULL,

	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);