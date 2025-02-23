export function assignDefined<
  UpdateData extends Record<string, any>,
  EventTarget extends Record<string, any>
>(target: EventTarget, data: UpdateData) {
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      (target as any)[key] = value;
    }
  });
}
