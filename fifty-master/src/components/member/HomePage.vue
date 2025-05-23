<template>
  <button @click="flip">전환</button>
    <div class="mainbody">
      <div class="header">
  <img src="@/assets/3333.svg" alt="fifftyfifty" class="fifty-img" stroke="black" stroke-width="2">
      </div>
      <div class="rank">
        <h1>음원 사이트</h1>
      </div>
      <div class="community">
        <a href="https://www.youtube.com/@WE_FIFTYFIFTY" target="_blank">
          <img src="@/assets/yb.png" alt="YouTube" class="social-icon" />
          <p>FIFTY FIFTY YOUTUBE</p>
        </a>
        <a href="https://www.instagram.com/we_fiftyfifty" target="_blank">
          <img src="@/assets/is.jpg" alt="Instagram" class="social-icon" />
          <p>FIFTY FIFTY INSTAGRAM</p>
        </a>
        <a href="https://www.tiktok.com/@we_fiftyfifty" target="_blank">
          <img src="@/assets/tt.png" alt="TikTok" class="social-icon" />
          <p>FIFTY FIFTY TIKTOK</p>
        </a>
        <a href="https://weverse.io/fiftyfifty" target="_blank">
          <img src="@/assets/wb.jpg" alt="Weverse" class="social-icon" />
          <p>FIFTY FIFTY WEVERSE</p>
        </a>
      </div>
      <h1>일정표</h1>
    <div class="calendar-wrapper">
          <div class="calendar-content">
    <!-- 배경 이미지 -->
    <div
      class="calendar-background"
      :style="{ backgroundImage: `url('http://localhost:8080/upload/${backgroundImage}')` }"
    ></div>

  <!-- 캘린더 -->

      <FullCalendar :options="calendarOptions" />
    </div>
</div>
    <div class="notice">
    <h1>공지사항</h1>

    <ul class="notice-list">
   
      <li
        v-for="(item, index) in notices"
        :key="index"
        @click="openPopup(item)"
        class="notice-item"
      >
         <span style="color: red; margin-right: 5px; font-weight: bold;">(공지)</span>{{ item.title }}
      </li>
    </ul>

    <!-- 팝업창 -->
    <div v-if="selectedNotice" class="modal-overlay" @click.self="closePopup">
      <div class="modal-content1">
        <h2>{{ selectedNotice.title }}</h2>
        <p class="content" style="font-size: 30px;">{{ selectedNotice.content }}</p>
        <div class="meta">
          <p>등록일자: {{ selectedNotice.createdAt }}</p>
          <p>수정일자: {{ selectedNotice.updatedAt }}</p>
        </div>
        <button @click="closePopup">닫기</button>
      </div>
    </div>
  </div>
      <div class="profile" style="margin-top: 50px;">
        <div class="card-grid">
          <div
            v-for="member in profile"
            :key="member.no"
            class="member-card"
            @click="showProfileBox(member)"
          >
            <img
              v-if="!isSmallScreen"
              :src="`http://localhost:8080/upload/${member.filePath}`"
              :alt="member.title"
              class="member-img"
            />
            <p v-else class="member-text">{{ member.title }}</p>
          </div>
        </div>
        </div>

      <!-- 프로필 박스 -->
  <transition name="slide-down">
    <div
      v-if="showProfile"
      class="profile-box"
      :key="selectedMemberNo?.memberNo" 
    >
      <div class="profile-box-content" v-if="selectedMemberNo">
        <section style="width: 30%;">
          <img
            :src="`http://localhost:8080/upload/${selectedMemberNo.filePath}`"
            :alt="selectedMemberNo.title"
            class="member-profile"
            style="width: 90%;"
          />
        </section>
        <section style="width: 60%; text-align: center;">
          <h1 style="font-size: 40px;">{{ selectedMemberNo.title }}</h1>
          <h2 style="color: black; font-size: 25px;">"{{ selectedMemberNo.subContent }}"</h2>
          <p style="color: black; font-size: 25px;">{{ selectedMemberNo.content }}</p>
        </section>
      </div>
    </div>
  </transition>
    <button v-if="showProfile" class="close-btn" @click="closeProfileBox">닫기</button>
    <div class="card-image-wrapper">
    <div class="card-image">
      <div
        v-for="member in displayedMembers"
        :key="member.no"
        class="member-card-image"
        @click="openModal(`http://localhost:8080/upload/${member.name}`)"
      >
        <img :src="`http://localhost:8080/upload/${member.name}`" :alt="member.name" class="member-img" />
    </div>
  </div>
  </div>
  <div class="pagination" style="margin-top: 50px; color: black;">
    <button @click="changePage('prev')" :disabled="currentPage === 1">Previous</button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <img :src="selectedImage" alt="확대 이미지" class="modal-img" />
      <button class="modal-close" @click="closeModal">×</button>
    </div>
  </div>     
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from '../../axios/files'
import axiospr from '../../axios/profile'
import { useRoute, useRouter } from 'vue-router'
import koLocale from '@fullcalendar/core/locales/ko';
// import { DatesSetArg } from '@fullcalendar/core';


