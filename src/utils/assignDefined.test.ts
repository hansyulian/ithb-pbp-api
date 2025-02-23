import { assignDefined } from "~/utils/assignDefined";

describe("utils: assignDefined", () => {
  it("should assign defined values from data to target", () => {
    const target: any = { name: "Old Name", age: 25 };
    const data = { name: "New Name", age: undefined };

    assignDefined(target, data);

    expect(target).toEqual({
      name: "New Name",
      age: 25, // Remains unchanged because `data.age` is `undefined`
    });
  });

  it("should not assign keys with undefined values", () => {
    const target: any = { status: "active" };
    const data = { status: undefined };

    assignDefined(target, data);

    expect(target).toEqual({
      status: "active", // Unchanged
    });
  });

  it("should add new keys to the target if they exist in data", () => {
    const target: any = { name: "Existing Name" };
    const data = { role: "admin", status: "active" };

    assignDefined(target, data);

    expect(target).toEqual({
      name: "Existing Name",
      role: "admin",
      status: "active",
    });
  });

  it("should handle empty data gracefully", () => {
    const target = { name: "Existing Name" };
    const data = {};

    assignDefined(target, data);

    expect(target).toEqual({
      name: "Existing Name", // Unchanged
    });
  });

  it("should handle empty target gracefully", () => {
    const target: any = {};
    const data = { name: "New Name", role: "admin" };

    assignDefined(target, data);

    expect(target).toEqual({
      name: "New Name",
      role: "admin",
    });
  });

  it("should not mutate the data object", () => {
    const target = { name: "Old Name" };
    const data = { name: "New Name" };

    assignDefined(target, data);

    expect(data).toEqual({
      name: "New Name", // Unchanged
    });
  });

  it("should work with nested objects", () => {
    const target = { profile: { name: "Old Name", age: 30 } };
    const data = { profile: { name: "New Name" } };

    assignDefined(target, data);

    expect(target).toEqual({
      profile: { name: "New Name" }, // Entire profile is replaced
    });
  });
});
