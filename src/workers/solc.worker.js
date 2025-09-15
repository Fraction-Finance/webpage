/* eslint-disable no-restricted-globals */

self.importScripts('https://binaries.soliditylang.org/bin/soljson-v0.8.27+commit.a9f45682.js');

self.addEventListener('message', async (e) => {
    const { contractCode, contractName } = e.data;
    const solc = self.Module;

    const findImports = (path) => {
        try {
            if (path.startsWith('@openzeppelin/contracts/')) {
                const url = `https://unpkg.com/${path}@5.0.2`;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.send(null);
                if (xhr.status === 200) {
                    return { contents: xhr.responseText };
                } else {
                    return { error: `Failed to load ${path} from CDN: ${xhr.statusText}` };
                }
            }
            return { error: 'Only @openzeppelin/contracts imports are supported.' };
        } catch (error) {
            return { error: `Error resolving import ${path}: ${error.message}` };
        }
    };

    if (solc) {
        const input = {
            language: 'Solidity',
            sources: {
                'contract.sol': {
                    content: contractCode,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };

        try {
            const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

            let errors = [];
            if (output.errors) {
                errors = output.errors.filter(err => err.severity === 'error');
            }

            if (errors.length > 0) {
                self.postMessage({ error: errors.map(err => err.formattedMessage).join('\n') });
                return;
            }

            const compiledContract = output.contracts['contract.sol'][contractName];
            if (!compiledContract) {
                const availableContracts = output.contracts['contract.sol'] ? Object.keys(output.contracts['contract.sol']) : [];
                self.postMessage({ error: `Contract "${contractName}" not found. Available contracts in file: ${availableContracts.join(', ')}` });
                return;
            }

            self.postMessage({
                output: {
                    abi: compiledContract.abi,
                    evm: compiledContract.evm,
                },
            });
        } catch (error) {
            self.postMessage({ error: `Compilation failed: ${error.message}` });
        }
    } else {
        self.postMessage({ error: 'Solc compiler not loaded yet.' });
    }
});