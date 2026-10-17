import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const MOCK_CONTEXT = {
  product: 'Handcrafted premium leather bags and accessories — wallets, totes, laptop bags',
  targetCustomer: 'Urban professionals aged 28-38 who value quality craftsmanship and want premium accessories without paying luxury brand prices',
  geography: 'Pan-India',
  budget: '₹15K–₹50K/mo',
  challenge: 'awareness',
  sector: 'Fashion & Apparel',
  stage: 'just-started',
  state: 'Karnataka',
}

const MOCK_STRATEGY = {
  icp: {
    profile: 'The ideal Artisana customer is a 28-38 year old urban professional — a product manager, consultant, or entrepreneur — based in Bangalore, Mumbai, or Delhi. They earn ₹15-30L annually, dress intentionally, and are tired of seeing the same mass-produced bags on every colleague\'s desk. They want something that reflects their taste and values, not just their budget.',
    demographics: 'Age 28-38, Tier 1 cities (Bangalore, Mumbai, Delhi, Hyderabad), monthly income ₹1.2L-2.5L, employed in tech, consulting, finance, or running own business',
    psychographics: 'Values authenticity and craftsmanship, willing to pay a premium for quality, proud of supporting Indian artisans, dislikes fast fashion, researches purchases thoroughly before buying',
    painPoints: [
      'Mass-market bags wear out in 6 months but are expensive to replace',
      'Luxury imports (Coach, Michael Kors) feel overpriced for what they offer',
      'Can\'t find premium leather goods made in India at a fair price',
      'Most "handmade" brands don\'t show the actual making process — hard to trust',
    ],
    whereToFindThem: [
      'Instagram (following #leatherbags #madeinIndia #premiumaccessories #slowfashion)',
      'LinkedIn (sharing sustainability content, following conscious consumerism accounts)',
      'WhatsApp groups (professional communities, alumni networks)',
      'Reddit r/India (product recommendations and anti-fast-fashion discussions)',
    ],
  },
  positioning: {
    valueProposition: 'For urban professionals who want premium quality without the import markup, Artisana is the Indian leather goods brand that delivers handcrafted, lifetime-quality bags at honest prices — because every piece is made by our own artisans in Bangalore, with zero middlemen.',
    messagingPillars: [
      'Handcrafted in Bangalore — every stitch placed by an artisan with a name and a story',
      'Built to last 10 years, not 10 months — we stand behind every product for life',
      'Fair price, honest margin — no import duty, no brand tax, just quality',
    ],
    toneOfVoice: 'Warm, confident, and storytelling-driven. Knowledgeable about craft without being pretentious. Speaks like a founder who genuinely loves what they make, not like a marketing department.',
  },
  channels: [
    {
      name: 'Instagram',
      priority: 'primary',
      reasoning: 'Your target customer — professionals 28-38 — discovers premium products on Instagram. Leather goods and artisan crafts perform exceptionally well with Reels showing the making process, before/after durability content, and "day in the life with my bag" POV videos. This is where your category lives.',
      tactics: [
        'Reels showing the full leather cutting and stitching process (30-60 seconds)',
        '5-year durability content — before/after leather ageing shots',
        'Founder-led content: "Why I started this" and "A day at our workshop"',
        'Collab with working professional micro-influencers (20K-150K followers)',
      ],
      estimatedCAC: '₹600–1,200',
      timeToResults: '6-8 weeks',
      effort: 'high',
    },
    {
      name: 'WhatsApp',
      priority: 'secondary',
      reasoning: 'WhatsApp converts at 8-15% for premium products in India — 5x better than email. Your customers share product recommendations in professional WhatsApp groups constantly. A broadcast list of 300 warm contacts will outperform 3,000 cold Instagram followers for actual sales.',
      tactics: [
        'WhatsApp broadcast for new arrivals and limited edition drops (max 2/week)',
        'Video messages from founder showing new products — personal touch converts',
        'Easy custom order enquiry via WhatsApp chat',
        '"Share with a colleague who needs a new bag" referral via WhatsApp',
      ],
      estimatedCAC: '₹250–500',
      timeToResults: '2-3 weeks',
      effort: 'low',
    },
    {
      name: 'Email',
      priority: 'tertiary',
      reasoning: 'Email builds long-term asset value. Your repeat purchase rate will determine your business health — customers who buy a wallet often come back for a laptop bag 3-6 months later. Email is the best channel for nurturing this repeat behaviour with care guides, new collection announcements, and loyalty rewards.',
      tactics: [
        'Post-purchase leather care guide (builds trust and reduces returns)',
        'New collection announcement to existing customers first',
        '6-month check-in: "How\'s your bag holding up?" with cross-sell',
        'Annual "bring it back for conditioning" service campaign',
      ],
      estimatedCAC: '₹150–350',
      timeToResults: '3-4 months',
      effort: 'medium',
    },
  ],
  caseStudies: [
    {
      brand: 'The Postbox',
      sector: 'Leather goods / Accessories',
      strategy: 'Built entirely on Instagram storytelling — every post showed the making process, the artisans by name, and the leather sourcing. Never ran paid ads in the first year. Used WhatsApp for customer service and repeat orders.',
      result: 'Grew to ₹2Cr revenue in 18 months. 85% repeat customer rate. Average order value ₹3,800.',
      lessonForYou: 'Your biggest competitive advantage is showing what happens in your workshop. Film the artisans. Show the leather selection. Name the hands that made each piece. This content is impossible for Myntra or Amazon to replicate.',
    },
    {
      brand: 'Hidesign',
      sector: 'Leather goods / Premium accessories',
      strategy: 'Positioned as "Proudly Indian" against imported luxury brands. Led with craftsmanship and durability narrative over fashion trends. Targeted corporate gifting heavily — bulk orders from IT companies and consultancies.',
      result: '₹200Cr+ revenue. Present in 23 countries. 40% of revenue from corporate gifting.',
      lessonForYou: 'Corporate gifting is massively underexplored for premium leather goods. 10 companies ordering 50 bags each for employee rewards is equivalent to 500 individual sales — with lower CAC and higher AOV. Pitch to HR managers of 50-500 person companies in your city.',
    },
  ],
  benchmarks: {
    avgCAC: '₹600–1,400 (D2C premium accessories, India)',
    conversionRate: '1.2–2.5% (website), 8–15% (WhatsApp)',
    ltv: '₹6,000–12,000 (24 months, 2-3 purchases)',
    bestChannel: 'Instagram + WhatsApp combination drives 70% of D2C revenue in this category',
    contentFrequency: 'Instagram: 1 Reel/day + 3 Stories/day. WhatsApp: 2 broadcasts/week.',
  },
  ninetyDayPlan: {
    days1to30: 'Foundation: Set up Instagram Shop and WhatsApp Business with full catalogue. Film 10 pieces of making-process content. Post 1 Reel/day for 30 days straight. Build WhatsApp list to 150 contacts from personal network. Goal: 1,000 Instagram followers, first 15 orders, ₹45,000 revenue.',
    days31to60: 'Momentum: Reach out to 5 micro-influencers in professional/fashion space for barter collab. Run first ₹10,000 Instagram ad campaign targeting Bangalore/Mumbai professionals. Launch email newsletter with care guide. Start corporate gifting outreach to 10 local companies. Goal: 3,000 followers, 50 orders, ₹1.5L revenue.',
    days61to90: 'Scale: Double down on the content format that drove most followers in month 2. Send proposal to corporate gifting contacts — close 2 bulk deals. Launch referral programme via WhatsApp. Analyse CAC per channel and shift budget accordingly. Goal: 7,000 followers, 100+ orders/month, ₹3L+ monthly revenue.',
  },
  quickWins: [
    'Film a 60-second Reel today: place your phone against a stack of books, film your hands cutting leather in natural light. No voiceover needed — just the sound of the craft and a caption that says "Every Artisana bag starts like this." Post it. This type of content gets 10x more reach than a product flat-lay.',
    'Open WhatsApp right now and send a personal message (not broadcast) to 20 people in your network: "Hey, I just launched Artisana — handcrafted leather bags made in Bangalore. Would love your honest feedback on this [photo]. No pressure to buy — just want to know what you think." Expect 3-5 orders from this alone.',
    'Email or DM 3 HR managers at tech companies in your city this week: "We make premium leather bags in Bangalore — many companies use us for employee anniversary gifts and onboarding kits. Happy to send you one sample at no cost." Corporate gifting deals at ₹15,000-50,000 per order will change your unit economics.',
  ],
}