const backgroundImage = ref('');


// 공지사항 목록 (예시 데이터)
const notices = ref([]);


const isFlipped = ref(false)

function flip() {
  isFlipped.value = !isFlipped.value
}


async function fetchBackground(month: number) {
  try {
    console.log("이거나옴?");
    console.log(month);
    const response = await axiospr.backgroundList(month);
    console.log(response.data);
    backgroundImage.value = response.data.imageUrl;
    console.log(backgroundImage.value);
  } catch (error) {
    console.error(error);
  }
}

async function fetchNotice() {
  try {
    const response = await axiospr.ListNotice()
    notices.value = response.data
    console.log(response.data)
    // 받아온 데이터 구조에 따라 처리

  } catch (error) {
    console.error('공지사항을 불러오는데 실패했습니다.:', error)
  }
}


const selectedNotice = ref(null)

function openPopup(item : any) {
  selectedNotice.value = item
}

function closePopup() {
  selectedNotice.value = null
}




const route = useRoute()
const router = useRouter()

const currentPage = ref(Number(route.query.page) || 1)

// 페이지 변경 시 쿼리 업데이트
watch(currentPage, (newPage) => {
  router.replace({ query: { ...route.query, page: newPage } })
})
const isSmallScreen = ref(window.innerWidth <= 480)

const showModal = ref(false)
const selectedImage = ref('')
const showProfile = ref(false) // 프로필 박스를 보여줄지 여부
const allImagesLoaded = ref(false)
const crt = ref('')

const selectedMemberNo = ref([]);
const calendarEvents = ref<any[]>([])


// 페이징
const totalItems = ref(0)
const itemsPerPage = 15 // 한 페이지에 15명씩

const members = ref([]);

const profile = ref([]);
const colors = ref([]);

const totalPages = computed(() => {
  return members.value.length === 0
    ? 1
    : Math.ceil(totalItems.value / itemsPerPage);
});

// 현재 페이지의 멤버들만 추출
const displayedMembers = computed(() => {
  const start = (currentPage.value - currentPage.value) * itemsPerPage
  const end = start + itemsPerPage
  return members.value.slice(start, end)
})

async function fetchMembers() {
  try {
    const response = await axios.fetchFiles({
      crt: crt.value,
      page: currentPage.value - 1,
      rows: itemsPerPage,  // ← 'rows'로 전달
    })
    console.log(response.data)
    // 받아온 데이터 구조에 따라 처리
    members.value = response.data.list || []       // 'list' 또는 'members' 키를 서버 응답에 맞게
    totalItems.value = response.data.total || 0    // 'total' 키를 서버 응답에 맞게
    allImagesLoaded.value = true
  } catch (error) {
    console.error('멤버 목록을 불러오는 데 실패했습니다:', error)
  }
}

async function fetchProfile() {
    try {
      const response = await axiospr.ListProfile()
          profile.value = response.data.list || []
    }
  catch (error) {
    console.error('멤버 목록을 불러오는 데 실패했습니다:', error)
  }
}

// 페이지 변경
function changePage(direction: 'next' | 'prev') {
  if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
}

watch(currentPage, () => {
  fetchMembers()
})


// 프로필 박스 열기 함수 수정
function showProfileBox(member: any) {
  selectedMemberNo.value = member
  crt.value = member.no
  fetchMembers() 
  console.log(crt.value)
  showProfile.value = true
}

// 프로필 박스 닫기
function closeProfileBox() {
  showProfile.value = false
  selectedMemberNo.value = []
  crt.value = ""
  fetchMembers()
}

