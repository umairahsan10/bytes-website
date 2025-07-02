export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content: string;
}

// TODO: Replace with real data fetching (e.g. CMS or database)
export function getBlogs(): BlogPost[] {
  const placeholderImages = [
    "/assets/hero.jpg",
    "/assets/business-tools.jpg",
    "/assets/ai-intelligence.jpg",
    "/assets/bytebot-ai.jpg",
    "/assets/ecommerce.jpg",
    "/assets/security.jpg",
    "/assets/data&analytics.jpg",
    "/assets/communication-hub.jpg",
  ];

  const customExcerpts: string[] = [
    "Discover how counterbalanced putters improve stability and consistency on the greens for golfers of all skill levels.",
    "A deep dive into the cutting-edge GCQuad launch monitor—how it works and why it's the gold standard for swing analysis.",
    "Everything you need to know about Uniflex shafts and whether they're the right fit for your playing style.",
    "Step-by-step instructions and pro tips for safely shortening a graphite golf shaft without compromising performance.",
    "Proven drills and training aids to unlock greater swing speed and add yards to every drive.",
    "Understand golf ball compression and pick the perfect ball for your swing speed and feel preferences.",
    "Break down the anatomy of a putter to learn how head shape, weight, and inserts influence roll.",
    "Choosing the right golf glove: materials, sizing tips, and care instructions for lasting grip.",
    "Exploring the benefits of custom club fitting and how it can shave strokes off your handicap.",
    "The role of shaft flex in shot trajectory and how to select the ideal flex for your tempo.",
    "An introduction to launch-angle optimization for maximizing driver distance and carry.",
    "How groove design on wedges affects spin rates and greenside control.",
    "Fairway woods vs hybrids: decide which club belongs in your long-game arsenal.",
    "Top mental game strategies to stay focused under tournament pressure.",
    "The science behind premium golf grips and when you should re-grip your clubs.",
    "Speed training 101: resistance bands, overspeed sticks, and tempo drills explained.",
    "Breaking down MOI (Moment of Inertia) and why forgiveness matters off the tee.",
    "Essential warm-up stretches to prevent injury and improve swing consistency.",
    "How altitude and temperature influence golf ball flight and club selection.",
    "Course-management tactics to lower your score without changing your swing.",
    "Understanding bounce on wedges and how to pick the right grind for your turf conditions.",
    "Key putting drills to dial in distance control and eliminate three-putts.",
    "Latest advancements in golf rangefinder technology and accuracy comparisons.",
    "DIY club maintenance: cleaning grooves, checking loft/lie angles, and more.",
    "How shaft torque impacts feel and shot dispersion for different swing tempos.",
    "The benefits of playing a one-length iron set and who should consider the switch.",
    "Green reading basics: slopes, grain, and using your feet to feel break.",
    "Understanding COR and CT measurements in driver faces for distance maximization.",
    "Best on-course nutrition strategies to maintain energy through 18 holes.",
    "All about swing plane: drills to keep your club on-plane for consistent ball-striking.",
    "How adjustable driver hosels change loft, face angle, and shot shape.",
    "Choosing the perfect golf shoe: traction types, waterproofing, and fit tips.",
    "The history of golf ball dimples and their aerodynamic importance.",
    "Building an effective practice routine that balances short game, long game, and fitness.",
    "Laser vs GPS: which distance-measuring device suits your playing style?",
    "The impact of swing weight on club feel and how to fine-tune it.",
    "How to create and use yardage books like the pros for strategic play.",
    "Eco-friendly golf gear: sustainable balls, tees, and apparel hitting the market.",
    "Intro to shot shaping: learn to hit controlled fades and draws on command.",
    "Clubhead materials: titanium, carbon fiber, and steel—benefits and trade-offs.",
    "Winter golf tips: staying warm, adjusting yardages, and preserving feel in cold weather.",
  ];

  return Array.from({ length: 40 }, (_, idx) => {
    const id = idx + 1;
    const title = `Blog Post ${id}`;
    return {
      id,
      slug: `blog-${id}`,
      title,
      excerpt:
        idx < customExcerpts.length
          ? customExcerpts[idx]
          : "This is a short description placeholder for the blog post. Replace with actual excerpt.",
      image: placeholderImages[idx % placeholderImages.length],
      date: new Date(Date.UTC(2024, 0, id)).toISOString(),
      content:
        "Full content for " + title + ". Replace with actual markdown or rich text from CMS.",
    };
  });
} 