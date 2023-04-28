import { Db } from "./client";
import { Container } from "shared/models/container";
import { fromDbRecord, toDbRecord } from "./helper";

export const getAllContainers = async (db: Db): Promise<Container[]> => {
    console.log("Executing SELECT * query");
    const { data, error } = await db
        .from("containers")
        .select()
        .order("created", { ascending: false });

    if (error) {
        console.error(error);
        throw new Error("Error fetching containers");
    }

    return (data || []).map((row) => Container.parse(fromDbRecord(row)));
};

export const createContainer = async (
    db: Db,
    container: Pick<Container, "name" | "description">
): Promise<Container | null> => {
    console.log("Executing INSERT query");
    const res = await db
        .from("containers")
        .insert(toDbRecord(container))
        .select();

    return res.data && res.data.length > 0
        ? Container.parse(fromDbRecord(res.data[0]))
        : null;
};
