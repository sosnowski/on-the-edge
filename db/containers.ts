import { Db } from "./client";
import { Container } from "shared/models/container";
import { fromDbRecord, toDbRecord } from "./helper";
import { newEntityId } from "shared/models/base";

export const getAllContainers = async (db: Db): Promise<Container[]> => {
    console.log("Executing getAllContainers query");
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

export const getContainerById = async (
    db: Db,
    containerId: string
): Promise<Container | null> => {
    console.log("Executing getContainerById query");
    const { data, error } = await db
        .from("containers")
        .select()
        .eq("id", containerId)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Error fetching container");
    }

    return data ? Container.parse(fromDbRecord(data)) : null;
};

export const createContainer = async (
    db: Db,
    container: Container
): Promise<Container> => {
    console.log("Executing INSERT query");
    const { data, error } = await db
        .from("containers")
        .insert({
            id: newEntityId(),
            ...toDbRecord(container),
        })
        .select()
        .single();

    if (error || !data) {
        console.error(error);
        throw new Error("Error creating container");
    }

    return Container.parse(fromDbRecord(data));
};

export const updateContainer = async (
    db: Db,
    container: Container
): Promise<Container> => {
    console.log("Executing UPDATE CONTAINER query");
    const { data, error } = await db
        .from("containers")
        .update(toDbRecord(container))
        .eq("id", container.id)
        .select()
        .single();

    if (error || !data) {
        console.error(error);
        throw new Error("Error updating container");
    }

    return Container.parse(fromDbRecord(data));
};
