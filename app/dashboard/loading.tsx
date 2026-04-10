export default function DashboardLoading() {
  const Skeleton = ({ w, h = '1rem', radius = '6px' }: { w: string; h?: string; radius?: string }) => (
    <div className="skeleton" style={{ width: w, height: h, borderRadius: radius }} />
  )

  return (
    <div style={{ maxWidth: '1200px', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Skeleton w="240px" h="1.75rem" radius="8px" />
        <div style={{ marginTop: '6px' }}><Skeleton w="180px" h="0.875rem" /></div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <Skeleton w="60%" h="0.75rem" />
            <div style={{ marginTop: '10px' }}><Skeleton w="80%" h="1.75rem" radius="8px" /></div>
            <div style={{ marginTop: '8px' }}><Skeleton w="50%" h="0.75rem" /></div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px', marginBottom: '14px' }}>
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', height: '320px' }}>
          <Skeleton w="40%" h="1rem" />
          <div style={{ marginTop: '6px' }}><Skeleton w="25%" h="0.75rem" /></div>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px' }}>
            {[60, 80, 45, 90, 70, 95].map((h, i) => (
              <div key={i} className="skeleton" style={{ flex: 1, height: `${h}%`, borderRadius: '6px 6px 0 0' }} />
            ))}
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed' }}>
          <Skeleton w="50%" h="1rem" />
          <div style={{ marginTop: '6px' }}><Skeleton w="35%" h="0.75rem" /></div>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Skeleton w="24px" h="24px" radius="4px" />
                <div style={{ flex: 1 }}>
                  <Skeleton w="80%" h="0.8rem" />
                  <div style={{ marginTop: '5px' }}><Skeleton w="100%" h="0.7rem" /></div>
                  <div style={{ marginTop: '5px' }}><Skeleton w="60%" h="0.7rem" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed' }}>
        <Skeleton w="35%" h="1rem" />
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Skeleton w="36px" h="36px" radius="10px" />
              <div style={{ flex: 1 }}>
                <Skeleton w="40%" h="0.8rem" />
                <div style={{ marginTop: '5px' }}><Skeleton w="25%" h="0.7rem" /></div>
              </div>
              <Skeleton w="70px" h="0.8rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
