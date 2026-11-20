// [name, age, gender(w/m), city · college, bio, interests, likedMe]
const RAW = [
  ["Aanya", 24, "w", "Mumbai · St. Xavier's", "Chai over coffee, always. Will trade playlists for pani puri.", ["Indie music", "Street food", "Sketching"], 1],
  ["Rohan", 26, "m", "Delhi · IIT Delhi", "Part-time coder, full-time dog dad. Ask me about my golden retriever.", ["Dogs", "Cricket", "Coding"], 0],
  ["Meera", 23, "w", "Bengaluru · Christ University", "Bookshop wanderer. Looking for someone who reads the last page first.", ["Books", "Poetry", "Cafés"], 1],
  ["Kabir", 27, "m", "Pune · Symbiosis", "Weekend trekker, weekday spreadsheet wizard.", ["Trekking", "Photography", "Finance"], 0],
  ["Isha", 25, "w", "Jaipur · Banasthali", "Dancing in the kitchen at midnight is my cardio.", ["Dance", "Cooking", "Travel"], 0],
  ["Arjun", 28, "m", "Hyderabad · ISB", "Start-up survivor. Make a mean biryani and a better pun.", ["Cooking", "Startups", "Puns"], 1],
  ["Naina", 22, "w", "Kolkata · Presidency", "Film-school dropout turned storyteller. Rain = best weather.", ["Cinema", "Writing", "Rain walks"], 0],
  ["Vihaan", 25, "m", "Chennai · SRM", "Guitar in my room, chaos in my group chat.", ["Guitar", "Football", "Memes"], 0],
  ["Tara", 24, "w", "Goa · Goa University", "Beach sunsets and slow mornings. Surf at 6am?", ["Surfing", "Yoga", "Sunsets"], 1],
  ["Aditya", 29, "m", "Mumbai · NMIMS", "Amateur chef, professional napper.", ["Cooking", "Naps", "Board games"], 0],
  ["Zoya", 23, "w", "Lucknow · Amity", "Shayari at 2am, biryani at 2pm.", ["Poetry", "Food", "Thrifting"], 0],
  ["Dev", 26, "m", "Ahmedabad · NID", "Designer who judges fonts. Gently.", ["Design", "Typography", "Coffee"], 1],
  ["Riya", 25, "w", "Chandigarh · Panjab University", "Gym in the morning, gelato at night. Balance.", ["Fitness", "Gelato", "Travel"], 0],
  ["Samar", 27, "m", "Delhi · DU", "Stand-up open-mic regular. I'll make you laugh or leave.", ["Comedy", "Podcasts", "Chai"], 0],
  ["Pihu", 22, "w", "Pune · FLAME", "Plant mom of 14. Yes, they all have names.", ["Plants", "Baking", "K-dramas"], 1],
  ["Ishaan", 24, "m", "Bengaluru · IISc", "Telescope + terrace + you? Let's count stars.", ["Astronomy", "Chess", "Hiking"], 0],
  ["Sanya", 26, "w", "Mumbai · Jai Hind", "Vinyl collector. Currently obsessed with 80s Bollywood.", ["Vinyl", "Fashion", "Karaoke"], 0],
  ["Veer", 28, "m", "Jaipur · MNIT", "Motorbike diaries and mountain roads.", ["Biking", "Travel", "Camping"], 1],
  ["Kiara", 23, "w", "Delhi · Lady Shri Ram", "Debate champion. I'll win you over, fairly.", ["Debate", "Politics", "Brunch"], 0],
  ["Neil", 25, "m", "Goa · BITS Goa", "Sea, sand & side-projects.", ["Sailing", "Coding", "Music"], 0],
  ["Myra", 24, "w", "Hyderabad · Osmania", "Artist with paint on my sleeves. Always.", ["Painting", "Museums", "Pottery"], 1],
  ["Yash", 26, "m", "Kolkata · Jadavpur", "Fish-curry loyalist and adda enthusiast.", ["Adda", "Football", "Food"], 0],
  ["Anika", 21, "w", "Bengaluru · PES", "Freshly into running. 5K by December!", ["Running", "Podcasts", "Smoothies"], 0],
  ["Rehan", 27, "m", "Mumbai · KC College", "Street photographer. Will take your candid.", ["Photography", "Film", "Walks"], 1],
  ["Diya", 25, "w", "Chennai · Loyola", "Carnatic singer with a Taylor Swift problem.", ["Singing", "Swifties", "Filter coffee"], 0],
  ["Aarav", 24, "m", "Pune · COEP", "Robotics nerd. Romantic, in binary.", ["Robotics", "Anime", "Gaming"], 0],
  ["Sia", 23, "w", "Udaipur · MLSU", "Lake-city girl. Sunset boat rides > anything.", ["Travel", "Photography", "Journaling"], 1],
  ["Kian", 29, "m", "Delhi · Ashoka Univ.", "Philosophy over pasta. Both are better with company.", ["Philosophy", "Pasta", "Jazz"], 0],
  ["Mahi", 22, "w", "Ahmedabad · CEPT", "Architecture student, building castles in the air.", ["Architecture", "Sketching", "Street food"], 0],
  ["Reyansh", 26, "m", "Chandigarh · PEC", "Punjabi at heart, parathas on repeat.", ["Cooking", "Bhangra", "Cricket"], 0],
  ["Avni", 24, "w", "Mumbai · Mithibai", "Spontaneous road trips and mixtapes.", ["Road trips", "Mixtapes", "Cafés"], 0],
  ["Laksh", 25, "m", "Bengaluru · Christ University", "Coffee snob. Pour-over or nothing.", ["Coffee", "Cycling", "Tech"], 0],
  ["Trisha", 27, "w", "Kolkata · St. Xavier's", "Bookworm with a sweet tooth for rosogolla.", ["Books", "Sweets", "Theatre"], 0],
  ["Om", 23, "m", "Jaipur · JECRC", "Folk music, fairy lights and long walks.", ["Folk music", "Walks", "Travel"], 0],
  ["Ruhi", 26, "w", "Delhi · JNU", "Poet. Pun intended, always.", ["Poetry", "Politics", "Chai"], 0],
];

// Hand-picked, clear adult portraits (pravatar.cc, 600px) sorted by gender so photos match the profile.
const WOMEN = [5, 16, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 32, 34, 35, 36, 38, 42, 43, 44, 45, 47, 49];
const MEN = [8, 11, 12, 13, 14, 18, 51, 52, 53, 58, 59, 60, 61, 15, 62, 7, 3];
export const SEED_VERSION = 3;

export function makeProfiles() {
  let w = 0, m = 0;
  return RAW.map(([name, age, g, place, bio, interests, likedMe], i) => ({
    id: `p${String(i + 1).padStart(2, "0")}`,
    name,
    age,
    photo: `https://i.pravatar.cc/640?img=${g === "w" ? WOMEN[w++ % WOMEN.length] : MEN[m++ % MEN.length]}`,
    bio,
    place,
    city: place.split(" · ")[0],
    interests,
    likedMe: !!likedMe, // SERVER-ONLY. Never serialise to clients unless mutual.
  }));
}
