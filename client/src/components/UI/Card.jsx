export function Card({ children, className = '', hover = false }) {
    return (
        <div
            className={`
        glass-card p-6
        ${hover ? 'hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = 'primary' }) {
    const colors = {
        primary: 'from-primary-500 to-primary-700',
        accent: 'from-accent-500 to-accent-700',
        warning: 'from-amber-500 to-amber-700',
        danger: 'from-red-500 to-red-700'
    };

    return (
        <Card hover>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-400 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trendUp ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </Card>
    );
}
