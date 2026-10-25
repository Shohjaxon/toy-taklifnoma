(function () {
  "use strict";

  var W = window.WEDDING;
  var lang = document.documentElement.lang === "ru" ? "ru" : "uz";
  var L = W[lang];
  var date = new Date(W.date);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var T = {
    uz: {
      months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
      days: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
      dow: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
      copied: "Manzil nusxalandi",
      calTitle: "Nikoh to'yi"
    },
    ru: {
      months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      monthsNom: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dow: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      copied: "Адрес скопирован",
      calTitle: "Свадьба"
    }
  }[lang];

  // To'y vaqtini Toshkent vaqtida ko'rsatamiz, mehmon qaysi mintaqada bo'lishidan qat'i nazar
  var tz = new Date(date.getTime() + 5 * 3600 * 1000);
  var D = { y: tz.getUTCFullYear(), m: tz.getUTCMonth(), d: tz.getUTCDate(), wd: tz.getUTCDay(),
    time: pad(tz.getUTCHours()) + ":" + pad(tz.getUTCMinutes()) };
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Ma'lumotlarni joylash ---------- */
  var fill = {
    groom: L.groom, bride: L.bride, venue: L.venue, address: L.address, hosts: L.hosts,
    initials: L.groom.charAt(0) + "&" + L.bride.charAt(0),
    day: D.d, year: D.y, time: D.time, weekday: T.days[D.wd],
    month: T.months[D.m],
    fulldate: lang === "ru"
      ? D.d + " " + T.months[D.m] + " " + D.y + " г."
      : D.y + "-yil " + D.d + "-" + T.months[D.m].toLowerCase()
  };
  $$("[data-w]").forEach(function (el) {
    var v = fill[el.getAttribute("data-w")];
    if (v !== undefined) el.textContent = v;
  });
  document.title = L.groom + " & " + L.bride + " — " + document.title;


  /* ---------- Konvert ---------- */
  var intro = $("#intro");
  var audio = null;
  document.body.classList.add("locked");
  function openEnvelope() {
    if (intro.classList.contains("opened")) return;
    intro.classList.add("opened");
    setTimeout(function () {
      document.body.classList.remove("locked");
      startPetals();
    }, 1600);
    playMusic();
  }
  intro.addEventListener("click", openEnvelope);
  intro.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); } });

  /* ---------- Musiqa ---------- */
  var musicBtn = $("#music");
  if (W.music) {
    audio = new Audio(W.music);
    audio.loop = true;
    audio.volume = .5;
    musicBtn.hidden = false;
    musicBtn.addEventListener("click", function () { audio.paused ? playMusic() : pauseMusic(); });
  }
  function playMusic() {
    if (!audio) return;
    audio.play().then(function () { musicBtn.classList.add("playing"); }).catch(function () {});
  }
  function pauseMusic() { audio.pause(); musicBtn.classList.remove("playing"); }

  /* ---------- Gul barglari ---------- */
  function startPetals() {
    var canvas = $("#petals");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, petals = [];
    var colors = ["#f3c7c3", "#e9aeb0", "#f6dcd2", "#e8cf9f", "#fbe6e0"];
    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      return {
        x: Math.random() * w, y: initial ? Math.random() * h : -20,
        s: 6 + Math.random() * 8, vy: .4 + Math.random() * .8, vx: -.3 + Math.random() * .6,
        r: Math.random() * Math.PI, vr: -.02 + Math.random() * .04, sw: Math.random() * Math.PI * 2,
        c: colors[(Math.random() * colors.length) | 0], o: .5 + Math.random() * .4
      };
    }
    resize();
    window.addEventListener("resize", resize);
    var count = w < 600 ? 18 : 30;
    for (var i = 0; i < count; i++) petals.push(make(true));
    (function loop() {
      ctx.clearRect(0, 0, w, h);
      petals.forEach(function (p, i) {
        p.sw += .02; p.y += p.vy; p.x += p.vx + Math.sin(p.sw) * .6; p.r += p.vr;
        if (p.y > h + 20) petals[i] = make(false);
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.moveTo(0, -p.s);
        ctx.bezierCurveTo(p.s * .9, -p.s * .6, p.s * .7, p.s * .6, 0, p.s);
        ctx.bezierCurveTo(-p.s * .7, p.s * .6, -p.s * .9, -p.s * .6, 0, -p.s);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: .15 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Teskari sanoq ---------- */
  var cd = $("#countdown");
  function tick() {
    var diff = date - Date.now();
    if (diff <= 0) {
      cd.hidden = true;
      $("#countdown-done").hidden = false;
      return;
    }
    var s = Math.floor(diff / 1000);
    $("#cd-d").textContent = Math.floor(s / 86400);
    $("#cd-h").textContent = pad(Math.floor(s % 86400 / 3600));
    $("#cd-m").textContent = pad(Math.floor(s % 3600 / 60));
    $("#cd-s").textContent = pad(s % 60);
    setTimeout(tick, 1000);
  }
  tick();

  /* ---------- Kalendar ---------- */
  var grid = $("#calendar-grid");
  if (grid) {
    $("#calendar-month").textContent = (lang === "ru" ? T.monthsNom[D.m] : T.months[D.m]) + " " + D.y;
    var html = T.dow.map(function (d) { return '<span class="dow">' + d + "</span>"; }).join("");
    var first = (new Date(Date.UTC(D.y, D.m, 1)).getUTCDay() + 6) % 7;
    var total = new Date(Date.UTC(D.y, D.m + 1, 0)).getUTCDate();
    for (var i = 0; i < first; i++) html += "<span></span>";
    for (var d = 1; d <= total; d++) html += '<span' + (d === D.d ? ' class="day-active"' : "") + ">" + d + "</span>";
    grid.innerHTML = html;
  }

  /* ---------- Xarita va QR ---------- */
  var lat = W.coords.lat, lng = W.coords.lng;
  var links = {
    google: W.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng
  };
  $$("[data-map]").forEach(function (a) { a.href = links[a.getAttribute("data-map")]; });
  var map = $("#map");
  if (map) map.src = "https://yandex.uz/map-widget/v1/?ll=" + lng + "," + lat + "&z=16&pt=" + lng + "," + lat + ",pm2rdm&lang=" + (lang === "ru" ? "ru_RU" : "uz_UZ");
  var qr = $("#qr");
  if (qr && window.QRCode) {
    new QRCode(qr, { text: links.google, width: 320, height: 320, colorDark: "#3a2e27", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
  }

  $("#copy-address").addEventListener("click", function () {
    var text = L.venue + ", " + L.address;
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      function () { toast(T.copied); },
      function () { window.prompt("", text); }
    );
  });

  /* ---------- Kalendarga qo'shish ---------- */
  var end = new Date(date.getTime() + W.durationHours * 3600 * 1000);
  function icsDate(dt) { return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var calTitle = T.calTitle + ": " + L.groom + " & " + L.bride;
  var calPlace = L.venue + ", " + L.address;
  $("#gcal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(calTitle) +
    "&dates=" + icsDate(date) + "/" + icsDate(end) +
    "&location=" + encodeURIComponent(calPlace) +
    "&details=" + encodeURIComponent(location.href.split("?")[0]);
  $("#ics").addEventListener("click", function () {
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//wedding//invite//" + lang.toUpperCase(),
      "BEGIN:VEVENT", "UID:" + icsDate(date) + "-wedding@invite",
      "DTSTAMP:" + icsDate(new Date()), "DTSTART:" + icsDate(date), "DTEND:" + icsDate(end),
      "SUMMARY:" + calTitle, "LOCATION:" + calPlace.replace(/,/g, "\\,"),
      "GEO:" + lat + ";" + lng,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + calTitle, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = "wedding.ics";
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- Ulashish ---------- */
  $("#share").addEventListener("click", function () {
    var data = { title: document.title, url: location.href.split("?")[0] };
    if (navigator.share) navigator.share(data).catch(function () {});
    else window.open("https://t.me/share/url?url=" + encodeURIComponent(data.url) + "&text=" + encodeURIComponent(data.title), "_blank");
  });

  /* ---------- Yordamchilar ---------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }
})();
