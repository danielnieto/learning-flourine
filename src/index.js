require("neon");
require("neon/stdlib");
require("fluorine");

function async1(callback) {
    setTimeout(function() {
        return callback("hello");
    }, 100);
}

function async2(callback) {
    setTimeout(function() {
        return callback("flourine");
    }, 150);
}

const flow = new Flow("helloFlow");

flow.bind("reject", function(event) {
    console.log("A step failed: ");
    console.log(event);
});

flow.step("first")(function(step) {
    async1(function(firstResult) {
        step.success(firstResult);
    });
});

flow.step("second")(function(step) {
    async2(function(secondResult) {
        if (Math.random() > 0.5) {
            step.success(secondResult);
        } else {
            step.fail();
        }
    });
});

flow.step("do").dependsOn("first", "second")(function(step) {
    console.log(step.data);
    step.success();
});