async function fetchPlan() {
  try{
    const response = await axiospr.ListPlan()
    calendarEvents.value = response.data || []
    colors.value = response.data.map(event => event.backgroundColor);
    console.log(calendarEvents.value)
    console.log(colors)
  
  }catch (error) {
    console.error('일정 목록을 불러오는 데 실패했습니다:', error)
  }
}

function openModal(imageUrl: string) {
  selectedImage.value = imageUrl
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}


const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  locale: koLocale,
  dayMaxEventRows: true,
  eventDisplay: 'block',
  initialView: 'dayGridMonth', 
  datesSet: (info:any) => {
      const currentStartDate = new Date(info.view.currentStart);
    const month = currentStartDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
    console.log("현재 월:", month);
    fetchBackground(month);
  },
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  buttonText: {
    today: '오늘',
    month: '월간',
    week: '주간',
    day: '일간',
    list: '리스트'
  },
  events: calendarEvents,

  dateClick(info : any) {
    const clickedDate = info.dateStr
    const eventsOnClickedDate = calendarEvents.value.filter(event => {
      return event.start.startsWith(clickedDate)
    })

    if (eventsOnClickedDate.length > 0) {
      const eventTitles = eventsOnClickedDate
        .map(ev => `${ev.title} (${new Date(ev.start).getHours()}시)`)
        .join('\n')
      alert(`📅 ${clickedDate} 일정:\n${eventTitles}`)
    } else {
     return
    }
  },

  // 🟢 일정 클릭 시 상세 내용 표시
  eventClick(info : any) {
    const event = info.event
    const title = event.title
    const start = event.startStr
    const end = event.endStr || '없음'
    const description = event.extendedProps.description || '내용 없음'

    alert(`📌 일정 상세 정보\n\n제목: ${title}\n시작: ${start}\n종료: ${end}\n내용: ${description}`)
  },

  eventDidMount(info) {
    info.el.style.backgroundColor = info.event.backgroundColor || '#f0f0f0'
    info.el.style.color = '#ffffff'
    info.el.style.padding = '2px 4px'
    info.el.style.borderRadius = '4px'
    info.el.style.fontSize = 'clamp(5px, 1.0vw, 16px)'
  },

  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    meridiem: false
  }
})



onMounted(() => {
     fetchMembers()
     fetchProfile()
     fetchPlan()
     fetchNotice()
    
  });

</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  justify-content: center;
  height: 100%;
  margin: 80px;
}

.calendar-content {
  padding: 50px;
  color: #000000;
  font-weight: bold;
  position: relative;
  z-index: 1;
  width: 50%;
  overflow: hidden; /* 이 부분이 중요! 내부 내용만 보여줍니다 */
  border-radius: 5%;
}

.calendar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  z-index: 0;
}

.notice {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 정렬 */
  padding: 5px;
  text-align: center; /* 텍스트 중앙 정렬 */
}

.notice-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 정렬 */
  padding: 5px;
  text-align: center; /* 텍스트 중앙 정렬 */
  color: black;
  font-size: 1.5em;
  list-style: none;
  margin-bottom: 0;
}

.notice-item {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background 0.2s;
}
.notice-item:hover {
  background-color: #f5f5f5;
}

/* 팝업 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content1 {
  background-color: white;
  color: black;
  padding: 40px;
  border-radius: 16px;
  width: 50%;
  max-width: 800px;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
  font-size: 28px;
}

.modal-content .content {
  margin: 24px 0;
  font-size: 18px;
  white-space: pre-wrap;
}

.modal-content .meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}



.fifty-img{
  margin: 120px;
  width: 40%;
  height: auto;
}


.mainbody {
  position: relative; /* 콘텐츠 영역 위에 별을 배경으로 두기 위해 relative로 설정 */
  z-index: 10; /* 별 배경보다 위에 표시 */
  background: rgb(255, 255, 255);

  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.profile-box {
  border-radius: 12px;
  background-color: rgb(248, 246, 240);
   box-shadow: 
    0px 0px 15px rgba(0, 0, 0, 0.5),  /* 위쪽 */
    0px 0px 15px rgba(0, 0, 0, 0.5);  /* 오른쪽 */
  margin: 20px auto;
  margin-top: 70px; 
  overflow: hidden;
  width: 1100px;

}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.7s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.profile-box-content {
  display: flex;
  justify-content: space-around;
  text-align: left;
  padding: 20px;
}

