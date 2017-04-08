var expect = require("chai").expect;
var path = require("path");

var Robot = require("hubot/src/robot");
var TextMessage = require("hubot/src/message").TextMessage;

describe("Gilles the random *er boy", function () {
  var robot;
  var cgatayUser;
  var tdebarochezUser;
  var strangerUser;
  var adapter;

  beforeEach(function (done) {
    // create new robot, without http, using the mock adapter
    robot = new Robot(null, "mock-adapter", false, "gilles");

    robot.adapter.on("connected", function () {
      // only load scripts we absolutely need, like auth.coffee
      process.env.HUBOT_AUTH_ADMIN = "1";
      robot.loadFile(
        path.resolve(
          path.join("node_modules/hubot-scripts/src/scripts")
        ),
        "auth.coffee"
      );

      // load the module under test and configure it for the
      // robot.  This is in place of external-scripts
      require("../scripts/trooper")(robot);

      // create a user
      cgatayUser = robot.brain.userForId("1", {
        name: "cgatay",
        room: "#general"
      });

      tdebarochezUser = robot.brain.userForId("2", {
        name: "tdebarochez",
        room: "#general"
      });

      strangerUser= robot.brain.userForId("3", {
        name: "slackbot",
        room: "#general"
      });

      adapter = robot.adapter;

      done();
    });

    robot.run();
  });

  afterEach(function () {
    robot.shutdown();
  });

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


  describe("when asked for a trooper", function () {
    it("never returns a looser randomly (1000 attempts)", function (done) {
      adapter.on("reply", function (envelope, strings) {
        expect(strings[0]).not.match(/@tdebarochez/);
        expect(strings[0]).not.match(/@mbitard/);
      });
      for (var i = 0; i < 1000; i++) {
        adapter.receive(new TextMessage(cgatayUser, "@gilles random trooper"));
      }
      done();
    });
    it("never returns the trooper that asked (1000 attempts)", function (done) {
      adapter.on("reply", function (envelope, strings) {
        expect(strings[0]).not.match(new RegExp('^@'+cgatayUser.name+'$'));
      });
      for (var i = 0; i < 1000; i++) {
        adapter.receive(new TextMessage(cgatayUser, "@gilles random trooper"));
      }
      done();
    });

    it("returns every troopers when asked by a looser (1000 attempts)", function (done) {
      var answers = [];
      adapter.on("reply", function (envelope, strings) {
        answers.push(strings[0]);
        if (answers.length == 1000){
          var filtered = answers.filter(onlyUnique)
          expect(filtered.length).equal(7);
          done();
        }
      });
      for (var i = 0; i < 1000; i++) {
        adapter.receive(new TextMessage(tdebarochezUser, "@gilles random trooper"));
      }
    });
  });
  describe("when asked for a looser", function () {
    it("never returns the looser that asked (1000 attempts)", function (done) {
      adapter.on("reply", function (envelope, strings) {
        expect(strings[0]).not.match(new RegExp('^@'+tdebarochezUser.name+'$'));
      });
      for (var i = 0; i < 1000; i++) {
        adapter.receive(new TextMessage(tdebarochezUser, "@gilles random looser"));
      }
      done();
    });

    it("returns every loosers when asked by a stranger(1000 attempts)", function (done) {
      var answers = [];
      adapter.on("reply", function (envelope, strings) {
        answers.push(strings[0]);
        if (answers.length == 1000){
          var filtered = answers.filter(onlyUnique);
          expect(filtered.length).equal(9);
          done();
        }
      });
      for (var i = 0; i < 1000; i++) {
        adapter.receive(new TextMessage(strangerUser, "@gilles random looser"));
      }
    });
  })
});