const MOCK_NODES = [
  { id: 'root-1', type: 'root', position: { x: 420, y: 30 }, data: { label: 'Artisana Leather — GTM Strategy', subtitle: 'D2C Premium Leather Goods · Bangalore' } },
  { id: 'icp-1', type: 'icp', position: { x: 420, y: 160 }, data: { label: 'Urban Professionals 28-38', subtitle: 'Bangalore · Mumbai · Delhi · ₹15-30L income' } },
  { id: 'channel-1', type: 'channel', position: { x: 120, y: 300 }, data: { label: 'Instagram', subtitle: 'Primary · CAC ₹600-1,200' } },
  { id: 'channel-2', type: 'channel', position: { x: 420, y: 300 }, data: { label: 'WhatsApp', subtitle: 'Secondary · CAC ₹250-500' } },
  { id: 'channel-3', type: 'channel', position: { x: 720, y: 300 }, data: { label: 'Email', subtitle: 'Tertiary · CAC ₹150-350' } },
  { id: 'tactic-1', type: 'tactic', position: { x: 0, y: 440 }, data: { label: 'Making-process Reels', subtitle: 'Cutting, stitching, crafting' } },
  { id: 'tactic-2', type: 'tactic', position: { x: 230, y: 440 }, data: { label: 'Micro-influencer Collabs', subtitle: '20K-150K professional creators' } },
  { id: 'tactic-3', type: 'tactic', position: { x: 420, y: 440 }, data: { label: 'WhatsApp Broadcasts', subtitle: 'New arrivals + limited drops' } },
  { id: 'tactic-4', type: 'tactic', position: { x: 630, y: 440 }, data: { label: 'Corporate Gifting Outreach', subtitle: 'HR managers, bulk deals' } },
  { id: 'content-1', type: 'content', position: { x: 820, y: 440 }, data: { label: 'Post-purchase Care Guide', subtitle: 'Email nurture → repeat buy' } },
  { id: 'goal-1', type: 'goal', position: { x: 420, y: 580 }, data: { label: '100 Orders/Month by Day 90', subtitle: '₹3L+ monthly revenue · 7K followers' } },
]

