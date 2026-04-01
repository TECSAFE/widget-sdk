import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import crypto from 'crypto'

const dir = 'mermaid'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mmd'))
const isCheckMode = process.argv.includes('--check');
let hasErrors = false;

for (const file of files) {
  const input = path.join(dir, file)
  const output = path.join(dir, file.replace('.mmd', '.png'))
  const hashFile = input + '.md5'
  
  const content = fs.readFileSync(input, 'utf8')
  const currentHash = crypto.createHash('md5').update(content).digest('hex')
  
  if (isCheckMode) {
    if (!fs.existsSync(hashFile)) {
      console.error(`[ERROR] Missing hash file for ${file}. Please run 'pnpm run build:mermaid' locally and commit the changes.`);
      hasErrors = true;
    } else {
      const storedHash = fs.readFileSync(hashFile, 'utf8').trim()
      if (storedHash !== currentHash) {
        console.error(`[ERROR] Hash mismatch for ${file}. The diagram was modified but PNG wasn't rebuilt. Please run 'pnpm run build:mermaid' locally and commit the changes.`);
        hasErrors = true;
      } else {
        console.log(`[OK] ${file} is up to date.`);
      }
    }
  } else {
    let skip = false;
    if (fs.existsSync(hashFile)) {
      const storedHash = fs.readFileSync(hashFile, 'utf8').trim()
      if (storedHash === currentHash && fs.existsSync(output)) {
        console.log(`Skipping ${file} - no changes detected.`)
        skip = true;
      }
    }
    
    if (!skip) {
      console.log(`Generating ${output}...`)
      execSync(`npx mmdc -i ${input} -o ${output} -b white`, { stdio: 'inherit' })
      fs.writeFileSync(hashFile, currentHash)
    }
  }
}

if (hasErrors) {
  process.exit(1)
} else if (isCheckMode) {
  console.log('All Mermaid diagrams are up to date.')
}
