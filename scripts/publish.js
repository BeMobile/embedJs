import { execa } from 'execa';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const packages = readdirSync('./dist/esm');

for (const pkg of packages) {
    const packageJson = JSON.parse(readFileSync(`dist/esm/${pkg}/package.json`, 'utf-8'));

    writeFileSync(`dist/esm/${pkg}/package.json`, JSON.stringify({
        ...packageJson,
        dependencies: Object.fromEntries(Object.entries(packageJson.dependencies).map(([key, value]) => {
            if (key.startsWith('@betalent/') && value.length < 10) {
                const tag = `${key.replace('@betalent/', 'betalent-')}-${value}`
                return [key, `https://github.com/BeMobile/embedJs/releases/download/${tag}/${tag}.tgz`]
            }

            return [key, value]
        }))
    }, null, 2))

    const { stdout: file } = await execa({ cwd: `dist/esm/${pkg}` })`npm pack`

    const tag = file.replace('.tgz', '');

    const { stdout: packageUrl, stderr } = await execa({
        cwd: `dist/esm/${pkg}`,
        reject: false
    })`gh release create ${tag} ${file} -t "${tag}" -n ""`

    if (stderr) {
        console.error('Error:', stderr, 'path:', `dist/esm/${pkg}`);
        continue
    }

    console.log(packageUrl);
}