const MOCK_EDGES = [
  { id: 'e1', source: 'root-1', target: 'icp-1', style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1.5 } },
  { id: 'e2', source: 'icp-1', target: 'channel-1', style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1.5 } },
  { id: 'e3', source: 'icp-1', target: 'channel-2', style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1.5 } },
  { id: 'e4', source: 'icp-1', target: 'channel-3', style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1.5 } },
  { id: 'e5', source: 'channel-1', target: 'tactic-1', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e6', source: 'channel-1', target: 'tactic-2', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e7', source: 'channel-2', target: 'tactic-3', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e8', source: 'channel-2', target: 'tactic-4', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e9', source: 'channel-3', target: 'content-1', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e10', source: 'tactic-1', target: 'goal-1', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e11', source: 'tactic-3', target: 'goal-1', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
  { id: 'e12', source: 'tactic-4', target: 'goal-1', style: { stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1.5 } },
]

const MOCK_CAMPAIGNS = [
  {
    name: 'Brand Story Launch',
    channel: 'Instagram',
    goal: 'Awareness',
    week_number: 1,
    brief: 'Launch the Artisana brand on Instagram with our founding story. Show who we are, why we started, and what makes us different from every other bag brand. This is our first impression — make it count.',
    content_draft: `✋ I quit my corporate job to stitch leather bags in Bangalore.

Here's why:

Three years ago I paid ₹8,000 for a leather wallet from a "premium" brand. It started peeling in 4 months.

I went looking for something better. Made in India, by people I could talk to, with leather that would last. I couldn't find it.

So I learned to make it.

Artisana is what I built — handcrafted leather bags and accessories, made by our small team in HSR Layout, Bangalore.

No factory. No middlemen. No mass production.

Just good leather, good craft, and honest prices.

Swipe to see what our workshop looks like → 🧵

#ArtisanaLeather #MadeInBangalore #HandmadeLeather #IndianCraft #SlowFashion #LeatherBags #MadeInIndia`,
    status: 'approved',
  },
  {
    name: 'Making Process Reel',
    channel: 'Instagram',
    goal: 'Engagement',
    week_number: 2,
    brief: 'Show the full leather cutting and stitching process in a satisfying 45-60 second Reel. No voiceover — just the sounds of craft. End with the finished product. This format consistently drives 3-5x more reach than product shots.',
    content_draft: `Took 6 hours. Worth every minute. 🤎

From a single piece of full-grain leather to a bag that'll outlast your phone, your job, and probably your next relationship.

Watch how we make the Bangalore Tote →

Every cut is hand-measured. Every stitch is pulled by hand. Every edge is burnished and sealed. No shortcuts.

That's why Artisana bags get better with age — not worse.

Link in bio to see the full collection.

#LeatherCraft #HandmadeInIndia #ArtisanaLeather #LeatherWorking #SlowMade #CraftedWithCare`,
    status: 'approved',
  },
  {
    name: 'WhatsApp First Collection Drop',
    channel: 'WhatsApp',
    goal: 'First Sales',
    week_number: 2,
    brief: 'First broadcast to our WhatsApp list announcing the full collection. Keep it personal, not salesy. Include a direct link and offer free shipping for the first 20 orders to create urgency.',
    content_draft: `Hey [Name] 👋

Artisana is finally live.

After 6 months of crafting, testing, and refining — our first collection of handmade leather bags is ready.

🎒 The Bangalore Tote — ₹3,200
💼 The HSR Laptop Bag — ₹4,800
👜 The Koramangala Sling — ₹2,100
💰 Classic Bifold Wallet — ₹1,400

All made in our workshop in Bangalore. Full-grain leather. Lifetime guarantee on stitching.

First 20 orders get free shipping — no code needed.

See everything here → [link]

If you know someone who's been looking for a good leather bag, share this with them 🙏

— Rohan, Founder`,
    status: 'live',
  },
  {
    name: 'Artisan Spotlight',
    channel: 'Instagram',
    goal: 'Brand affinity',
    week_number: 3,
    brief: 'Feature Rajan, our head craftsman, in a short interview-style post. Name the hands that make the products. This builds emotional connection and is impossible for mass-market brands to replicate.',
    content_draft: `Meet Rajan. He's been working leather for 22 years. 👐

He joined Artisana 6 months ago from a factory job where he stitched 400 bags a day — same design, same stitching pattern, no variation.

Now he makes 4-6 bags a week. Every one is different.

"In the factory, I was just hands. Here, I'm the maker," he told me last week.

Every Artisana bag has his initials stamped inside. Not a brand logo — his initials.

Because the bag is his work as much as it is mine.

When you buy Artisana, you're not just buying leather. You're buying 22 years of skill from a craftsman who loves what he makes.

The Koramangala Sling that Rajan is holding — link in bio.

#MeetTheMaker #ArtisanaLeather #HandmadeIndia #CraftsPerson #EthicalFashion #IndianArtisan`,
    status: 'draft',
  },
  {
    name: 'Durability Content',
    channel: 'Instagram',
    goal: 'Trust building',
    week_number: 5,
    brief: '6-month check-in content: show how our bags age and develop patina over time. This is our strongest proof point against fast fashion competitors. Feature a customer\'s bag with their testimonial.',
    content_draft: `6 months later. Still going strong. 🤎

Priya from Mumbai has been carrying her Bangalore Tote every single day since March.

To work. To client meetings. Through monsoon season.

Here's her update: "The leather has darkened in the best way. It looks like it's mine now — broken in, personal. The stitching hasn't budged."

This is what full-grain leather does. It doesn't wear out — it wears in.

Most bags look worst after 6 months. Artisana bags look best.

Is your bag getting better with age? Show us → tag #MyArtisana

Priya's bag: The Bangalore Tote (₹3,200) — link in bio.

#LeatherPatina #AgingLeather #ArtisanaLeather #QualityOverQuantity #SlowFashion #BuyLess BuyBetter`,
    status: 'draft',
  },
  {
    name: 'Corporate Gifting Campaign',
    channel: 'Email',
    goal: 'B2B sales',
    week_number: 6,
    brief: 'Target HR managers and office managers at mid-sized companies for employee gifting. Premium leather goods are popular for work anniversaries, onboarding kits, and Diwali gifts. This is a high-AOV, low-CAC channel.',
    content_draft: `Subject: Premium leather gifts for your team — made in Bangalore

Hi [Name],

I run Artisana — we make handcrafted leather bags and accessories in Bangalore.

A lot of companies use us for employee appreciation gifts — work anniversaries, Diwali, senior promotions, onboarding kits for leadership hires.

What we offer for corporate orders:
✓ Personalised embossing (employee name or company logo)
✓ Custom packaging with your brand
✓ Minimum order: 10 pieces
✓ Volume pricing from ₹1,100/piece (wallets) to ₹4,200/piece (laptop bags)
✓ Delivery across India

We've done orders for teams at Razorpay, Swiggy, and a few law firms in Bangalore.

Happy to send you one sample piece at no cost — just tell me which product and where to ship it.

Worth a 10-minute call?

Rohan Sharma
Founder, Artisana Leather
+91 98765 43210`,
    status: 'draft',
  },
  {
    name: 'New Collection Teaser',
    channel: 'Instagram',
    goal: 'Anticipation',
    week_number: 9,
    brief: 'Tease the upcoming monsoon/winter collection with behind-the-scenes content. Build anticipation before the launch. Use a "coming soon" countdown in Stories to drive follows and DMs.',
    content_draft: `Something new is coming. 🌧️

We've been working on this one for 3 months.

A collection built for Bangalore weather — structured enough for meetings, casual enough for weekends, tough enough for monsoon.

New leathers. New silhouettes. Same craft.

Launching in 2 weeks.

Follow us + turn on notifications so you don't miss the drop.

(First 48 hours = 15% off + free shipping)

Comment "🤎" and we'll DM you when it's live.

#ArtisanaLeather #NewCollection #ComingSoon #LeatherBags #MadeInIndia #BangaloreFashion`,
    status: 'draft',
  },
  {
    name: 'Repeat Customer Offer',
    channel: 'WhatsApp',
    goal: 'Retention',
    week_number: 10,
    brief: 'Reach out to customers who bought in month 1-2 with a loyalty offer on the new collection. Personalise by mentioning what they bought before. Repeat buyer CAC is near zero — this is the highest ROI message we send.',
    content_draft: `Hey [Name] 👋

It's Rohan from Artisana.

You picked up the [Product Name] about 3 months ago — hope it's treating you well!

We're dropping a new collection in 2 weeks and wanted to give you first access before we open it up.

As a returning customer, you get:
→ 20% off (our best discount, never public)
→ First pick before it sells out
→ Free personalised embossing (your initials)

I'll send you the link as soon as it's live — just reply "yes" and I'll make sure you're first in line.

Thanks for supporting us from the beginning. It means a lot 🙏

— Rohan`,
    status: 'draft',
  },
  {
    name: 'Year-end Wrap Campaign',
    channel: 'Email',
    goal: 'Community + Sales',
    week_number: 11,
    brief: 'End-of-quarter email to full list sharing milestones, customer stories, and a gratitude offer. This builds community around the brand and drives Q4 sales with a genuine, non-pushy tone.',
    content_draft: `Subject: 90 days, 200 bags, and a lot we learned

Hi [Name],

Three months ago we launched Artisana with 8 products and no idea if anyone would buy.

Here's what happened:

→ 214 bags went to 187 customers across 22 cities
→ Our most popular product: The Bangalore Tote (sold out twice)
→ Oldest customer: 67-year-old retired professor who wanted "one last good bag"
→ Youngest: 24-year-old who bought it as his first grown-up purchase
→ Most touching: A woman who bought one for her husband's promotion gift

We're still a tiny team making bags by hand in HSR Layout.

We're not going to pretend we've figured it all out. But we're getting better every week.

As a thank you to everyone who took a chance on us early — here's 10% off anything in the new collection. Code: EARLYBELIEVER

Valid for the next 7 days.

Thank you for being here.

— Rohan & the Artisana team`,
    status: 'draft',
  },
]

