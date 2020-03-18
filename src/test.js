describe("Authorizer", function() {
    let near;
    let contract;
    let alice;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    // Common setup below
    beforeAll(async function() {
      near = await nearlib.connect(nearConfig);
      alice = nearConfig.contractName;
      contract = await near.loadContract(nearConfig.contractName, {
        // NOTE: This configuration only needed while NEAR is still in development
        // View methods are read only. They don't modify the state, but usually return some value. 
        viewMethods: ["getCurrentGame", "getGame", "getRecentGames"],
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: ["createOrJoinGame", "makeMove", "giveUpCurrentGame"],
        sender: alice
      });
    });

    // Multiple tests can be described below. Search Jasmine JS for documentation.
    describe("simple", function() {
      beforeAll(async function() {
        // There can be some common setup for each test.
      });

      it("creates a game that shows up as expected in recent games", async function() {
        await contract.createOrJoinGame();
        const recentGames = await contract.getRecentGames();
        console.log("aloha recentGames", recentGames);
        expect(recentGames.length).toBe(1);
        expect(recentGames[0]['game']['player1']).toBe(nearConfig.contractName);
      });
    });
});
