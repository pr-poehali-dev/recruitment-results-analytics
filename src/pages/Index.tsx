import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const funnelStages = [
  { id: "new",        label: "Неразобранные",          count: 856, days: 5,  conv: 100.00, convFirst: 100.00 },
  { id: "sms",        label: "На отправку SMS",         count: 126, days: 8,  conv: 14.72,  convFirst: 14.72  },
  { id: "call",       label: "Телефонный разговор",     count: 96,  days: 18, conv: 76.19,  convFirst: 11.21  },
  { id: "invite",     label: "Приглашён на интервью",   count: 39,  days: 9,  conv: 40.63,  convFirst: 4.56   },
  { id: "recall",     label: "Повторный обзвон",        count: 31,  days: 15, conv: 79.49,  convFirst: 3.62   },
  { id: "interview",  label: "Интервью",                count: 41,  days: 5,  conv: 132.26, convFirst: 4.79   },
  { id: "middle",     label: "Промежуточный этап",      count: 9,   days: 3,  conv: 21.95,  convFirst: 1.05   },
  { id: "tech",       label: "Техническое собеседование", count: 9, days: 6,  conv: 100.00, convFirst: 1.05   },
  { id: "security",   label: "Проверка СБ",             count: 7,   days: 10, conv: 77.78,  convFirst: 0.82   },
  { id: "offer",      label: "Предложение о работе",    count: 8,   days: 13, conv: 114.29, convFirst: 0.93   },
  { id: "hired",      label: "Выход на работу",         count: 10,  days: 42, conv: 125.00, convFirst: 1.17   },
  { id: "reserve",    label: "Резерв",                  count: 5,   days: 23, conv: 50.00,  convFirst: 0.58   },
];

const stageColors = [
  "hsl(217 91% 60%)",
  "hsl(230 70% 62%)",
  "hsl(250 65% 63%)",
  "hsl(270 60% 65%)",
  "hsl(280 58% 60%)",
  "hsl(295 55% 58%)",
  "hsl(20 90% 58%)",
  "hsl(35 100% 55%)",
  "hsl(45 95% 52%)",
  "hsl(80 70% 48%)",
  "hsl(160 84% 45%)",
  "hsl(185 70% 48%)",
];

const bottlenecks = [
  { label: "Промежуточный этап", value: 21.95, risk: "high", desc: "Резкий отсев: с 41 до 9 кандидатов" },
  { label: "Приглашён на интервью", value: 40.63, risk: "medium", desc: "Кандидаты отказываются после первичного общения" },
  { label: "Телефонный разговор", value: 18, risk: "medium", desc: "18 дней — самый долгий этап по времени", unit: "д" },
];

const anomalies = [
  { label: "Интервью", value: "132%", desc: "Конверсия >100% — кандидаты возвращаются на этап повторно" },
  { label: "Предложение о работе", value: "114%", desc: "Возможна ошибка базы или повторный учёт" },
  { label: "Выход на работу", value: "125%", desc: "Нанято больше, чем предложено — сверхплановый найм" },
];

const recommendations = [
  { icon: "Zap", title: "Оптимизировать промежуточный этап", desc: "Выяснить причины 78% отсева. Возможно, критерии слишком жёсткие или процесс непрозрачен.", priority: "high" },
  { icon: "Phone", title: "Автоматизировать SMS и обзвоны", desc: "Сократить 8+18 дней на первичных этапах. Автообзвон снизит время реакции.", priority: "high" },
  { icon: "Calendar", title: "Ускорить этап выхода", desc: "42 дня — критически долго. Заранее готовить документы параллельно последним собеседованиям.", priority: "medium" },
  { icon: "Users", title: "Задействовать резерв", desc: "5 кандидатов готовы — предложите им открытые вакансии в первую очередь.", priority: "medium" },
];

