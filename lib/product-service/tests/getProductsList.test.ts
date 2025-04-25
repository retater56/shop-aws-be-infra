import { main } from "../getProductsList";
import { products } from "../mocked-data";

describe("getProductsList", () => {
  it("should return the list of all products", async () => {
    const result = await main();
    expect(result).toEqual(products);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(products.length);
  });
});
