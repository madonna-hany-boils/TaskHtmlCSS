
  AOS.init();

//check if user register on one or more course or not
var coursesData = [
  { id: '1', name: 'المحاسبة المالية', categories: '100', tests: '120', questions: '100' },
  // { id: '2', name: ' المفاوضات', categories: '285', tests: '255', questions: '150' }
];


document.addEventListener('DOMContentLoaded', () => {
  const userCoursesCount = coursesData.length; 

  const dropdownArrow = document.querySelector('.dropdown-arrow');
  const dropdown = document.querySelector('.courses-dropdown');
  const selectedCourse = document.getElementById('selected-course');
  const courseSelect = document.getElementById('course-select');
  
  if (userCoursesCount > 1) {
    dropdownArrow.classList.remove('d-none');
    dropdown.classList.remove('d-none');
    
    // Clear existing options
    courseSelect.innerHTML = '';
    
    // Add new options
    coursesData.forEach(course => {
      const option = document.createElement('option');
      option.value = course.id;
      option.textContent = course.name;
      courseSelect.appendChild(option);
    });
    
    // Set onChange event
    courseSelect.addEventListener('change', (e) => {
      updateDashboardData(e.target.value);
    });
    
    // Set first course as default
    updateDashboardData(coursesData[0].id);
  } 
  else if (userCoursesCount === 1) {
    selectedCourse.classList.remove('d-none');
    selectedCourse.textContent = coursesData[0].name;
    updateDashboardData(coursesData[0].id);
  }
});


function toggleCoursesDropdown() {
  const arrow = document.querySelector('.dropdown-arrow');
  const dropdown = document.querySelector('.courses-dropdown');
  
  arrow.classList.toggle('rotated');
  dropdown.classList.toggle('show');
}

function updateDashboardData(courseId) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return;
  
  document.getElementById('selected-course').textContent = course.name;
  document.querySelector('.custom-card2 h3').textContent = course.categories;
  document.querySelector('.custom-card3 h3').textContent = course.tests;
  document.querySelector('.custom-card4 h3').textContent = course.questions;
}

/**********************************************************
 *                       Chart رسم بياني                  *
 **********************************************************/
const ctx = document.getElementById('myChart').getContext('2d');
const correctCount = parseInt(document.getElementById("correctCount").innerText);
const wrongCount = parseInt(document.getElementById("wrongCount").innerText);

const total = correctCount + wrongCount;
const successPercentage = ((correctCount / total) * 100).toFixed(1);
const failPercentage = ((wrongCount / total) * 100).toFixed(1);

