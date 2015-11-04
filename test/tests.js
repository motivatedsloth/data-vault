QUnit.test("data-vault", function( assert ){
    localStorage.removeItem("data-vault.test");

    var vault = new window.vault("data-vault.test"),
    testObj = {hello: "world"};

    assert.equal(localStorage.getItem("data-vault.test"), null, "Intialize Test");

    vault.set("item1", "value1");
    assert.equal(vault.get("item1"), "value1", "set value test");

    var setDate = assert.async(),
    checkSince = assert.async(),
    now;

    setTimeout(function(){
        now = new Date();
        setDate();
    }, 1000);

    setTimeout(function(){
        vault.set(testObj, "hello world object");
        assert.equal(vault.get(testObj), "hello world object", "object key test");

        console.log(now);
        console.log(localStorage.getItem("data-vault.test"));
        assert.equal(vault.since(now).length, 1, "modified since test");

        vault.remove("item1");
        assert.equal(vault.get("item1"), false, "remove item test");

        localStorage.removeItem("data-vault.test");

        checkSince();
    }, 3000);

});
