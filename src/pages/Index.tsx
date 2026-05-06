import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const funnelStages = [
  {
    id: "applications",
    label: "Заявки",
    count: 847,
    icon: "FileText",
    color: "hsl(217 91% 60%)",
    colorClass: "text-blue-400",
    borderClass: "border-blue-500/30",
    glowClass: "glow-blue",
    bgClass: "bg-blue-500/10",
    badgeClass: "bg-blue-500/20 text-blue-300",
    avgDays: 0,
    label2: "поступило за месяц",
  },
  {
    id: "interviews",
    label: "Интервью",
    count: 312,
    icon: "Users",
    color: "hsl(270 60% 65%)",
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/30",
    glowClass: "glow-purple",
    bgClass: "bg-purple-500/10",
    badgeClass: "bg-purple-500/20 text-purple-300",
    avgDays: 4.2,
    label2: "прошли отбор",
  },
  {
    id: "offer",
    label: "Оффер",
    count: 89,
    icon: "Award",
    color: "hsl(35 100% 55%)",
    colorClass: "text-orange-400",
    borderClass: "border-orange-500/30",
    glowClass: "glow-orange",
    bgClass: "bg-orange-500/10",
    badgeClass: "bg-orange-500/20 text-orange-300",
    avgDays: 8.7,
    label2: "получили оффер",
  },
  {
    id: "hired",
    label: "Выход на работу",
    count: 64,
    icon: "Briefcase",
    color: "hsl(160 84% 45%)",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/30",
    glowClass: "glow-green",
    bgClass: "bg-emerald-500/10",
    badgeClass: "bg-emerald-500/20 text-emerald-300",
    avgDays: 14.1,
    label2: "вышли на работу",
  },
];

const conversionRates = [
  { label: "Заявки → Интервью", value: 36.8, color: "hsl(270 60% 65%)" },
  { label: "Интервью → Оффер", value: 28.5, color: "hsl(35 100% 55%)" },
  { label: "Оффер → Выход", value: 71.9, color: "hsl(160 84% 45%)" },
];

const monthlyData = [
  { month: "Янв", apps: 520 },
  { month: "Фев", apps: 610 },
  { month: "Мар", apps: 720 },
  { month: "Апр", apps: 680 },
  { month: "Май", apps: 847 },
];

