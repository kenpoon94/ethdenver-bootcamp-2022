# Lesson 5 - Vscode setup and code quality
## Environment setup
* Tooling:
  * [Node](https://nodejs.org/en/docs/guides/getting-started-guide/)
  * [NPM](https://docs.npmjs.com/cli/v8/configuring-npm/install)
  * [Yarn](https://yarnpkg.com/getting-started/install)
  * [Git CLI](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
  * [VS Code](https://code.visualstudio.com/docs/setup/setup-overview)
* Services
  * [infura](https://infura.io/)
  * [alchemy](https://www.alchemy.com/)
  * [etherscan](https://etherscan.io/register)

## Programming setup
* Reference repository
* NPM and Yarn
* VS Code
* VS Code plugins
* source control
* unit tests
* scripts
* Testing passing
* Breaking tests
### References
https://github.com/OpenZeppelin/openzeppelin-contracts

https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line

https://yarnpkg.com/getting-started

https://yarnpkg.com/getting-started/usage

https://code.visualstudio.com/docs

### Instructions
```
git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git
cd .\openzeppelin-contracts\
yarn install
```
### Output example
```
yarn compile
...
$ hardhat compile
...
Compiled 267 Solidity files successfully
Done in 18.79s.
```
### Package.json scripts
<pre><code>  "scripts": {
    "compile": "hardhat compile",
    "coverage": "env COVERAGE=true hardhat coverage",
    "docs": "oz-docs",
    "docs:watch": "npm run docs watch contracts 'docs/*.hbs' docs/helpers.js",
    "prepare-docs": "scripts/prepare-docs.sh",
    "lint": "npm run lint:js && npm run lint:sol",
    "lint:fix": "npm run lint:js:fix && npm run lint:sol:fix",
    "lint:js": "eslint --ignore-path .gitignore .",
    "lint:js:fix": "eslint --ignore-path .gitignore . --fix",
    "lint:sol": "solhint 'contracts/**/*.sol' && prettier -c 'contracts/**/*.sol'",
    "lint:sol:fix": "prettier --write \"contracts/**/*.sol\"",
    "clean": "hardhat clean && rimraf build contracts/build",
    "prepare": "npm run clean && env COMPILE_MODE=production npm run compile",
    "prepack": "scripts/prepack.sh",
    "release": "scripts/release/release.sh",
    "version": "scripts/release/version.sh",
    "test": "hardhat test",
    "test:inheritance": "node scripts/inheritanceOrdering artifacts/build-info/*",
    "gas-report": "env ENABLE_GAS_REPORT=true npm run test"
  },</code></pre>
### Test example
```
yarn test .\test\token\ERC20\ERC20.test.js
...
$ hardhat test .\test\token\ERC20\ERC20.test.js
...
  76 passing (5s)
Done in 8.39s.
```
### Breaking change
```
code .\contracts\token\ERC20\ERC20.sol
```
<pre><code>
    function decimals() public view virtual override returns (uint8) {
        return 42;
    }
</code></pre>
```
yarn test .\test\token\ERC20\ERC20.test.js
...
$ hardhat test .\test\token\ERC20\ERC20.test.js
...
Compiled 28 Solidity files successfully
...
 75 passing (7s)
  1 failing
  1) Contract: ERC20
       has 18 decimals:
      AssertionError: expected '42' to equal '18'
      + expected - actual
      -42
      +18
```
## Quality of code
* Composability
* Upgradeability
* Maintainability and readability
* Managing work flow and progress
* Reaching peace of mind
## Hardhat setup
* Creating a base repository
* Setup hardhat with typescript
* Configure VS Code
* Hardhat scripts and tasks
* VS Code extensions recommended
### References
https://hardhat.org/getting-started/    

https://hardhat.org/guides/typescript.html

https://hardhat.org/guides/vscode-tests.html

### Steps
* Creating a new project named `project`:
```// Exit your working folder:
cd ..
// Alternativelly you could pick a directory in another place, like "cd ~/desktop"

// Create a new folder called "project"
mkdir project

// Enter that folder
cd project
```

* Starting a new project using Yarn Berry:
```
yarn init -2
    ...
yarn config set nodeLinker node-modules
yarn add hardhat --dev
yarn hardhat init
    "Create a TypeScript project"
    ...
    .gitignore? Y
yarn add --dev [list of suggested dev dependencies above]
yarn add mocha --dev
code .
```
### Recommended extensions
[Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

[Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)

[Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)

### Environment setup
_.mocharc.json_ file:
<pre><code>{
  "require": "hardhat/register",
  "timeout": 40000,
  "_": ["tests/**/*.ts"]
}
</code></pre>
<pre><code>Suggested renaming:
// Renaming "test" folder
mv test tests
</code></pre>
<pre><code>If using Yarn Berry with PnP:
// Setting up yarn sdk for vscode
yarn dlx @yarnpkg/sdks vscode
// Press ctrl+shift+p in a TypeScript file
// Choose "Select TypeScript Version"
// Pick "Use Workspace Version"
</code></pre>
_hardhat.config.ts_ file:
<pre><code>{
const config: HardhatUserConfig = {
...
  paths: { tests: "tests" },
...
  }
}
</code></pre>
_tsconfig.json_ file:
<pre><code>
...
  "include": ["./scripts", "./tests", "./typechain-types"],
  "files": ["./hardhat.config.ts"],
...
</code></pre>
Create env file in root project folder

_.env_ file:

```
MNEMONIC="here is where your twelve words mnemonic should be put my friend"
PRIVATE_KEY="<your private key here if you don't have a mnemonic seed>"
INFURA_API_KEY="********************************"
INFURA_API_SECRET="********************************"
ALCHEMY_API_KEY="********************************"
ETHERSCAN_API_KEY="********************************"
```

Edit the environment with your keys:

```
code .env
```

Test it out:
```
 yarn hardhat compile 
 yarn hardhat test 
```

Accounts task:
```
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
```

Test it out:
```
 yarn hardhat accounts 
```
## Coding in VS Code
* Syntax for typescript scripts
* How the project operates
* Writing a test file
* Using Ethers.js library
* Using Hardhat toolbox
* Using Typechain library
* Testing syntax
* Running a test file
### References
https://docs.ethers.io/v5/

https://mochajs.org/

https://hardhat.org/hardhat-chai-matchers/docs/overview

https://www.chaijs.com/guide/

https://github.com/dethcrypto/TypeChain

### Clearing template files
```
rm .\contracts\*
rm .\scripts\*
rm .\tests\*
yarn hardhat clean
```