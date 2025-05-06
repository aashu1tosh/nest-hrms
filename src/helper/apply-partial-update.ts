// /**
//  * Updates an entity with values from a partial DTO with optional custom mapping
//  * @param entity The entity to update
//  * @param partialData The partial data to apply
//  * @param propertyMap Optional mapping between DTO properties and entity properties
//  * @returns The updated entity
//  */
// export function applyPartialUpdate<
//     T extends Record<string, any>,
//     P extends Partial<Record<string, unknown>>
// >(
//     entity: T,
//     partialData: P,
//     propertyMap: Record<string, string> = {}
// ): T {
//     if (!partialData) return entity;

//     Object.keys(partialData).forEach((dtoKey) => {
//         const value = partialData[dtoKey as keyof P];
//         if (value !== undefined) {
//             // Use property mapping if provided, otherwise use the key directly
//             const entityKey = propertyMap[dtoKey] || dtoKey;

//             // Check if the key exists on the entity before assignment
//             if (entityKey in entity) {
//                 entity[entityKey as keyof T] = value as T[keyof T];
//             }
//         }
//     });

//     return entity;
// }

/**
 * Updates an entity with values from a partial DTO with optional custom mapping
 * @param entity The entity to update
 * @param partialData The partial data to apply
 * @param propertyMap Optional mapping between DTO properties and entity properties
 * @returns The updated entity
 */
export function applyPartialUpdate<T extends Record<string, any>, P>(
  entity: T,
  partialData: P,
  propertyMap: Record<string, string> = {},
): T {
  if (!partialData) return entity;

  // Use type-safe approach with Object.entries
  Object.entries(partialData as Record<string, any>).forEach(
    ([dtoKey, value]) => {
      if (value !== undefined) {
        // Use property mapping if provided, otherwise use the key directly
        const entityKey = propertyMap[dtoKey] || dtoKey;

        // Check if the key exists on the entity before assignment
        if (entityKey in entity)
          entity[entityKey as keyof T] = value as T[keyof T];
      }
    },
  );

  return entity;
}
