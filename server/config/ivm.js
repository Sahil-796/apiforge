const ivm = require('isolated-vm');

async function runIsolatedFunction(functionCode, inputData) {
  const isolate = new ivm.Isolate({ memoryLimit: 8 }); // MB
  const context = await isolate.createContext();
  const jail = context.global;

  await jail.set('input', inputData, { copy: true });

  // Wrap the function in parentheses to make it an expression, then call it
  const script = await isolate.compileScript(`
    const handler = (${functionCode});
    handler(input);
  `)

  const result = await script.run(context, { timeout: 100 }); // ms timeout
  return result
}

module.exports = runIsolatedFunction