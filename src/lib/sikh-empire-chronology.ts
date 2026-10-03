// Content for /history/sikh-empire: who lived when, and what happened when.
// Edit this file to correct a date or add a person or event; the page reads
// everything from here.

export const AXIS_START = 1700;
export const AXIS_END = 1870;

/** Years the Sikh Empire stood; drawn as a shaded band on the lifespans chart. */
export const EMPIRE_YEARS: [number, number] = [1799, 1849];

export type BirthCertainty = "exact" | "approximate" | "unknown";

export type Person = {
  name: string;
  /** null when the birth year is not known. */
  birth: number | null;
  death: number;
  birthCertainty: BirthCertainty;
  role: string;
};

export type PersonGroup = { name: string; people: Person[] };

export const PERSON_GROUPS: PersonGroup[] = [
  {
    name: "Misl-era leaders",
    people: [
      { name: "Banda Singh Bahadur", birth: 1670, death: 1716, birthCertainty: "exact", role: "Led the first Sikh rule in Punjab (1710); executed in Delhi." },
      { name: "Nawab Kapur Singh", birth: 1697, death: 1753, birthCertainty: "exact", role: "Organised the Buddha Dal and Taruna Dal; leader of the Dal Khalsa before Jassa Singh Ahluwalia." },
      { name: "Jassa Singh Ahluwalia", birth: 1718, death: 1783, birthCertainty: "exact", role: "Supreme leader of the Dal Khalsa from 1748." },
      { name: "Jassa Singh Ramgarhia", birth: 1723, death: 1803, birthCertainty: "exact", role: "Founder of the Ramgarhia misl." },
      { name: "Baba Sahib Singh Bedi", birth: 1756, death: 1834, birthCertainty: "exact", role: "Descendant of Guru Nanak's family; applied the tilak at Ranjit Singh's investiture in 1801." },
    ],
  },
  {
    name: "Ranjit Singh's family and successors",
    people: [
      { name: "Maharaja Ranjit Singh", birth: 1780, death: 1839, birthCertainty: "exact", role: "Founder of the Sikh Empire (Sarkar-i-Khalsa). Born 13 Nov 1780; died 27 June 1839." },
      { name: "Sada Kaur", birth: 1762, death: 1832, birthCertainty: "approximate", role: "Head of the Kanhaiya misl, Ranjit Singh's mother-in-law and key early ally." },
      { name: "Maharaja Kharak Singh", birth: 1801, death: 1840, birthCertainty: "exact", role: "Eldest son and successor; died 5 Nov 1840." },
      { name: "Kanwar Nau Nihal Singh", birth: 1821, death: 1840, birthCertainty: "exact", role: "Kharak Singh's son; fatally injured by a falling archway on the day of his father's cremation." },
      { name: "Maharani Chand Kaur", birth: 1802, death: 1842, birthCertainty: "exact", role: "Kharak Singh's widow; claimed the regency; murdered June 1842." },
      { name: "Maharaja Sher Singh", birth: 1807, death: 1843, birthCertainty: "exact", role: "Maharaja 1841–43; assassinated 15 Sept 1843." },
      { name: "Maharani Jind Kaur (Jindan)", birth: 1817, death: 1863, birthCertainty: "exact", role: "Mother and regent of Duleep Singh; exiled by the British; escaped to Nepal in 1849." },
      { name: "Maharaja Duleep Singh", birth: 1838, death: 1893, birthCertainty: "exact", role: "Last Maharaja; proclaimed at age five in 1843, deposed 1849." },
    ],
  },
  {
    name: "Generals and statesmen of the Khalsa Darbar",
    people: [
      { name: "Akali Phula Singh", birth: 1761, death: 1823, birthCertainty: "exact", role: "Jathedar of the Akal Takht and leader of the Akalis; killed at Naushera." },
      { name: "Diwan Mohkam Chand", birth: null, death: 1814, birthCertainty: "unknown", role: "Leading general of the early conquests; victor of Haidru (1813)." },
      { name: "Misr Diwan Chand", birth: null, death: 1825, birthCertainty: "unknown", role: "Conqueror of Multan (1818) and Kashmir (1819)." },
      { name: "Fateh Singh Ahluwalia", birth: 1784, death: 1836, birthCertainty: "exact", role: "Ruler of Kapurthala; early ally who exchanged turbans with Ranjit Singh." },
      { name: "Fakir Azizuddin", birth: 1780, death: 1845, birthCertainty: "exact", role: "Foreign minister and trusted adviser." },
      { name: "Hari Singh Nalwa", birth: 1791, death: 1837, birthCertainty: "exact", role: "Commander on the north-west frontier; governor of Kashmir and Peshawar; killed at Jamrud." },
      { name: "Sham Singh Attariwala", birth: 1790, death: 1846, birthCertainty: "approximate", role: "Veteran general; died fighting at Sobraon." },
      { name: "Diwan Dina Nath", birth: 1795, death: 1857, birthCertainty: "exact", role: "Finance minister." },
      { name: "Zorawar Singh", birth: 1786, death: 1841, birthCertainty: "exact", role: "Gulab Singh's general; conquered Ladakh and Baltistan; killed in Tibet." },
      { name: "Baba Bir Singh of Naurangabad", birth: 1768, death: 1844, birthCertainty: "exact", role: "Revered saint-soldier; killed when Hira Singh's troops attacked his dera." },
      { name: "Bhai Maharaj Singh", birth: null, death: 1856, birthCertainty: "unknown", role: "Led resistance to the British in 1848–49; arrested Dec 1849; died in exile in Singapore." },
      { name: "Diwan Mulraj", birth: 1814, death: 1851, birthCertainty: "exact", role: "Governor of Multan whose revolt began the second war." },
      { name: "Sher Singh Attariwala", birth: null, death: 1858, birthCertainty: "unknown", role: "Commander of the 1848–49 rising; fought at Chillianwala and Gujrat." },
    ],
  },
  {
    name: "European officers of the Fauj-i-Khas",
    people: [
      { name: "Jean-François Allard", birth: 1785, death: 1839, birthCertainty: "exact", role: "French cavalry officer; joined 1822." },
      { name: "Jean-Baptiste Ventura", birth: 1794, death: 1858, birthCertainty: "exact", role: "Italian infantry officer; joined 1822." },
      { name: "Paolo Avitabile", birth: 1791, death: 1850, birthCertainty: "exact", role: "Italian officer; governor of Peshawar." },
      { name: "Claude Auguste Court", birth: 1793, death: 1880, birthCertainty: "exact", role: "French artillery officer." },
    ],
  },
  {
    name: "Court factions and those who played the wrong role",
    people: [
      { name: "Dhian Singh Dogra", birth: 1796, death: 1843, birthCertainty: "exact", role: "Wazir from 1828; kingmaker after 1839; assassinated 15 Sept 1843." },
      { name: "Gulab Singh Dogra", birth: 1792, death: 1857, birthCertainty: "exact", role: "Raja of Jammu from 1822; stayed out of the first war, negotiated with the British and bought Kashmir in March 1846." },
      { name: "Suchet Singh Dogra", birth: 1801, death: 1844, birthCertainty: "exact", role: "Youngest Dogra brother; killed March 1844." },
      { name: "Hira Singh Dogra", birth: 1816, death: 1844, birthCertainty: "approximate", role: "Dhian Singh's son; wazir 1843–44; killed by the army Dec 1844." },
      { name: "Jawahar Singh", birth: 1814, death: 1845, birthCertainty: "exact", role: "Jindan's brother; wazir in 1845; executed by the army panchayats." },
      { name: "Lal Singh", birth: null, death: 1866, birthCertainty: "unknown", role: "Wazir during the first war; corresponded with British officers." },
      { name: "Tej Singh", birth: 1799, death: 1862, birthCertainty: "exact", role: "Commander-in-chief in the first war; withdrew at Ferozeshah and fled Sobraon." },
    ],
  },
  {
    name: "British",
    people: [
      { name: "Charles Metcalfe", birth: 1785, death: 1846, birthCertainty: "exact", role: "Negotiated the 1809 Treaty of Amritsar." },
      { name: "Hugh Gough", birth: 1779, death: 1869, birthCertainty: "exact", role: "British commander-in-chief in both Anglo-Sikh wars." },
      { name: "Henry Hardinge", birth: 1785, death: 1856, birthCertainty: "exact", role: "Governor-General during the first war." },
      { name: "Henry Lawrence", birth: 1806, death: 1857, birthCertainty: "exact", role: "Resident at Lahore from 1846." },
      { name: "Lord Dalhousie", birth: 1812, death: 1860, birthCertainty: "exact", role: "Governor-General who annexed Punjab in 1849." },
    ],
  },
];

