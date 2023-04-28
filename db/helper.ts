export const snakeCaseToCamelCase = (str: string) => {
    return str.replace(/(_\w)/g, (m) => m[1].toUpperCase());
};

export const camelCaseToSnakeCase = (str: string) => {
    return str.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
};

export const toDbRecord = <T>(
    obj: T,
    skip: string[] = []
): Record<string, unknown> => {
    const snakeCaseObj: Record<string, unknown> = {};
    for (const key in obj) {
        if (!skip.includes(key)) {
            snakeCaseObj[camelCaseToSnakeCase(key)] = obj[key];
        }
    }
    return snakeCaseObj;
};

export const fromDbRecord = <T>(
    record: Record<string, unknown>,
    skip: string[] = []
): T => {
    const camelCaseObj: Record<string, unknown> = {};
    for (const key in record) {
        if (!skip.includes(key)) {
            camelCaseObj[snakeCaseToCamelCase(key)] = record[key];
        }
    }
    return camelCaseObj as T;
};
