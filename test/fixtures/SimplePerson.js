var test = module.exports = {
  descriptor: {
    name: "Person",
    prefixes: {
      "": "http://schema.org/",
      "foaf": "http://xmlns.com/foaf/0.1/",
    },
    type: ["Person", "foaf:Person"],
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
  },
  inputs: [{
    name: "Mikey",
  }],
  outputs: [{
    "@context": {
      "@vocab": "http://schema.org/",
      "foaf": "http://xmlns.com/foaf/0.1/",
      "id": "@id",
      "type": "@type",
    },
    id: /.*/,
    type: ["Person", "foaf:Person"],
    name: "Mikey",
  }],
};
