// Node application
const jexiaSDK = require('jexia-sdk-js/node');
// You will need to add a compatible dependency to your project. For development of the SDK we've used node-fetch
const nodeFetch = require('node-fetch');
const ws = require("ws");
const jexiaModule = jexiaSDK.dataOperations();

const credentials = {
  projectID: "f47edb9c-a456-4188-b215-011b64ee08c7",
  key: "william@jexia.com",
  secret: "password"
};

const rtc = jexiaSDK.realTime((messageObject: any) => {
  console.log("Realtime message received:");
  console.log(messageObject);
}, (url: any) => {
  return new ws(url, { origin: "http://localhost" });
});

const jexiaClientInstance = jexiaSDK.jexiaClient(nodeFetch);
jexiaClientInstance.init(credentials, jexiaModule, rtc).then(function() {
  return rtc.subscribe("insert", jexiaModule.dataset("skd_js")).then(() => {
    console.log("Succesfully subscribed to dataset changes");
    return jexiaModule.dataset("skd_js").insert([{ abacaxi: "aNewKeyword" }, { abacaxi: "anotherKeyword" }]).execute();
  }).then((records: any) => {
    console.log(records);
    console.log("HTTP response to request query received, shutting down in 5, 4, 3...");
    setTimeout(() => {
      jexiaClientInstance.terminate().then(() => process.exit());
    }, 5000);
  });
}).catch((err: any) => {
  console.log(err.message);
  jexiaClientInstance.terminate().then(() => process.exit());
});