function useCountUp(target: number, duration = 1400, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = Date.now();
      const frame = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const count = useCountUp(value, 1400, delay);
  return <span>{count.toLocaleString("ru-RU")}</span>;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<"funnel" | "table" | "recs">("funnel");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalDays = 134;
  const totalConv = 1.17;
  const planExec = 143;

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(217 91% 60%) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, hsl(270 60% 65%) 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8 transition-all duration-700"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(16px)" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
              <Icon name="BarChart3" size={16} className="text-white" />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">HR Аналитика · Итоговый отчёт</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gradient mb-1">Воронка найма</h1>
          <p className="text-muted-foreground text-sm">7 вакансий · 856 кандидатов · 10 вышли на работу</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Кандидатов", value: 856, sub: "вошли в воронку", icon: "Users", color: "text-blue-400", border: "border-blue-500/30", glow: "glow-blue", bg: "bg-blue-500/10", delay: 0 },
            { label: "Нанято", value: 10, sub: "вышли на работу", icon: "Briefcase", color: "text-emerald-400", border: "border-emerald-500/30", glow: "glow-green", bg: "bg-emerald-500/10", delay: 80 },
            { label: "Вакансий", value: 7, sub: "план перевыполнен", icon: "Target", color: "text-orange-400", border: "border-orange-500/30", glow: "glow-orange", bg: "bg-orange-500/10", delay: 160 },
            { label: "Дней", value: totalDays, sub: "среднее время найма", icon: "Clock", color: "text-purple-400", border: "border-purple-500/30", glow: "glow-purple", bg: "bg-purple-500/10", delay: 240 },
          ].map((kpi) => (
            <div key={kpi.label}
              className={`card-glass rounded-2xl p-4 border ${kpi.border} ${kpi.glow} hover:scale-[1.02]`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.7s ${kpi.delay}ms, transform 0.7s ${kpi.delay}ms`,
              }}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <Icon name={kpi.icon} size={18} className={kpi.color} fallback="Circle" />
                </div>
              </div>
              <div className={`text-3xl font-black font-mono-data ${kpi.color} mb-0.5`}>
                {isVisible ? <AnimatedCounter value={kpi.value} delay={kpi.delay} /> : "0"}
              </div>
              <div className="text-xs font-semibold text-foreground/80 mb-0.5">{kpi.label}</div>
              <div className="text-xs text-muted-foreground">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Общая конверсия", value: `${totalConv}%`, sub: "из заявки в сотрудника", color: "text-blue-400", border: "border-blue-500/20" },
            { label: "Выполнение плана", value: `${planExec}%`, sub: "перевыполнен на 43%", color: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "В резерве", value: "5", sub: "кандидатов готово", color: "text-purple-400", border: "border-purple-500/20" },
          ].map((s) => (
            <div key={s.label} className={`card-glass rounded-xl p-4 border ${s.border} flex items-center gap-4`}>
              <div className={`text-2xl font-black font-mono-data ${s.color}`}>{s.value}</div>
              <div>
                <div className="text-xs font-semibold text-foreground/80">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {(["funnel", "table", "recs"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? "gradient-blue-purple text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}>
              {tab === "funnel" ? "Воронка" : tab === "table" ? "Этапы" : "Рекомендации"}
            </button>
          ))}
        </div>

        {/* FUNNEL TAB */}
        {activeTab === "funnel" && (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card-glass rounded-2xl p-5 border border-border">
              <h2 className="font-bold text-base mb-5">Воронка подбора — 12 этапов</h2>
              <div className="space-y-2.5">
                {funnelStages.map((stage, i) => {
                  const width = Math.max((stage.count / 856) * 100, 3);
                  const color = stageColors[i];
                  const isAnomaly = stage.conv > 100 && i > 0;
                  return (
                    <div key={stage.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-foreground/70">{stage.label}</span>
                          {isAnomaly && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono-data">
                              {stage.conv}%
                            </span>
                          )}
                        </div>
                        <span className="font-mono-data text-sm font-semibold" style={{ color }}>
                          {stage.count}
                        </span>
                      </div>
                      <div className="h-7 rounded-lg bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-lg flex items-center px-2.5"
                          style={{
                            width: `${width}%`,
                            background: `linear-gradient(90deg, ${color}25, ${color}55)`,
                            borderRight: `2px solid ${color}`,
                            transition: `width 1.2s ${i * 60 + 300}ms ease-out`,
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-4">
              {/* Bottlenecks */}
              <div className="card-glass rounded-2xl p-5 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="AlertTriangle" size={15} className="text-orange-400" />
                  <h3 className="font-bold text-sm">Узкие места</h3>
                </div>
                <div className="space-y-3">
                  {bottlenecks.map((b, i) => (
                    <div key={i} className={`p-3 rounded-xl ${b.risk === "high" ? "bg-red-500/10 border border-red-500/20" : "bg-orange-500/10 border border-orange-500/20"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground/80">{b.label}</span>
                        <span className={`font-mono-data text-sm font-bold ${b.risk === "high" ? "text-red-400" : "text-orange-400"}`}>
                          {b.value}{b.unit ?? "%"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomalies */}
              <div className="card-glass rounded-2xl p-5 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Zap" size={15} className="text-yellow-400" />
                  <h3 className="font-bold text-sm">Аномалии конверсии</h3>
                </div>
                <div className="space-y-2.5">
                  {anomalies.map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="font-mono-data text-yellow-400 font-bold text-sm mt-0.5 flex-shrink-0">{a.value}</span>
                      <div>
                        <div className="text-xs font-semibold text-foreground/80">{a.label}</div>
                        <div className="text-xs text-muted-foreground">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABLE TAB */}
        {activeTab === "table" && (
          <div className="card-glass rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50">
              <h2 className="font-bold">Детализация по этапам</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border/30">
                    <th className="text-left px-5 py-3 font-medium">Этап</th>
                    <th className="text-center px-4 py-3 font-medium">Кандидатов</th>
                    <th className="text-center px-4 py-3 font-medium">Конверсия с пред.</th>
                    <th className="text-center px-4 py-3 font-medium">С первого этапа</th>
                    <th className="text-right px-5 py-3 font-medium">Ср. дней</th>
                  </tr>
                </thead>
                <tbody>
                  {funnelStages.map((s, i) => {
                    const color = stageColors[i];
                    const isAnomaly = s.conv > 100 && i > 0;
                    const isCritical = s.conv < 30 && i > 0;
                    return (
                      <tr key={s.id} className="border-b border-border/20 hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span className="text-sm font-medium">{s.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono-data text-sm font-semibold" style={{ color }}>{s.count}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-mono-data text-sm px-2 py-0.5 rounded-lg ${
                            isAnomaly ? "bg-orange-500/20 text-orange-300"
                            : isCritical ? "bg-red-500/20 text-red-300"
                            : "text-muted-foreground"
                          }`}>
                            {i === 0 ? "—" : `${s.conv}%`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono-data text-sm text-muted-foreground">{s.convFirst}%</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className={`font-mono-data text-sm ${s.days >= 30 ? "text-red-400" : s.days >= 15 ? "text-orange-400" : "text-muted-foreground"}`}>
                            {s.days}д
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-white/[0.02]">
                    <td className="px-5 py-3 text-sm font-bold">Итого</td>
                    <td className="px-4 py-3 text-center font-mono-data text-sm text-blue-400 font-bold">856 → 10</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 text-center font-mono-data text-sm text-emerald-400 font-bold">1.17%</td>
                    <td className="px-5 py-3 text-right font-mono-data text-sm text-purple-400 font-bold">134д</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === "recs" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {recommendations.map((r, i) => (
              <div key={i}
                className={`card-glass rounded-2xl p-5 border ${r.priority === "high" ? "border-red-500/25" : "border-blue-500/20"}`}
                style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(12px)", transition: `opacity 0.5s ${i * 100}ms, transform 0.5s ${i * 100}ms` }}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${r.priority === "high" ? "bg-red-500/15" : "bg-blue-500/15"}`}>
                    <Icon name={r.icon} size={18} className={r.priority === "high" ? "text-red-400" : "text-blue-400"} fallback="Circle" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-sm">{r.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.priority === "high" ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"}`}>
                        {r.priority === "high" ? "Приоритет" : "Важно"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Вывод */}
            <div className="sm:col-span-2 card-glass rounded-2xl p-5 border border-emerald-500/20 glow-green">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CheckCircle" size={16} className="text-emerald-400" />
                <h3 className="font-bold text-sm">Ключевые выводы</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { v: "+43%", label: "перевыполнение плана по найму" },
                  { v: "1.17%", label: "общая конверсия воронки — есть куда расти" },
                  { v: "134д", label: "длинный цикл найма теряет кандидатов" },
                ].map((item) => (
                  <div key={item.v} className="text-center">
                    <div className="text-2xl font-black font-mono-data text-emerald-400 mb-1">{item.v}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>HR Dashboard · на основе реальных данных отчёта</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>7 вакансий · май 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
