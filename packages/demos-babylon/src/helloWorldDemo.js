import {HostObject} from '@amazon-sumerian-hosts/babylon';
import {Scene} from '@babylonjs/core/scene';
import DemoUtils from './common/demo-utils';
//import detectIntent from './dailog'
//import {SessionsClient} from '@google-cloud/dialogflow/build/src/index';

//const dialogflow = require('@google-cloud/dialogflow');
//import detectIntent from './dailogflow';
//import detectIntent from './export';


let host;
let scene;
const PROJECID ="testbot-icpe";
const sessionId="me";

// Configuration for the client
const CONFIGURATION = {
    credentials: {
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZjxbBgK4uD/Wp\npbFNGK7TUcvajKV0c1wruE6ejxsMMMpMnkrd67X/7wyH/zLAl8iQVVdAvYPwU2JK\nUbEyYrZaWNwL/c0Ayy6Fq6uC95z2xM/Pb23nPQtM7MJGlWI5m0q4m4vzA5XVthgN\nxm3Yw7ms6xdUicNvfG6z99118zwKBFMzy2Lu6YW2bQFCAm0JoaFNBAhPW5gz2Man\ne1J+8pQ6hUUSfktnG+5/8aJ1qeiqaBYsl3qDpKHkt8HMWPcdOzy/D9AVtRjoeDcf\nhSldXnJ5UMdlyGN2LcMDBWiZ11GbJ9uOLRynzafFafZKKrDoyMdQVg08rxfJ7X5d\nc3NEApibAgMBAAECggEAC5LrrH6qhYPO12gbrxTNlCtpU2ahFLlgYWkMMa4+S586\n2+md5QF5rLRsb725VvqcLmWD30tVvg7Jj1eaPCp5NgQ9LJwjcFPe1TilRrHilVQy\nFACDEcazF7QOv8+JqrPivUB1KQf7TCPEUtNIG7yJ37OgCZzMm108zHE2xGQcwRGR\nuR0X2DT4KWyKK4B3dx1U3Fi9nh4/fmTHcH1by8R1S7erzCfPW6PpkHDe2oIeSPIF\n1m3cr+yW0VPn+h3BiQgIdAZattOWd4QrV8nAROBdEZK/fTPJoZ1FsNcwrMTwl9sJ\nx6SEu85tHv2GuWk0Z4Ifcnt/R/+lGJP33daQH2193QKBgQDuNXvARHP1LyhUu8kg\ni4etA2ISd1R+zW0sxWMyOZ5lZOQq7Mp+rHww509qkZA0w8vsulOO9PQgA49P5dWP\n5SoyTeTJ+duWAih9jaBdQLN4udM0tgC9a6/O+GnzRDic5U5uB74ZwGvrp6hr0inW\nHvlydBzucAnfNQ3c4y9EDi28rwKBgQDpzsf720O3yE8X8ZAN2qt8jaeLF7wWFeN7\nPqmis/aYxoGHH9IDeMcU++kW7n4El2W7foytRWPVMABLkgT9NRZ5twwOpk8eTF0Z\nSK5ZAduNC5wv5UAdxPbv4nOybYxlbNqqh2cp8VG7t/CgwhhwHw45ZCOM5u/2OYbc\n21c9yTnV1QKBgQC009jrbYtxNqkxGZRmpkUKa6UJS5jS4XLdJ8JToDXD1sD2bOaT\nHrDwFsfMqE+GHpQxUoiX3w9rNgiWqGxkXZyYr1TcllXBHEZMeTShVbpoDPht7TPG\nl3bQcPdM+h7Xy6KsGCiRN+c07wMFRncH2l+WKNrFjjuQO6AYbEW3LeQ+dQKBgESu\nzeiafMYcPb/W4m5vcjjgk/s0ObhzLaQiwEpfe21dwuci3drPPAxaBBsMbFCE+Qmf\nH0w3OiCCPVP1zSlk0vlmYFBdYpiP7jljNHRJK2m/o14ehjs4hSHq7/nWXIve8k1u\nAUw867mtSy6uVed59/+7/wWBQbSfKZLvjC1GU4sRAoGALuDW4vWn8VKD2IVUGwdh\nWnACxkfUrkBbN7ige00ZdPEU6QIVSxJYUAJDphRR0eoaauM8/457MjNr7V4r0JwY\nsqP1lPWPEnT3yB9hBYWNh3d+30xWUxjLKp8stooKs3fncvqgOqa2QUf/TVurGtw8\ntV5Or1jQYqc6bxpYJxFGQ54=\n-----END PRIVATE KEY-----\n",
        client_email: "test-583@testbot-icpe.iam.gserviceaccount.com"
    }
}
//const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

// Create a new session

async function createScene() {
  // Create an empty scene. Note: Sumerian Hosts work with both
  // right-hand or left-hand coordinate system for babylon scene
  scene = new Scene();

  const {shadowGenerator} = DemoUtils.setupSceneEnvironment(scene);
  initUi();

  // ===== Configure the AWS SDK =====

  // This is served by webpack-dev-server and comes from demo-credentials.js in the repo root
  // If you copy this example, you will substitute in your own cognito Pool ID
  const config = await (await fetch('/devConfig.json')).json();
  const cognitoIdentityPoolId = config.cognitoIdentityPoolId;

  AWS.config.region = cognitoIdentityPoolId.split(':')[0];
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoIdentityPoolId,
  });

  // ===== Instantiate the Sumerian Host =====

  // Edit the characterId if you would like to use one of
  // the other pre-built host characters. Available character IDs are:
  // "Cristine", "Fiona", "Grace", "Maya", "Jay", "Luke", "Preston", "Wes"
  const characterId = 'Grace';
  const pollyConfig = {pollyVoice: 'joanna', pollyEngine: 'Standard',pollyLanguage:'English-US'};
  const characterConfig = HostObject.getCharacterConfig(
    './character-assets',
    characterId
  );
  host = await HostObject.createHost(scene, characterConfig, pollyConfig);

  // Tell the host to always look at the camera.
  host.PointOfInterestFeature.setTarget(scene.activeCamera);

  // Enable shadows.
  scene.meshes.forEach(mesh => {
    shadowGenerator.addShadowCaster(mesh);
  });

  return scene;
}

function initUi() {
  document.getElementById('speakButton').onclick = speak.bind(this);
  
}

function speak() {
  const speech = document.getElementById('speechText').value;
  host.TextToSpeechFeature.play(speech);
}
DemoUtils.loadDemo(createScene);

