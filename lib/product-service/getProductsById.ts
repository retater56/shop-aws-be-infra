import { NOT_FOUND_ERROR_CODE } from "./consts";
import { products } from "./mocked-data";

export async function main(
  event: { productId: string },
  _: any,
  callback: any
) {
  const { productId } = event;

  const product = products.find((product) => product.id === productId);

  if (!product) {
    return callback(
      JSON.stringify({
        errorCode: NOT_FOUND_ERROR_CODE,
        message: "Product not found",
      })
    );
  }

  return product;
}
