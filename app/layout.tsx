import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlowAI — Your AI Financial Advisor',
  description: 'Track income, expenses, and investments. Get proactive AI-powered financial insights that help you spend smarter, save more, and invest better.',
  keywords: ['personal finance', 'budget tracker', 'AI financial advisor', 'expense tracking', 'investment tracking'],
  openGraph: {
    title: 'FlowAI — Your AI Financial Advisor',
    description: 'Your money, finally thinking for itself.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
