const itemList = document.getElementById("item_list");
const searchInput = document.getElementById("search_input");
const coursePills = document.getElementById("course_pills");
const unfinishedOnly = document.getElementById("unfinished_only");
const hubTitle = document.getElementById("hub_title");
const prevWeekBtn = document.getElementById("prev_week");
const nextWeekBtn = document.getElementById("next_week");
const weekInput = document.getElementById("week_input");
const viewTabs = document.querySelectorAll(".view_tab");
const themeToggle = document.getElementById("theme_toggle");
const workView = document.getElementById("work_view");
const timetableView = document.getElementById("timetable_view");
const timetableGrid = document.getElementById("timetable_grid");
const timetableMobile = document.getElementById("timetable_mobile");
const languageSelector = document.getElementById("language_selector");
const tagline = document.getElementById("tagline");
const timetableTitle = document.getElementById("timetable_title");
const timetableNote = document.getElementById("timetable_note");

// Language state management
let currentLanguage = localStorage.getItem("language") || "en";

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  languageSelector.value = lang;
  renderAll();
}

function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] ?? key;
}

function getSubjectLabel(subjectId) {
  return SUBJECT_LABELS[currentLanguage]?.[subjectId] ?? subjectId;
}

// Translation dictionaries
const TRANSLATIONS = {
  en: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    today: "Today",
    free: "Free",
    done: "Done",
    unfinished: "Unfinished",
    loadingCourses: "Loading courses...",
    loadingItems: "Loading items...",
    noActiveCourses: "No active courses found.",
    noItemsWeek: "No items for this week.",
    noItemsMatch: "No items match your search.",
    time: "Time",
    period1: "Period 1",
    period2: "Period 2",
    period3: "Period 3",
    period4: "Period 4",
    period5: "Period 5",
    period6: "Period 6",
    period7: "Period 7",
    breaktime: "Breaktime",
    lunchBreak: "Lunch Break",
    work: "Work",
    timetable: "Timetable",
    week: "Week",
    searchPlaceholder: "Search items",
    unfinishedLabel: "Unfinished",
    tagline: "Canvas information hub — browse courses, weeks, and resources.",
    timetableTitle: "Weekly Timetable",
    timetableNote: "Manual schedule stored locally in this app.",
    items: "items",
    noClassesAdded: "No classes added yet.",
  },
  vi: {
    monday: "Thứ Hai",
    tuesday: "Thứ Ba",
    wednesday: "Thứ Tư",
    thursday: "Thứ Năm",
    friday: "Thứ Sáu",
    today: "Hôm Nay",
    free: "Trống",
    done: "Hoàn Thành",
    unfinished: "Chưa Hoàn Thành",
    loadingCourses: "Đang tải khóa học...",
    loadingItems: "Đang tải mục...",
    noActiveCourses: "Không tìm thấy khóa học hoạt động.",
    noItemsWeek: "Không có mục nào trong tuần này.",
    noItemsMatch: "Không tìm thấy mục phù hợp.",
    time: "Thời Gian",
    period1: "Tiết 1",
    period2: "Tiết 2",
    period3: "Tiết 3",
    period4: "Tiết 4",
    period5: "Tiết 5",
    period6: "Tiết 6",
    period7: "Tiết 7",
    breaktime: "Giờ ra chơi",
    lunchBreak: "Nghỉ trưa",
    work: "Làm Việc",
    timetable: "Thời Khóa Biểu",
    week: "Tuần",
    searchPlaceholder: "Tìm kiếm mục",
    unfinishedLabel: "Chưa Hoàn Thành",
    tagline: "Trung tâm thông tin Canvas — duyệt khóa học, tuần và tài nguyên.",
    timetableTitle: "Thời Khóa Biểu Tuần",
    timetableNote: "Lịch học được lưu cục bộ trong ứng dụng này.",
    items: "bài",
    noClassesAdded: "Chưa có lớp học nào được thêm.",
  },
};

