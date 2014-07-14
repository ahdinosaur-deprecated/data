var test = module.exports = {
  schema: {
    id: "person",
    prefixes: {
      "": "http://schema.org/",
      "foaf": "http://xmlns.com/foaf/0.1/",
    },
    type: ["Person", "foaf:Person"],
    properties: {
      name: {
        type: "string",
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
    type: ["Person", "foaf:Person"],
    name: "Mikey",
  }],
};