new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['الاجابات الصحيحة', 'الاجابات الخاطئة'],
    datasets: [{
      data: [successPercentage, failPercentage],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderWidth: 0,
      offset: [20, 20],
      borderAlign: 'inner',
      radius: '75%',
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.parsed}%`
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 13 },
        anchor: 'center',
        align: 'center',
        formatter: value => value + ' %'
      }
    }
  },
  plugins: [ChartDataLabels]
});


/**********************************************************
 *                  Calendar التقويم                     *
 **********************************************************/

// Calendar DOM elements
const monthYear1 = document.getElementById("month-year");
const datesDiv1 = document.getElementById("dates");
const monthYear2 = document.getElementById("month-year2");
const datesDiv2 = document.getElementById("dates2");
const monthYearAdmin = document.getElementById("month-year-admin");
const datesDivAdmin = document.getElementById("dates-admin");

const prevBtnAdmin = document.getElementById("prev-admin");
const nextBtnAdmin = document.getElementById("next-admin");
const prevBtn1 = document.getElementById("prev");
const nextBtn1 = document.getElementById("next");
const prevBtn2 = document.getElementById("prev2");
const nextBtn2 = document.getElementById("next2");

let selectedDay = null;
let openedExamDate = null;
let resultDate = null;
let selectedDayAdmin = null;
let openedExamDateAdmin = null;
let resultDateAdmin= null;

function createCalendar(monthYearElement, datesDiv, prevBtn, nextBtn, isController) {
  let currentDate = new Date();
  const daysHeader = datesDiv.parentElement.querySelector('.days');

  function renderCalendar(date) {
    datesDiv.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();

    monthYearElement.innerText = `${date.toLocaleString("en-US", { month: "long" })} ${year}`;

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (daysHeader) daysHeader.innerHTML = weekDays.map(day => `<div>${day}</div>`).join('');

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) datesDiv.innerHTML += `<div></div>`;

    for (let i = 1; i <= lastDate; i++) {
      const dayDiv = document.createElement("div");
      const fullDate = new Date(year, month, i);
      dayDiv.textContent = i;

      if (!isController) {
        if (selectedDay && fullDate.toDateString() === selectedDay.toDateString()) {
          dayDiv.classList.add("selected");
        } else if (openedExamDate && fullDate.toDateString() === openedExamDate.toDateString()) {
          dayDiv.classList.add("opened-exam");
        } else if (resultDate && fullDate.toDateString() === resultDate.toDateString()) {
          dayDiv.classList.add("exam-result");
        }

        dayDiv.addEventListener("click", () => {
          dayDiv.classList.add("selected");
          document.querySelectorAll('.round-details').forEach(m => m.classList.add('d-none'));
          if (dayDiv.classList.contains("exam-result")) document.getElementById("exam-result").classList.remove("d-none");
          else if (dayDiv.classList.contains("opened-exam")) document.getElementById("register-exam").classList.remove("d-none");
          else if (dayDiv.classList.contains("selected")) document.getElementById("exam-time").classList.remove("d-none");
        });

      } else {
        dayDiv.addEventListener("click", () => {
          const type = document.querySelector('input[name="date-type"]:checked')?.value;
          if (type === "selected") {
            selectedDay = fullDate;
            openedExamDate = new Date(selectedDay);
            openedExamDate.setDate(openedExamDate.getDate() - 5);
            resultDate = new Date(selectedDay);
            resultDate.setDate(resultDate.getDate() + 8);
            
            selectedDayAdmin = fullDate;
            openedExamDateAdmin = new Date(selectedDay);
            openedExamDateAdmin.setDate(openedExamDate.getDate() - 5);
            resultDateAdmin = new Date(selectedDay);
            resultDateAdmin.setDate(resultDate.getDate() + 8);

          }
         renderCalendar(currentDate); // controller
renderCalendar1(); // main
renderCalendarAdmin(); // admin

        });
      }

      datesDiv.appendChild(dayDiv);
    }
  }

  prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); };
  nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); };

 if (isController) {
  window.renderCalendar2 = () => renderCalendar(currentDate);
} else {

  if (monthYearElement.id === "month-year") {
    window.renderCalendar1 = () => renderCalendar(currentDate);
  } else if (monthYearElement.id === "month-year-admin") {
    window.renderCalendarAdmin = () => renderCalendar(currentDate);
  }
}

  renderCalendar(currentDate);
}

// Initialize calendars
createCalendar(monthYear1, datesDiv1, prevBtn1, nextBtn1, false);
createCalendar(monthYear2, datesDiv2, prevBtn2, nextBtn2, true);
createCalendar(monthYearAdmin, datesDivAdmin, prevBtnAdmin, nextBtnAdmin, false);

// Close modals
document.querySelectorAll('.round-details img').forEach(btn =>
  btn.addEventListener('click', e =>
    e.target.closest('.round-details').classList.add('d-none')
  )
);



/**********************************************************
 *             Notifications الإشعارات                    *
 **********************************************************/

const notificationBox = document.getElementById("notifications");
//  const notificationBtns = document.querySelectorAll("[onclick='getNotifications()']");

function getNotifications() {
  console.log("noti")
  const notificationBox = document.getElementById("notifications");
  console.log(notificationBox)
  notificationBox.classList.toggle("appear");
 setTimeout(() => {
    document.addEventListener('click', function closeHandler(e) {
      if (!notificationBox.contains(e.target)) {
        notificationBox.classList.remove("appear");
        document.removeEventListener('click', closeHandler);
      }
    });
  }, 0);
}


/**********************************************************
 *                Pagination تقسيم الصفحات                *
 **********************************************************/
const notifications = Array.from(document.querySelectorAll("#notificationList > div"));
const itemsPerPage = 2;
const pagination = document.getElementById("pagination");

function displayPage(pageNumber) {
  const start = (pageNumber - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  notifications.forEach((notif, index) => {
    notif.style.display = (index >= start && index < end) ? "block" : "none";
  });

  pagination.querySelectorAll(".page-item").forEach(item => item.classList.remove("active"));
  pagination.querySelectorAll(".page-item")[pageNumber - 1]?.classList.add("active");
}

function setupPagination() {
  const pageCount = Math.ceil(notifications.length / itemsPerPage);
  pagination.innerHTML = '';

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === 1 ? " active" : "");
    const link = document.createElement("a");
    link.className = "page-link";
    link.style.border = "none";
    link.href = "#";
    link.textContent = i;
    link.addEventListener("click", e => {
      e.preventDefault();
      displayPage(i);
    });

    li.appendChild(link);
    pagination.appendChild(li);
  }

  displayPage(1);
}

setupPagination();


/**********************************************************
 *              Rounds & Exams الجولات والامتحانات        *
 **********************************************************/
function getRounds() {
  document.getElementById("rounds").classList.add("appear");
  
}
function hideRounds() {
  document.getElementById("rounds").classList.remove("appear");
}

function getexams() {
  const arrowImg = document.getElementById("up-arrow");
  const exams = document.getElementById("exams");
  arrowImg.setAttribute("src", arrowImg.getAttribute("src").includes("prev.svg")
    ? "/assets/icons/down.svg" : "/assets/icons/prev.svg");
  exams.classList.toggle("appear");
}


/**********************************************************
 *            Calendar Small التقويم الصغير              *
 **********************************************************/
function getCalender() {
  document.getElementById('calendar-small').classList.toggle('appear');
}
function saveDate() {
  document.getElementById('calendar-small').classList.toggle('appear');
}
function removeDate() {
  document.getElementById('calendar-small').classList.toggle('appear');
}


/**********************************************************
 *                  Sidebar الشريط الجانبي                *
 **********************************************************/
function showSideBar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("appear");
  setTimeout(() => {
    document.addEventListener('click', function closeHandler(e) {
      if (!sidebar.contains(e.target)) {
        sidebar.classList.remove("appear");
        document.removeEventListener('click', closeHandler);
      }
    });
  }, 0);
}

function setActiveLink(clickedElement) {
  document.querySelectorAll('.link-line').forEach(link => link.classList.remove('active'));
  clickedElement.classList.add('active');
}

function setActiveLink_lg(clickedElement) {
  document.querySelectorAll('.link-line-lg').forEach(link => link.classList.remove('active2'));
  clickedElement.classList.add('active2');
}


/**********************************************************
 *              Logout تسجيل الخروج                       *
 **********************************************************/
function showLogout() {
  const logoutItems = document.querySelectorAll(".logout");
  logoutItems.forEach(el => el.classList.toggle("appear"));
  setTimeout(() => {
    document.addEventListener('click', function closeHandler(e) {
      if (!Array.from(logoutItems).some(item => item.contains(e.target))) {
        logoutItems.forEach(el => el.classList.remove("appear"));
        document.removeEventListener('click', closeHandler);
      }
    });
  }, 0);
}

function hideLogout() {
  document.querySelectorAll(".logout").forEach(el => el.classList.toggle("appear"));
}

function logOut() {
  window.location.href = "login.html";
}