// Subject labels with bilingual support
const SUBJECT_LABELS = {
  en: {
    MATHS: "Math",
    PHY: "Physics",
    CHEM: "Chemistry",
    BIO: "Biology",
    IT: "ICT",
    TECH: "Tech",
    GEO: "Geography",
    HIS: "History",
    CIVIC: "Civics",
    GCED: "GCED",
    CLISE: "CLISE",
    NV: "Literature",
    LOCE: "Local Studies",
    CAREER: "Career",
    VNS: "VNH",
    ESL: "ESL",
    MUS: "Music",
    PE: "Sports",
    ART: "Art",
  },
  vi: {
    MATHS: "Toán",
    PHY: "Vật Lý",
    CHEM: "Hóa Học",
    BIO: "Sinh Học",
    IT: "Tin Học",
    TECH: "Công Nghệ",
    GEO: "Địa Lý",
    HIS: "Lịch Sử",
    CIVIC: "GDCD",
    GCED: "GCED",
    CLISE: "CLISE",
    NV: "Ngữ Văn",
    LOCE: "NDĐP",
    CAREER: "HĐTN-HN",
    VNS: "VNH",
    ESL: "ESL",
    MUS: "Âm Nhạc",
    PE: "Thể Chất",
    ART: "Mỹ Thuật",
  },
};

const HIDDEN_SUBJECTS = new Set(["MUS", "PE", "ART"]);

// Timetable data using subject IDs with teacher specifications
const TIMETABLE = {
  monday: [
    { period: "p1", subject: "GEO" },
    { period: "p2", subject: "PHY" },
    { period: "p3", subject: "ESL (GVNN)" },
    { period: "p4", subject: "ESL (GVNN)" },
    { period: "p5", subject: "MUS" },
    { period: "p6", subject: "NV" },
    { period: "p7", subject: "VNS" },
  ],
  tuesday: [
    { period: "p1", subject: "ESL (GVVN)" },
    { period: "p2", subject: "ESL (GVVN)" },
    { period: "p3", subject: "MATHS" },
    { period: "p4", subject: "MATHS" },
    { period: "p5", subject: "PHY" },
    { period: "p6", subject: "PE" },
    { period: "p7", subject: "CLISE" },
  ],
  wednesday: [
    { period: "p1", subject: "ESL (GVVN)" },
    { period: "p2", subject: "ESL (GVVN)" },
    { period: "p3", subject: "NV" },
    { period: "p4", subject: "GCED" },
    { period: "p5", subject: "ESL (GVNN)" },
    { period: "p6", subject: "MATHS" },
    { period: "p7", subject: "MATHS" },
  ],
  thursday: [
    { period: "p1", subject: "PE" },
    { period: "p2", subject: "NV" },
    { period: "p3", subject: "NV" },
    { period: "p4", subject: "MATHS" },
    { period: "p5", subject: "PHY" },
    { period: "p6", subject: "ESL (GVNN)" },
    { period: "p7", subject: "ESL (GVNN)" },
  ],
  friday: [
    { period: "p1", subject: "GCED" },
    { period: "p2", subject: "PHY" },
    { period: "p3", subject: "PHY" },
    { period: "p4", subject: "HIS" },
    { period: "p5", subject: "ESL (GVVN)" },
    { period: "p6", subject: "IT" },
    { period: "p7", subject: "IT" },
  ],
};

const TIMETABLE_DAYS = [
  { key: "monday", labelKey: "monday", index: 1 },
  { key: "tuesday", labelKey: "tuesday", index: 2 },
  { key: "wednesday", labelKey: "wednesday", index: 3 },
  { key: "thursday", labelKey: "thursday", index: 4 },
  { key: "friday", labelKey: "friday", index: 5 },
];

const TIMETABLE_PERIODS = [
  { key: "p1", labelKey: "period1", start: "08:00am", end: "08:45am", type: "class" },
  { key: "p2", labelKey: "period2", start: "08:50am", end: "09:35am", type: "class" },
  { key: "break1", labelKey: "breaktime", start: "09:35am", end: "09:55am", type: "break" },
  { key: "p3", labelKey: "period3", start: "09:55am", end: "10:40am", type: "class" },
  { key: "p4", labelKey: "period4", start: "10:45am", end: "11:30am", type: "class" },
  { key: "p5", labelKey: "period5", start: "11:35am", end: "12:20pm", type: "class" },
  { key: "lunch", labelKey: "lunchBreak", start: "12:20pm", end: "01:30pm", type: "break" },
  { key: "p6", labelKey: "period6", start: "01:35pm", end: "02:20pm", type: "class" },
  { key: "break2", labelKey: "breaktime", start: "02:20pm", end: "02:40pm", type: "break" },
  { key: "p7", labelKey: "period7", start: "02:40pm", end: "03:25pm", type: "class" },
];

