export interface ContentSlotTemplate {
  week: number
  channel: string
  type: string
  title: string
  description: string
}

export interface ContextField {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'textarea'
}

export interface PlayTemplate {
  id: string
  name: string
  tagline: string
  objective: string
  channels: string[]
  duration_weeks: number
  ideal_for: string
  context_fields: ContextField[]
  content_slots: ContentSlotTemplate[]
  target_metric: string
}

export const PLAY_TEMPLATES: PlayTemplate[] = [
  {
    id: 'brand-launch',
    name: 'Brand Launch',
    tagline: 'Go from zero to known',
    objective: 'Build awareness from scratch across channels with a consistent brand story',
    channels: ['Instagram', 'WhatsApp', 'Email'],
    duration_weeks: 4,
    ideal_for: 'New businesses, rebrands, entering a new market',
    target_metric: 'Reach & Followers',
    context_fields: [
      { key: 'brand_story', label: 'Your brand story (1–2 lines)', placeholder: 'What you do and why you do it', type: 'textarea' },
      { key: 'hero_offer', label: 'Launch offer or hook', placeholder: 'e.g. 20% off for the first 50 customers', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Origin story post', description: 'Who you are and why you started' },
      { week: 1, channel: 'Instagram', type: 'Story', title: 'We are live announcement', description: 'Behind the scenes on launch day' },
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: 'Launch announcement', description: 'Personal message to your contacts' },
      { week: 2, channel: 'Instagram', type: 'Post', title: 'What problem do you solve', description: 'Pain-point focused post for your ICP' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Show the product/service in action', description: 'Demo or transformation video' },
      { week: 2, channel: 'Email', type: 'Email', title: 'Welcome email + launch offer', description: 'First email to your list with an exclusive deal' },
      { week: 3, channel: 'Instagram', type: 'Post', title: 'First customer story', description: 'Early customer reaction or testimonial' },
      { week: 3, channel: 'WhatsApp', type: 'Broadcast', title: 'Offer reminder', description: 'Last few days to claim launch offer' },
      { week: 4, channel: 'Instagram', type: 'Post', title: 'Month 1 milestone', description: 'Share what you have achieved — customers, orders, etc.' },
      { week: 4, channel: 'Email', type: 'Email', title: 'Thank you + what is next', description: 'Gratitude email with a sneak peek' },
    ],
  },
  {
    id: 'new-product-drop',
    name: 'New Product Drop',
    tagline: 'Build anticipation, then convert',
    objective: 'Generate buzz and drive sales for a new product or service',
    channels: ['Instagram', 'WhatsApp'],
    duration_weeks: 3,
    ideal_for: 'Launching a new SKU, service tier, or product line',
    target_metric: 'Sales & Conversions',
    context_fields: [
      { key: 'product_name', label: 'New product name', placeholder: 'e.g. The Premium Leather Tote', type: 'text' },
      { key: 'key_benefit', label: 'Key benefit in one line', placeholder: 'What makes it special or different', type: 'text' },
      { key: 'launch_date', label: 'Drop date', placeholder: 'e.g. 15 April 2025', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Story', title: 'Teaser — something is coming', description: 'Blurred/partial reveal to spark curiosity' },
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Countdown post', description: 'Official reveal countdown with date' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Full product reveal', description: 'Showcase every angle, feature, and benefit' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Early access to your list', description: 'Give WhatsApp subscribers first dibs' },
      { week: 2, channel: 'Instagram', type: 'Story', title: 'FAQ — answer questions', description: 'Use polls/questions stickers to engage' },
      { week: 3, channel: 'Instagram', type: 'Post', title: 'Social proof drop', description: 'First customer reviews or unboxing content' },
      { week: 3, channel: 'WhatsApp', type: 'Broadcast', title: 'Last chance / scarcity message', description: 'Low stock or ending soon nudge' },
    ],
  },
  {
    id: 'festival-season',
    name: 'Festival Season',
    tagline: 'Ride the seasonal buying wave',
    objective: 'Capitalise on festival shopping intent with timely, relevant campaigns',
    channels: ['Instagram', 'WhatsApp', 'Email'],
    duration_weeks: 3,
    ideal_for: 'Diwali, Eid, Christmas, Holi, Onam, New Year — any peak season',
    target_metric: 'Revenue during season',
    context_fields: [
      { key: 'festival_name', label: 'Festival / occasion', placeholder: 'e.g. Diwali 2025', type: 'text' },
      { key: 'offer', label: 'Festival offer', placeholder: 'e.g. Flat 30% off + free gift wrapping', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Festival mood warmup', description: 'Celebratory, on-theme content building the mood' },
      { week: 1, channel: 'Email', type: 'Email', title: 'Early access sale email', description: 'Email your list before the public announcement' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Offer announcement reel', description: 'High-energy video announcing the deal' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Festival offer message', description: 'Personalised message with direct link to shop' },
      { week: 2, channel: 'Instagram', type: 'Story', title: 'Gift guide story series', description: '3–5 slides showing gifting options for different people' },
      { week: 3, channel: 'Instagram', type: 'Post', title: 'Last day push', description: 'Urgency post — offer ends at midnight' },
      { week: 3, channel: 'WhatsApp', type: 'Broadcast', title: 'Festival greetings + recap', description: 'Warm wishes + thank you for shopping with us' },
    ],
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    tagline: 'Short burst, high conversion',
    objective: 'Drive immediate purchases with a time-limited deal',
    channels: ['WhatsApp', 'Instagram', 'Email'],
    duration_weeks: 1,
    ideal_for: 'Inventory clearance, slow periods, quick revenue boost',
    target_metric: 'Units sold / Revenue',
    context_fields: [
      { key: 'discount', label: 'Sale offer', placeholder: 'e.g. 40% off everything, 24 hours only', type: 'text' },
      { key: 'sale_duration', label: 'Sale window', placeholder: 'e.g. Saturday 10am – Sunday 10pm', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Story', title: 'Pre-sale hype — save the date', description: '24 hours before: "something big tomorrow"' },
      { week: 1, channel: 'Email', type: 'Email', title: 'Flash sale goes live', description: 'Email as soon as sale opens, with link' },
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: 'Flash sale launch broadcast', description: 'Urgent, conversational message to your list' },
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Sale live post', description: 'Bold visual with discount and link in bio' },
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: '6 hours left reminder', description: 'Final nudge with countdown' },
    ],
  },
  {
    id: 'behind-the-brand',
    name: 'Behind the Brand',
    tagline: 'Build trust by showing the real you',
    objective: 'Increase brand affinity and follower engagement through authentic storytelling',
    channels: ['Instagram'],
    duration_weeks: 4,
    ideal_for: 'Building a loyal community, D2C brands, founder-led businesses',
    target_metric: 'Engagement rate & Saves',
    context_fields: [
      { key: 'founder_name', label: 'Founder / team name', placeholder: 'e.g. Priya and her team of 3', type: 'text' },
      { key: 'brand_values', label: 'Top 2 brand values', placeholder: 'e.g. sustainability, handmade quality', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Meet the founder', description: 'Personal intro, why you started, your face on the page' },
      { week: 1, channel: 'Instagram', type: 'Reel', title: 'A day in my business', description: 'Morning to evening BTS walkthrough' },
      { week: 2, channel: 'Instagram', type: 'Post', title: 'How your product is made', description: 'Process, craft, or sourcing story' },
      { week: 2, channel: 'Instagram', type: 'Story', title: 'This week at the workshop/office', description: 'Raw, unfiltered daily snippets' },
      { week: 3, channel: 'Instagram', type: 'Reel', title: 'Mistakes I made starting out', description: 'Vulnerable, relatable founder story' },
      { week: 3, channel: 'Instagram', type: 'Post', title: 'Our values in action', description: 'Show your brand values in a real scenario' },
      { week: 4, channel: 'Instagram', type: 'Post', title: 'Thank you to our community', description: 'Milestone celebration or gratitude post' },
      { week: 4, channel: 'Instagram', type: 'Reel', title: 'What is next for us', description: 'Tease upcoming products or plans' },
    ],
  },
  {
    id: 'influencer-collab',
    name: 'Influencer Collab',
    tagline: 'Borrow audience, build credibility',
    objective: 'Drive reach and sales through influencer or creator partnerships',
    channels: ['Instagram', 'WhatsApp'],
    duration_weeks: 3,
    ideal_for: 'Growing beyond your existing audience, social proof at scale',
    target_metric: 'Reach & New followers',
    context_fields: [
      { key: 'influencer_type', label: 'Type of influencer', placeholder: 'e.g. Micro influencer, 10k-50k followers, lifestyle/food niche', type: 'text' },
      { key: 'collab_offer', label: 'What you offer the influencer', placeholder: 'e.g. Free products + 10% commission on sales', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Story', title: 'Announce the collab', description: 'Introduce the creator/influencer to your audience' },
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Influencer feature post', description: 'Joint post introducing the partnership' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Influencer review/unboxing reel', description: 'Creator shares genuine first-time experience' },
      { week: 2, channel: 'Instagram', type: 'Story', title: 'Influencer takeover stories', description: '24-hour story takeover by the creator' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Collab discount code', description: 'Exclusive code tied to the influencer' },
      { week: 3, channel: 'Instagram', type: 'Post', title: 'Results & social proof roundup', description: 'Share engagement, reactions, order screenshots' },
    ],
  },
  {
    id: 'customer-reactivation',
    name: 'Customer Reactivation',
    tagline: 'Win back your silent customers',
    objective: 'Re-engage customers who have not bought in 60+ days',
    channels: ['WhatsApp', 'Email'],
    duration_weeks: 2,
    ideal_for: 'Businesses with an existing customer base that has gone quiet',
    target_metric: 'Repeat purchases',
    context_fields: [
      { key: 'inactive_period', label: 'How long since they bought', placeholder: 'e.g. 2–3 months ago', type: 'text' },
      { key: 'win_back_offer', label: 'Win-back offer', placeholder: 'e.g. 15% off with code COMEBACK', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Email', type: 'Email', title: '"We miss you" email', description: 'Warm, personal re-engagement email with a reason to return' },
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: 'Check-in message', description: 'Casual, non-pushy message asking how they are doing' },
      { week: 2, channel: 'Email', type: 'Email', title: 'Win-back offer', description: 'Time-limited discount specifically for lapsed customers' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Final nudge', description: 'Offer expires soon — last reminder' },
    ],
  },
  {
    id: 'corporate-gifting',
    name: 'Corporate Gifting',
    tagline: 'Unlock B2B bulk orders',
    objective: 'Target corporate buyers for bulk gifting orders — Diwali, employee gifts, client gifts',
    channels: ['Email', 'WhatsApp'],
    duration_weeks: 3,
    ideal_for: 'D2C brands, food businesses, craft businesses with bulk capacity',
    target_metric: 'B2B leads & Bulk orders',
    context_fields: [
      { key: 'min_order', label: 'Minimum bulk order quantity', placeholder: 'e.g. Minimum 25 pieces', type: 'text' },
      { key: 'gifting_season', label: 'Target gifting occasion', placeholder: 'e.g. Diwali corporate gifts', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Email', type: 'Email', title: 'Corporate gifting pitch email', description: 'Cold/warm email to HR and admin contacts' },
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: 'Bulk order enquiry prompt', description: 'Reach out to known business contacts' },
      { week: 2, channel: 'Email', type: 'Email', title: 'Gifting catalogue email', description: 'Share a PDF or link with options, pricing, customisation' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Follow-up with social proof', description: 'Share past corporate gifting examples' },
      { week: 3, channel: 'Email', type: 'Email', title: 'Closing email — book before it is too late', description: 'Production lead time urgency + last order date' },
    ],
  },
  {
    id: 'referral-programme',
    name: 'Referral Programme',
    tagline: 'Turn your customers into your sales team',
    objective: 'Launch a structured referral programme that acquires new customers through word of mouth',
    channels: ['WhatsApp', 'Email'],
    duration_weeks: 4,
    ideal_for: 'Businesses with satisfied customers, subscription or repeat-purchase models',
    target_metric: 'New customers from referral',
    context_fields: [
      { key: 'referrer_reward', label: 'Reward for referrer', placeholder: 'e.g. ₹200 store credit for each referral', type: 'text' },
      { key: 'referee_reward', label: 'Reward for new customer', placeholder: 'e.g. 15% off their first order', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Email', type: 'Email', title: 'Referral programme launch email', description: 'Explain the programme, how to participate, what they earn' },
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: 'Referral launch announcement', description: 'Short, punchy message with the referral mechanic' },
      { week: 2, channel: 'Instagram', type: 'Post', title: 'Share your referral link post', description: 'Encourage public sharing of referral link' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Mid-campaign reminder', description: 'Update on how many referrals have happened so far' },
      { week: 3, channel: 'Email', type: 'Email', title: 'Referral leaderboard or stats', description: 'Show top referrers, create social competition' },
      { week: 4, channel: 'WhatsApp', type: 'Broadcast', title: 'Programme closing reminder', description: 'Last chance to refer before the offer ends' },
    ],
  },
  {
    id: 'whatsapp-list-builder',
    name: 'WhatsApp List Builder',
    tagline: 'Build your most powerful owned channel',
    objective: 'Grow your WhatsApp subscriber list rapidly through Instagram-driven lead magnets',
    channels: ['Instagram', 'WhatsApp'],
    duration_weeks: 3,
    ideal_for: 'Any business looking to build a high-conversion owned audience',
    target_metric: 'WhatsApp subscribers added',
    context_fields: [
      { key: 'lead_magnet', label: 'Lead magnet offer', placeholder: 'e.g. Free sizing guide, exclusive discount, first access to drops', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Introduce the WhatsApp community', description: 'What subscribers get that Instagram followers do not' },
      { week: 1, channel: 'Instagram', type: 'Story', title: 'Join our WhatsApp — DM for link', description: 'Story with link sticker or DM to get the invite' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Lead magnet showcase reel', description: 'Show the freebie/benefit they get for joining' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: 'Welcome message to new subscribers', description: 'What to expect, how often you will message' },
      { week: 3, channel: 'Instagram', type: 'Story', title: 'Social proof — X people already joined', description: 'Show subscriber count or community milestone' },
      { week: 3, channel: 'WhatsApp', type: 'Broadcast', title: 'Exclusive content drop for list subscribers', description: 'Deliver on the promise — exclusive content or discount' },
    ],
  },
  {
    id: 'content-authority',
    name: 'Content Authority',
    tagline: 'Become the go-to expert in your niche',
    objective: 'Build thought leadership and organic reach through educational content',
    channels: ['Instagram'],
    duration_weeks: 6,
    ideal_for: 'Service businesses, coaches, consultants, expert-led brands',
    target_metric: 'Followers, saves & inbound enquiries',
    context_fields: [
      { key: 'expertise_topic', label: 'Your area of expertise', placeholder: 'e.g. Financial planning for freelancers', type: 'text' },
      { key: 'content_format', label: 'Preferred content format', placeholder: 'e.g. Carousels, short reels, talking head videos', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Authority intro carousel', description: '"I help [ICP] achieve [outcome] — here is how"' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Mistake most people make in your niche', description: 'High-value, shareable insight that establishes expertise' },
      { week: 2, channel: 'Instagram', type: 'Post', title: 'Quick tip carousel — 5 things to know', description: 'Practical, saveable list content' },
      { week: 3, channel: 'Instagram', type: 'Reel', title: 'Myth vs reality', description: 'Debunk a common misconception in your industry' },
      { week: 4, channel: 'Instagram', type: 'Post', title: 'Case study or transformation story', description: 'Client result or before/after narrative' },
      { week: 4, channel: 'Instagram', type: 'Reel', title: 'Day in the life of an expert', description: 'How you actually work — builds trust' },
      { week: 5, channel: 'Instagram', type: 'Post', title: 'Top 3 tools / resources I recommend', description: 'Helpful, saves-worthy content' },
      { week: 6, channel: 'Instagram', type: 'Reel', title: 'What I wish I knew when starting', description: 'Vulnerable, widely shareable content' },
      { week: 6, channel: 'Instagram', type: 'Post', title: 'CTA post — work with me / book a call', description: 'Direct conversion ask after 6 weeks of value' },
    ],
  },
  {
    id: 'social-proof-sprint',
    name: 'Social Proof Sprint',
    tagline: 'Let your customers sell for you',
    objective: 'Amplify reviews, testimonials and user-generated content to convert fence-sitters',
    channels: ['Instagram', 'WhatsApp'],
    duration_weeks: 2,
    ideal_for: 'Businesses with happy customers who have not yet shared reviews',
    target_metric: 'Reviews collected & Conversions from proof',
    context_fields: [
      { key: 'review_incentive', label: 'Review incentive (optional)', placeholder: 'e.g. 10% off next order for leaving a review', type: 'text' },
    ],
    content_slots: [
      { week: 1, channel: 'WhatsApp', type: 'Broadcast', title: 'Review request to past customers', description: 'Warm ask for a Google/Instagram review or testimonial' },
      { week: 1, channel: 'Instagram', type: 'Post', title: 'Customer story spotlight', description: 'Feature a real customer and their experience' },
      { week: 1, channel: 'Instagram', type: 'Story', title: 'Before and after / results story', description: 'Show transformation or outcome from using your product' },
      { week: 2, channel: 'Instagram', type: 'Post', title: 'Review compilation post', description: 'Collage or carousel of top reviews' },
      { week: 2, channel: 'WhatsApp', type: 'Broadcast', title: '"Others love it — join them" message', description: 'Social proof message with link to shop or book' },
      { week: 2, channel: 'Instagram', type: 'Reel', title: 'Customer unboxing or reaction reel', description: 'Real reaction video — powerful conversion content' },
    ],
  },
]

export function getPlayById(id: string): PlayTemplate | undefined {
  return PLAY_TEMPLATES.find(p => p.id === id)
}
