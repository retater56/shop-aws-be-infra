import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { Construct } from "constructs";
import { NOT_FOUND_ERROR_PATTERN } from "./consts";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda functions
    const getProductsLambdaFunction = new lambda.Function(
      this,
      "get-products-lambda-function",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(5),
        handler: "getProductsList.main",
        code: lambda.Code.fromAsset(path.join(__dirname, "./")),
      }
    );

    const getProductByIdLambdaFunction = new lambda.Function(
      this,
      "get-product-by-id-lambda-function",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(5),
        handler: "getProductsById.main",
        code: lambda.Code.fromAsset(path.join(__dirname, "./")),
      }
    );

    // API Gateway
    const getProductsList = new apigateway.LambdaIntegration(
      getProductsLambdaFunction,
      {
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": "'*'",
            },
          },
        ],
        proxy: false,
      }
    );

    const getProductById = new apigateway.LambdaIntegration(
      getProductByIdLambdaFunction,
      {
        integrationResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": "'*'",
            },
          },
          {
            statusCode: "404",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": "'*'",
            },
            selectionPattern: NOT_FOUND_ERROR_PATTERN,
          },
        ],
        requestTemplates: {
          "application/json": `{ "productId": "$input.params('productId')" }`,
        },
        proxy: false,
      }
    );

    // Create a new API Gateway REST API
    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Products Service API",
      description: "This API serves the Lambda functions.",
    });

    // Define the API Gateway resources

    const productsResource = api.root.addResource("products");
    productsResource.addMethod("GET", getProductsList, {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });

    const singleProductResource = productsResource.addResource("{productId}");
    singleProductResource.addMethod("GET", getProductById, {
      requestParameters: {
        "method.request.path.productId": true,
      },
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
        {
          statusCode: "404",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });

    // Add CORS support
    productsResource.addCorsPreflight({
      allowOrigins: [
        "https://dowwmkcvl2cq.cloudfront.net",
        "http://localhost:3000/",
      ],
      allowMethods: ["GET"],
      allowHeaders: ["*"],
    });
  }
}