const topVacancies = [
  { role: "Frontend Developer", apps: 142, stage: "Интервью", days: 12 },
  { role: "Product Manager", apps: 98, stage: "Оффер", days: 18 },
  { role: "Data Analyst", apps: 87, stage: "Выход", days: 9 },
  { role: "DevOps Engineer", apps: 76, stage: "Интервью", days: 15 },
  { role: "UX Designer", apps: 65, stage: "Заявки", days: 6 },
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

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("funnel");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalDays = 14.1;
  const maxApps = Math.max(...monthlyData.map(m => m.apps));

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(217 91% 60%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, hsl(270 60% 65%) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div
          className="mb-8 transition-all duration-700"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(16px)" }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
              <Icon name="BarChart3" size={16} className="text-white" />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">HR Аналитика</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gradient mb-1">Воронка найма</h1>
          <p className="text-muted-foreground text-sm">Май 2026 · Обновлено сегодня в 09:41</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {funnelStages.map((stage, i) => (
            <div
              key={stage.id}
              className={`card-glass rounded-2xl p-4 border ${stage.borderClass} ${stage.glowClass} hover:scale-[1.02] transition-all duration-300`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.7s ${i * 80}ms, transform 0.7s ${i * 80}ms, box-shadow 0.3s, scale 0.3s`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${stage.bgClass} flex items-center justify-center`}>
                  <Icon name={stage.icon} size={18} className={stage.colorClass} fallback="FileText" />
                </div>
                {stage.avgDays > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${stage.badgeClass} font-mono-data`}>
                    ~{stage.avgDays}д
                  </span>
                )}
              </div>
              <div className={`text-3xl font-black font-mono-data ${stage.colorClass} mb-0.5`}>
                {isVisible ? <AnimatedCounter value={stage.count} delay={i * 100} /> : "0"}
              </div>
              <div className="text-xs text-muted-foreground">{stage.label2}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-4">

          {/* Funnel visualization */}
          <div className="lg:col-span-2 card-glass rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">Воронка подбора</h2>
              <div className="flex gap-1">
                {["funnel", "chart"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeTab === tab
                        ? "gradient-blue-purple text-white"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    {tab === "funnel" ? "Воронка" : "График"}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "funnel" ? (
              <div className="space-y-3">
                {funnelStages.map((stage, i) => {
                  const width = (stage.count / funnelStages[0].count) * 100;
                  return (
                    <div key={stage.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground/70">{stage.label}</span>
                        <span className={`font-mono-data text-sm font-semibold ${stage.colorClass}`}>
                          {stage.count.toLocaleString("ru-RU")}
                        </span>
                      </div>
                      <div className="h-8 rounded-lg bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-lg flex items-center px-3 transition-all duration-1000"
                          style={{
                            width: `${width}%`,
                            background: `linear-gradient(90deg, ${stage.color}30, ${stage.color}60)`,
                            borderRight: `2px solid ${stage.color}`,
                            transitionDelay: `${i * 150 + 300}ms`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: stage.color, boxShadow: `0 0 6px ${stage.color}` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-end gap-2 h-36">
                  {monthlyData.map((d, i) => {
                    const barH = (d.apps / maxApps) * 100;
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-mono-data text-muted-foreground">{d.apps}</span>
                        <div className="w-full relative" style={{ height: "96px" }}>
                          <div
                            className="absolute bottom-0 w-full rounded-t-md"
                            style={{
                              height: `${barH}%`,
                              background: "linear-gradient(180deg, hsl(217 91% 60%) 0%, hsl(217 91% 60% / 0.4) 100%)",
                              transition: `height 1s ${i * 100}ms ease-out`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Количество заявок по месяцам</p>
                </div>
              </div>
            )}

            {/* Conversion rates */}
            <div className="mt-6 pt-5 border-t border-border/50">
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest">
                Конверсия между этапами
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {conversionRates.map((rate, i) => (
                  <div key={i} className="text-center">
                    <div className="relative h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${rate.value}%`,
                          background: rate.color,
                          transition: `width 1s ${i * 150 + 500}ms ease-out`,
                        }}
                      />
                    </div>
                    <div className="font-mono-data font-bold text-lg" style={{ color: rate.color }}>
                      {rate.value}%
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">{rate.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Time to hire */}
            <div className="card-glass rounded-2xl p-5 border border-emerald-500/20 glow-green">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Clock" size={16} className="text-emerald-400" />
                <h2 className="font-bold text-sm">Среднее время найма</h2>
              </div>
              <div className="text-5xl font-black font-mono-data text-emerald-400 mb-1">
                {isVisible ? <AnimatedCounter value={Math.round(totalDays)} delay={600} /> : "0"}
                <span className="text-2xl font-semibold ml-1">дн</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">от заявки до выхода</p>

              <div className="space-y-2.5">
                {funnelStages.slice(1).map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className={`font-mono-data ${s.colorClass}`}>{s.avgDays}д</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(s.avgDays / totalDays) * 100}%`, background: s.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Итоговая конверсия */}
            <div className="card-glass rounded-2xl p-5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="TrendingUp" size={16} className="text-blue-400" />
                <h2 className="font-bold text-sm">Итоговая конверсия</h2>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-5xl font-black font-mono-data text-blue-400">
                  7.6<span className="text-2xl">%</span>
                </div>
                <SparkLine data={[4.2, 5.1, 6.8, 6.2, 7.6]} color="hsl(217 91% 60%)" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">из заявки в сотрудника</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                <Icon name="ArrowUpRight" size={14} />
                <span>+1.4% к прошлому месяцу</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vacancies table */}
        <div className="card-glass rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-bold">Топ вакансий</h2>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              <span>Все вакансии</span>
              <Icon name="ArrowRight" size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border/30">
                  <th className="text-left px-5 py-3 font-medium">Вакансия</th>
                  <th className="text-center px-4 py-3 font-medium">Заявки</th>
                  <th className="text-center px-4 py-3 font-medium">Этап</th>
                  <th className="text-center px-4 py-3 font-medium">Дней</th>
                  <th className="text-right px-5 py-3 font-medium">Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {topVacancies.map((v, i) => {
                  const stageColor: Record<string, string> = {
                    "Заявки": "bg-blue-500/20 text-blue-300",
                    "Интервью": "bg-purple-500/20 text-purple-300",
                    "Оффер": "bg-orange-500/20 text-orange-300",
                    "Выход": "bg-emerald-500/20 text-emerald-300",
                  };
                  const conv = ((64 / v.apps) * 100).toFixed(1);
                  return (
                    <tr key={i} className="border-b border-border/20 hover:bg-white/[0.03] transition-colors cursor-pointer">
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-sm">{v.role}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono-data text-sm text-blue-400">{v.apps}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColor[v.stage] || "bg-white/10 text-foreground"}`}>
                          {v.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-mono-data text-sm text-muted-foreground">{v.days}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-mono-data text-sm text-emerald-400">{conv}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>HR Dashboard v1.0</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Данные обновляются в реальном времени</span>
          </div>
        </div>
      </div>
    </div>
  );
}