const TYPE_ORDER = ["Quiz", "Assignment", "File"];
const TYPE_LABELS = {
  Quiz: "Quizzes",
  Assignment: "Assignments",
  File: "Files",
};

let items = [];
let courses = [];
let subjectCounts = new Map();
let availableWeeks = [];
let selectedCourseId = null;
let currentWeek = Number(localStorage.getItem("selectedWeek")) || 36;
let coursesLoaded = false;

function courseSubjectKey(course) {
  const parts = (course.course_code || "").split("-");
  return parts[0] === "THCS.OP" && parts.length >= 3 ? parts[1] : null;
}

function isCourseHidden(course) {
  const key = courseSubjectKey(course);
  return key !== null && HIDDEN_SUBJECTS.has(key);
}

function courseTeacherCode(course) {
  const parts = (course.name || "").split("-");
  return parts.length >= 3 ? parts[2] : null;
}

function rebuildSubjectCounts() {
  subjectCounts = new Map();
  for (const course of courses) {
    const key = courseSubjectKey(course);
    if (key) {
      subjectCounts.set(key, (subjectCounts.get(key) || 0) + 1);
    }
  }
}

function courseShortLabel(course) {
  const subjectKey = courseSubjectKey(course);
  const subject = subjectKey
    ? getSubjectLabel(subjectKey)
    : (course.name || "").split("-")[1]?.trim().slice(0, 14) || `Course ${course.id}`;

  if ((subjectCounts.get(subjectKey) || 0) > 1) {
    const teacher = courseTeacherCode(course);
    if (teacher) {
      return `${subject} · ${teacher.slice(0, 6)}`;
    }
  }

  return subject;
}

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function showMessage(text) {
  itemList.innerHTML = "";
  const message = document.createElement("p");
  message.className = "empty_message";
  message.textContent = text;
  itemList.appendChild(message);
}

function itemMatchesSearch(item, query) {
  if (!query) {
    return true;
  }

  return [item.title, item.module, item.type, item.course_name]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function createItemRow(item) {
  const row = document.createElement("div");
  row.className = "item_row";

  const content = document.createElement("div");
  content.className = "item_content";

  const title = document.createElement("h3");
  title.className = "item_title";

  if (item.url) {
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.title;
    title.appendChild(link);
  } else {
    title.textContent = item.title;
  }

  const meta = document.createElement("p");
  meta.className = "item_meta";
  meta.textContent = item.module;

  const badge = document.createElement("span");
  badge.className = `status_badge ${item.completed ? "status_done" : "status_open"}`;
  badge.textContent = item.completed ? t("done") : t("unfinished");

  content.append(title, meta);
  row.append(content, badge);
  return row;
}

function renderItems() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const visibleItems = items.filter((item) => itemMatchesSearch(item, searchQuery));

  if (items.length === 0) {
    showMessage(t("noItemsWeek"));
    return;
  }

  if (visibleItems.length === 0) {
    showMessage(t("noItemsMatch"));
    return;
  }

  itemList.replaceChildren();

  for (const type of TYPE_ORDER) {
    const typeItems = visibleItems.filter((item) => item.type === type);
    if (typeItems.length === 0) {
      continue;
    }

    const section = document.createElement("section");
    section.className = "type_section";

    const heading = document.createElement("h3");
    heading.className = "type_heading";
    heading.textContent = `${TYPE_LABELS[type]} (${typeItems.length})`;

    const list = document.createElement("div");
    list.className = "type_list";
    list.append(...typeItems.map(createItemRow));

    section.append(heading, list);
    itemList.append(section);
  }
}

