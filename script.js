document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const slides = document.querySelector(".cat-slides");
  const dots = document.getElementById("catDots");

  if (slides && dots) {
    const cards = [...slides.querySelectorAll(".cat-card")];
    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "cat-dot" + (i === 0 ? " active" : "");
      dots.appendChild(dot);
    });

    const updateDots = () => {
      const width = slides.clientWidth || 1;
      const index = Math.round(slides.scrollLeft / width);
      [...dots.children].forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    };

    slides.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateDots);
    }, {passive:true});
  }

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    const CAPACITY = 18;
    const ALL_SLOTS = [
      "11:00–12:40",
      "13:00–14:40",
      "15:00–16:40",
      "17:00–18:40"
    ];

    const dateInput = document.getElementById("date");
    const peopleInput = document.getElementById("people");
    const timeInput = document.getElementById("time");

    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 30);

    const fmt = d => {
      const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
      return local.toISOString().split("T")[0];
    };

    dateInput.min = fmt(today);
    dateInput.max = fmt(max);

    const getBookings = () =>
      JSON.parse(localStorage.getItem("maoyuBookings") || "[]");

    const bookedSeats = (date, time) =>
      getBookings()
        .filter(item => item.date === date && item.time === time)
        .reduce((sum, item) => sum + Number(item.people || 0), 0);

    const updateAvailableTimes = () => {
      const date = dateInput.value;
      const partySize = Number(peopleInput.value);
      timeInput.innerHTML = "";

      if (!date || !partySize) {
        timeInput.disabled = true;
        timeInput.innerHTML =
          '<option value="">請先選擇日期與人數</option>';
        return;
      }

      const available = ALL_SLOTS.filter(slot => {
        return CAPACITY - bookedSeats(date, slot) >= partySize;
      });

      if (!available.length) {
        timeInput.disabled = true;
        timeInput.innerHTML =
          '<option value="">當日已無可預約時段</option>';
        return;
      }

      timeInput.disabled = false;
      timeInput.innerHTML = '<option value="">請選擇時段</option>';

      available.forEach(slot => {
        const remaining = CAPACITY - bookedSeats(date, slot);
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = `${slot}（剩餘 ${remaining} 位）`;
        timeInput.appendChild(option);
      });
    };

    dateInput.addEventListener("change", updateAvailableTimes);
    peopleInput.addEventListener("change", updateAvailableTimes);

    bookingForm.addEventListener("submit", e => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(bookingForm).entries());
      const partySize = Number(data.people);
      const remaining = CAPACITY - bookedSeats(data.date, data.time);

      if (remaining < partySize) {
        alert("這個時段的剩餘名額不足，請重新選擇。");
        updateAvailableTimes();
        return;
      }

      const list = getBookings();
      data.id = Date.now();
      data.createdAt = new Date().toLocaleString("zh-TW");
      list.push(data);
      localStorage.setItem("maoyuBookings", JSON.stringify(list));

      const result = document.getElementById("result");
      result.style.display = "block";
      result.innerHTML =
        "<strong>測試預約已儲存 ✓</strong><br>" +
        data.date + "　" + data.time + "<br>" +
        data.name + "｜" + data.people + " 位";

      bookingForm.reset();
      updateAvailableTimes();
      result.scrollIntoView({behavior:"smooth", block:"center"});
    });
  }
});
