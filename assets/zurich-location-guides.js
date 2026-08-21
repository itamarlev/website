(() => {
  if (!window.location.pathname.includes("/trips/zurich-black-forest-alsace-2026/")) return;

  const commons = (name) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}`;

  const photoFixes = {
    7: {
      primary: commons("Riquewihr Rue du Général de Gaulle.jpg"),
      fallback: commons("Riquewihr-001.jpg")
    },
    8: {
      primary: commons("Chateau du haut koenigsbourg.jpg"),
      fallback: commons("Haut Koenigsbourg en Alsace.jpg")
    },
    9: {
      primary: commons("Colmar petite venise.jpg"),
      fallback: commons("ColmarPetiteVenise.jpg")
    },
    10: {
      primary: commons("Zürich mit Altstadt, Limmat und Grossmünster.jpg"),
      fallback: commons("Old town Zurich.jpg")
    },
    11: {
      primary: commons("Zürich airport.jpg"),
      fallback: commons("Zurich Airport Terminal (186313365).jpeg")
    }
  };

  Object.entries(photoFixes).forEach(([day, photo]) => {
    const chapter = document.querySelector(`#day-${day}`);
    const trigger = chapter?.querySelector(".day-photo");
    const image = trigger?.querySelector("img");
    if (!image || !trigger) return;

    let usedFallback = false;
    image.addEventListener("error", () => {
      if (usedFallback) return;
      usedFallback = true;
      image.src = photo.fallback;
      trigger.dataset.lightboxSrc = photo.fallback;
    });

    image.src = photo.primary;
    trigger.dataset.lightboxSrc = photo.primary;
  });

  const p = (description, highlight, time, tip, url) => ({ description, highlight, time, tip, url });

  const placeInfo = {
    "Zurich Airport": p(
      "שדה התעופה הבינלאומי של ציריך הוא שער הכניסה לטיול ונקודת המעבר הראשונה לפני איסוף הרכב. זה שדה גדול אך מסודר, עם שילוט ברור לרכבות, השכרת רכב ומרכז הקניות Airport Center.",
      "ביום ההגעה אין סיבה להתעכב: ביקורת גבולות, מזוודות, שירותים אם צריך, ואז ללכת ישירות למרכז השכרת הרכב.",
      "כדאי לחשב בערך 45–75 דקות מהנחיתה עד היציאה ברכב, תלוי בתור ובמזוודות.",
      "האיסוף מתוכנן ל-20:30, רק חצי שעה אחרי הנחיתה המתוכננת. אם יש עיכוב, דלגו על קפה וקניות וטפלו קודם ברכב.",
      "https://www.flughafen-zuerich.ch/en/passengers"
    ),
    "Hilton Garden Inn Zurich Limmattal": p(
      "המלון ב-Spreitenbach הוא בסיס לוגיסטי נוח ללילה הראשון וללילה האחרון, מערבית למרכז ציריך ובדרך הטבעית בין שדה התעופה לכיוון היער השחור. המטרה כאן היא נוחות, חניה ושינה טובה יותר מאשר תיירות.",
      "בלילה הראשון פשוט עושים צ'ק-אין ונחים. בלילה האחרון כדאי להשתמש בו כתחנת אריזה מסודרת לפני היציאה המוקדמת לשדה.",
      "אין צורך להקדיש זמן מיוחד למלון מעבר לצ'ק-אין, ארוחת ערב/בוקר והתארגנות.",
      "בלילה האחרון הניחו ליד הדלת דרכונים, מפתחות רכב, מטענים ומזוודות מוכנות כדי שהבוקר לא יהפוך לחיפוש חפצים.",
      "https://www.hilton.com/en/hotels/zrhspgi-hilton-garden-inn-zurich-limmattal/"
    ),
    "Freiburg Minster": p(
      "קתדרלת פרייבורג היא הסמל של העיר ואחד המבנים הגותיים המרשימים בדרום גרמניה. הצריח המערבי מתנשא לכ-116 מטר, והכיכר שמסביבה היא לב העיר העתיקה.",
      "כדאי להסתכל על החזית והגרגוילים מבחוץ, להיכנס לחלל הפנימי ואז להסתובב ב-Münsterplatz ובשוק אם הוא פעיל. העלייה למגדל מתאימה למי שרוצה תצפית ועומד במדרגות.",
      "30–45 דקות לקתדרלה ולכיכר; יותר אם עולים למגדל או יושבים לקפה.",
      "העלייה למגדל כוללת הרבה מדרגות ואינה מתאימה לכולם. ההורים יכולים ליהנות מהכיכר והקתדרלה בלי לוותר על החוויה המרכזית.",
      "https://visit.freiburg.de/en/freiburg-muenster-cathedral"
    ),
    "Freiburg Old Town": p(
      "העיר העתיקה של פרייבורג היא אזור קומפקטי ונעים של רחובות היסטוריים, בתי קפה, שערי עיר ותעלות Bächle קטנות שזורמות לאורך המדרכות. זה מקום שמתאים יותר לשיטוט מאשר לרשימת 'חובה' קשיחה.",
      "עברו דרך Münsterplatz, Rathausplatz, Konviktstraße והרחובות סביב Schwabentor ו-Martinstor. שימו לב ל-Bächle ולחזיתות הצבעוניות.",
      "כשעה וחצי עד שעתיים בקצב משפחתי כולל עצירה לאוכל.",
      "קבעו נקודת מפגש אחת במרכז. כך מי שמתעייף יכול לשבת בבית קפה בזמן שהילדים והנוער ממשיכים עוד כמה רחובות.",
      "https://visit.freiburg.de/en"
    ),
    "Schlossbergbahn Freiburg": p(
      "ה-Schlossbergbahn הוא פוניקולר קצר שמחבר את Stadtgarten עם אזור Schlossberg שמעל פרייבורג. הוא חוסך את העלייה הרגלית ומביא אתכם במהירות לאזור תצפיות ירוק מעל העיר.",
      "העניין העיקרי הוא הנוף חזרה אל העיר, הצריח של הקתדרלה וההרים סביב. אם מזג האוויר בהיר, זו תוספת יפה בלי להפוך את היום לטיול רגלי ארוך.",
      "30–60 דקות לעלייה, תצפית וירידה.",
      "זו אפשרות טובה במיוחד להורים כי הנסיעה קצרה וחוסכת טיפוס. אם הראות גרועה, אפשר לוותר בלי להרגיש שהפסדתם יעד מרכזי.",
      "https://visit.freiburg.de/en/schlossbergbahn"
    ),
    "Gengenbach Old Town": p(
      "Gengenbach היא עיירת יער שחור קטנה עם מרכז היסטורי שמור, בתי עץ, שערי עיר וכיכר שוק נעימה. היא נותנת תחושה הרבה יותר 'כפרית' מפרייבורג ומתאימה במיוחד לערב רגוע.",
      "לכו לאורך Hauptstraße עד Marktplatz, הסתכלו על Rathaus והיכנסו לסמטאות הקצרות סביב המרכז. בשעת ערב האור והאווירה נהדרים לצילום.",
      "60–90 דקות מספיקות בהחלט.",
      "אל תהפכו אותה לעוד יום מלא. היא מושלמת כטיול קצר וארוחת ערב אחרי הצ'ק-אין ב-Offenburg.",
      "https://www.gengenbach.info/"
    ),
    "Triberg Waterfalls": p(
      "מפלי טריברג הם רצף של מפלים ומדרגות מים בתוך יער תלול והם אחד האתרים המזוהים ביותר עם היער השחור. היתרון הוא שאפשר לבחור כמה לעלות ולא חייבים להשלים מסלול ארוך.",
      "התחילו בנקודות התצפית התחתונות ורק אז החליטו אם להמשיך גבוה יותר. המסלולים עוברים ביער ונותנים מבטים שונים על המים, הגשרים והסלעים.",
      "כשעה למסלול קצר; 90–120 דקות אם ממשיכים גבוה יותר.",
      "ההורים יכולים לעצור בתצפיות הנמוכות בזמן שהקבוצה הפעילה ממשיכה. נעלי הליכה עם אחיזה עדיפות כי השביל עלול להיות לח.",
      "https://www.triberg.de/english/tourismus-1/sights/germanys-highest-waterfalls"
    ),
    "Triberg im Schwarzwald": p(
      "Triberg היא עיירת תיירות קטנה בלב היער השחור, מוכרת בזכות שעוני קוקייה, עוגת היער השחור וה-Museum Schwarzwald. היא משמשת כהשלמה נוחה לביקור במפלים.",
      "אחרי המפלים אפשר לשוטט ברחוב הראשי, להיכנס לכמה חנויות שעונים ולבחור במוזיאון אם מזג האוויר פחות טוב.",
      "45–90 דקות אחרי המפלים.",
      "אל תרגישו צורך לקנות שעון קוקייה במקום הראשון. אם באמת רוצים אחד, השוו בין כמה חנויות ושאלו איפה המנגנון יוצר.",
      "https://www.triberg.de/english/tourismus-1/sights/schwarzwaldmuseum-blackforest-museum"
    ),
    "Europa-Park": p(
      "Europa-Park הוא פארק השעשועים הגדול בגרמניה, מחולק לאזורים בסגנון מדינות אירופה וכולל יותר ממאה מתקנים ומופעים. הוא מתאים מאוד לטווח הגילים של הילדים והנוער שלכם כי אפשר לבנות יום שונה לכל רמת אומץ.",
      "לנוער כדאי לבדוק Voltron, Silver Star, blue fire ו-WODAN. מי שפחות אוהב אקסטרים יכול ליהנות ממתקנים משפחתיים, מופעים ואזורים מעוצבים בלי להישאר מחוץ לחוויה.",
      "יום מלא, מהפתיחה ועד אחר הצהריים/ערב.",
      "אל תנסו לנוע כל היום כתשעה אנשים. התפצלו לזוגות/קבוצות קטנות וקבעו שתי נקודות מפגש קבועות באפליקציה או ב-WhatsApp.",
      "https://www.europapark.de/en/theme-park/plan-your-europa-park-visit"
    ),
    "Caracalla Therme": p(
      "Caracalla Therme הוא מתחם מרחצאות תרמיים מודרני בלב Baden-Baden עם בריכות פנימיות וחיצוניות, מים חמים ואזורי מנוחה. זה יום מנוגד מצוין ל-Europa-Park ומתאים במיוחד להורים ולמבוגרים שרוצים קצב רגוע.",
      "התמקדו בבריכות התרמיות ובזמן מנוחה ולא בניסיון 'למצות' את כל המתחם. אפשר לשלב אחר כך ארוחה והליכה קצרה בעיר.",
      "כ-3 שעות הן ביקור טוב; אפשר להישאר יותר אם נהנים.",
      "לא לשכוח בגד ים, כפכפים ובגדים נוחים להחלפה. בדקו סמוך לנסיעה את המחיר והמבצע של ספטמבר.",
      "https://caracalla.de/"
    ),
    "Lichtentaler Allee": p(
      "Lichtentaler Allee היא טיילת-פארק ארוכה לאורך נהר Oos עם עצים עתיקים, גנים, מוזיאונים ובתי מידות. היא אחת הדרכים הנעימות לראות את Baden-Baden בלי להפוך את היום למסלול תיירותי מאומץ.",
      "אפשר להתחיל ליד Kurhaus ופשוט ללכת לאורך הנהר עד שמתחשק לחזור. אין צורך להשלים את כל 3 הקילומטרים.",
      "30–60 דקות של הליכה חלקית מספיקות ביום הספא.",
      "המסלול שטוח יחסית ומתאים להורים. ביום חם או עייף, אפשר לקצר ולהסתפק באזור המרכזי.",
      "https://www.baden-baden.com/en/nature/lichtentaler-allee"
    ),
    "Batorama": p(
      "Batorama הוא שיט תיירותי על נהר Ill ותעלות Strasbourg שמאפשר לראות הרבה מהעיר בישיבה. עבור קבוצה רב-דורית זו דרך מצוינת לקבל 'תמונה גדולה' של העיר לפני שמתחילים ללכת.",
      "במהלך השיט עוברים ליד Petite France, ביצורים, שכונות היסטוריות ואזורים מודרניים יותר. בחרו סירה סגורה או מתכווננת אם התחזית לא יציבה.",
      "בערך 60–70 דקות למסלול המרכזי.",
      "לתשעה אנשים הזמינו את אותה יציאה מראש והגיעו מוקדם. זה גם נותן להורים מנוחה לפני החלק הרגלי של היום.",
      "https://www.batorama.com/en"
    ),
    "Strasbourg Cathedral": p(
      "קתדרלת Notre-Dame היא הסמל של Strasbourg, בנויה מאבן חול ורודה ובעלת צריח יחיד דרמטי בגובה כ-142 מטר. בפנים נמצאים ויטראז'ים, חלל גותי גבוה והשעון האסטרונומי המפורסם.",
      "התעכבו על החזית המפוסלת, חלון הרוזטה והשעון האסטרונומי. מי שרוצה תצפית יכול לעלות לפלטפורמה, אך זו עלייה ארוכה במדרגות.",
      "30–45 דקות לביקור בקתדרלה; יותר אם עולים לפלטפורמה.",
      "הפלטפורמה דורשת מאות מדרגות. ההורים יכולים להישאר בכיכר ובקתדרלה בזמן שהנוער והמבוגרים הפעילים עולים.",
      "https://www.visitstrasbourg.fr/en/discover/must-see-attractions/the-cathedral/"
    ),
    "Petite France": p(
      "Petite France הוא הרובע הציורי ביותר ב-Strasbourg, עם בתי עץ, תעלות, גשרים קטנים ורחובות ששימשו בעבר בורסקאים, טוחנים ודייגים. זה האזור שבו הכי כיף פשוט להאט.",
      "חפשו את Rue du Bain-aux-Plantes, Place Benjamin Zix, Pont du Faisan והבתים המשופצים לאורך המים.",
      "60–90 דקות כולל קפה וצילומים.",
      "אחרי Batorama אין צורך לחזור על כל מה שראיתם מהמים. בחרו לולאה קצרה ויפה, במיוחד אם ההורים כבר הלכו הרבה.",
      "https://www.visitstrasbourg.fr/en/discover/strasbourg-and-its-surrounding-area/petite-france/"
    ),
    "Ponts Couverts": p(
      "Ponts Couverts הם שרידים ממערכת הביצורים של Strasbourg: גשרים ומגדלי שמירה מימי הביניים סביב זרועות נהר Ill. השם 'הגשרים המקורים' נשאר גם אחרי שהגגות המקוריים הוסרו.",
      "הנקודה הטובה היא השילוב של המגדלים, המים ו-Barrage Vauban הסמוך. מהטרסה של Vauban מתקבלת תצפית יפה חזרה ל-Petite France.",
      "20–30 דקות אם כבר נמצאים באזור.",
      "זה מקום מצוין לסיים בו את המסלול הרגלי ולא יעד שמצדיק נסיעה נפרדת.",
      "https://www.visitstrasbourg.fr/en/things-to-see-and-do/visiting/places-to-visit/historical-sites-and-monuments/f223007617_the-covered-bridges-strasbourg/"
    ),
    "Vogtsbauernhof": p(
      "Vogtsbauernhof הוא מוזיאון פתוח גדול שמרכז בתי חווה היסטוריים מהיער השחור וממחיש איך משפחות חיו, עבדו, בישלו וייצרו לאורך מאות שנים. הוא הרבה יותר חי ממוזיאון רגיל כי מסתובבים בין מבנים, בעלי מלאכה וגנים.",
      "היכנסו לפחות לכמה בתי חווה, חפשו הדגמות מלאכה וראו אילו פעילויות משפחתיות מתקיימות באותו יום.",
      "2–3 שעות בקצב משפחתי טוב.",
      "ביום ראשון יש פעילויות משפחתיות, ולכן עדיף להגיע לפני הצהריים ולא להשאיר את הכול לסוף היום.",
      "https://www.vogtsbauernhof.de/en"
    ),
    "Sommerrodelbahn Gutach": p(
      "Sommerrodelbahn Gutach היא מגלשת הרים שבה יושבים בקרונית ושולטים במהירות בעצמכם בעזרת בלמים. הירידה מתפתלת במדרון ונותנת לילדים ולנוער פעילות קצרה ואנרגטית אחרי המוזיאון.",
      "הכיף הוא לעשות יותר מסיבוב אחד אם התור קצר. מהאזור יש גם נוף יפה של עמק Kinzig.",
      "30–60 דקות בדרך כלל מספיקות.",
      "הפעילות תלויה במזג האוויר. ההורים יכולים לשבת ולצפות בזמן שהילדים והמבוגרים הפעילים עושים כמה סיבובים.",
      "https://www.sommerrodelbahn-gutach.de/en/summer-toboggan-run/"
    ),
    "Guémar": p(
      "Guémar הוא כפר אלזסי קטן ושקט שישמש אתכם כבסיס לשלושה לילות. הוא לא נועד להיות 'אטרקציה מרכזית' אלא מקום נוח מאוד בין Colmar, Ribeauvillé, Riquewihr והטירה.",
      "אם נשאר כוח בערב, אפשר לעשות סיבוב קצר בכפר; אבל הערך האמיתי הוא לחזור לבית, לנוח, לקנות בסופר ולהתארגן ליום הבא.",
      "20–40 דקות לשיטוט מקומי, רק אם מתחשק.",
      "אל תעמיסו עליו משימות. השתמשו בו בתור בסיס אמיתי שמאפשר למשפחה להוריד קצב.",
      "https://www.visit.alsace/en/"
    ),
    "Riquewihr": p(
      "Riquewihr הוא אחד הכפרים המזוהים ביותר עם דרך היין של אלזס: רחוב ראשי מרוצף, בתי עץ צבעוניים, חומות ושערים מימי הביניים, וכל זה מוקף כרמים. הוא קטן, מרוכז וצילומי מאוד.",
      "לכו לאורך Rue du Général de Gaulle עד Dolder, הציצו בסמטאות הצדדיות ובחומות ואל תמהרו בין חנויות המזכרות.",
      "60–90 דקות בקצב רגוע.",
      "אחר הצהריים המאוחרים עדיפים כי חלק מקבוצות היום כבר עוזבות. האבנים ברחוב עלולות להיות פחות נוחות, אז נעליים טובות יעזרו.",
      "https://www.visit.alsace/en/the-alsace-wine-route/typical-villages/"
    ),
    "Ribeauvillé": p(
      "Ribeauvillé גדולה יותר מ-Riquewihr ומרגישה יותר כמו עיירת יין חיה: Grand'Rue ארוך, מזרקות, בתי עץ ומגדלים, ומעל העיר נראים שרידי שלוש טירות.",
      "התמקדו ב-Grand'Rue, Tour des Bouchers והכיכרות הקטנות שלאורכו. ביום המעבר אין צורך לטפס לטירות שמעל העיר.",
      "60–90 דקות.",
      "אם כולם כבר עייפים אחרי Riquewihr, בחרו רק חלק קצר של הרחוב הראשי. עדיף ליהנות מאחת העיירות לעומק מאשר לרוץ ביניהן.",
      "https://www.visit.alsace/en/the-alsace-wine-route/typical-villages/"
    ),
    "Château du Haut-Koenigsbourg": p(
      "Haut-Koenigsbourg היא טירת הרים אדירה על רכס בגובה כ-757 מטר, עם חומות, מגדלים, חצרות וחדרים משוחזרים. המיקום מאפשר להבין למה האזור היה חשוב אסטרטגית וגם נותן נוף רחב על מישור אלזס והיער השחור.",
      "עברו דרך החצרות, חדרי המגורים, הנשקייה והחומות. הנוף החוצה חשוב כמעט כמו החדרים עצמם.",
      "כדאי לחשב בערך שעתיים מהרכב ועד החזרה אליו.",
      "המסלול כולל הרבה מדרגות ועליות. לכו לאט, עצרו בישיבה כשאפשר, ותנו להורים להחליט במקום כמה מהמסלול הפנימי מתאים להם.",
      "https://www.haut-koenigsbourg.fr/en/practical-informations/"
    ),
    "La Montagne des Singes": p(
      "La Montagne des Singes הוא פארק יער שבו מקוקי ברברי מסתובבים בשטח פתוח יחסית, ולכן הביקור מרגיש כמו הליכה בתוך סביבת בעלי חיים ולא כמו גן חיות עם כלובים. הוא רגוע, ירוק ונגיש יותר מהטירה.",
      "הסתכלו על ההתנהגות החברתית של הקופים והקשיבו להסברים של הצוות. זה מקום שבו הילדים מקבלים הרבה גם בלי 'מתקן' או מופע.",
      "כשעה עד שעה וחצי.",
      "לא נוגעים בקופים ולא מאכילים אותם עצמאית. נעלי הליכה נוחות וביגוד לשטח יעשו את הביקור נעים יותר.",
      "https://www.montagnedessinges.com/en/"
    ),
    "Little Venice": p(
      "Little Venice הוא החלק האיקוני ביותר של Colmar, שבו נהר Lauch עובר בין בתי עץ צבעוניים, גשרים ופרחים. האזור קטן יחסית אבל נותן את התמונות הקלאסיות של העיר.",
      "חפשו את הגשרים סביב Quai de la Poissonnerie ו-Krutenau. אם יש שיט בסירה שטוחה בזמן מתאים, הוא נותן זווית אחרת וגם הפסקה מהרגליים.",
      "45–60 דקות ברגל; יותר עם שיט וקפה.",
      "הגיעו מוקדם ככל האפשר כדי ליהנות לפני העומס. השיט יכול להיות מנוחה מצוינת להורים באמצע הבוקר.",
      "https://www.tourisme-colmar.com/en/whats-on/sports-nature/sports-activities/F235008803_little-venice-colmar"
    ),
    "Marché Couvert": p(
      "השוק המקורה של Colmar פועל במבנה היסטורי משנת 1865 ומרכז דוכני מזון ומוצרים מקומיים. הוא שימושי במיוחד לקבוצה גדולה כי כל אחד יכול לבחור משהו אחר בלי להזמין שולחן ארוך במסעדה.",
      "עברו בין הדוכנים, חפשו גבינות, מאפים, ירקות ומוצרים אלזסיים, והשתמשו בו כעצירת צהריים קלה.",
      "30–60 דקות.",
      "זה מקום טוב לתת לילדים ולמבוגרים לבחור אוכל בקצב שלהם ולחסוך ויכוח על מסעדה אחת שמתאימה לתשעה אנשים.",
      "https://www.tourisme-colmar.com/en/eat-drink/selection-of-shops/the-covered-market"
    ),
    "Eguisheim": p(
      "Eguisheim הוא כפר ימי-ביניימי קטן שבנוי במעגלים סביב מרכז עתיק, עם רחובות צרים, בתי עץ צבעוניים, מזרקות וכרמים מסביב. הוא מרוכז מאוד ולכן מתאים מצוין לסוף יום בלי עוד הרבה נסיעה או הליכה.",
      "עשו לולאה ברחובות המעגליים, עברו בכיכר המרכזית וצאו לכמה דקות לשולי הכפר כדי לראות את הכרמים.",
      "60–90 דקות.",
      "אחרי יום ב-Colmar אין צורך להוסיף גם Kaysersberg אם כולם עייפים. Eguisheim לבדו נותן סיום מצוין.",
      "https://www.visit.alsace/253000781-eguisheim/"
    ),
    "Zurich Old Town": p(
      "העיר העתיקה של ציריך משתרעת משני צדי נהר Limmat ומשלבת סמטאות, בתי גילדות, כנסיות, בתי קפה וכיכרות. היא קומפקטית מספיק לחצי יום ומאפשרת לבחור מסלול קל בהתאם לאנרגיה של כולם.",
      "בחרו לולאה דרך Niederdorf, Grossmünster, Münsterbrücke, Fraumünster ו-Lindenhof. מ-Lindenhof יש תצפית יפה על הנהר והעיר בלי טיפוס ארוך במיוחד.",
      "שעה וחצי עד שעתיים וחצי.",
      "זה היום האחרון, לכן עדיף מסלול קצר ונעים על ניסיון לראות את כל ציריך. השאירו כוח לאריזה ולבוקר הטיסה.",
      "https://www.zuerich.com/en/sightseeing-activities/places-to-visit/zurichs-old-town"
    ),
    "Bürkliplatz / Lake Zurich": p(
      "Bürkliplatz נמצאת בקצה Bahnhofstrasse מול אגם ציריך ומשמשת נקודת מפגש בין מרכז העיר, הטיילת והסירות. ביום בהיר נפתחת מכאן תחושת מרחב יפה לאורך האגם ולעיתים גם אל ההרים.",
      "עברו ב-Bürkliterrasse, התקרבו למים ולכו קטע קצר לכיוון Bellevue. זה מקום לשבת ולהסתכל, לא יעד שצריך 'להספיק'.",
      "30–60 דקות.",
      "אם מזג האוויר טוב, זה מקום מושלם לסיים בו את הטיול לפני ארוחת ערב מוקדמת וחזרה למלון.",
      "https://www.zuerich.com/en/visit/attractions/burkliterrasse-zurichs-front-row-seat-by-the-lake"
    ),
    "Zurich Airport / SIXT return": p(
      "זו נקודת הסיום הלוגיסטית של הטיול: כניסה לאזור החזרת הרכב, מסירת ה-SIXT ואז מעבר לטרמינל. בבוקר כזה המטרה היא פשטות ולא עוד עצירה בדרך.",
      "לפני מסירת המפתח צלמו את הרכב מכל הצדדים, את מד הדלק ואת הקילומטראז', ורק אז עברו עם כל המזוודות לטרמינל.",
      "החזרת הרכב מתוכננת ל-08:00 והטיסה ל-10:55, כך שיש כמעט שלוש שעות עד ההמראה.",
      "עשו בדיקה אחרונה של תא המטען, הכיסים בדלתות, מטענים וכיסאות לפני שעוזבים את הרכב.",
      "https://www.flughafen-zuerich.ch/en/passengers"
    )
  };

  const typeTranslations = {
    "Airport": "שדה תעופה",
    "Hotel": "מלון",
    "Cathedral": "קתדרלה",
    "Old Town": "עיר עתיקה",
    "Old town": "עיר עתיקה",
    "Old quarter": "רובע עתיק",
    "Viewpoint": "תצפית",
    "Evening": "ערב",
    "Waterfalls": "מפלים",
    "Town": "עיירה",
    "Theme Park": "פארק שעשועים",
    "Thermal Spa": "מרחצאות",
    "Walk": "הליכה",
    "Boat tour": "שיט",
    "Open-air museum": "מוזיאון פתוח",
    "Alpine coaster": "מגלשת הרים",
    "Base": "בסיס לינה",
    "Village": "כפר",
    "Castle": "טירה",
    "Wildlife park": "פארק טבע",
    "Market": "שוק",
    "Lake": "אגם"
  };

  const style = document.createElement("style");
  style.textContent = `
    .day-points li {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 6px 12px;
      align-items: start;
    }
    .day-points li > a { grid-column: 1; min-width: 0; }
    .day-points li > span {
      grid-column: 2;
      align-self: center;
      padding: 4px 8px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--trip-sky) 75%, #fff);
      color: var(--trip-pine);
      font-size: .68rem;
      font-weight: 850;
      text-align: center;
      white-space: nowrap;
    }
    .day-points .place-info {
      grid-column: 1 / -1;
      width: 100%;
      margin-top: 2px;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--trip-pine) 18%, var(--trip-line));
      border-radius: 12px;
      background: color-mix(in srgb, var(--trip-sky) 34%, var(--trip-paper-bright));
    }
    .day-points .place-info > summary {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: start;
      padding: 11px 12px;
      color: var(--trip-muted);
      cursor: pointer;
      list-style: none;
    }
    .day-points .place-info > summary::-webkit-details-marker { display: none; }
    .place-info__preview {
      min-width: 0;
      color: var(--trip-muted);
      font-size: .82rem;
      font-weight: 500;
      line-height: 1.55;
    }
    .place-info:not([open]) .place-info__preview {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .place-info__toggle {
      color: var(--trip-pine);
      font-size: .74rem;
      font-weight: 850;
      white-space: nowrap;
    }
    .place-info__body {
      display: grid;
      gap: 9px;
      padding: 0 12px 14px;
      border-top: 1px solid color-mix(in srgb, var(--trip-line) 70%, transparent);
    }
    .place-info__body p {
      margin: 0;
      color: var(--trip-muted);
      font-size: .82rem;
      line-height: 1.6;
    }
    .place-info__body p:first-child { padding-top: 11px; }
    .place-info__body b { color: var(--trip-ink); }
    .place-info__source {
      justify-self: start;
      margin-top: 2px;
      color: var(--trip-pine);
      font-size: .77rem;
      font-weight: 850;
      text-underline-offset: 3px;
    }
    @media (max-width: 520px) {
      .day-points li { grid-template-columns: minmax(0, 1fr) auto; gap: 5px 8px; }
      .day-points li > span { font-size: .64rem; }
      .place-info__preview, .place-info__body p { font-size: .8rem; }
    }
  `;
  document.head.append(style);

  document.querySelectorAll(".day-points li").forEach((item) => {
    const link = item.querySelector(":scope > a");
    if (!link) return;

    const type = item.querySelector(":scope > span");
    if (type && typeTranslations[type.textContent.trim()]) {
      type.textContent = typeTranslations[type.textContent.trim()];
    }

    const info = placeInfo[link.textContent.trim()];
    if (!info) return;

    item.querySelector(".place-info")?.remove();

    const details = document.createElement("details");
    details.className = "place-info";

    const summary = document.createElement("summary");
    const preview = document.createElement("span");
    preview.className = "place-info__preview";
    preview.textContent = info.description;
    const toggle = document.createElement("span");
    toggle.className = "place-info__toggle";
    toggle.textContent = "עוד";
    summary.append(preview, toggle);

    const body = document.createElement("div");
    body.className = "place-info__body";
    body.innerHTML = `
      <p><b>מה לא לפספס:</b> ${info.highlight}</p>
      <p><b>כמה זמן:</b> ${info.time}</p>
      <p><b>טיפ למשפחה:</b> ${info.tip}</p>
      ${info.url ? `<a class="place-info__source" href="${info.url}" target="_blank" rel="noopener noreferrer">מידע רשמי ועדכני ↗</a>` : ""}
    `;

    details.addEventListener("toggle", () => {
      toggle.textContent = details.open ? "פחות" : "עוד";
    });

    details.append(summary, body);
    item.append(details);
  });
})();
