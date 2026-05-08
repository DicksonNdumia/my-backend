const core = require("@actions/core");

try {
  const hook = core.getInput("deploy-hook");
  console.log(`Drill mode active. Target hook would be: ${hook}`);

 
  console.log("Simulating deployment to Render...");

  core.setOutput("website-url", "https://my-api.onrender.com");
  console.log("Drill successful!");
} catch (error) {
  core.setFailed(error.message);
}
