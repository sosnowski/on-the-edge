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

const isObj = (obj: unknown): obj is Record<string, unknown> => {
    return (
        obj !== null &&
        typeof obj === "object" &&
        !(obj instanceof Date) &&
        !Array.isArray(obj)
    );
};

export const fromDbRecord = <T>(
    record: Record<string, unknown>,
    skip: string[] = []
): T => {
    const camelCaseObj: Record<string, unknown> = {};
    for (const key in record) {
        if (!skip.includes(key)) {
            let value;
            if (Array.isArray(record[key])) {
                value = (record[key] as unknown[]).map((item) => {
                    return isObj(item) ? fromDbRecord(item, skip) : item;
                });
            } else if (isObj(record[key])) {
                value = fromDbRecord(
                    record[key] as Record<string, unknown>,
                    skip
                );
            } else {
                value = record[key];
            }
            camelCaseObj[snakeCaseToCamelCase(key)] = value;
        }
    }
    return camelCaseObj as T;
};
