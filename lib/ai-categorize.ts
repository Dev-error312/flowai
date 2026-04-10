// AI-powered transaction categorization
// Uses Claude Haiku for speed and cost efficiency
// Caches results by merchant name

const CATEGORY_CACHE = new Map<string, { category: string; confidence: number }>()

const AVAILABLE_CATEGORIES = [
  'Housing', 'Food & Dining', 'Transportation', 'Healthcare', 'Shopping',
  'Entertainment', 'Subscriptions', 'Utilities', 'Travel', 'Education',
  'Personal Care', 'Savings', 'Investments', 'Debt Payments', 'Other',
  'Salary', 'Freelance', 'Investment Returns', 'Rental Income', 'Other Income',
]

export interface CategorizationResult {
  category: string
  confidence: number
  reasoning?: string
}

export async function categorizeTransaction(
  merchant: string,
  description: string,
  amount: number,
  type: 'income' | 'expense' | 'transfer'
): Promise<CategorizationResult> {

  // Check cache first (saves API calls for repeat merchants)
  const cacheKey = `${merchant.toLowerCase().trim()}-${type}`
  if (CATEGORY_CACHE.has(cacheKey)) {
    return CATEGORY_CACHE.get(cacheKey)!
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Fallback: rule-based categorization
    return ruleBasedCategorize(merchant, description, amount, type)
  }

  try {
    const prompt = `Categorize this financial transaction into exactly one category.

Transaction details:
- Merchant/Payee: "${merchant}"
- Description: "${description}"
- Amount: $${amount}
- Type: ${type}

Available categories: ${AVAILABLE_CATEGORIES.join(', ')}

Rules:
- For income transactions, only use income categories (Salary, Freelance, Investment Returns, Rental Income, Other Income)
- For expense transactions, use expense categories
- Be specific — prefer specific categories over "Other"
- Netflix/Spotify/Hulu → Subscriptions
- Rent/Mortgage → Housing
- DoorDash/UberEats → Food & Dining
- Amazon → Shopping (unless description suggests otherwise)

Respond with ONLY a JSON object, no other text:
{"category": "Category Name", "confidence": 0.95, "reasoning": "brief explanation"}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      return ruleBasedCategorize(merchant, description, amount, type)
    }

    const data = await response.json()
    const text = data.content[0]?.text ?? '{}'
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(clean) as CategorizationResult

    // Cache result
    CATEGORY_CACHE.set(cacheKey, { category: result.category, confidence: result.confidence })

    return result

  } catch {
    return ruleBasedCategorize(merchant, description, amount, type)
  }
}

// Fallback rule-based categorizer (no API needed)
function ruleBasedCategorize(
  merchant: string,
  description: string,
  amount: number,
  type: 'income' | 'expense' | 'transfer'
): CategorizationResult {
  const m = merchant.toLowerCase()
  const d = description.toLowerCase()
  const text = `${m} ${d}`

  if (type === 'income') {
    if (text.includes('payroll') || text.includes('salary') || text.includes('direct dep'))
      return { category: 'Salary', confidence: 0.9 }
    if (text.includes('freelance') || text.includes('consulting') || text.includes('invoice'))
      return { category: 'Freelance', confidence: 0.85 }
    if (text.includes('dividend') || text.includes('interest') || text.includes('return'))
      return { category: 'Investment Returns', confidence: 0.8 }
    return { category: 'Other Income', confidence: 0.6 }
  }

  // Expense rules
  const rules: [string[], string][] = [
    [['rent', 'mortgage', 'apartment', 'landlord', 'realty'], 'Housing'],
    [['whole foods', 'trader joe', 'safeway', 'kroger', 'instacart', 'grocery'], 'Food & Dining'],
    [['doordash', 'uber eats', 'grubhub', 'postmates', 'restaurant', 'mcdonald', 'starbucks', 'chipotle', 'pizza'], 'Food & Dining'],
    [['uber', 'lyft', 'gas', 'shell', 'chevron', 'bp ', 'exxon', 'parking', 'metro', 'transit'], 'Transportation'],
    [['netflix', 'spotify', 'apple music', 'hulu', 'disney+', 'amazon prime', 'youtube premium', 'subscription'], 'Subscriptions'],
    [['electric', 'water bill', 'internet', 'comcast', 'at&t', 'verizon', 'phone bill', 'utility', 'comed'], 'Utilities'],
    [['amazon', 'target', 'walmart', 'nordstrom', 'zara', 'h&m', 'macy', 'shopping'], 'Shopping'],
    [['doctor', 'pharmacy', 'cvs', 'walgreens', 'hospital', 'medical', 'dental', 'vision', 'health'], 'Healthcare'],
    [['gym', 'netflix', 'movie', 'concert', 'spotify', 'entertainment', 'amc'], 'Entertainment'],
    [['airline', 'hotel', 'airbnb', 'expedia', 'booking', 'travel'], 'Travel'],
    [['tuition', 'university', 'coursera', 'udemy', 'textbook', 'education'], 'Education'],
    [['401k', 'fidelity', 'vanguard', 'schwab', 'robinhood', 'investment'], 'Investments'],
    [['loan payment', 'credit card payment', 'debt', 'chase payment'], 'Debt Payments'],
  ]

  for (const [keywords, category] of rules) {
    if (keywords.some(k => text.includes(k))) {
      return { category, confidence: 0.8 }
    }
  }

  return { category: 'Other', confidence: 0.5 }
}

// Batch categorization for Plaid sync
export async function batchCategorize(
  transactions: Array<{ merchant: string; description: string; amount: number; type: 'income' | 'expense' | 'transfer' }>
): Promise<CategorizationResult[]> {
  // Process in parallel, but throttle to avoid rate limits
  const BATCH_SIZE = 10
  const results: CategorizationResult[] = []

  for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
    const batch = transactions.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(tx => categorizeTransaction(tx.merchant, tx.description, tx.amount, tx.type))
    )
    results.push(...batchResults)

    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < transactions.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return results
}
