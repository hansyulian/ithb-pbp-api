import { mapRelation } from "~/utils/mapRelation";

describe("mapRelation", () => {
  test("maps relation data to a single record with single ID key", () => {
    const data = { id: 1, relatedId: 10 };
    const relationData = [{ id: 10, name: "Relation 1" }];

    const result = mapRelation(data, relationData, "relatedId", "relation");

    expect(result).toEqual({
      id: 1,
      relatedId: 10,
      relation: { id: 10, name: "Relation 1" },
    });
  });

  test("maps relation data to an array of records with single ID key", () => {
    const data = [
      { id: 1, relatedId: 10 },
      { id: 2, relatedId: 20 },
    ];
    const relationData = [
      { id: 10, name: "Relation 1" },
      { id: 20, name: "Relation 2" },
    ];

    const result = mapRelation(data, relationData, "relatedId", "relation");

    expect(result).toEqual([
      { id: 1, relatedId: 10, relation: { id: 10, name: "Relation 1" } },
      { id: 2, relatedId: 20, relation: { id: 20, name: "Relation 2" } },
    ]);
  });

  test("maps relation data to a single record with multiple ID keys", () => {
    const data = { id: 1, relatedIds: [10, 20] };
    const relationData = [
      { id: 10, name: "Relation 1" },
      { id: 20, name: "Relation 2" },
    ];

    const result = mapRelation(data, relationData, "relatedIds", "relations");

    expect(result).toEqual({
      id: 1,
      relatedIds: [10, 20],
      relations: [
        { id: 10, name: "Relation 1" },
        { id: 20, name: "Relation 2" },
      ],
    });
  });

  test("handles missing relation data gracefully", () => {
    const data = { id: 1, relatedIds: [10, 30] };
    const relationData = [
      { id: 10, name: "Relation 1" },
      { id: 20, name: "Relation 2" },
    ];

    const result = mapRelation(data, relationData, "relatedIds", "relations");

    expect(result).toEqual({
      id: 1,
      relatedIds: [10, 30],
      relations: [{ id: 10, name: "Relation 1" }, undefined],
    });
  });

  test("maps relation data to an array of records with multiple ID keys", () => {
    const data = [
      { id: 1, relatedIds: [10, 20] },
      { id: 2, relatedIds: [20, 30] },
    ];
    const relationData = [
      { id: 10, name: "Relation 1" },
      { id: 20, name: "Relation 2" },
      { id: 30, name: "Relation 3" },
    ];

    const result = mapRelation(data, relationData, "relatedIds", "relations");

    expect(result).toEqual([
      {
        id: 1,
        relatedIds: [10, 20],
        relations: [
          { id: 10, name: "Relation 1" },
          { id: 20, name: "Relation 2" },
        ],
      },
      {
        id: 2,
        relatedIds: [20, 30],
        relations: [
          { id: 20, name: "Relation 2" },
          { id: 30, name: "Relation 3" },
        ],
      },
    ]);
  });
});
