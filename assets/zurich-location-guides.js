(() => {
  if (!window.location.pathname.includes("/trips/zurich-black-forest-alsace-2026/")) return;

  const placeInfo = {
    "Zurich Airport": {
      what: "שדה התעופה הראשי של ציריך ונקודת הכניסה והיציאה של הטיול.",
      see: "ביום ההגעה המטרה היא רק לעבור ביקורת גבולות, לאסוף מזוודות ולהגיע למרכז השכרת הרכב בלי לחץ.",
      time: "כדאי להשאיר 45–75 דקות מהנחיתה עד היציאה ברכב, תלוי בתורים ובמזוודות.",
      tip: "איסוף ה-SIXT מתוכנן ל-20:30, רק 30 דקות אחרי הנחיתה המתוכננת. אם יש עיכוב, לכו ישירות לרכב וותרו על כל עצירה אחרת.",
      url: "https://www.flughafen-zuerich.ch/en/passengers"
    },
    "Hilton Garden Inn Zurich Limmattal": {
      what: "מלון הבסיס ללילה הראשון והלילה האחרון, ב-Spreitenbach מערבית לציריך.",
      see: "זהו בסיס לוגיסטי ולא יעד תיירותי: היתרון הוא הגעה נוחה יחסית מהשדה ויציאה מהירה לכיוון גרמניה או חזרה לשדה.",
      time: "ביום הראשון – צ'ק-אין ושינה. ביום האחרון – הורדת מזוודות, מנוחה ואריזה לפני הטיסה.",
      tip: "בלילה האחרון הכינו מראש את כל המזוודות והמסמכים, כדי לצאת בבוקר ישירות להחזרת הרכב ב-08:00.",
      url: "https://www.hilton.com/en/hotels/zrhspgi-hilton-garden-inn-zurich-limmattal/"
    },
    "Freiburg Minster": {
      what: "קתדרלת פרייבורג היא הסמל של העיר ואחת הדוגמאות המרשימות לאדריכלות גותית באזור. המגדל המערבי מתנשא לגובה 116 מטר.",
      see: "כדאי להסתכל גם על החזית מבחוץ וגם להיכנס פנימה. בכיכר Münsterplatz מתקיים שוק עירוני והוא אחד המקומות הנעימים ביותר לעצירה.",
      time: "30–45 דקות לביקור רגוע בקתדרלה ובכיכר; יותר אם עולים למגדל.",
      tip: "העלייה למגדל כוללת 209 מדרגות עד Türmerstube ואינה נגישה. להורים עדיף ליהנות מהקתדרלה והכיכר ולוותר על העלייה.",
      url: "https://visit.freiburg.de/en/freiburg-muenster-cathedral"
    },
    "Freiburg Old Town": {
      what: "העיר העתיקה של פרייבורג משלבת רחובות היסטוריים, בתי קפה ותעלות Bächle קטנות הזורמות לצד הרחובות.",
      see: "Münsterplatz, Rathausplatz, הרחובות סביב Konviktstraße ותעלות ה-Bächle. לא צריך מסלול קשיח – זה מקום טוב פשוט לשוטט בו.",
      time: "כשעה וחצי עד שעתיים בקצב משפחתי כולל עצירה לאוכל.",
      tip: "רוב האזור נוח להליכה, אבל שימו לב לתעלות ה-Bächle בקצה המדרכה. אפשר לקצר בכל רגע ולחזור לכיכר המרכזית.",
      url: "https://visit.freiburg.de/en"
    },
    "Schlossbergbahn Freiburg": {
      what: "פוניקולר קצר שמעלה מ-Stadtgarten אל Schlossberg בגובה 456 מטר, ממש בקצה העיר העתיקה.",
      see: "המטרה היא התצפית על פרייבורג והקתדרלה ולא הנסיעה עצמה. בימים בהירים רואים גם לכיוון הרי הווז'.",
      time: "הנסיעה עצמה אורכת כ-3 דקות לכל כיוון; 30–60 דקות מספיקות לעלייה, תצפית וירידה.",
      tip: "הקרונית מתאימה לכיסאות גלגלים ולעגלות ונוסעת לפי דרישה, כך שזו דרך טובה לתת גם להורים תצפית בלי טיפוס ארוך.",
      url: "https://visit.freiburg.de/en/schlossbergbahn"
    },
    "Gengenbach Old Town": {
      what: "עיירת יער שחור קטנה ומטופחת עם מרכז היסטורי, בתי עץ, כיכר שוק ובית עירייה מרשים.",
      see: "Hauptstraße, Marktplatz, בית העירייה והסמטאות סביב המרכז. האור של סוף היום מתאים במיוחד לצילומים.",
      time: "60–90 דקות בערב מספיקות בהחלט.",
      tip: "אל תהפכו אותה לעוד 'יום טיול'. היא עובדת הכי טוב כהליכה קצרה וארוחת ערב אחרי הצ'ק-אין ב-Offenburg.",
      url: "https://www.gengenbach.info/"
    },
    "Triberg Waterfalls": {
      what: "מפלי טריברג הם אחד מאתרי הטבע המזוהים ביותר עם היער השחור, עם סדרה של מפלים ומדרגות מים בתוך היער.",
      see: "יש שלושה מסלולים מסומנים: Nature, Culture ו-Cascades. לא חייבים להגיע לנקודה הגבוהה ביותר כדי ליהנות מהמקום.",
      time: "כשעה למסלול קצר ותצפיות נמוכות; 90–120 דקות אם ממשיכים גבוה יותר.",
      tip: "הכניסה מאחורי Asklepios Clinic ב-Ludwigstraße 1 נגישה עד פלטפורמת התצפית הראשונה. זה פתרון טוב אם ההורים רוצים מסלול קצר יותר.",
      url: "https://www.triberg.de/english/tourismus-1/sights/germanys-highest-waterfalls"
    },
    "Triberg im Schwarzwald": {
      what: "עיירת תיירות בלב היער השחור המזוהה עם שעוני קוקייה, מסורת מקומית ומוזיאון היער השחור.",
      see: "אחרי המפלים אפשר להסתובב ברחוב הראשי, להיכנס לחנויות שעונים או למוזיאון Schwarzwaldmuseum אם מזג האוויר פחות טוב.",
      time: "45–90 דקות בדרך כלל מספיקות אחרי המפלים.",
      tip: "אל תקנו שעון קוקייה רק כי הגעתם ל-Triberg. אם רוצים מזכרת אמיתית, כדאי להשוות כמה חנויות ולבדוק היכן מיוצר המנגנון.",
      url: "https://www.triberg.de/english/tourismus-1/sights/schwarzwaldmuseum-blackforest-museum"
    },
    "Europa-Park": {
      what: "פארק השעשועים הגדול בגרמניה, עם יותר מ-100 מתקנים ומופעים ואזורים המעוצבים לפי מדינות אירופה.",
      see: "לנוער: Voltron, Silver Star, blue fire ו-WODAN. לילדים ומי שלא רוצה אקסטרים יש עשרות מתקנים משפחתיים ומופעים.",
      time: "יום מלא. ב-25/9/2026 זהו היום האחרון של עונת הקיץ; הפארק פתוח מ-09:00 עד לפחות 18:00.",
      tip: "הגיעו לפני הפתיחה, השתמשו באפליקציה הרשמית לתורים, ואל תכריחו את כל הקבוצה לנוע יחד כל היום – קובעים נקודות מפגש.",
      url: "https://www.europapark.de/en/theme-park/plan-your-europa-park-visit"
    },
    "Caracalla Therme": {
      what: "מתחם מרחצאות תרמיים מודרני ב-Baden-Baden, מתאים במיוחד ליום רגוע למבוגרים.",
      see: "בריכות תרמיות פנימיות וחיצוניות, אזורי מנוחה ואפשרות לשלב ארוחה או קפה במתחם.",
      time: "3 שעות הן ביקור טוב; בספטמבר 2026 בימי שני–שישי המבצע הרשמי נותן יום מלא במחיר תעריף 3 שעות.",
      tip: "ב-25/9 המבצע המפורסם כרגע הוא €25 ליום מלא במקום €35. בדקו שוב בשבוע שלפני ואל תשכחו בגד ים וכפכפים.",
      url: "https://caracalla.de/preise"
    },
    "Lichtentaler Allee": {
      what: "טיילת-פארק ירוקה לאורך נהר Oos המחברת את מרכז Baden-Baden עם מנזר Lichtenthal.",
      see: "גנים, עצים ותיקים, בתי מידות ומוזיאונים לאורך הדרך. נקודת פתיחה נוחה היא אזור Kurhaus.",
      time: "המסלול המלא הוא כ-3 ק״מ, אבל 30–60 דקות של הליכה חלקית מספיקות ביום הספא.",
      tip: "חינם ופתוח 24/7. אין צורך להשלים את כל המסלול – פשוט הולכים עד שנעים ואז חוזרים.",
      url: "https://www.baden-baden.com/en/nature/lichtentaler-allee"
    },
    "Batorama": {
      what: "שיט תיירותי על נהר Ill שמציג את Strasbourg מזווית מצוינת בלי להעמיס הליכה על הקבוצה.",
      see: "Petite France, הסכרים, אזורים היסטוריים וחלק מהאזור האירופי, בהתאם למסלול שנבחר.",
      time: "המסלול המרכזי נמשך בדרך כלל 60–70 דקות.",
      tip: "לתשעה אנשים כדאי להזמין את אותה יציאה מראש. יש סירות סגורות, פתוחות ומתכווננות; במזג אוויר לא יציב עדיפה סירה סגורה/מתכווננת.",
      url: "https://www.batorama.com/en"
    },
    "Strasbourg Cathedral": {
      what: "קתדרלת Notre-Dame היא הסמל של Strasbourg, בנויה מאבן חול ורודה עם צריח בגובה 142 מטר וחלון רוזטה גדול.",
      see: "החזית, חלונות הוויטראז' והשעון האסטרונומי. מי שרוצה תצפית יכול לעלות לפלטפורמה בגובה 66 מטר.",
      time: "30–45 דקות לקתדרלה; כשעה נוספת אם עולים לפלטפורמה.",
      tip: "הפלטפורמה דורשת כ-330 מדרגות ומצב גופני טוב. להורים עדיף להישאר למטה; הנוער יכול לעלות אם יש זמן ואנרגיה.",
      url: "https://www.visitstrasbourg.fr/en/discover/must-see-attractions/the-cathedral/"
    },
    "Petite France": {
      what: "הרובע הציורי ביותר ב-Strasbourg, שהיה בעבר אזור של בורסקאים, טוחנים ודייגים, עם בתי עץ ותעלות.",
      see: "Rue du Bain-aux-Plantes, Place Benjamin Zix, Pont du Faisan המסתובב וגשר Saint-Martin.",
      time: "60–90 דקות של שיטוט רגוע כולל עצירת קפה.",
      tip: "המדרכות והאבנים העתיקות יפות אבל פחות נוחות. אחרי השיט ב-Batorama, שמרו את ההליכה כאן קצרה ונעימה במקום לנסות לכסות את כל העיר.",
      url: "https://www.visitstrasbourg.fr/en/discover/strasbourg-and-its-surrounding-area/petite-france/"
    },
    "Ponts Couverts": {
      what: "מערכת גשרים ושלושה מגדלי שמירה מהמאה ה-13, שרידים של ביצורי Strasbourg. למרות השם, הגגות עצמם נעלמו במאה ה-18.",
      see: "הנוף של הזרועות של נהר Ill, המגדלים ו-Barrage Vauban הסמוך. מהטרסה של Vauban מתקבלת תצפית מצוינת על Petite France.",
      time: "20–30 דקות מספיקות אם כבר טיילתם ב-Petite France.",
      tip: "זה מקום טוב לסיים בו את המסלול הרגלי ולא עוד יעד שמצריך נסיעה מיוחדת.",
      url: "https://www.visitstrasbourg.fr/en/things-to-see-and-do/visiting/places-to-visit/historical-sites-and-monuments/f223007617_the-covered-bridges-strasbourg/"
    },
    "Vogtsbauernhof": {
      what: "מוזיאון פתוח של היער השחור המציג חוות היסטוריות ואת האופן שבו חיו ועבדו באזור במשך מאות שנים.",
      see: "בתי החווה, טחנות, הדגמות מלאכה והפעילויות המשפחתיות. עונת 2026 פתוחה מדי יום 09:00–18:00 עד 1 בנובמבר.",
      time: "2–3 שעות הן קצב טוב למשפחה.",
      tip: "ביום ראשון מתקיימת סדנה פתוחה למשפחות בין 11:00 ל-16:00 ללא הרשמה מוקדמת; ייתכן תשלום קטן על חומרים.",
      url: "https://www.vogtsbauernhof.de/en"
    },
    "Sommerrodelbahn Gutach": {
      what: "מגלשת הרים מסוג Alpine Coaster ליד Vogtsbauernhof, שבה כל נוסע שולט במהירות בעזרת ידיות בלימה.",
      see: "ירידה של כ-850 מטר ונוף של עמק Kinzig. אפשר לנסוע לבד או בזוג.",
      time: "30–60 דקות לרוב מספיקות, תלוי בתור ובכמה פעמים הילדים רוצים לעלות.",
      tip: "מגיל 8 אפשר לגלוש לבד, בכפוף לגובה מינימלי 1.35 מ'; מגיל 3 אפשר עם מלווה. הפעילות תלויה במזג האוויר.",
      url: "https://www.sommerrodelbahn-gutach.de/en/summer-toboggan-run/"
    },
    "Guémar": {
      what: "כפר אלזסי קטן המשמש אותנו כבסיס הלינה לשלושת הלילות באזור היין.",
      see: "אין צורך 'לסמן' כאן אטרקציות. הערך שלו הוא מיקום שקט ונוח בין Colmar, Riquewihr, Ribeauvillé והטירה.",
      time: "הליכה של 20–40 דקות בכפר מספיקה אם רוצים לצאת בערב מהבית.",
      tip: "נצלו את Guémar למנוחה, קניות בסופר וארוחות ביתיות. את האנרגיה שומרים לכפרים ולאטרקציות שמסביב.",
      url: "https://www.visit.alsace/en/"
    },
    "Riquewihr": {
      what: "אחד הכפרים המפורסמים בדרך היין של אלזס, עם בתי עץ צבעוניים, רחובות מרוצפים ושערים מימי הביניים.",
      see: "הרחוב הראשי, אזור Dolder, החומות והסמטאות הקטנות. כל הכיף הוא ללכת לאט ולהסתכל על החזיתות.",
      time: "60–90 דקות בדרך כלל מספיקות.",
      tip: "הכפר קטן אבל עמוס בתיירים. הגיעו אחרי הצ'ק-אין בשעות אחר הצהריים המאוחרות, כשקבוצות היום מתחילות להתפזר.",
      url: "https://www.visit.alsace/en/the-alsace-wine-route/typical-villages/"
    },
    "Ribeauvillé": {
      what: "עיירת יין היסטורית גדולה מעט יותר מ-Riquewihr, עם Grand'Rue ארוך, מזרקות, בתי עץ והרים עם שרידי טירות מעליה.",
      see: "Grand'Rue, Tour des Bouchers והכיכרות לאורך הרחוב. אין צורך לטפס לטירות ביום המעבר.",
      time: "60–90 דקות לשיטוט רגוע.",
      tip: "אם כולם עייפים אחרי Riquewihr, אפשר לבחור רק אחת משתי העיירות. עדיף ליהנות מאחת מאשר לרוץ בין שתיהן.",
      url: "https://www.visit.alsace/en/the-alsace-wine-route/typical-villages/"
    },
    "Château du Haut-Koenigsbourg": {
      what: "הטירה האיקונית ביותר באלזס, יושבת בגובה 757 מטר ומציעה שילוב של מבצר משוחזר, היסטוריה ונוף רחב אל המישור והיער השחור.",
      see: "החצרות, חדרי המגורים, הנשקייה והנוף מהחומות. ביקור עצמאי בתוך הטירה נמשך בערך שעה.",
      time: "האתר ממליץ לחשב בערך שעתיים מהרכב ועד החזרה אליו.",
      tip: "יש שביל עפר בעלייה של כ-300 מטר מהחניה והמסלול בתוך הטירה כולל כ-300 מדרגות על 21 מפלסים. יש מקומות ישיבה לאורך הדרך; להורים מחליטים במקום לפי האנרגיה.",
      url: "https://www.haut-koenigsbourg.fr/en/practical-informations/"
    },
    "La Montagne des Singes": {
      what: "פארק יער שבו חיים קופי מקוק ברברי בסביבה פתוחה, כך שהביקור מרגיש יותר כמו הליכה בטבע מאשר גן חיות רגיל.",
      see: "התנהגות הקופים, האינטראקציות ביניהם וההסברים של אנשי הצוות. זה ניגוד טוב לטירה של הבוקר.",
      time: "כשעה עד שעה וחצי לביקור משפחתי רגוע.",
      tip: "לבוא עם נעלי הליכה וביגוד שמתאים ליער ולמזג האוויר. לא נוגעים בקופים ולא מנסים להאכיל אותם באופן עצמאי.",
      url: "https://www.montagnedessinges.com/en/"
    },
    "Little Venice": {
      what: "החלק המצולם ביותר של Colmar, שבו נהר Lauch עובר בין בתי עץ צבעוניים ורחובות עתיקים.",
      see: "הגשרים סביב Quai de la Poissonnerie ו-Krutenau. אפשר לשלב שיט קצר בסירה שטוחה.",
      time: "45–60 דקות ברגל; יותר אם מוסיפים שיט וקפה.",
      tip: "הגיעו מוקדם יחסית לפני העומס. השיט הקצר יכול להיות הפסקה מצוינת להורים אחרי הליכה בעיר העתיקה.",
      url: "https://www.tourisme-colmar.com/en/whats-on/sports-nature/sports-activities/F235008803_little-venice-colmar"
    },
    "Marché Couvert": {
      what: "השוק המקורה של Colmar שוכן במבנה לבנים ומתכת משנת 1865 וחזר לשמש כשוק מזון מקומי.",
      see: "כ-20 דוכנים עם ירקות, גבינות, מאפים, בשר, דגים ומוצרים אזוריים.",
      time: "30–60 דקות, במיוחד אם משתמשים בו לעצירת צהריים.",
      tip: "זה מקום טוב לתת לכל אחד לבחור משהו אחר לאכול בלי להתחייב למסעדה גדולה של תשעה אנשים.",
      url: "https://www.tourisme-colmar.com/en/eat-drink/selection-of-shops/the-covered-market"
    },
    "Eguisheim": {
      what: "כפר ימי-ביניימי קטן מדרום ל-Colmar, בנוי במעגלים סביב הטירה ומדורג בין 'הכפרים היפים בצרפת'.",
      see: "הרחובות המעגליים, בתי העץ הצבעוניים, המזרקות והכיכר המרכזית. המסלול הרשמי העצמאי סביב הכפר נמשך בערך שעה.",
      time: "60–90 דקות בקצב רגוע.",
      tip: "זה יעד מושלם לאחר הצהריים כי הוא קטן ומרוכז. אין צורך להוסיף גם Kaysersberg אם המשפחה כבר עייפה.",
      url: "https://www.visit.alsace/253000781-eguisheim/"
    },
    "Zurich Old Town": {
      what: "המרכז ההיסטורי של ציריך משתרע משני צדי נהר Limmat וכולל כנסיות, בתי גילדות, סמטאות וכיכרות.",
      see: "Niederdorf, Grossmünster, Fraumünster, Lindenhof ו-Schipfe. Lindenhof נותן תצפית יפה בלי צורך בטיפוס גדול.",
      time: "שעה וחצי עד שעתיים וחצי, תלוי כמה נכנסים לכנסיות וכמה עוצרים.",
      tip: "זה היום האחרון – לא צריך 'לכבוש' את ציריך. בחרו לולאה קצרה סביב Limmat ו-Lindenhof והישארו עם אנרגיה לאריזה.",
      url: "https://www.zuerich.com/en/sightseeing-activities/places-to-visit/zurichs-old-town"
    },
    "Bürkliplatz / Lake Zurich": {
      what: "רחבה וטיילת בקצה Bahnhofstrasse על שפת אגם ציריך, עם מבט פתוח לאורך האגם ולעיתים עד האלפים.",
      see: "Bürkliterrasse, הנמל הקטן והטיילת לכיוון Bellevue. זה מקום לשבת ולהירגע יותר מאשר 'אטרקציה'.",
      time: "30–60 דקות מספיקות.",
      tip: "אם מזג האוויר בהיר, זה מקום מצוין לסיים בו את הטיול לפני ארוחת ערב מוקדמת וחזרה למלון.",
      url: "https://www.zuerich.com/en/visit/attractions/burkliterrasse-zurichs-front-row-seat-by-the-lake"
    },
    "Zurich Airport / SIXT return": {
      what: "נקודת סיום הטיול: החזרת הרכב ולאחריה כניסה לטרמינל לטיסת LY348.",
      see: "אין כאן סיור – המטרה היא החזרה מסודרת של הרכב ומעבר לשדה ללא לחץ.",
      time: "החזרת SIXT מתוכננת ל-08:00 והטיסה ל-10:55, כך שיש כמעט שלוש שעות עד ההמראה.",
      tip: "לפני מסירת המפתח צלמו את הרכב מכל הצדדים, מד הדלק והקילומטראז', ודאו שלא נשארו מטענים או חפצים בתאים.",
      url: "https://www.flughafen-zuerich.ch/en/passengers"
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .day-points li { flex-wrap: wrap; align-items: flex-start; }
    .day-points .place-info {
      flex: 0 0 100%;
      width: 100%;
      margin-top: 2px;
      border: 1px solid color-mix(in srgb, var(--trip-pine) 18%, var(--trip-line));
      border-radius: 12px;
      background: color-mix(in srgb, var(--trip-sky) 38%, var(--trip-paper-bright));
      overflow: hidden;
    }
    .day-points .place-info > summary {
      display: flex;
      grid-template-columns: none;
      min-height: 0;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      color: var(--trip-navy);
      font-size: .8rem;
      font-weight: 850;
    }
    .day-points .place-info > summary::after {
      content: "+";
      color: var(--trip-sun);
      font-size: 1.15rem;
      line-height: 1;
    }
    .day-points .place-info[open] > summary::after { content: "−"; }
    .day-points .place-info__body {
      display: grid;
      gap: 8px;
      padding: 0 12px 14px;
      color: var(--trip-muted);
    }
    .day-points .place-info__body p {
      margin: 0;
      color: var(--trip-muted);
      font-size: .84rem;
      line-height: 1.55;
    }
    .day-points .place-info__body b { color: var(--trip-ink); }
    .day-points .place-info__source {
      justify-self: start;
      margin-top: 2px;
      font-size: .78rem;
      font-weight: 800;
    }
  `;
  document.head.append(style);

  document.querySelectorAll(".day-points li").forEach((item) => {
    const link = item.querySelector(":scope > a");
    if (!link || item.querySelector(".place-info")) return;
    const info = placeInfo[link.textContent.trim()];
    if (!info) return;
    const details = document.createElement("details");
    details.className = "place-info";
    details.innerHTML = `
      <summary>מידע על המקום</summary>
      <div class="place-info__body">
        <p><b>מה זה:</b> ${info.what}</p>
        <p><b>מה לא לפספס:</b> ${info.see}</p>
        <p><b>כמה זמן:</b> ${info.time}</p>
        <p><b>טיפ למשפחה:</b> ${info.tip}</p>
        ${info.url ? `<a class="place-info__source" href="${info.url}" target="_blank" rel="noopener noreferrer">מידע רשמי ועדכני ↗</a>` : ""}
      </div>`;
    item.append(details);
  });
})();
