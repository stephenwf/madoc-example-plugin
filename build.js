// 1. Load and Validate package.json
// 2. Verify connection with Madoc development server
//    - If not verified, pop open madoc to install module
//    - Once verified, a token will be provided
// 3. Run bundler
// 4. Take bundle and post to Madoc
//    - Madoc will save to disk
//    - Madoc will refresh bundle (possibly restart to begin with)
// 5. Watch for changes, go to 3.

const { prompt } = require('enquirer');
const http = require('http');
const crypto = require("crypto");
const querystring = require('querystring');
const url = require('url');
const fetch = require('node-fetch');
const pkg = require('./package.json');

// Roll up dependencies.
const loadConfigFile = require('rollup/dist/loadConfigFile');
const path = require('path');
const rollup = require('rollup');


// Verify connection with madoc development server.
const initialToken = process.env.MADOC_TOKEN;
const endpoint = process.env.MADOC_ENDPOINT;
const defaultSite = process.env.MADOC_SITE || 'default';
const isProduction = process.env.NODE_ENV === 'production';

(async () => {

    // 1st confirm the endpoint.
    const { madocEndpoint } = endpoint ? { madocEndpoint: endpoint } : await prompt({
        type: 'input',
        name: 'madocEndpoint',
        message: 'Madoc endpoint',
        required: true,
        initial: 'http://localhost:8888',
    });

    const { token } = initialToken ? { token: initialToken } : await requestTokenFromMadoc(madocEndpoint);

    // Token should be
    // - JWT with service
    // - New custom scope for publishing plugin
    // - Contain information about the plugin
    // - Contain a code that will be checked each time - and can be invalidated.
    console.log(`Using token: ${token}`);

    // @todo Verify our new token.
    // await fetch(`${madocEndpoint}/`)

    // @todo Run bundler.
    const bundle = await createBundle();
    if (!bundle) {
        process.exit(1);
    }

    const resp = await fetch(`${madocEndpoint}/api/madoc/development/dev-bundle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            pluginId: 'my-plugin',
            revision: '3ee99c02fb31792f0c8a947153b942519694f64c',
            // revision: crypto.createHash('sha1').update(bundle.code).digest('hex'),
            bundle,
        })
    })

    await syncBundle(madocEndpoint, token, bundle);


    // Watching.
    const { options } = await loadConfigFile(path.resolve(__dirname, 'rollup.config.js'), { format: 'es' });
    const inputOptions = Array.isArray(options) ? options[0] : options;

    const watcher = rollup.watch(inputOptions);
    watcher.on('event', event => {
        if (event.error) {
            console.log(event.error)
        }
        if (event.code === 'BUNDLE_END') {
            processBundle(event.result).then(async bundle => {
                console.log('syncing bundle...')
                await syncBundle(madocEndpoint, token, bundle);
                console.log('done!');
            })
        }
    });

    watcher.on('event', ({ result }) => {
        if (result) {
            result.close();
        }
    });

    process.on('SIGINT', async () => {
        watcher.close();
    });
})();

async function syncBundle(madocEndpoint, token, bundle) {
    return await fetch(`${madocEndpoint}/api/madoc/development/dev-bundle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            pluginId: 'my-plugin',
            revision: '3ee99c02fb31792f0c8a947153b942519694f64c',
            // revision: crypto.createHash('sha1').update(bundle.code).digest('hex'),
            bundle,
        })
    });
}

async function processBundle(bundle) {
    const bundleOutput = await bundle.generate({
        format: 'umd',
        name: pkg.name
    });
    const output = bundleOutput.output;

    const entry = output.find(item => item.isEntry);

    await bundle.close();

    const features = {
        hookBlocks: entry.exports.indexOf('hookBlocks') !== -1,
        hookComponents: entry.exports.indexOf('hookComponents') !== -1,
        hookRoutes: entry.exports.indexOf('hookRoutes') !== -1,
    };

    return {
        features,
        code: entry.code,
    };
}

async function createBundle() {
    const { options } = await loadConfigFile(path.resolve(__dirname, 'rollup.config.js'), { format: 'es' });
    const inputOptions = Array.isArray(options) ? options[0] : options;

    try {
        // create a bundle
        const bundle = await rollup.rollup(inputOptions);

        return await processBundle(bundle);
    } catch (e) {
        if (e.plugin === 'typescript') {
            console.log('\n');
            console.log(e.loc.file);
            console.log(e.frame);
        } else {
            console.log(e.message);
        }
        // process.exit(1);
    }
}


async function requestTokenFromMadoc(madocEndpoint) {
    // Next, start a small response server.
    const deferred = generateDeferredPromise();
    const randomId = crypto.randomBytes(16).toString("hex");
    const tempServer = http.createServer((req, res) => {
        const reqUrl = url.parse(req.url);
        const qs = reqUrl.search ? querystring.parse(reqUrl.search.slice(1)) : {};

        if (!qs.token || !qs.code || qs.code !== randomId) {
            res.write(`Something went wrong`);
            res.end();
            return;
        }

        deferred.resolve({
            token: qs.token,
        })

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(`
            <br/>
            <center>
                <h2>Plugin installed</h2>
                <p>you can go back to  your terminal window.</p>
            </center> 
        `)
        res.end();
        tempServer.close();
    });

    tempServer.listen(7839);

    // Open up madoc
    console.log(
        `
    Go to the following URL to install your plugin:

        ${madocEndpoint}/s/${defaultSite}/madoc/admin/system/development?cb=http://localhost:7839&code=${randomId}
`
    );

    return await deferred.promise;
}

// Helpers.
function generateDeferredPromise() {
    return (() => {
        let resolve;
        let reject;

        let p = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        return {
            promise: p,
            reject,
            resolve
        };
    })();
}
