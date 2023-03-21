
CREATE TABLE survey_responses (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	userId UUID NOT NULL,
	surveyId UUID NOT NULL,
	fieldId UUID NOT NULL,
	fieldType FieldType NOT NULL,
	content TEXT NULL,

	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);