export type AnchorEvent = { year: number; endYear?: number; when: string; label: string };

/** Turning points drawn as vertical lines across the lifespans chart. */
export const ANCHOR_EVENTS: AnchorEvent[] = [
  { year: 1799, when: "1799", label: "Lahore taken" },
  { year: 1809, when: "1809", label: "Treaty of Amritsar" },
  { year: 1839, when: "1839", label: "Ranjit Singh dies" },
  { year: 1845, endYear: 1846, when: "1845–46", label: "First Anglo-Sikh War" },
  { year: 1849, when: "1849", label: "Annexation" },
  { year: 1857, when: "1857", label: "Uprising" },
];

export const CATEGORIES = [
  "Conquest & war",
  "Court & succession",
  "Treaty & diplomacy",
  "Betrayal & intrigue",
  "British policy",
  "Faith & institutions",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ChronologyEvent = {
  date: string;
  title: string;
  description: string;
  category: Category;
  /** Dated or interpreted differently by different historians. */
  disputed?: boolean;
};

export type Phase = { name: string; years: string; events: ChronologyEvent[] };

export const PHASES: Phase[] = [
  {
    name: "Before the empire",
    years: "1699–1799",
    events: [
      {
        date: "1699",
        title: "Creation of the Khalsa",
        description: "Guru Gobind Singh creates the Khalsa at Anandpur Sahib.",
        category: "Faith & institutions",
      },
      {
        date: "1710",
        title: "Banda Singh Bahadur takes Sirhind",
        description: "First Sikh rule is established in Punjab.",
        category: "Conquest & war",
      },
      {
        date: "1716",
        title: "Banda Singh Bahadur executed",
        description: "He and his companions are executed in Delhi; decades of persecution follow.",
        category: "Conquest & war",
      },
      {
        date: "1748",
        title: "Dal Khalsa organised",
        description: "The Sikh jathas unite at Amritsar under Jassa Singh Ahluwalia; the misls take shape. Decisions are taken by Gurmata at the Sarbat Khalsa.",
        category: "Faith & institutions",
      },
      {
        date: "1762",
        title: "Wadda Ghallughara",
        description: "Ahmad Shah Abdali's army kills many thousands of Sikhs near Kup-Rahira.",
        category: "Conquest & war",
      },
      {
        date: "1764–65",
        title: "Sirhind and Lahore taken",
        description: "The misls take Sirhind, then Lahore, and strike coin in the Gurus' name.",
        category: "Conquest & war",
      },
      {
        date: "13 Nov 1780",
        title: "Ranjit Singh born",
        description: "Born into the Sukerchakia misl, son of Maha Singh.",
        category: "Court & succession",
      },
      {
        date: "c. 1790",
        title: "Maha Singh dies",
        description: "Ranjit Singh inherits the Sukerchakia misl as a boy. Some sources give 1792.",
        category: "Court & succession",
        disputed: true,
      },
      {
        date: "1796",
        title: "Alliance with Sada Kaur",
        description: "Marriage to Mehtab Kaur brings the support of her mother, Sada Kaur of the Kanhaiya misl.",
        category: "Court & succession",
      },
      {
        date: "1797–98",
        title: "Shah Zaman's last invasions",
        description: "The Afghan king's final attempts on Punjab fail.",
        category: "Conquest & war",
      },
    ],
  },
  {
    name: "Building the empire",
    years: "1799–1809",
    events: [
      {
        date: "7 July 1799",
        title: "Lahore taken",
        description: "Ranjit Singh takes Lahore from the Bhangi sardars.",
        category: "Conquest & war",
      },
      {
        date: "12 April 1801",
        title: "Proclaimed Maharaja",
        description: "Invested on Baisakhi; Baba Sahib Singh Bedi applies the tilak. Coins are struck in the Gurus' name and the state is called Sarkar-i-Khalsa.",
        category: "Court & succession",
      },
      {
        date: "1802",
        title: "Amritsar taken",
        description: "He exchanges turbans with Fateh Singh Ahluwalia and takes Amritsar from the Bhangis. Some sources date this to 1805.",
        category: "Conquest & war",
        disputed: true,
      },
      {
        date: "1805",
        title: "Last Gurmata",
        description: "The Maratha chief Holkar flees into Punjab with the British in pursuit; the last Gurmata is held at Amritsar. Collective decision-making is not used again.",
        category: "Faith & institutions",
      },
      {
        date: "Jan 1806",
        title: "First treaty with the British",
        description: "A treaty of friendship; Holkar leaves Punjab.",
        category: "Treaty & diplomacy",
      },
      {
        date: "1806–08",
        title: "Malwa expeditions",
        description: "Three expeditions across the Sutlej alarm the chiefs of Patiala, Nabha, Jind and Kaithal, who ask the British for protection.",
        category: "Conquest & war",
      },
      {
        date: "1807",
        title: "Kasur taken",
        description: "The Pathan stronghold of Kasur is annexed.",
        category: "Conquest & war",
      },
      {
        date: "Feb 1809",
        title: "British advance to Ludhiana",
        description: "Ochterlony marches to Ludhiana and declares the cis-Sutlej states under British protection.",
        category: "British policy",
      },
      {
        date: "25 April 1809",
        title: "Treaty of Amritsar",
        description: "Negotiated by Charles Metcalfe. The British disclaim any concern north of the Sutlej; Ranjit Singh agrees not to encroach on the chiefs south of it. The Sikhs are divided into two political blocs.",
        category: "Treaty & diplomacy",
      },
    ],
  },
  {
    name: "Expansion",
    years: "1809–1839",
    events: [
      {
        date: "1809",
        title: "Kangra fort taken",
        description: "Taken after the Gurkhas are driven off.",
        category: "Conquest & war",
      },
      {
        date: "1813",
        title: "Attock and Haidru",
        description: "Attock is taken and Diwan Mohkam Chand defeats the Afghans at Haidru.",
        category: "Conquest & war",
      },
      {
        date: "1813",
        title: "Koh-i-Noor obtained",
        description: "The diamond is obtained from Shah Shuja.",
        category: "Court & succession",
      },
      {
        date: "1818",
        title: "Multan conquered",
        description: "Misr Diwan Chand takes Multan.",
        category: "Conquest & war",
      },
      {
        date: "1819",
        title: "Kashmir conquered",
        description: "Won after the battle of Shopian.",
        category: "Conquest & war",
      },
      {
        date: "1822",
        title: "Fauj-i-Khas",
        description: "Ventura and Allard join and begin drilling the army on European lines.",
        category: "Conquest & war",
      },
      {
        date: "1822",
        title: "Gulab Singh made Raja of Jammu",
        description: "The Dogra brothers' rise at court begins.",
        category: "Court & succession",
      },
      {
        date: "14 March 1823",
        title: "Battle of Naushera",
        description: "Victory over the Afghans and tribesmen; Akali Phula Singh is killed.",
        category: "Conquest & war",
      },
      {
        date: "1828",
        title: "Dhian Singh becomes wazir",
        description: "He is given the title Raja and becomes chief minister.",
        category: "Court & succession",
      },
      {
        date: "1831",
        title: "Balakot",
        description: "Sayyid Ahmad Barelvi's jihad against the Sikh state ends with his death at Balakot.",
        category: "Conquest & war",
      },
      {
        date: "Oct 1831",
        title: "Ropar meeting",
        description: "Ranjit Singh meets Governor-General Bentinck at Ropar.",
        category: "Treaty & diplomacy",
      },
      {
        date: "1834",
        title: "Peshawar annexed",
        description: "Hari Singh Nalwa brings Peshawar under direct rule.",
        category: "Conquest & war",
      },
      {
        date: "1834",
        title: "Ladakh conquered",
        description: "Zorawar Singh conquers Ladakh for Gulab Singh.",
        category: "Conquest & war",
      },
      {
        date: "1836",
        title: "Blocked in Sindh",
        description: "The British stop Ranjit Singh's move toward Shikarpur.",
        category: "British policy",
      },
      {
        date: "30 April 1837",
        title: "Battle of Jamrud",
        description: "The Afghans are repulsed but Hari Singh Nalwa is killed.",
        category: "Conquest & war",
      },
      {
        date: "June 1838",
        title: "Tripartite Treaty",
        description: "Agreement with the British and Shah Shuja over Afghanistan.",
        category: "Treaty & diplomacy",
      },
      {
        date: "6 Sept 1838",
        title: "Duleep Singh born",
        description: "The youngest son, born to Maharani Jind Kaur.",
        category: "Court & succession",
      },
      {
        date: "27 June 1839",
        title: "Maharaja Ranjit Singh dies",
        description: "He dies at Lahore; Kharak Singh succeeds.",
        category: "Court & succession",
      },
    ],
  },
  {
    name: "Collapse of the court",
    years: "1839–1845",
    events: [
      {
        date: "Oct 1839",
        title: "Chet Singh Bajwa murdered",
        description: "Kharak Singh's adviser is killed in the Maharaja's presence by Dhian Singh's party; Nau Nihal Singh takes effective control.",
        category: "Betrayal & intrigue",
      },
      {
        date: "5 Nov 1840",
        title: "Kharak Singh and Nau Nihal Singh",
        description: "Kharak Singh dies. Nau Nihal Singh is fatally injured by a falling archway on the day of the cremation. Whether this was accident or murder is disputed.",
        category: "Court & succession",
        disputed: true,
      },
      {
        date: "Jan 1841",
        title: "Sher Singh takes Lahore",
        description: "He besieges the fort, displaces Chand Kaur and becomes Maharaja.",
        category: "Court & succession",
      },
      {
        date: "Dec 1841",
        title: "Zorawar Singh killed in Tibet",
        description: "His campaign into western Tibet ends in defeat.",
        category: "Conquest & war",
      },
      {
        date: "June 1842",
        title: "Chand Kaur murdered",
        description: "She is killed by her own attendants.",
        category: "Betrayal & intrigue",
      },
      {
        date: "1843",
        title: "British annex Sindh",
        description: "The Company now surrounds Punjab on the south as well as the east.",
        category: "British policy",
      },
      {
        date: "15 Sept 1843",
        title: "Three assassinations",
        description: "The Sandhanwalia sardars kill Maharaja Sher Singh, his son Partap Singh and Dhian Singh. Hira Singh avenges his father; five-year-old Duleep Singh is proclaimed Maharaja.",
        category: "Betrayal & intrigue",
      },
      {
        date: "March 1844",
        title: "Suchet Singh killed",
        description: "He is killed challenging his nephew Hira Singh.",
        category: "Betrayal & intrigue",
      },
      {
        date: "May 1844",
        title: "Attack on Baba Bir Singh's dera",
        description: "Hira Singh's troops attack the dera at Naurangabad; Baba Bir Singh, Kanwar Kashmira Singh and Attar Singh Sandhanwalia are killed.",
        category: "Betrayal & intrigue",
      },
      {
        date: "Dec 1844",
        title: "Hira Singh and Pandit Jalla killed",
        description: "The army turns on the wazir and his adviser.",
        category: "Court & succession",
      },
      {
        date: "21 Sept 1845",
        title: "Jawahar Singh executed",
        description: "The army panchayats execute the wazir. Lal Singh becomes wazir and Tej Singh commander-in-chief.",
        category: "Court & succession",
      },
    ],
  },
  {
    name: "First Anglo-Sikh War",
    years: "1845–1846",
    events: [
      {
        date: "1838–45",
        title: "British build-up on the Sutlej",
        description: "British troops on the frontier are greatly increased and bridging boats are collected at Ferozepur.",
        category: "British policy",
      },
      {
        date: "11 Dec 1845",
        title: "Army crosses the Sutlej",
        description: "The Khalsa army crosses; Hardinge declares war on 13 December.",
        category: "Conquest & war",
      },
      {
        date: "18 Dec 1845",
        title: "Battle of Mudki",
        description: "A hard-fought first engagement.",
        category: "Conquest & war",
      },
      {
        date: "21–22 Dec 1845",
        title: "Battle of Ferozeshah",
        description: "The British come close to defeat; Tej Singh arrives with a fresh army and withdraws.",
        category: "Betrayal & intrigue",
      },
      {
        date: "28 Jan 1846",
        title: "Battle of Aliwal",
        description: "British victory under Harry Smith.",
        category: "Conquest & war",
      },
      {
        date: "10 Feb 1846",
        title: "Battle of Sobraon",
        description: "Tej Singh flees and the bridge of boats is wrecked behind the army. Sham Singh Attariwala dies fighting.",
        category: "Betrayal & intrigue",
      },
      {
        date: "9 March 1846",
        title: "Treaty of Lahore",
        description: "The Jalandhar Doab is ceded, an indemnity of 1.5 crore is imposed and the army is cut down.",
        category: "Treaty & diplomacy",
      },
      {
        date: "16 March 1846",
        title: "Kashmir sold to Gulab Singh",
        description: "By a second Treaty of Amritsar the British transfer Kashmir to Gulab Singh for 75 lakh.",
        category: "Treaty & diplomacy",
      },
      {
        date: "16 Dec 1846",
        title: "Treaty of Bhyrowal",
        description: "A British Resident, Henry Lawrence, governs through a Council of Regency during Duleep Singh's minority.",
        category: "British policy",
      },
    ],
  },
  {
    name: "Second war and annexation",
    years: "1847–1850",
    events: [
      {
        date: "Aug 1847",
        title: "Maharani Jindan removed",
        description: "She is separated from Duleep Singh and exiled from Punjab in 1848.",
        category: "British policy",
      },
      {
        date: "April 1848",
        title: "Revolt at Multan",
        description: "Two British officers are killed and Diwan Mulraj's revolt begins.",
        category: "Conquest & war",
      },
      {
        date: "Sept 1848",
        title: "National rising",
        description: "Sher Singh Attariwala joins the revolt; Bhai Maharaj Singh rallies support.",
        category: "Conquest & war",
      },
      {
        date: "22 Nov 1848",
        title: "Battle of Ramnagar",
        description: "An indecisive opening action.",
        category: "Conquest & war",
      },
      {
        date: "13 Jan 1849",
        title: "Battle of Chillianwala",
        description: "The British suffer very heavy losses.",
        category: "Conquest & war",
      },
      {
        date: "21 Feb 1849",
        title: "Battle of Gujrat",
        description: "The decisive British victory.",
        category: "Conquest & war",
      },
      {
        date: "14 March 1849",
        title: "Surrender at Rawalpindi",
        description: "The Khalsa army lays down its arms.",
        category: "Conquest & war",
      },
      {
        date: "29 March 1849",
        title: "Punjab annexed",
        description: "Dalhousie annexes Punjab; Duleep Singh is deposed and the Koh-i-Noor is surrendered.",
        category: "British policy",
      },
      {
        date: "Dec 1849",
        title: "Bhai Maharaj Singh arrested",
        description: "He is deported to Singapore, where he dies in 1856.",
        category: "British policy",
      },
      {
        date: "1850",
        title: "Koh-i-Noor presented to Queen Victoria",
        description: "The diamond leaves Punjab for England.",
        category: "British policy",
      },
    ],
  },
  {
    name: "Afterword",
    years: "",
    events: [
      {
        date: "1857",
        title: "The uprising of 1857",
        description: "Called the Sepoy Mutiny by the British and the \"First War of Independence\" by later nationalists. Punjab stays largely quiet and the cis-Sutlej Sikh states side with the British. Dr. Ganda Singh argued it was not a planned national war and that the charge of Sikh betrayal is unfounded.",
        category: "British policy",
      },
    ],
  },
];

/** "1780–1839", "c. 1762–1832", or "b. ? – 1814" when the birth year is not known. */
export function formatLifeYears(person: Person): string {
  if (person.birthCertainty === "unknown" || person.birth === null) {
    return `b. ? – ${person.death}`;
  }
  const prefix = person.birthCertainty === "approximate" ? "c. " : "";
  return `${prefix}${person.birth}–${person.death}`;
}