const MOCK_METRICS = [
  { week: 'Week 1', channel: 'Instagram', reach: 1240, clicks: 38, conversions: 2, spend: 0 },
  { week: 'Week 2', channel: 'WhatsApp', reach: 140, clicks: 32, conversions: 6, spend: 0 },
  { week: 'Week 2', channel: 'Instagram', reach: 2180, clicks: 74, conversions: 3, spend: 3000 },
  { week: 'Week 3', channel: 'Instagram', reach: 4100, clicks: 142, conversions: 8, spend: 5000 },
  { week: 'Week 4', channel: 'WhatsApp', reach: 210, clicks: 58, conversions: 11, spend: 0 },
  { week: 'Week 4', channel: 'Email', reach: 280, clicks: 41, conversions: 4, spend: 0 },
  { week: 'Week 5', channel: 'Instagram', reach: 6800, clicks: 231, conversions: 14, spend: 8000 },
  { week: 'Week 6', channel: 'WhatsApp', reach: 320, clicks: 89, conversions: 18, spend: 0 },
]

export async function POST() {
  // This replaces the caller's real strategy, board, campaigns and metrics
  // with mock data, so it is for local and preview testing only.
  if (process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ error: 'Demo data is disabled in production.' }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tableErrors: Record<string, string> = {}

  // Clear existing data (ignore errors on missing tables)
  await supabase.from('gtm_strategies').delete().eq('user_id', user.id)
  await supabase.from('drawing_boards').delete().eq('user_id', user.id)
  await supabase.from('campaigns').delete().eq('user_id', user.id)
  await supabase.from('metrics').delete().eq('user_id', user.id)

  // Insert sequentially so partial success is possible
  const strat = await supabase.from('gtm_strategies').insert({ user_id: user.id, context: MOCK_CONTEXT, strategy: MOCK_STRATEGY })
  if (strat.error) tableErrors['gtm_strategies'] = strat.error.message

  const board = await supabase.from('drawing_boards').insert({ user_id: user.id, nodes: MOCK_NODES, edges: MOCK_EDGES })
  if (board.error) tableErrors['drawing_boards'] = board.error.message

  const campaigns = await supabase.from('campaigns').insert(MOCK_CAMPAIGNS.map(c => ({ ...c, user_id: user.id })))
  if (campaigns.error) tableErrors['campaigns'] = campaigns.error.message

  const metrics = await supabase.from('metrics').insert(MOCK_METRICS.map(m => ({ ...m, user_id: user.id })))
  if (metrics.error) tableErrors['metrics'] = metrics.error.message

  const hasErrors = Object.keys(tableErrors).length > 0
  const stratOk = !tableErrors['gtm_strategies'] && !tableErrors['campaigns']

  return NextResponse.json({
    ok: stratOk,
    tableErrors: hasErrors ? tableErrors : undefined,
    message: hasErrors
      ? `Loaded with issues. Missing tables: ${Object.keys(tableErrors).join(', ')}. Run the SQL in Supabase to fix.`
      : 'Demo data loaded successfully',
  }, { status: stratOk ? 200 : 500 })
}
