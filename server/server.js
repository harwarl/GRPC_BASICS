var PROTO_PATH = __dirname + "../../proto/article.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

var articleProtoDescriptor = grpc.loadPackageDefinition(packageDefinition);

let articles = [
  {
    id: 1,
    title: "Article 1",
    body: "Body 1",
    postImage: "Image 1",
  },
  {
    id: 2,
    title: "Article 2",
    body: "Body 2",
    postImage: "Image 2",
  },
];

function getAllArticles(call, callback) {
  callback(null, { articles: articles });
}

function getSingleArticle(call, callback) {
  const articleId = call.request.articleId;
  const article = articles.find((a) => a.id === Number(articleId));
  if (article) {
    callback(null, article);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Not Found",
    });
  }
}

function getServer() {
  var articleServer = new grpc.Server();
  articleServer.addService(articleProtoDescriptor.ArticleService.service, {
    GetAllArticles: getAllArticles,
    GetSingleArticle: getSingleArticle,
  });
  return articleServer;
}

var routeServer = getServer();
routeServer.bindAsync(
  "0.0.0.0:55001",
  grpc.ServerCredentials.createInsecure(),
  () => {
    routeServer.start();
  }
);
