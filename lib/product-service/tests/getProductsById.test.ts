import { main } from "../getProductsById";
import { products } from "../mocked-data";
import { NOT_FOUND_ERROR_CODE } from "../consts";

describe("getProductsById", () => {
  it("should return a product when it exists", async () => {
    const mockCallback = jest.fn();
    const testProduct = products[0];
    await main({ productId: testProduct.id }, {}, mockCallback);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should return an error when product is not found", async () => {
    const mockCallback = jest.fn();
    await main({ productId: "non-existent-id" }, {}, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(
      JSON.stringify({
        errorCode: NOT_FOUND_ERROR_CODE,
        message: "Product not found",
      })
    );
  });
});
