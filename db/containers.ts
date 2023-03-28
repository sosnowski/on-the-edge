import { Db } from "./client";
import { Container } from "shared/models/container";

export const getAllContainers = async (db: Db): Promise<Container[]> => {
    console.log("Executing SELECT * query");
    const res = await db.execute(
        "SELECT * FROM containers ORDER BY created DESC"
    );
    return res.rows.map((row) => Container.parse(row));
};

export const createContainer = async (
    db: Db,
    container: Pick<Container, "name" | "description">
): Promise<void> => {
    console.log("Executing INSERT query");
    const res = await db.execute(
        "INSERT INTO containers (name, description) VALUES (?, ?)",
        [container.name, container.description]
    );

    console.log(res);
};
