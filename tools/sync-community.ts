// 改完内置包以后跑一遍：bun tools/sync-community.ts
// 按 packs/index.ts 重写 community/packs/<id>.json，并把 community/index.json 里同 id 条目的 version 同步成包的 version。
// CI 跑 --check：只比较不写，有不一致就退出 1（插件测试读不了 .json 文件，所以检查放在这里）。
import { resolve } from 'node:path'
const check = process.argv.includes('--check')
const repo = resolve(import.meta.dir, '..')
const { BUILTIN } = await import(`${repo}/packs/index.ts`)
const idxPath = `${repo}/community/index.json`
const idx = JSON.parse(await Bun.file(idxPath).text())
const stale: string[] = []
for (const p of BUILTIN) {
  const path = `${repo}/community/packs/${p.id}.json`
  const file = Bun.file(path)
  const want = JSON.stringify(p)
  const have = (await file.exists()) ? JSON.stringify(JSON.parse(await file.text())) : ''
  if (have !== want) stale.push(`community/packs/${p.id}.json`)
  const e = idx.packs.find((x: { id: string }) => x.id === p.id)
  if (!e) stale.push(`community/index.json: no entry for ${p.id}`)
  else if (e.version !== p.version) stale.push(`community/index.json: ${p.id} ${e.version} != ${p.version}`)
  if (!check) {
    await Bun.write(path, JSON.stringify(p, null, 2) + '\n')
    if (e) e.version = p.version
  }
}
if (check) {
  if (stale.length) {
    console.log(`out of date (run bun tools/sync-community.ts):\n  ${stale.join('\n  ')}`)
    process.exit(1)
  }
  console.log('community/ matches packs/')
} else {
  if (stale.length) idx.updated = new Date().toISOString().slice(0, 10)
  await Bun.write(idxPath, JSON.stringify(idx, null, 2) + '\n')
  console.log(BUILTIN.map((p: { id: string; version: string }) => `${p.id}@${p.version}`).join(' '))
}
