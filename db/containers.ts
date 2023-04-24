import { Db } from "./client";
import { Container } from "shared/models/container";

export const getAllContainers = async (db: Db): Promise<Container[]> => {
    console.log("Executing SELECT * query");
    const res = await db
        .from("containers")
        .select()
        .order("created", { ascending: false });

    console.log(res);
    // if (res.status !== 200) {
    //     console.error(res);
    //     throw new Error("Error fetching containers");
    // }
    return (res.data || []).map((row) => Container.parse(row));
};

export const createContainer = async (
    db: Db,
    container: Pick<Container, "name" | "description">
): Promise<Container | null> => {
    console.log("Executing INSERT query");
    const res = await db.from("containers").insert(container).select();

    return res.data && res.data.length > 0
        ? Container.parse(res.data[0])
        : null;
};
