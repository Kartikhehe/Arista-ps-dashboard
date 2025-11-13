// App.jsx - Professional RRM Dashboard with Modern Layout
import { useState, useEffect } from 'react'
import { 
  Activity, Radio, Wifi, TrendingUp, Settings, Users, Calendar, 
  ChevronRight, ChevronDown // Import new icons
} from 'lucide-react'
import './App.css'

function MetricCard({ title, value, unit, icon: Icon, trend, status }) {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <Icon size={20} className="metric-header-icon" />
        <span className="metric-header-title">{title}</span>
      </div>
      <div className="metric-body">
        <div className="metric-main">
          <span className="metric-value">{value.toFixed(1)}</span>
          <span className="metric-unit">{unit}</span>
        </div>
        {trend && (
          <div className={`metric-trend ${trend > 0 ? 'trend-positive' : 'trend-negative'}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d={trend > 0 ? "M8 3L13 8L11.5 9.5L8 6L4.5 9.5L3 8L8 3Z" : "M8 13L3 8L4.5 6.5L8 10L11.5 6.5L13 8L8 13Z"} 
                    fill="currentColor"/>
            </svg>
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SimpleBarChart({ data, title }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.baseline, d.current)))
  
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-legend-inline">
          <div className="legend-item-inline">
            <span className="legend-dot" style={{ backgroundColor: '#60a5fa' }}></span>
            <span>Baseline</span>
          </div>
          <div className="legend-item-inline">
            <span className="legend-dot" style={{ backgroundColor: '#f97316' }}></span>
            <span>RRM-Plus</span>
          </div>
        </div>
      </div>
      <div className="bar-chart-container">
        {data.map((item, idx) => (
          <div key={idx} className="bar-group">
            <div className="bars-wrapper">
              <div 
                className="bar bar-baseline"
                style={{ height: `${(item.baseline / maxValue) * 100}%` }}
                title={`Baseline: ${item.baseline} Mbps`}
              ></div>
              <div 
                className="bar bar-current"
                style={{ height: `${(item.current / maxValue) * 100}%` }}
                title={`Current: ${item.current} Mbps`}
              ></div>
            </div>
            <div className="bar-label">{item.time}</div>
          </div>
        ))}
      </div>
      <div className="chart-highlight">
        <div className="highlight-value">
          <span className="highlight-label">Current Throughput</span>
          <span className="highlight-number">{data[data.length - 1].current} <span className="highlight-unit">Mbps</span></span>
        </div>
        <div className="highlight-badge">+{((data[data.length - 1].current / data[data.length - 1].baseline - 1) * 100).toFixed(1)}%</div>
      </div>
    </div>
  )
}

function SimplePieChart({ data, title }) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  let currentAngle = 0
  
  const slices = data.map((item) => {
    const percentage = (item.count / total) * 100
    const angle = (item.count / total) * 360
    const slice = {
      ...item,
      percentage,
      startAngle: currentAngle,
      angle
    }
    currentAngle += angle
    return slice
  })

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="pie-chart-wrapper">
        <div className="pie-chart-container">
          <svg viewBox="0 0 200 200" className="pie-chart">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
              </filter>
            </defs>
            {slices.map((slice, idx) => {
              const startAngle = (slice.startAngle - 90) * (Math.PI / 180)
              const endAngle = (slice.startAngle + slice.angle - 90) * (Math.PI / 180)
              const x1 = 100 + 70 * Math.cos(startAngle)
              const y1 = 100 + 70 * Math.sin(startAngle)
              const x2 = 100 + 70 * Math.cos(endAngle)
              const y2 = 100 + 70 * Math.sin(endAngle)
              const largeArc = slice.angle > 180 ? 1 : 0
              
              return (
                <path
                  key={idx}
                  d={`M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={slice.color}
                  filter="url(#shadow)"
                  className="pie-slice"
                >
                  <title>{slice.type}: {slice.percentage.toFixed(1)}%</title>
                </path>
              )
            })}
            <circle cx="100" cy="100" r="40" fill="rgba(255, 255, 255, 0.95)" />
          </svg>
          <div className="pie-center-text">
            <div className="pie-center-number">{total}</div>
            <div className="pie-center-label">Total</div>
          </div>
        </div>
        <div className="pie-legend-grid">
          {data.map((item, idx) => (
            <div key={idx} className="pie-legend-item">
              <div className="pie-legend-color" style={{ backgroundColor: item.color }}></div>
              <div className="pie-legend-info">
                <span className="pie-legend-name">{item.type}</span>
                <span className="pie-legend-value">{((item.count / total) * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// NEW COMPONENT for expandable AP rows
function AccessPointRow({ ap }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="data-table-row-main" onClick={() => setIsOpen(!isOpen)}>
        <td className="font-semibold">
          <span className="ap-toggle-icon">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
          {ap.id}
        </td>
        <td>{ap.channel}</td>
        <td>{ap.power} dBm</td>
        <td>{ap.clientCount}</td>
        <td>{ap.rssi} dBm</td>
        <td>
          <span className={`status-pill status-${ap.status}`}>
            {ap.status}
          </span>
        </td>
      </tr>
      {isOpen && (
        <tr className="data-table-row-nested">
          <td colSpan="6">
            <div className="nested-table-container">
              <h4 className="nested-table-title">Clients connected to {ap.id}</h4>
              <table className="nested-data-table">
                <thead>
                  <tr>
                    <th>Client ID</th>
                    <th>RSSI</th>
                    <th>SNR</th>
                    <th>Uplink</th>
                    <th>Downlink</th>
                  </tr>
                </thead>
                <tbody>
                  {ap.clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>{client.rssi} dBm</td>
                      <td>{client.snr} dB</td>
                      <td>{client.uplink} Mbps</td>
                      <td>{client.downlink} Mbps</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}


function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState({
    edgeClientThroughput: 52.5,
    retryRate: 4.8,
    uplinkPER: 2.3,
    steeringAcceptance: 89.2,
    configChurn: 0.18,
    sensingAirtimeCost: 1.6
  })

  const interferenceData = [
    { type: 'WiFi', count: 45, color: '#8b5cf6' },
    { type: 'BLE', count: 23, color: '#ec4899' },
    { type: 'ZigBee', count: 12, color: '#f97316' },
    { type: 'Microwave', count: 8, color: '#14b8a6' },
    { type: 'Other', count: 5, color: '#64748b' }
  ]

  const throughputHistory = [
    { time: '00:00', baseline: 45, current: 52 },
    { time: '04:00', baseline: 48, current: 58 },
    { time: '08:00', baseline: 42, current: 56 },
    { time: '12:00', baseline: 38, current: 51 },
    { time: '16:00', baseline: 44, current: 59 },
    { time: '20:00', baseline: 46, current: 61 }
  ]

  // UPDATED AP STATUS DATA with nested clients
  const [apStatus, setApStatus] = useState([
    { 
      id: 'AP-01', channel: 36, power: 17, clientCount: 4, status: 'optimal', rssi: -45,
      clients: [
        { id: 'iPhone-User-1', rssi: -55, snr: 35, uplink: 120, downlink: 350 },
        { id: 'Laptop-Admin', rssi: -60, snr: 32, uplink: 80, downlink: 280 },
        { id: 'Pixel-Guest', rssi: -65, snr: 29, uplink: 75, downlink: 250 },
        { id: 'Smart-TV', rssi: -58, snr: 34, uplink: 10, downlink: 150 },
      ]
    },
    { 
      id: 'AP-02', channel: 48, power: 14, clientCount: 3, status: 'optimal', rssi: -52,
      clients: [
        { id: 'MacBook-Dev', rssi: -50, snr: 40, uplink: 250, downlink: 600 },
        { id: 'Galaxy-S23', rssi: -62, snr: 31, uplink: 110, downlink: 320 },
        { id: 'Work-PC', rssi: -59, snr: 33, uplink: 130, downlink: 400 },
      ]
    },
    { 
      id: 'AP-03', channel: 149, power: 20, clientCount: 5, status: 'warning', rssi: -68,
      clients: [
        { id: 'Client-A', rssi: -70, snr: 25, uplink: 40, downlink: 100 },
        { id: 'Client-B', rssi: -72, snr: 24, uplink: 35, downlink: 90 },
        { id: 'Client-C', rssi: -68, snr: 27, uplink: 50, downlink: 120 },
        { id: 'Client-D', rssi: -75, snr: 22, uplink: 30, downlink: 80 },
        { id: 'Client-E', rssi: -71, snr: 25, uplink: 45, downlink: 110 },
      ]
    },
    { 
      id: 'AP-04', channel: 157, power: 17, clientCount: 2, status: 'optimal', rssi: -48,
      clients: [
        { id: 'iPad-Pro', rssi: -53, snr: 38, uplink: 180, downlink: 500 },
        { id: 'Surface-Book', rssi: -56, snr: 36, uplink: 150, downlink: 450 },
      ]
    },
    { 
      id: 'AP-05', channel: 36, power: 14, clientCount: 3, status: 'optimal', rssi: -50,
      clients: [
        { id: 'Nest-Cam', rssi: -60, snr: 32, uplink: 20, downlink: 20 },
        { id: 'Smart-Speaker', rssi: -58, snr: 33, uplink: 15, downlink: 15 },
        { id: 'Thermostat', rssi: -61, snr: 31, uplink: 5, downlink: 5 },
      ]
    }
  ])

  const recentChanges = [
    { time: '14:23:15', ap: 'AP-03', action: 'Channel change', from: '149', to: '157', reason: 'DFS event detected' },
    { time: '13:45:32', ap: 'AP-01', action: 'Power adjustment', from: '20dBm', to: '17dBm', reason: 'Co-channel interference reduced' },
    { time: '12:18:09', ap: 'AP-05', action: 'OBSS-PD tuned', from: '-82dBm', to: '-74dBm', reason: '50% OBSS detected' },
    { time: '11:32:44', ap: 'AP-02', action: 'Client steering', from: 'AP-02', to: 'AP-04', reason: 'Load balancing' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        edgeClientThroughput: 52 + Math.random() * 10,
        retryRate: 4.2 + Math.random() * 2,
        uplinkPER: 2.1 + Math.random() * 1.5,
        steeringAcceptance: 87 + Math.random() * 5,
        configChurn: 0.15 + Math.random() * 0.1,
        sensingAirtimeCost: 1.4 + Math.random() * 0.4
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content-wrapper">
          <div className="header-left">
            <h1 className="dashboard-title">RRM-Plus Dashboard</h1>
            <p className="dashboard-subtitle">Real-time WiFi Radio Resource Management</p>
          </div>
          <div className="header-right">
            <button className="time-period-btn">
              <Calendar size={18} />
              <span>Last 24 hours</span>
            </button>
            <div className="status-indicator">
              <span className="status-dot-live"></span>
              <span className="status-text">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <div className="nav-wrapper">
          {['Overview', 'Access Points', 'Recent Changes'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`nav-tab ${activeTab === tab.toLowerCase().replace(' ', '-') ? 'nav-tab-active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === 'overview' && (
          <>
            {/* Metrics Grid */}
            <div className="metrics-container">
              <MetricCard 
                title="Edge Client Throughput" 
                value={metrics.edgeClientThroughput} 
                unit=" Mbps" 
                icon={TrendingUp}
                trend={28.5}
                status="good"
              />
              <MetricCard 
                title="P95 Retry Rate" 
                value={metrics.retryRate} 
                unit="%" 
                icon={Activity}
                trend={-22.3}
                status="good"
              />
              <MetricCard 
                title="Uplink PER" 
                value={metrics.uplinkPER} 
                unit="%" 
                icon={Wifi}
                trend={-18.7}
                status="good"
              />
              <MetricCard 
                title="Steering Acceptance" 
                value={metrics.steeringAcceptance} 
                unit="%" 
                icon={Users}
                trend={12.4}
                status="good"
              />
              <MetricCard 
                title="Config Churn" 
                value={metrics.configChurn} 
                unit="/AP/day" 
                icon={Settings}
                trend={-5.2}
                status="good"
              />
              <MetricCard 
                title="Sensing Overhead" 
                value={metrics.sensingAirtimeCost} 
                unit="%" 
                icon={Radio}
                trend={2.1}
                status="good"
              />
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <SimpleBarChart data={throughputHistory} title="Throughput Performance" />
              <SimplePieChart data={interferenceData} title="Interference Classification" />
            </div>
          </>
        )}

        {activeTab === 'access-points' && (
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Access Point Status</h2>
              <span className="content-card-badge">{apStatus.length} APs</span>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>AP ID</th>
                    <th>Channel</th>
                    <th>Power</th>
                    <th>Clients</th>
                    <th>Avg RSSI</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* UPDATED to use new component */}
                  {apStatus.map((ap) => (
                    <AccessPointRow key={ap.id} ap={ap} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recent-changes' && (
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Recent RRM Changes</h2>
              <span className="content-card-badge">{recentChanges.length} changes</span>
            </div>
            <div className="timeline">
              {recentChanges.map((change, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-ap">{change.ap}</span>
                      <span className="timeline-time">{change.time}</span>
                    </div>
                    <h4 className="timeline-action">{change.action}</h4>
                    <p className="timeline-details">{change.from} → {change.to}</p>
                    <div className="timeline-reason">{change.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Arista Networks RRM-Plus • Inter IIT Tech Meet 14.0 • Powered by AI & Additional Radio</p>
      </footer>
    </div>
  )
}

export default App