.close-btn {
  background-color: rgb(255, 255, 255);
  border: 1px solid #000000;
  color: rgb(0, 0, 0);
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.member-text {
  font-size: 15px;
  font-weight: bold;
  color: black;
}
h1{
  color:black;
}

.mainbody h1 {
  margin: 0;
}

.rank {
  background-color: blue;
  height: 200px;
}

/* 한줄로 나열 */
.community {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 1500px;
  margin: 0 auto;
  margin-bottom: 40px;
  padding: 30px 0;
  box-sizing: border-box;
}


.community a {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  text-decoration: none;
  color: rgb(252, 252, 252);
  width: 100%;
  max-width: 300px;
  padding: 10px;
  background-image: linear-gradient(to bottom, #7D64BD , #B166B6 25%, #CF8AB4 80%);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.calander {
  margin: 30px auto;
  width: 80%;
  max-width: 1200px;
  overflow-x: auto;
  font-weight: bold;
  color: black;
}

.profile {
  height: 400px;
}

.card-image-wrapper {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.card-image {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 60px;
  padding: 20px;
}

.card-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

.member-card {
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.member-card-image {
  /* background-color: white; */
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
  @media (max-width: 1380px) {
    .header1 {

      font-size: 120px;
    }
    .profile-box {
      margin-top: 70px;
      overflow: hidden;
      width: 1000px;
    }
    .community {
      width: 100%;
      grid-template-columns: 1fr;
    }
    .card-image {
      grid-template-columns: repeat(4, 1fr);
    }
    .pagination button {
      padding: 12px 25px;
      font-size: 16px;
    }
  }
  @media (max-width: 1080px) {
    .card-image {
      grid-template-columns: repeat(3, 1fr);
    }
    .pagination button {
      padding: 12px 25px;
      font-size: 16px;
    }
       .profile-box {
      margin-top: 70px;
      overflow: hidden;
      width: 800px;
    }
  }
  @media (max-width: 840px) {
    .community {
      width: 100%;
      grid-template-columns: 1fr;
    }
    .card-image {
      grid-template-columns: repeat(2, 1fr);
    }
    .pagination button {
      padding: 12px 25px;
      font-size: 16px;
    }
       .profile-box {
      margin-top: 70px;
      overflow: hidden;
      width: 600px;
    }
  }

  @media (max-width: 560px) {
    .community {
      grid-template-columns: 1fr;
    }
    .card-image {
      grid-template-columns: 1fr;
    }
    .pagination button {
      padding: 10px 20px;
      font-size: 14px;
    }
       .profile-box {
     font-size: 10px;
      margin-top: 70px;
      overflow: hidden;
      width: 400px;
    }
    .profile-box-content {
      display: flex;
      flex-direction: column; /* 세로 방향으로 배치 */
      align-items: center; /* 가로 중앙 정렬 */
      text-align: center;
      gap: 15px; /* 이미지와 텍스트 간격 조정 */
      padding: 20px;
    }
  }
 .pagination button {
    background-color: white;
    color: black;
    font-size: 18px;
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 100px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .pagination button:hover {
    background-color: #f0f0f0;
  }

  .pagination button:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }

  .pagination span {
    font-size: 18px;
    margin: 0 10px;
  }

.member-card-image:hover {
  transform: scale(1.05);
}

.member-card:hover {
  transform: scale(1.05);
}

.member-img
{
width: 100%;
height: 100%;
object-fit: cover;
border-radius: 10px;
border: 5px solid #a19191;
}

.social-icon {
width: 40px;
height: 40px;
border-radius: 50%;
margin-right: 10px;
}

.pagination {
display: flex;
justify-content: center;
gap: 20px;
margin-top: 20px;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.8);
display: flex;
align-items: center;
justify-content: center;
z-index: 999;
}

.modal-content {
position: relative;
max-width: 90%;
max-height: 90%;
}

.modal-img {
 width: 500px;
  object-fit: contain;
  border-radius: 20px;
}

.modal-close {
position: absolute;
top: 10px;
right: 20px;
font-size: 28px;
background: none;
color: white;
border: none;
cursor: pointer;
}
</style>