/*
 * TO'Y MA'LUMOTLARI / ДАННЫЕ СВАДЬБЫ
 * Barcha o'zgarishlarni shu faylda qiling — ikkala til sahifasi ham shu yerdan oladi.
 * Все изменения вносите здесь — обе языковые версии берут данные отсюда.
 */
window.WEDDING = {
  // To'y sanasi va vaqti (Toshkent vaqti, +05:00)
  date: "2026-11-07T18:00:00+05:00",
  durationHours: 5,

  // To'yxona koordinatalari (Google/Yandex xaritadan olinadi)
  coords: { lat: 40.145412, lng: 67.806984 },
  // Google Maps'dagi to'yxona havolasi (QR kod va "Google Maps" tugmasi shu yerga olib boradi)
  googleMapsUrl: "https://maps.app.goo.gl/eh2fzMNL1rDJyXiYA",

  // Fon musiqasi: faylni assets/audio/ ga qo'ying va yo'lini yozing, masalan "../assets/audio/music.mp3"
  music: "",

  uz: {
    groom: "Abdullajon",
    bride: "Shahzodaoy",
    venue: "«BEK» to'yxonasi",
    address: "Jizzax viloyati, Moskva kolxozi",
    hosts: "Ergash bobo o'g'li Umid Mamajonovlar oilasi"
  },
  ru: {
    groom: "Абдуллажон",
    bride: "Шахзодаой",
    venue: "Свадебный зал «BEK»",
    address: "Джизакская область, колхоз «Москва»",
    hosts: "семья Умида Мамажонова, сына Эргаш бобо"
  }
};
