export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Anagnosis</h1>
        <p className="text-[var(--muted)] leading-relaxed text-base">
          一个把“如何读画”操作化为 companion AI 的研究原型。它不急着替你下结论，而是带你看见：
          解释是怎样被构图、图像志、细节和历史语境一步步组织出来的。
        </p>
        <p className="text-[var(--muted)] leading-relaxed text-sm">
          方法论锚点来自 Patrick de Rynck、Erwin Panofsky 与 Michael Baxandall。
          当前 v0 先复用继承来的本地画库做界面与交互骨架，后续再接入西方绘画 corpus。
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="/gallery"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">读一幅画</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            从画库选择一幅作品，按你想要的深度解读
          </p>
        </a>

        <a
          href="/learn"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">学怎么看</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            系统挑一幅作品，带你一步步建立解释路径
          </p>
          <p className="text-xs text-[var(--muted)] mt-2 italic">即将上线</p>
        </a>

        <a
          href="/roam"
          className="block border border-[var(--border)] rounded-lg p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h2 className="font-semibold mb-2">画中漫游</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            让你的视线进入画面，从某个具体细节开始慢看
          </p>
          <p className="text-xs text-[var(--muted)] mt-2 italic">即将上线</p>
        </a>
      </div>

      <section className="space-y-3 pt-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-semibold">四种模式</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--muted)]">
          <div><strong className="text-[var(--foreground)]">初见</strong>：像美术馆导览，帮你先把画面读开</div>
          <div><strong className="text-[var(--foreground)]">深读</strong>：把 source text、图像志与历史语境接起来</div>
          <div><strong className="text-[var(--foreground)]">画中漫游</strong>：从一个细节进入，训练你的观看路径</div>
          <div><strong className="text-[var(--foreground)]">研究笔记</strong>：导出成可继续加工的 Markdown</div>
        </div>
      </section>

      <section className="text-xs text-[var(--muted)] space-y-1 pt-4 border-t border-[var(--border)]">
        <p>本项目是视觉文化解释的研究原型，不构成任何占卜、命运或心理咨询服务。</p>
        <p>所有解读都必须回到画面证据，并明确区分观察、推断与待考。当 AI 越界时请反馈给我们。</p>
        <p className="pt-2">
          <a href="/admin" className="underline hover:text-[var(--foreground)]">管理后台</a>
        </p>
      </section>
    </div>
  );
}
