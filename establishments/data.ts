export type Establishment={name:string;category:string;address:string;facebook?:string;slug:string;town:string;hours?:Record<string,string>;onlinePayment?:boolean;wifi?:boolean};
export const slugify=(name:string)=>name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const records:Establishment[]=[
  {
    "name": "Tambayan sa Curba",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "San Miguel, Boac, Philippines, 4901",
    "slug": "tambayan-sa-curba",
    "facebook": "https://web.facebook.com/profile.php?id=100066814575503",
    "hours": {
      "Monday": "9:00 AM – 8:00 PM",
      "Tuesday": "9:00 AM – 8:00 PM",
      "Wednesday": "9:00 AM – 8:00 PM",
      "Thursday": "9:00 AM – 8:00 PM",
      "Friday": "9:00 AM – 8:00 PM",
      "Saturday": "9:00 AM – 9:00 PM"
    }
  },
  {
    "name": "R&R Bistro",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "50 Damian Reyes Murallon, Boac, Philippines, 4900",
    "slug": "randr-bistro",
    "facebook": "https://web.facebook.com/profile.php?id=61581422643197",
    "hours": {
      "Monday": "11:00 AM – 10:00 PM",
      "Tuesday": "11:00 AM – 10:00 PM",
      "Wednesday": "11:00 AM – 10:00 PM",
      "Thursday": "11:00 AM – 10:00 PM",
      "Friday": "11:00 AM – 10:00 PM",
      "Saturday": "11:00 AM – 10:00 PM",
      "Sunday": "11:00 AM – 10:00 PM"
    }
  },
  {
    "name": "Cafe Ma'mita (Boac Hotel)",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Gov Reyes St, San Miguel, Boac, Philippines, 4900",
    "slug": "cafe-ma-mita-boac-hotel",
    "facebook": "https://web.facebook.com/cafemamita"
  },
  {
    "name": "Lucky Foodhaus",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Malusak Boac, Boac, Philippines, 4900",
    "slug": "lucky-foodhaus",
    "facebook": "https://web.facebook.com/luckyfoodhaus",
    "hours": {
      "Monday": "10:00 AM – 8:00 PM",
      "Tuesday": "10:00 AM – 8:00 PM",
      "Wednesday": "10:00 AM – 8:00 PM",
      "Thursday": "10:00 AM – 8:00 PM",
      "Friday": "10:00 AM – 8:00 PM",
      "Saturday": "10:00 AM – 8:00 PM",
      "Sunday": "10:00 AM – 8:00 PM"
    }
  },
  {
    "name": "Golden Island",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Deogracias St., Barangay Malusak, Boac, Marinduque",
    "slug": "golden-island",
    "facebook": "https://web.facebook.com/profile.php?id=61578192281627"
  },
  {
    "name": "Goodchow",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Lardizabal Street 4900 Boac",
    "slug": "goodchow",
    "facebook": "https://web.facebook.com/goodchowfoodexpress",
    "hours": {
      "Monday": "7:00 AM – 8:00 PM",
      "Tuesday": "7:00 AM – 8:00 PM",
      "Wednesday": "7:00 AM – 8:00 PM",
      "Thursday": "7:00 AM – 8:00 PM",
      "Friday": "7:00 AM – 8:00 PM",
      "Saturday": "7:00 AM – 8:00 PM",
      "Sunday": "7:00 AM – 8:00 PM"
    }
  },
  {
    "name": "T-Spot Tea Shop",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Lardizabal Street 4900 Boac",
    "slug": "t-spot-tea-shop",
    "facebook": "https://web.facebook.com/tspotteashop",
    "hours": {
      "Monday": "10:00 AM – 6:00 PM",
      "Tuesday": "10:00 AM – 6:00 PM",
      "Wednesday": "10:00 AM – 6:00 PM",
      "Thursday": "10:00 AM – 6:00 PM",
      "Friday": "10:00 AM – 6:00 PM",
      "Saturday": "10:00 AM – 6:00 PM",
      "Sunday": "10:00 AM – 6:00 PM"
    }
  },
  {
    "name": "Kusina sa Plaza",
    "category": "Cafeteria",
    "town": "Boac",
    "address": "Mercader Street 4900 Marinduque Island Mimaropa",
    "slug": "kusina-sa-plaza"
  },
  {
    "name": "Chinggay's",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Nepomuceno Corner, Lardizabal Street, Boac, Philippines",
    "slug": "chinggay-s",
    "facebook": "https://web.facebook.com/chinggayscafe",
    "hours": {
      "Monday": "10:00 AM – 8:00 PM",
      "Tuesday": "10:00 AM – 8:00 PM",
      "Wednesday": "10:00 AM – 8:00 PM",
      "Thursday": "10:00 AM – 8:00 PM",
      "Friday": "10:00 AM – 8:00 PM",
      "Saturday": "10:00 AM – 8:00 PM",
      "Sunday": "10:00 AM – 8:00 PM"
    }
  },
  {
    "name": "Sa Bundok Cafe",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Santol, Boac, Marinduque",
    "slug": "sa-bundok-cafe",
    "facebook": "https://web.facebook.com/profile.php?id=61579830893967",
    "hours": {
      "Monday": "10:30 AM – 9:30 PM",
      "Tuesday": "10:30 AM – 9:30 PM",
      "Wednesday": "10:30 AM – 9:30 PM",
      "Thursday": "10:30 AM – 9:30 PM",
      "Friday": "10:30 AM – 9:30 PM",
      "Saturday": "10:30 AM – 9:30 PM",
      "Sunday": "10:30 AM – 9:30 PM"
    }
  },
  {
    "name": "La Concha Annex Restaurant",
    "category": "Cafeteria",
    "town": "Boac",
    "address": "Del Mundo Street, Boac, Philippines",
    "slug": "la-concha-annex-restaurant"
  },
  {
    "name": "Casa de Don Emilio",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Mercader Street 4900 Marinduque Island Mimaropa",
    "slug": "casa-de-don-emilio",
    "facebook": "https://web.facebook.com/CasaDeDonEmilio"
  },
  {
    "name": "Blossoms and Brews",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Deogracias St., Barangay Malusak, Boac, Marinduque",
    "slug": "blossoms-and-brews",
    "facebook": "https://web.facebook.com/profile.php?id=61572007823015",
    "hours": {
      "Monday": "10:00 AM – 7:00 PM",
      "Tuesday": "10:00 AM – 7:00 PM",
      "Wednesday": "10:00 AM – 7:00 PM",
      "Thursday": "10:00 AM – 7:00 PM",
      "Friday": "10:00 AM – 7:00 PM",
      "Saturday": "10:00 AM – 7:00 PM",
      "Sunday": "10:00 AM – 7:00 PM"
    }
  },
  {
    "name": "Hale Ai",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "NAtional Road, Santol, Boac, Marinduque",
    "slug": "hale-ai",
    "facebook": "https://web.facebook.com/haleaiislandcafe",
    "hours": {
      "Tuesday": "10:30 AM – 8:30 PM",
      "Wednesday": "10:30 AM – 8:30 PM",
      "Thursday": "10:30 AM – 8:30 PM",
      "Friday": "10:30 AM – 8:30 PM",
      "Saturday": "10:30 AM – 8:30 PM",
      "Sunday": "10:30 AM – 8:30 PM"
    }
  },
  {
    "name": "Marin Brew",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Tabi-Poblacion Road Tanza, Boac, Philippines",
    "slug": "marin-brew",
    "facebook": "https://web.facebook.com/marinbrewcafe.main",
    "hours": {
      "Monday": "10:00 AM – 10:00 PM",
      "Tuesday": "10:00 AM – 10:00 PM",
      "Wednesday": "10:00 AM – 10:00 PM",
      "Thursday": "10:00 AM – 10:00 PM",
      "Friday": "10:00 AM – 10:00 PM",
      "Saturday": "10:00 AM – 10:00 PM",
      "Sunday": "10:00 AM – 10:00 PM"
    }
  },
  {
    "name": "10 Y.O Cafe",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Brgy. Balaring, Boac, Philippines",
    "slug": "10-y-o-cafe",
    "facebook": "https://web.facebook.com/10yoCafe",
    "hours": {
      "Monday": "7:00 AM – 9:00 PM",
      "Tuesday": "7:00 AM – 9:00 PM",
      "Wednesday": "7:00 AM – 9:00 PM",
      "Thursday": "7:00 AM – 9:00 PM",
      "Friday": "7:00 AM – 9:00 PM",
      "Saturday": "7:00 AM – 9:00 PM",
      "Sunday": "7:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Eomma K-Grill",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Brgy. Balaring, Boac, Philippines",
    "slug": "eomma-k-grill",
    "facebook": "https://web.facebook.com/eommakgrill",
    "hours": {
      "Monday": "11:00 AM – 9:00 PM",
      "Tuesday": "11:00 AM – 9:00 PM",
      "Wednesday": "11:00 AM – 9:00 PM",
      "Thursday": "11:00 AM – 9:00 PM",
      "Friday": "11:00 AM – 9:00 PM",
      "Saturday": "11:00 AM – 9:00 PM",
      "Sunday": "9:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Bricks & Coals",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Brgy. Balaring, Boac, Philippines",
    "slug": "bricks-and-coals",
    "facebook": "https://web.facebook.com/bricksncoals",
    "hours": {
      "Monday": "10:00 AM – 9:00 PM",
      "Tuesday": "10:00 AM – 9:00 PM",
      "Wednesday": "10:00 AM – 9:00 PM",
      "Thursday": "10:00 AM – 9:00 PM",
      "Friday": "10:00 AM – 9:00 PM",
      "Saturday": "9:00 AM – 9:00 PM",
      "Sunday": "9:00 AM – 9:00 PM"
    }
  },
  {
    "name": "The Penthouse by Marina",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Brgy. Balaring, Boac, Philippines",
    "slug": "the-penthouse-by-marina",
    "facebook": "https://web.facebook.com/PenthousebyMarina",
    "hours": {
      "Monday": "10:00 AM – 12:00 AM",
      "Tuesday": "10:00 AM – 12:00 AM",
      "Wednesday": "10:00 AM – 12:00 AM",
      "Thursday": "10:00 AM – 12:00 AM",
      "Friday": "10:00 AM – 12:00 AM",
      "Saturday": "10:00 AM – 12:00 AM",
      "Sunday": "10:00 AM – 12:00 AM"
    }
  },
  {
    "name": "Monserrat Pizza",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Isok Boac",
    "slug": "monserrat-pizza",
    "facebook": "https://web.facebook.com/leon.zurc1"
  },
  {
    "name": "C&S Foods",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "D.Reyes Street, Boac, Philippines, 4900",
    "slug": "cands-foods",
    "facebook": "https://web.facebook.com/smashedbrger",
    "hours": {
      "Monday": "10:00 AM – 9:00 PM",
      "Tuesday": "10:00 AM – 9:00 PM",
      "Wednesday": "10:00 AM – 9:00 PM",
      "Thursday": "10:00 AM – 9:00 PM",
      "Friday": "10:00 AM – 9:00 PM",
      "Saturday": "10:00 AM – 9:00 PM",
      "Sunday": "10:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Café Locca",
    "category": "Cafe / Milktea Shop",
    "town": "Boac",
    "address": "Uno De Noviembre St., San Miguel, Boac, Philippines",
    "slug": "cafe-locca",
    "facebook": "https://web.facebook.com/cafeloccamdq",
    "hours": {
      "Monday": "10:00 AM – 10:00 PM",
      "Tuesday": "10:00 AM – 10:00 PM",
      "Wednesday": "10:00 AM – 10:00 PM",
      "Thursday": "10:00 AM – 10:00 PM",
      "Friday": "10:00 AM – 10:00 PM",
      "Saturday": "10:00 AM – 10:00 PM"
    }
  },
  {
    "name": "Happy Tummy",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Malusak, Boac, Boac, Philippines, 4900",
    "slug": "happy-tummy",
    "facebook": "https://web.facebook.com/profile.php?id=100064061882330"
  },
  {
    "name": "Chi Wing's Canton Panciteria",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Moreno Street, Brgy Malusak, Boac, Philippines, 4900",
    "slug": "chi-wing-s-canton-panciteria",
    "facebook": "https://web.facebook.com/profile.php?id=100057085194190",
    "hours": {
      "Monday": "7:30 AM – 5:30 PM",
      "Tuesday": "7:30 AM – 5:30 PM",
      "Wednesday": "7:30 AM – 5:30 PM",
      "Thursday": "7:30 AM – 5:30 PM",
      "Friday": "7:30 AM – 5:30 PM",
      "Saturday": "7:30 AM – 5:30 PM",
      "Sunday": "7:30 AM – 5:30 PM"
    }
  },
  {
    "name": "YNP (Your Next Pizza)",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Magsaysay road, Tabi zone 3 , Boac, Philippines, 4900",
    "slug": "ynp-your-next-pizza",
    "facebook": "https://web.facebook.com/Yournextpizza",
    "hours": {
      "Monday": "10:00 AM – 7:00 PM",
      "Tuesday": "10:00 AM – 7:00 PM",
      "Wednesday": "10:00 AM – 7:00 PM",
      "Thursday": "10:00 AM – 7:00 PM",
      "Friday": "10:00 AM – 7:00 PM",
      "Saturday": "10:00 AM – 7:00 PM",
      "Sunday": "10:00 AM – 7:00 PM"
    }
  },
  {
    "name": "YNP (Your Next Pizza) Sta. Cruz",
    "category": "Specialty / Local Dishes",
    "town": "Sta. Cruz",
    "address": "Bonifacio St., Brgy. Banahaw, Sta. Cruz, Marinduque",
    "slug": "ynp-your-next-pizza-sta-cruz",
    "facebook": "https://www.facebook.com/profile.php?id=100083299212780",
    "hours": {
      "Monday": "10:00 AM – 7:00 PM",
      "Tuesday": "10:00 AM – 7:00 PM",
      "Wednesday": "10:00 AM – 7:00 PM",
      "Thursday": "10:00 AM – 7:00 PM",
      "Friday": "10:00 AM – 7:00 PM",
      "Saturday": "10:00 AM – 7:00 PM",
      "Sunday": "10:00 AM – 7:00 PM"
    }
  },
  {
    "name": "Lola Pia's Pancitan and Lomi Batangas",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Laylay, Boac",
    "slug": "lola-pia-s-pancitan-and-lomi-batangas"
  },
  {
    "name": "Porknok",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Bangbangalon , Boac, Philippines, 4900",
    "slug": "porknok"
  },
  {
    "name": "Kafétolyo Food Co.",
    "category": "Coffee Shop / Cafe",
    "town": "Boac",
    "address": "Bangbangalon , Boac, Philippines, 4900",
    "slug": "kafetolyo-food-co",
    "facebook": "https://web.facebook.com/bellybellescoffeeboac",
    "hours": {
      "Sunday": "9:00 AM – 8:00 PM",
      "Monday": "9:00 AM – 8:00 PM",
      "Tuesday": "9:00 AM – 8:00 PM",
      "Wednesday": "9:00 AM – 8:00 PM",
      "Thursday": "9:00 AM – 8:00 PM",
      "Friday": "9:00 AM – 6:00 PM"
    }
  },
  {
    "name": "Café Rajo",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Casa Narvas, D. Reyes cor Del Mundo Street, San Miguel,, Boac, Philippines, 4900",
    "slug": "cafe-rajo",
    "facebook": "https://web.facebook.com/profile.php?id=61586515275036",
    "hours": {
      "Monday": "11:00 AM – 8:00 PM",
      "Tuesday": "11:00 AM – 8:00 PM",
      "Wednesday": "11:00 AM – 8:00 PM",
      "Thursday": "11:00 AM – 8:00 PM",
      "Friday": "11:00 AM – 8:00 PM",
      "Saturday": "10:00 AM – 9:00 PM",
      "Sunday": "10:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Dayo",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Balogo, Boac, Philippines",
    "slug": "dayo",
    "facebook": "https://web.facebook.com/daYOmarinduque2020",
    "hours": {
      "Monday": "11:00 AM – 9:30 PM",
      "Tuesday": "11:00 AM – 9:30 PM",
      "Wednesday": "11:00 AM – 9:30 PM",
      "Thursday": "11:00 AM – 9:30 PM",
      "Friday": "11:00 AM – 9:30 PM",
      "Saturday": "11:00 AM – 9:30 PM",
      "Sunday": "11:00 AM – 9:30 PM"
    }
  },
  {
    "name": "Elvi's Food Hub",
    "category": "Cafeteria",
    "town": "Boac",
    "address": "Isok 1, Boac, Philippines, 4900",
    "slug": "elvi-s-food-hub",
    "facebook": "https://web.facebook.com/profile.php?id=61574710277504",
    "hours": {
      "Monday": "8:00 AM – 10:00 PM",
      "Tuesday": "8:00 AM – 10:00 PM",
      "Wednesday": "8:00 AM – 10:00 PM",
      "Thursday": "8:00 AM – 10:00 PM",
      "Friday": "8:00 AM – 10:00 PM",
      "Saturday": "8:00 AM – 10:00 PM",
      "Sunday": "8:00 AM – 10:00 PM"
    }
  },
  {
    "name": "Mango Heyhey",
    "category": "Cafe / Milktea Shop",
    "town": "Boac",
    "address": "Gov. D. Reyes St. Cor Dela Santa St. Brgy Murallon , Boac, Philippines",
    "slug": "mango-heyhey",
    "facebook": "https://web.facebook.com/profile.php?id=61568424939760",
    "hours": {
      "Monday": "10:00 AM – 8:00 PM",
      "Tuesday": "10:00 AM – 8:00 PM",
      "Wednesday": "10:00 AM – 8:00 PM",
      "Thursday": "10:00 AM – 8:00 PM",
      "Friday": "10:00 AM – 8:00 PM",
      "Saturday": "10:00 AM – 8:00 PM"
    }
  },
  {
    "name": "Maria's Café Boac",
    "category": "Cafe / Milktea Shop",
    "town": "Boac",
    "address": "Doña Tesing Building, Mercado, Boac, Philippines, 4900",
    "slug": "maria-s-cafe-boac",
    "facebook": "https://web.facebook.com/mariascafeboac",
    "hours": {
      "Monday": "9:00 AM – 6:00 PM",
      "Tuesday": "9:00 AM – 6:00 PM",
      "Wednesday": "9:00 AM – 6:00 PM",
      "Thursday": "9:00 AM – 6:00 PM",
      "Friday": "9:00 AM – 6:00 PM",
      "Saturday": "9:00 AM – 6:00 PM",
      "Sunday": "9:00 AM – 6:00 PM"
    }
  },
  {
    "name": "Maria's Café Buenavista",
    "category": "Cafe / Milktea Shop",
    "town": "Buenavista",
    "address": "Barangay II, Buenavista, Marinduque",
    "slug": "maria-s-cafe-buenavista",
    "facebook": "https://www.facebook.com/mariascafebuenavista",
    "hours": {
      "Monday": "9:00 AM – 7:00 PM",
      "Tuesday": "9:00 AM – 7:00 PM",
      "Wednesday": "9:00 AM – 7:00 PM",
      "Thursday": "9:00 AM – 7:00 PM",
      "Friday": "9:00 AM – 7:00 PM",
      "Saturday": "9:00 AM – 7:00 PM",
      "Sunday": "9:00 AM – 7:00 PM"
    }
  },
  {
    "name": "Roger's Cafe",
    "category": "Casual Dining",
    "town": "Gasan",
    "address": "944 Gov J. Lopez, Brgy Tres, Gasan, Marinduque, Gasan, Philippines",
    "slug": "roger-s-cafe",
    "facebook": "https://www.facebook.com/profile.php?id=61577923678606",
    "hours": {
      "Monday": "10:00 AM – 10:00 PM",
      "Tuesday": "10:00 AM – 10:00 PM",
      "Wednesday": "10:00 AM – 10:00 PM",
      "Thursday": "10:00 AM – 10:00 PM",
      "Friday": "10:00 AM – 10:00 PM",
      "Saturday": "10:00 AM – 10:00 PM",
      "Sunday": "10:00 AM – 10:00 PM"
    }
  },
  {
    "name": "Komedor sa Luxor",
    "category": "Casual Dining",
    "town": "Gasan",
    "address": "Marinduque Circumferential Road, Brgy. Pangi, Gasan, Philippines, 4905",
    "slug": "komedor-sa-luxor",
    "facebook": "https://www.facebook.com/luxor.resort.marinduque"
  },
  {
    "name": "Cappe Sacalli",
    "category": "Cafe / Milktea Shop",
    "town": "Gasan",
    "address": "Purok 3 Bahi Gasan Marinduque",
    "slug": "cappe-sacalli",
    "facebook": "https://www.facebook.com/Cappesacalle23"
  },
  {
    "name": "F&C Chillin Spot Bistro",
    "category": "Cafeteria",
    "town": "Gasan",
    "address": "Front of Gasan Public Market - Barangay Dili, Gasan, Philippines, 4905",
    "slug": "fandc-chillin-spot-bistro",
    "facebook": "https://www.facebook.com/profile.php?id=100064112951994"
  },
  {
    "name": "Marigold Kitchennete",
    "category": "Specialty / Local Dishes",
    "town": "Gasan",
    "address": "326 Bonifacio St. Barangay Uno, Pob. Gasan Marinduque, Gasan, Philippines, 4905",
    "slug": "marigold-kitchennete",
    "facebook": "https://www.facebook.com/MARIGOLDKITCHENETTEofficial"
  },
  {
    "name": "Monsanbrew",
    "category": "Cafe / Milktea Shop",
    "town": "Gasan",
    "address": "Zamora St., Brgy. Dos (Poblacion), Gasan, Marinduque",
    "slug": "monsanbrew",
    "facebook": "https://www.facebook.com/profile.php?id=100072636422290"
  },
  {
    "name": "Daungan Restaurant",
    "category": "Casual Dining",
    "town": "Gasan",
    "address": "Bacongbacong, Gasan, Philippines, 4905",
    "slug": "daungan-restaurant",
    "facebook": "https://www.facebook.com/daunganrestaurantt",
    "hours": {
      "Monday": "4:00 PM – 9:00 PM",
      "Tuesday": "4:00 PM – 9:00 PM",
      "Wednesday": "4:00 PM – 9:00 PM",
      "Thursday": "4:00 PM – 9:00 PM",
      "Friday": "4:00 PM – 9:00 PM",
      "Saturday": "4:00 PM – 9:00 PM"
    }
  },
  {
    "name": "Adi's Resort & Restobar",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Brgy. Ihatub, Boac, Philippines, 4900",
    "slug": "adi-s-resort-and-restobar",
    "facebook": "https://www.facebook.com/adisresortandrestobar"
  },
  {
    "name": "Tanawin Café & Glamping",
    "category": "Casual Dining",
    "town": "Torrijos",
    "address": "Barangay Bangwayin, Torrijos, Philippines, 4903",
    "slug": "tanawin-cafe-and-glamping",
    "facebook": "https://www.facebook.com/cafetanawin",
    "hours": {
      "Monday": "9:00 AM – 8:00 PM",
      "Tuesday": "9:00 AM – 8:00 PM",
      "Wednesday": "9:00 AM – 8:00 PM",
      "Thursday": "9:00 AM – 8:00 PM",
      "Friday": "9:00 AM – 8:00 PM",
      "Saturday": "9:00 AM – 8:00 PM",
      "Sunday": "9:00 AM – 8:00 PM"
    }
  },
  {
    "name": "Panuluyan Farmstay",
    "category": "Specialty / Local Dishes",
    "town": "Sta. Cruz",
    "address": "Panuluyan, Brgy. Masalukot, Santa Cruz, Philippines, 4902",
    "slug": "panuluyan-farmstay",
    "facebook": "https://www.facebook.com/panuluyan",
    "hours": {
      "Monday": "11:00 AM – 5:00 PM",
      "Tuesday": "11:00 AM – 5:00 PM",
      "Thursday": "11:00 AM – 5:00 PM",
      "Friday": "11:00 AM – 5:00 PM",
      "Saturday": "11:00 AM – 5:00 PM",
      "Sunday": "11:00 AM – 5:00 PM"
    }
  },
  {
    "name": "Roby's Bakeshoppe",
    "category": "Casual Dining",
    "town": "Sta. Cruz",
    "address": "Santa Cruz, Philippines, 4902",
    "slug": "roby-s-bakeshoppe",
    "facebook": "https://www.facebook.com/robysonestopshop",
    "hours": {
      "Monday": "8:00 AM – 6:00 PM",
      "Tuesday": "8:00 AM – 6:00 PM",
      "Wednesday": "8:00 AM – 6:00 PM",
      "Thursday": "8:00 AM – 6:00 PM",
      "Friday": "8:00 AM – 6:00 PM",
      "Saturday": "8:00 AM – 6:00 PM",
      "Sunday": "8:00 AM – 6:00 PM"
    }
  },
  {
    "name": "Curba Grill Buenavista",
    "category": "Casual Dining",
    "town": "Buenavista",
    "address": "Buenavista, Marinduque",
    "slug": "curba-grill-buenavista",
    "facebook": "https://www.facebook.com/profile.php?id=100078024638899",
    "hours": {
      "Monday": "9:00 AM – 9:00 PM",
      "Tuesday": "9:00 AM – 9:00 PM",
      "Wednesday": "9:00 AM – 9:00 PM",
      "Thursday": "9:00 AM – 9:00 PM",
      "Friday": "9:00 AM – 9:00 PM",
      "Saturday": "9:00 AM – 9:00 PM",
      "Sunday": "9:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Green Crib",
    "category": "Specialty / Local Dishes",
    "town": "Buenavista",
    "address": "Cornelio Sadiwa Street, Buenavista, Philippines, 4904",
    "slug": "green-crib",
    "facebook": "https://www.facebook.com/krisvian2025",
    "hours": {
      "Tuesday": "10:00 AM – 9:00 PM",
      "Wednesday": "10:00 AM – 9:00 PM",
      "Thursday": "10:00 AM – 9:00 PM",
      "Friday": "10:00 AM – 9:00 PM",
      "Saturday": "10:00 AM – 9:00 PM",
      "Sunday": "10:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Café Aurora",
    "category": "Cafe / Milktea Shop",
    "town": "Buenavista",
    "address": "Brgy. 2 Buenavista, marinduque, Buenavista, Philippines, 4904",
    "slug": "cafe-aurora"
  },
  {
    "name": "Tabag's Place",
    "category": "Casual Dining",
    "town": "Torrijos",
    "address": "Malibago, Torrijos, Marinduque, 4903",
    "slug": "tabag-s-place",
    "facebook": "https://www.facebook.com/tabagsplacemalibago",
    "hours": {
      "Monday": "10:00 AM – 8:00 PM",
      "Tuesday": "10:00 AM – 8:00 PM",
      "Wednesday": "10:00 AM – 8:00 PM",
      "Thursday": "10:00 AM – 8:00 PM",
      "Friday": "10:00 AM – 8:00 PM",
      "Saturday": "10:00 AM – 8:00 PM",
      "Sunday": "10:00 AM – 9:30 PM"
    }
  },
  {
    "name": "Villa Negro Café",
    "category": "Casual Dining",
    "town": "Mogpog",
    "address": "Barangay Argao Mogpog Marinduque , Mogpog, Philippines, 4901",
    "slug": "villa-negro-cafe",
    "facebook": "https://www.facebook.com/villanegrocafe",
    "hours": {
      "Wednesday": "11:00 AM – 8:00 PM",
      "Thursday": "11:00 AM – 8:00 PM",
      "Friday": "11:00 AM – 8:00 PM",
      "Saturday": "11:00 AM – 8:00 PM",
      "Sunday": "11:00 AM – 8:00 PM"
    }
  },
  {
    "name": "Poblacion Pares ATBP",
    "category": "Specialty / Local Dishes",
    "town": "Mogpog",
    "address": "Olaveria Street, Mogpog, Philippines, 4901",
    "slug": "poblacion-pares-atbp",
    "facebook": "https://www.facebook.com/p0blacionpares",
    "hours": {
      "Monday": "8:00 AM – 9:00 PM",
      "Tuesday": "8:00 AM – 9:00 PM",
      "Wednesday": "8:00 AM – 9:00 PM",
      "Thursday": "8:00 AM – 9:00 PM",
      "Friday": "8:00 AM – 9:00 PM",
      "Saturday": "8:00 AM – 9:00 PM",
      "Sunday": "8:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Maria's Café Main Branch",
    "category": "Cafe / Milktea Shop",
    "town": "Torrijos",
    "address": "Sitio Ibaba, Barangay Malibago, Torrijos, Marinduque, Torrijos, Philippines, 4903",
    "slug": "maria-s-cafe-main-branch",
    "facebook": "https://www.facebook.com/mariascafemain",
    "hours": {
      "Monday": "9:00 AM – 7:00 PM",
      "Tuesday": "9:00 AM – 7:00 PM",
      "Wednesday": "9:00 AM – 7:00 PM",
      "Thursday": "9:00 AM – 7:00 PM",
      "Friday": "9:00 AM – 7:00 PM",
      "Saturday": "9:00 AM – 7:00 PM",
      "Sunday": "9:00 AM – 7:00 PM"
    }
  },
  {
    "name": "Jethro's Hotel & Resto",
    "category": "Casual Dining",
    "town": "Sta. Cruz",
    "address": "Lopez Jaena St.Brgy PAG ASA, Sta Cruz Marinduque , 4902",
    "slug": "jethro-s-hotel-and-resto",
    "facebook": "https://www.facebook.com/profile.php?id=61579981777554"
  },
  {
    "name": "Galley Grill & BBQ Restaurant",
    "category": "Casual Dining",
    "town": "Sta. Cruz",
    "address": "Near Sta Cruz Public Market katapat ng RUSI , Santa Cruz, Philippines, 4902",
    "slug": "galley-grill-and-bbq-restaurant",
    "facebook": "https://www.facebook.com/profile.php?id=61590867210273",
    "hours": {
      "Monday": "10:00 AM – 8:30 PM",
      "Tuesday": "10:00 AM – 8:30 PM",
      "Wednesday": "10:00 AM – 8:30 PM",
      "Thursday": "10:00 AM – 8:30 PM",
      "Friday": "10:00 AM – 8:30 PM",
      "Saturday": "10:00 AM – 8:30 PM",
      "Sunday": "10:00 AM – 8:30 PM"
    }
  },
  {
    "name": "Luz Garden's Restaurant",
    "category": "Specialty / Local Dishes",
    "town": "Torrijos",
    "address": "Cagpo Torrijos Marinduque, Torrijos, Philippines",
    "slug": "luz-garden-s-restaurant",
    "facebook": "https://www.facebook.com/profile.php?id=61566845096116"
  },
  {
    "name": "Aloha Garden's Bar & Restaurant",
    "category": "Casual Dining",
    "town": "Mogpog",
    "address": "Guijo St. Marketsite Mogpog, 4901",
    "slug": "aloha-garden-s-bar-and-restaurant",
    "facebook": "https://www.facebook.com/profile.php?id=61556814095752"
  },
  {
    "name": "Nipa Hut Grill & Restaurant",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Tanza, Boac, Philippines",
    "slug": "nipa-hut-grill-and-restaurant",
    "facebook": "https://www.facebook.com/profile.php?id=61576609868162"
  },
  {
    "name": "Kangaroo Bar & Beach Club",
    "category": "Pub",
    "town": "Boac",
    "address": "Zone 7, Brgy. Buliasnin, Boac, Philippines, 4900",
    "slug": "kangaroo-bar-and-beach-club",
    "facebook": "https://www.facebook.com/kangaroobarandbeachclub"
  },
  {
    "name": "Bethany Café",
    "category": "Casual Dining",
    "town": "Mogpog",
    "address": "Rizal Street, Barangay Dulong Bayan, Mogpog, Philippines, 4901",
    "slug": "bethany-cafe",
    "facebook": "https://www.facebook.com/MariaDeBetaniaCafe",
    "hours": {
      "Monday": "11:00 AM – 9:00 PM",
      "Tuesday": "11:00 AM – 9:00 PM",
      "Wednesday": "11:00 AM – 9:00 PM",
      "Thursday": "11:00 AM – 9:00 PM",
      "Friday": "11:00 AM – 9:00 PM",
      "Saturday": "11:00 AM – 9:00 PM",
      "Sunday": "11:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Casa Silmara",
    "category": "Cafe / Milktea Shop",
    "town": "Mogpog",
    "address": "Nangka 1, Mogpog, Philippines, 4901",
    "slug": "casa-silmara",
    "facebook": "https://www.facebook.com/CasaSilmara",
    "hours": {
      "Tuesday": "11:00 AM – 9:00 PM",
      "Wednesday": "11:00 AM – 9:00 PM",
      "Thursday": "11:00 AM – 9:00 PM",
      "Friday": "10:00 AM – 10:00 PM",
      "Saturday": "10:00 AM – 10:00 PM",
      "Sunday": "10:00 AM – 10:00 PM"
    }
  },
  {
    "name": "Kalambingan",
    "category": "Specialty / Local Dishes",
    "town": "Mogpog",
    "address": "Sumangga, Mogpog",
    "slug": "kalambingan",
    "facebook": "https://www.facebook.com/Kalambingan",
    "hours": {
      "Monday": "9:00 AM – 12:00 AM",
      "Tuesday": "9:00 AM – 12:00 AM",
      "Wednesday": "9:00 AM – 12:00 AM",
      "Thursday": "9:00 AM – 12:00 AM",
      "Friday": "9:00 AM – 12:00 AM",
      "Saturday": "9:00 AM – 12:00 AM",
      "Sunday": "9:00 AM – 12:00 AM"
    }
  },
  {
    "name": "Brewista Coffee PH",
    "category": "Cafe / Milktea Shop",
    "town": "Sta. Cruz",
    "address": "003 Mabini Street, Sta. Cruz, Philippines, 4902",
    "slug": "brewista-coffee-ph",
    "facebook": "https://www.facebook.com/brewistacoffeeph",
    "hours": {
      "Tuesday": "10:00 AM – 7:00 PM",
      "Wednesday": "10:00 AM – 7:00 PM",
      "Thursday": "10:00 AM – 7:00 PM",
      "Friday": "10:00 AM – 7:00 PM",
      "Saturday": "10:00 AM – 7:00 PM",
      "Sunday": "10:00 AM – 7:00 PM"
    }
  },
  {
    "name": "Tilly's",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Tanza, Boac (MarSU)",
    "slug": "tilly-s",
    "facebook": "https://www.facebook.com/profile.php?id=61566336577833"
  },
  {
    "name": "Ano Nga Seyo",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "Zone 4 Tabi, Boac, Marinduque",
    "slug": "ano-nga-seyo",
    "facebook": "https://www.facebook.com/profile.php?id=61588284428508",
    "hours": {
      "Monday": "3:00 PM – 10:00 PM",
      "Tuesday": "3:00 PM – 10:00 PM",
      "Wednesday": "3:00 PM – 10:00 PM",
      "Thursday": "3:00 PM – 10:00 PM",
      "Friday": "3:00 PM – 10:00 PM",
      "Saturday": "3:00 PM – 10:00 PM"
    }
  },
  {
    "name": "Uncle Reymel 24 hours Restaurant",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "ABC Market, Mercado, Boac, Philippines, 4900",
    "slug": "uncle-reymel-24-hours-restaurant",
    "facebook": "https://www.facebook.com/profile.php?id=61573545224734",
    "hours": {
      "Monday": "Open 24 hours",
      "Tuesday": "Open 24 hours",
      "Wednesday": "Open 24 hours",
      "Thursday": "Open 24 hours",
      "Friday": "Open 24 hours",
      "Saturday": "Open 24 hours",
      "Sunday": "Open 24 hours"
    }
  },
  {
    "name": "Kusina sa Kanto",
    "category": "Specialty / Local Dishes",
    "town": "Gasan",
    "address": "Talinya, Masiga, Gasan",
    "slug": "kusina-sa-kanto",
    "facebook": "https://www.facebook.com/profile.php?id=61588790236250"
  },
  {
    "name": "Gaby's Best Bite",
    "category": "Specialty / Local Dishes",
    "town": "Boac",
    "address": "San Rafael st. Purok 2 Cawit, Boac, Marinduque",
    "slug": "gaby-s-best-bite",
    "facebook": "https://www.facebook.com/profile.php?id=100064111661301"
  },
  {
    "name": "Café Tribu Gasan",
    "category": "Cafe / Milktea Shop",
    "town": "Gasan",
    "address": "Dili Gasan, Marinduque, Philippines, Gasan, Philippines, 4905",
    "slug": "cafe-tribu-gasan",
    "facebook": "https://www.facebook.com/profile.php?id=100064137729138",
    "hours": {
      "Monday": "9:00 AM – 10:00 PM",
      "Tuesday": "9:00 AM – 10:00 PM",
      "Wednesday": "9:00 AM – 10:00 PM",
      "Thursday": "9:00 AM – 10:00 PM",
      "Friday": "9:00 AM – 10:00 PM",
      "Saturday": "9:00 AM – 10:00 PM",
      "Sunday": "9:00 AM – 10:00 PM"
    }
  },
  {
    "name": "Cravings Food & Refreshment Hub",
    "category": "Casual Dining",
    "town": "Boac",
    "address": "Laylay, Boac",
    "slug": "cravings-food-and-refreshment-hub",
    "facebook": "https://www.facebook.com/cravingslaylay",
    "hours": {
      "Monday": "9:00 AM – 9:00 PM",
      "Tuesday": "9:00 AM – 9:00 PM",
      "Wednesday": "9:00 AM – 9:00 PM",
      "Thursday": "9:00 AM – 9:00 PM",
      "Friday": "9:00 AM – 9:00 PM",
      "Saturday": "9:00 AM – 9:00 PM",
      "Sunday": "9:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Pitali Treats",
    "category": "Cafe / Milktea Shop",
    "town": "Buenavista",
    "address": "Purok 1, Brgy. Caigangan, Buenavista, Marinduque",
    "slug": "pitali-treats",
    "facebook": "https://www.facebook.com/profile.php?id=61588589710065"
  },
  {
    "name": "Sarang-Jin Keopi Hub",
    "category": "Cafe / Milktea Shop",
    "town": "Mogpog",
    "address": "CSM II Building, Yakal Street, Barangay Marketsite, Mogpog, Philippines, 4901",
    "slug": "sarang-jin-keopi-hub",
    "facebook": "https://www.facebook.com/sarangjinkeopihub",
    "hours": {
      "Monday": "9:00 AM – 9:00 PM",
      "Tuesday": "9:00 AM – 9:00 PM",
      "Wednesday": "9:00 AM – 9:00 PM",
      "Thursday": "9:00 AM – 9:00 PM",
      "Friday": "9:00 AM – 9:00 PM",
      "Saturday": "9:00 AM – 9:00 PM",
      "Sunday": "9:00 AM – 9:00 PM"
    }
  },
  {
    "name": "Kusinerang Marinduqueña",
    "category": "Specialty / Local Dishes",
    "town": "Torrijos",
    "address": "Pulang Lupa, Torrijos, Marinduque",
    "slug": "kusinerang-marinduquena",
    "hours": {
      "Monday": "10:00 AM – 12:00 AM",
      "Tuesday": "10:00 AM – 12:00 AM",
      "Wednesday": "10:00 AM – 12:00 AM",
      "Thursday": "10:00 AM – 12:00 AM",
      "Friday": "10:00 AM – 12:00 AM",
      "Saturday": "10:00 AM – 12:00 AM",
      "Sunday": "10:00 AM – 12:00 AM"
    }
  }
];
const onlinePaymentSlugs=new Set([
  "tambayan-sa-curba","randr-bistro","cafe-ma-mita-boac-hotel","golden-island","goodchow","t-spot-tea-shop","kusina-sa-plaza","chinggay-s","blossoms-and-brews","hale-ai","marin-brew","10-y-o-cafe","eomma-k-grill","chi-wing-s-canton-panciteria","porknok","kafetolyo-food-co","bethany-cafe","tilly-s",
]);
const wifiSlugs=new Set(["chinggay-s","marin-brew","10-y-o-cafe"]);
export const establishments:Establishment[]=records.map(item=>({
  ...item,
  onlinePayment:onlinePaymentSlugs.has(item.slug),
  wifi:wifiSlugs.has(item.slug),
}));
export const getEstablishment=(slug:string)=>establishments.find(item=>item.slug===slug);
