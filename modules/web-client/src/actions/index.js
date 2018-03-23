export const MERGE_ENTITIES = 'MERGE_ENTITIES';

export const addEntities = (entities) => ({
    type: MERGE_ENTITIES,
    entities,
});
