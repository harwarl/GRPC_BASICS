const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

var PROTO_PATH = __dirname + "../../proto/article.proto";

// Load the protobuf file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load the package definition
const articleProto =
  grpc.loadPackageDefinition(packageDefinition).ArticleService;

function main() {
  const client = new articleProto(
    "0.0.0.0:55001",
    grpc.credentials.createInsecure()
  );

  client.GetSingleArticle({ articleId: 1 }, function (err, response) {
    if (err) {
      console.error("Error getting single article:", err);
    } else {
      console.log("Single Article Response:", response);
    }
  });

  client.GetAllArticles({}, function (err, response) {
    if (err) {
      console.error("Error getting all articles:", err);
    } else {
      console.log("All Articles Response:", response.articles);
    }
  });
}

main();