function renderCoursePills() {
  coursePills.replaceChildren(
    ...courses.map((course) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "course_pill";
      button.textContent = courseShortLabel(course);
      button.title = course.name || course.course_code || "";
      button.setAttribute("aria-pressed", String(course.id === selectedCourseId));

      if (course.id === selectedCourseId) {
        button.classList.add("course_pill_active");
      }

      button.addEventListener("click", () => selectCourse(course.id));
      return button;
    })
  );
}

function updateWeekNav() {
  const weekIndex = availableWeeks.indexOf(currentWeek);

  weekInput.value = currentWeek || "";
  prevWeekBtn.disabled = weekIndex <= 0;
  nextWeekBtn.disabled = weekIndex < 0 || weekIndex >= availableWeeks.length - 1;
}

function weekApiPath(courseId, week) {
  const suffix = unfinishedOnly.checked ? "/unfinished" : "";
  return `/api/courses/${courseId}/week/${week}${suffix}`;
}

function updateHubTitle() {
  const course = courses.find((entry) => entry.id === selectedCourseId);
  const courseLabel = course ? courseShortLabel(course) : "Course";
  const scope = unfinishedOnly.checked ? t("unfinished") : `${items.length} ${t("items")}`;
  hubTitle.textContent = `${courseLabel} · ${t("week")} ${currentWeek} · ${scope}`;
}

async function loadCourses() {
  if (coursesLoaded) {
    return;
  }

  showMessage(t("loadingCourses"));

  const data = await fetchJson("/api/courses");
  courses = data.courses.filter((course) => !isCourseHidden(course));
  coursesLoaded = true;

  if (courses.length === 0) {
    showMessage(t("noActiveCourses"));
    return;
  }

  rebuildSubjectCounts();
  courses.sort((a, b) => courseShortLabel(a).localeCompare(courseShortLabel(b)));

  const savedCourseId = Number(localStorage.getItem("selectedCourseId"));
  selectedCourseId = courses.find((course) => course.id === savedCourseId)?.id ?? courses[0].id;

  renderCoursePills();
  await loadWeeks();
  await loadItems();
}

async function loadWeeks() {
  if (!selectedCourseId) {
    return;
  }

  try {
    const data = await fetchJson(`/api/courses/${selectedCourseId}/weeks`);
    availableWeeks = data.weeks;

    if (availableWeeks.length > 0 && !availableWeeks.includes(currentWeek)) {
      currentWeek = availableWeeks.at(-1);
      localStorage.setItem("selectedWeek", String(currentWeek));
    }
  } catch {
    availableWeeks = [];
  }

  updateWeekNav();
}

async function loadItems() {
  if (!selectedCourseId || !currentWeek) {
    return;
  }

  showMessage(t("loadingItems"));

  try {
    const data = await fetchJson(weekApiPath(selectedCourseId, currentWeek));
    items = data.items;
    updateHubTitle();
    updateWeekNav();
    renderItems();
  } catch (error) {
    showMessage(error.message);
  }
}

async function selectCourse(courseId) {
  selectedCourseId = courseId;
  localStorage.setItem("selectedCourseId", String(courseId));
  renderCoursePills();
  await loadWeeks();
  await loadItems();
}

function changeWeek(delta) {
  const weekIndex = availableWeeks.indexOf(currentWeek);
  const nextIndex = weekIndex + delta;

  if (weekIndex < 0 || nextIndex < 0 || nextIndex >= availableWeeks.length) {
    return;
  }

  currentWeek = availableWeeks[nextIndex];
  localStorage.setItem("selectedWeek", String(currentWeek));
  loadItems();
}

function timetableEntryFor(dayKey, periodKey) {
  return (TIMETABLE[dayKey] || []).find((entry) => entry.period === periodKey);
}

function todayDayKey() {
  const todayIndex = new Date().getDay();
  return TIMETABLE_DAYS.find((day) => day.index === todayIndex)?.key ?? null;
}

function timeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/);
  if (!match) return 0;
  
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];
  
  if (meridiem === "pm" && hours !== 12) {
    hours += 12;
  } else if (meridiem === "am" && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}

function currentPeriodKey() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const period of TIMETABLE_PERIODS) {
    const startTotal = timeToMinutes(period.start);
    const endTotal = timeToMinutes(period.end);
    
    if (currentMinutes >= startTotal && currentMinutes < endTotal) {
      return period.key;
    }
  }

  return null;
}

