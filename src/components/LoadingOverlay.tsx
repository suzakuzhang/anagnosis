"use client";

import { useEffect, useState, useRef } from "react";

const LOADING_STATES = [
  "正走近这幅画……",
  "正在把画面证据组织成观看路径……",
  "正在生成解读……",
];

const COMMON_FACTS = [
  `de Rynck 的常用起手式不是先下定义，而是先问：这幅画在视觉化哪段故事？`,
  `Panofsky 提醒我们区分三层：先看见，再辨识，最后再谈深层文化意义。`,
  `Baxandall 的 period eye 不是"时代风格"的空话，而是问：当时的人是怎样被训练着去看画的？`,
  `一处偏离源文本的细节，往往比一段大而化之的主题总结更重要。`,
  `谁被放大、居中、抬高、压暗，通常比人物名字本身更快暴露画面的等级结构。`,
  `宗教画、历史画、肖像画都不只是题材分类，它们也是不同的观看协议。`,
  `小物件常常不是装饰：百合、骷髅、棕榈枝、王冠、书本都可能是图像志 ID。`,
  `尺寸会改变解释：祭坛画、私人祈祷小画和公共厅堂壁画，本来就不是给同一种距离看的。`,
  `Close looking 不是看得更久，而是知道哪一处细节值得停下来。`,
  `Anagnosis 关心的不是"正确答案"，而是解释如何一步步被组织出来。`,
  `当画家删掉故事里本来有的东西，那个空缺本身也在说话。`,
  `政治潜台词不一定喊得很大声，它常常藏在委托方、展示场所和人物排列里。`,
];

interface LoadingOverlayProps {
  visible: boolean;
  paintingTitle?: string;
}

export default function LoadingOverlay({ visible, paintingTitle }: LoadingOverlayProps) {
  const [stateText, setStateText] = useState(LOADING_STATES[0]);
  const [fact, setFact] = useState("");
  const [progress, setProgress] = useState(0);
  const factPool = useRef<string[]>([]);
  const factIndex = useRef(0);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }

    const pool = [...COMMON_FACTS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    factPool.current = pool;
    factIndex.current = 0;
    setFact(pool[0] ?? "");

    setStateText(LOADING_STATES[0]);
    const t1 = setTimeout(() => setStateText(LOADING_STATES[1]), 2000);
    const t2 = setTimeout(() => setStateText(LOADING_STATES[2]), 4500);

    const factInterval = setInterval(() => {
      factIndex.current = (factIndex.current + 1) % factPool.current.length;
      setFact(factPool.current[factIndex.current]);
    }, 3000);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(95, (1 - Math.exp(-elapsed / 10000)) * 100);
      setProgress(p);
    }, 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, [visible, paintingTitle]);

  if (!visible) return null;

  return (
    <div className="space-y-4 py-4" aria-live="polite">
      <p className="text-sm text-[var(--muted)] animate-pulse">{stateText}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-[#1a1a1a] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[2.5rem] transition-opacity duration-500">
        {fact}
      </p>
    </div>
  );
}
