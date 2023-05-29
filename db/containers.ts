import { Db } from "./client";
import { Container } from "shared/models/container";
import { fromDbRecord, toDbRecord } from "./helper";
import { newEntityId } from "shared/models/base";

export const getAllContainers = async (db: Db): Promise<Container[]> => {
    console.log("Executing getAllContainers query");

    const res = await db.query(
        "SELECT * FROM containers ORDER BY created DESC"
    );

    return (res.rows || []).map((row) => Container.parse(fromDbRecord(row)));
};

export const getContainerById = async (
    db: Db,
    containerId: string
): Promise<Container | null> => {
    console.log("Executing getContainerById query");

    const res = await db.query(
        "SELECT * FROM containers WHERE id = $1 LIMIT 1",
        [containerId]
    );

    return res.rows.length === 1
        ? Container.parse(fromDbRecord(res.rows[0]))
        : null;
};

export const createContainer = async (
    db: Db,
    container: Container
): Promise<Container> => {
    console.log("Executing INSERT query");
    const res = await db.query(
        "INSERT INTO containers (id, name, description, domains) VALUES ($1, $2, $3, $4) RETURNING *",
        [
            newEntityId(),
            container.name,
            container.description,
            container.domains,
        ]
    );

    if (!res.rows || res.rows.length !== 1) {
        throw new Error("Error creating container");
    }

    return Container.parse(fromDbRecord(res.rows[0]));
};

export const updateContainer = async (
    db: Db,
    container: Container
): Promise<Container> => {
    console.log("Executing UPDATE CONTAINER query");
    const res = await db.query(
        "UPDATE containers SET name = $1, description = $2, domains = $3, updated = $4 WHERE id = $5 RETURNING *",
        [
            container.name,
            container.description,
            container.domains,
            new Date(),
            container.id,
        ]
    );

    if (!res.rows || res.rows.length !== 1) {
        throw new Error("Error updating container");
    }

    return Container.parse(fromDbRecord(res.rows[0]));
};