function nextPeriodKey() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  let foundCurrent = false;
  
  for (const period of TIMETABLE_PERIODS) {
    if (foundCurrent) {
      return period.key;
    }
    
    const startTotal = timeToMinutes(period.start);
    const endTotal = timeToMinutes(period.end);
    
    if (currentMinutes >= startTotal && currentMinutes < endTotal) {
      foundCurrent = true;
    }
  }

  return null;
}

function createSlotContent(period, entry) {
  const fragment = document.createDocumentFragment();

  const subject = document.createElement("p");
  subject.className = "slot_subject";
  
  if (period.type === "break") {
    subject.textContent = t(period.labelKey);
  } else if (entry?.subject) {
    // Extract subject ID and teacher info from strings like "ESL (GVVN)"
    const subjectMatch = entry.subject.match(/^([A-Z]+)\s*(?:\(([^)]+)\))?$/);
    if (subjectMatch) {
      const subjectId = subjectMatch[1];
      const teacherInfo = subjectMatch[2];
      const subjectLabel = getSubjectLabel(subjectId);
      subject.textContent = teacherInfo ? `${subjectLabel} (${teacherInfo})` : subjectLabel;
    } else {
      subject.textContent = getSubjectLabel(entry.subject);
    }
  } else {
    subject.textContent = t("free");
  }

  const metaParts = [];
  if (entry?.room) {
    metaParts.push(entry.room);
  }

  const meta = document.createElement("p");
  meta.className = "slot_meta";
  meta.textContent = metaParts.length > 0
    ? metaParts.join(" · ")
    : "";

  fragment.append(subject, meta);
  return fragment;
}

function renderTimetableGrid() {
  const todayKey = todayDayKey();
  const currentPeriod = currentPeriodKey();
  const nextPeriod = nextPeriodKey();
  const cells = [];

  const corner = document.createElement("div");
  corner.className = "day_cell";
  corner.textContent = t("time");
  cells.push(corner);

  for (const day of TIMETABLE_DAYS) {
    const dayCell = document.createElement("div");
    dayCell.className = "day_cell";
    dayCell.textContent = t(day.labelKey);

    if (day.key === todayKey) {
      dayCell.classList.add("day_cell_today");
    }

    cells.push(dayCell);
  }

  for (const period of TIMETABLE_PERIODS) {
    if (period.type === "break") {
      const breakCell = document.createElement("div");
      breakCell.className = "slot_cell slot_cell_break slot_cell_break_full";
      if (todayKey) {
        breakCell.classList.add("slot_cell_today");
      }
      const breakSubject = document.createElement("p");
      breakSubject.className = "slot_subject";
      breakSubject.textContent = t(period.labelKey);
      const breakMeta = document.createElement("p");
      breakMeta.className = "slot_meta";
      breakMeta.textContent = `${period.start}-\n${period.end}`;
      breakCell.append(breakSubject, breakMeta);
      cells.push(breakCell);
      continue;
    }

    const timeCell = document.createElement("div");
    timeCell.className = "time_cell";
    timeCell.textContent = `${t(period.labelKey)}\n${period.start}-\n${period.end}`;
    cells.push(timeCell);

    for (let i = 0; i < TIMETABLE_DAYS.length; i++) {
      const day = TIMETABLE_DAYS[i];
      const entry = timetableEntryFor(day.key, period.key);
      const slot = document.createElement("div");
      slot.className = "slot_cell";

      if (!entry) {
        slot.classList.add("slot_cell_free");
      }

      if (day.key === todayKey) {
        slot.classList.add("slot_cell_today");
      }

      if (day.key === todayKey && period.key === currentPeriod) {
        slot.classList.add("slot_cell_current");
      } else if (day.key === todayKey && period.key === nextPeriod) {
        slot.classList.add("slot_cell_next");
      }

      if (i === TIMETABLE_DAYS.length - 1) {
        slot.classList.add("last_col");
      }

      slot.append(createSlotContent(period, entry));
      cells.push(slot);
    }
  }

  timetableGrid.replaceChildren(...cells);
}

