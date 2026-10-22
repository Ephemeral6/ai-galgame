// 写代码的事件：只看工具调用的类型和成败（测试通过 / 失败、构建失败、git commit），
// 不读代码、不读路径、不读输出；进剧情时只有事件类型。陪伴模式的预写台词也在这里，零调用。

import type { Keepsake, Lang } from '../types'

export type WorkEvent = 'test-pass' | 'test-fail' | 'build-fail' | 'commit'

const TEST = /(^|[\s;&|(])(npm (run )?test|yarn test|pnpm (run )?test|bun test|npx (jest|vitest|mocha)|jest|vitest|mocha|pytest|python -m pytest|go test|cargo test|dotnet test|mvn test|gradle test|rspec|phpunit|claude plugin test)\b/
const BUILD = /(^|[\s;&|(])(npm run build|yarn build|pnpm build|tsc\b|cargo build|go build|make\b|mvn (package|compile)|gradle build|dotnet build)/
const COMMIT = /(^|[\s;&|(])git\s+commit\b/

/**
 * 把一次 Bash 调用归成事件：只用命令的种类和成败。命令本身、路径、输出都不留下。
 * 没有对应事件返回 null。
 */
export function classifyBash(command: string, failed: boolean): WorkEvent | null {
  if (COMMIT.test(command)) return failed ? null : 'commit'
  if (TEST.test(command)) return failed ? 'test-fail' : 'test-pass'
  if (BUILD.test(command) && failed) return 'build-fail'
  return null
}

/** 写进每一幕提示的一句（不含任何代码内容） */
export function workLine(ev: WorkEvent[]): string {
  if (!ev.length) return ''
  const say: Record<WorkEvent, string> = {
    'test-pass': 'my tests just passed in the real world',
    'test-fail': 'my tests just failed in the real world',
    'build-fail': 'my build just broke in the real world',
    commit: 'I just committed my work in the real world',
  }
  return `[Outside the story — the player's real-world coding] ${[...new Set(ev)].map(e => say[e]).join('; ')}. Someone present may react naturally in one line (happy for me, comforting me), without any technical detail. Do not invent what the code is.`
}

/** commit 变成一件信物（预画好的 8×8 小图标，不调用模型） */
export function commitKeepsake(pack: string, heroine: string, day: number, lang: Lang, n: number): Keepsake {
  return {
    pack, day, heroine,
    title: lang === 'zh' ? `第 ${n} 次提交` : `Commit #${n}`,
    desc: lang === 'zh' ? '你在现实里完成了一件事，她替你记下了这一天。' : 'You finished something in the real world; she marked the day for you.',
    art: ['..aaaa..', '.abbbba.', 'abbccbba', 'abcccbba', 'abbccbba', '.abbbba.', '..aaaa..', '...dd...'],
    palette: { a: 0xf2c14e, b: 0xfff3c4, c: 0x7fd1c7, d: 0x8a8f98 },
  }
}

// ---------- 陪伴模式：预写台词库 ----------
export type CompanionCue = 'test-pass' | 'test-fail' | 'build-fail' | 'commit' | 'rest' | 'done' | 'permission'

const LINES: Record<Lang, Record<CompanionCue, string[]>> = {
  zh: {
    'test-pass': ['{name}：测试过了！今天奖励你一根冰棍。', '{name}：绿的！我就说你可以。', '{name}：过了过了，喘口气吧。'],
    'test-fail': ['{name}：没关系，红的总会变绿的。', '{name}：先别急，喝口水再看。', '{name}：失败一次而已，我在这儿陪你。'],
    'build-fail': ['{name}：编不过去？慢慢来，我等你。', '{name}：机器也有脾气的嘛。'],
    commit: ['{name}：又提交了一次，记下来了。', '{name}：收工了一小段，真好。'],
    rest: ['{name}：你已经连着干了两个小时了，起来走走吧。', '{name}：眼睛酸了吧？看看远处。'],
    done: ['{name}：它写完了，去看看？', '{name}：好了，轮到你了。'],
    permission: ['{name}：它在等你点头呢。'],
  },
  en: {
    'test-pass': ['{name}: Tests passed! Popsicle on me.', '{name}: Green! Told you so.', '{name}: All passing. Take a breath.'],
    'test-fail': ['{name}: It\'s fine. Red turns green eventually.', '{name}: Easy. Sip some water, then look again.', '{name}: One failure. I\'m right here.'],
    'build-fail': ['{name}: Won\'t build? Take your time, I\'ll wait.', '{name}: Machines have moods too.'],
    commit: ['{name}: Another commit. Noted.', '{name}: One more piece done. Nice.'],
    rest: ['{name}: Two hours straight. Go stretch.', '{name}: Your eyes must hurt. Look at something far away.'],
    done: ['{name}: It\'s done. Go take a look?', '{name}: Your turn.'],
    permission: ['{name}: It\'s waiting for your okay.'],
  },
}

export function companionLine(lang: Lang, cue: CompanionCue, name: string, k: number): string {
  const list = LINES[lang][cue]
  return list[k % list.length]!.replace('{name}', name)
}

/** 每小时最多 2 句：给出上一小时说过的时间点，判断现在能不能说 */
export function canSpeak(times: number[], now: number, perHour = 2): boolean {
  return times.filter(x => now - x < 3600_000).length < perHour
}

/** 连续工作多久提醒休息：两次 Claude 回合之间空出 30 分钟以上算中断 */
export const REST_AFTER_MS = 2 * 3600_000
export const BREAK_GAP_MS = 30 * 60_000
