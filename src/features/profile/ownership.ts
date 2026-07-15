export type OwnedRecord = {
  userId: string;
};

export function userScopedWhere(id: string, userId: string) {
  return { id, userId };
}

export function assertUserOwnsRecord<TRecord extends OwnedRecord>(
  record: TRecord | null | undefined,
  userId: string,
) {
  if (!record || record.userId !== userId) {
    throw new Error("Resource not found for user.");
  }

  return record;
}