function renderTimetableMobile() {
  const todayKey = todayDayKey();
  const currentPeriod = currentPeriodKey();
  const nextPeriod = nextPeriodKey();
  const daySections = TIMETABLE_DAYS.map((day) => {
    const section = document.createElement("section");
    section.className = "day_schedule";

    const heading = document.createElement("h3");
    heading.textContent = t(day.labelKey);

    if (day.key === todayKey) {
      const badge = document.createElement("span");
      badge.className = "today_label";
      badge.textContent = t("today");
      heading.appendChild(badge);
    }

    section.appendChild(heading);

    const hasClasses = (TIMETABLE[day.key] || []).some((entry) => entry.subject);
    if (!hasClasses) {
      const empty = document.createElement("p");
      empty.className = "day_empty";
      empty.textContent = t("noClassesAdded");
      section.appendChild(empty);
    }

    for (const period of TIMETABLE_PERIODS) {
      const entry = timetableEntryFor(day.key, period.key);
      if (period.type === "class" && !entry) {
        continue;
      }

      const slot = document.createElement("div");
      slot.className = "mobile_slot";

      const time = document.createElement("div");
      time.className = "mobile_time";
      time.textContent = `${t(period.labelKey)}\n${period.start}-\n${period.end}`;

      const content = document.createElement("div");
      if (day.key === todayKey && period.key === currentPeriod) {
        slot.classList.add("slot_cell_current");
      } else if (day.key === todayKey && period.key === nextPeriod) {
        slot.classList.add("slot_cell_next");
      }
      content.append(createSlotContent(period, entry));

      slot.append(time, content);
      section.appendChild(slot);
    }

    return section;
  });

  timetableMobile.replaceChildren(...daySections);
}

function renderTimetable() {
  renderTimetableGrid();
  renderTimetableMobile();
}

function renderAll() {
  renderCoursePills();
  renderItems();
  renderTimetable();
  updateHubTitle();
  updateWeekNav();
  
  // Update static text elements
  tagline.textContent = t("tagline");
  timetableTitle.textContent = t("timetableTitle");
  timetableNote.textContent = t("timetableNote");
  document.querySelector(".view_tab[data-view='work']").textContent = t("work");
  document.querySelector(".view_tab[data-view='timetable']").textContent = t("timetable");
  document.getElementById("week_label").childNodes[0].textContent = `${t("week")} `;
  searchInput.placeholder = t("searchPlaceholder");
  document.querySelector(".filter_toggle span").textContent = t("unfinishedLabel");
}

function setView(viewName) {
  const nextView = viewName === "timetable" ? "timetable" : "work";
  localStorage.setItem("selectedView", nextView);

  workView.hidden = nextView !== "work";
  timetableView.hidden = nextView !== "timetable";
  workView.classList.toggle("app_view_active", nextView === "work");
  timetableView.classList.toggle("app_view_active", nextView === "timetable");

  for (const tab of viewTabs) {
    const isActive = tab.dataset.view === nextView;
    tab.classList.toggle("view_tab_active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  }

  if (nextView === "work") {
    loadCourses().catch((error) => showMessage(error.message));
  } else {
    renderTimetable();
  }
}

prevWeekBtn.addEventListener("click", () => changeWeek(-1));
nextWeekBtn.addEventListener("click", () => changeWeek(1));

weekInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const value = Number(weekInput.value);
    if (!Number.isFinite(value) || value < 1) {
      updateWeekNav();
      return;
    }

    currentWeek = value;
    localStorage.setItem("selectedWeek", String(currentWeek));
    loadItems();
  }
});

weekInput.addEventListener("blur", () => {
  updateWeekNav();
});
unfinishedOnly.addEventListener("change", loadItems);
searchInput.addEventListener("input", renderItems);
document.querySelector(".icon").addEventListener("click", () => searchInput.focus());
viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

languageSelector.addEventListener("change", (event) => {
  setLanguage(event.target.value);
});

const initialView = new URLSearchParams(window.location.search).get("view")
  || localStorage.getItem("selectedView")
  || "work";
setView(initialView);

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains("light");
  const newTheme = isLight ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", toggleTheme);

// Initialize language
setLanguage(currentLanguage);