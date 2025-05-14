<template>
    <div class="mainbody">
      <div class="header">
        <h1 class="header1">FIFTY FIFTY</h1>
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
      <div class="calander">
        <FullCalendar :options="calendarOptions" />
      </div>
      <div class="notice">
        <h1>공지사항</h1>
      </div>
      <div class="profile">
        <h1>멤버 프로필 카드</h1>
        <div class="card-grid">
          <div
            v-for="member in MemberProfile"
            :key="member.id"
            class="member-card"
            @click="showProfileBox(member.id)"
          >
            <img
              v-if="!isSmallScreen"
              :src="member.image"
              :alt="member.name"
              class="member-img"
            />
            <p v-else class="member-text">{{ member.name }}</p>
          </div>
        </div>
      </div>
      <!-- 프로필 박스 -->
      <div
        v-if="showProfile"
        class="profile-box"
        :style="{ height: showProfile ? '400px' : '0' }"
      >
        <div class="profile-box-content">
          <section>
            <img src="@/assets/1.jpg" alt="" class="member-profile">
          </section>
          <section style="width: 50%;">
            <h1>이름</h1>
            <h2>"간단한 소개"</h2>
            <p>프로필 내용이 여기에 표시됩니다.</p>
          </section>
        </div>
      </div>
      <button v-if="showProfile" class="close-btn" @click="closeProfileBox">취소</button>
      <div class="card-image-wrapper">
        <div class="card-image">
          <div
            v-for="member in displayedMembers"
            :key="member.id"
            class="member-card-image"
            @click="openModal(member.image)"
          >
            <img :src="member.image" :alt="member.name" class="member-img" />
          </div>
        </div>
      </div>
      <div class="pagination" style="margin-top: 50px;">
        <button @click="changePage('prev')" :disabled="currentPage === 1">Previous</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage('next')" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <img :src="selectedImage" alt="확대 이미지" class="modal-img" />
        <button class="modal-close" @click="closeModal">×</button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const isSmallScreen = ref(window.innerWidth <= 480)

const showModal = ref(false)
const selectedImage = ref('')
const showProfile = ref(false) // 프로필 박스를 보여줄지 여부

// 프로필 박스를 열기
function showProfileBox() {
  showProfile.value = true
}

// 프로필 박스를 닫기
function closeProfileBox() {
  showProfile.value = false
}

function openModal(imageUrl: string) {
  selectedImage.value = imageUrl
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function handleResize() {
  isSmallScreen.value = window.innerWidth <= 480
}

onMounted(() => {
 
    window.addEventListener('resize', handleResize);
  });


onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

interface Member {
  id: number
  name: string
  image: string
}

const member = ref<Member[]>([
  { id: 1, name: '샤넬', image: require('@/assets/1.jpg') },
  { id: 2, name: '하나', image: require('@/assets/2.jpg') },
  { id: 3, name: '아테나', image: require('@/assets/3.jpg') },
  { id: 4, name: '예원', image: require('@/assets/4.jpg') },
  { id: 5, name: '키나', image: require('@/assets/5.jpg') },
  { id: 6, name: '루비', image: require('@/assets/1.jpg') },
  { id: 7, name: '지나', image: require('@/assets/2.jpg') },
  { id: 8, name: '은하', image: require('@/assets/3.jpg') },
  { id: 9, name: '수연', image: require('@/assets/4.jpg') },
  { id: 10, name: '리안', image: require('@/assets/5.jpg') },
  { id: 11, name: '제이', image: require('@/assets/1.jpg') },
  { id: 12, name: '샤론', image: require('@/assets/2.jpg') },
  { id: 13, name: '엘라', image: require('@/assets/3.jpg') },
  { id: 14, name: '루시아', image: require('@/assets/4.jpg') },
  { id: 15, name: '지유', image: require('@/assets/5.jpg') },
])

const currentPage = ref(1)
const itemsPerPage = 15 // 한 페이지에 15개 보여주기
const itemsProfile = 5
const totalPages = Math.ceil(member.value.length / itemsPerPage);

const displayedMembers = computed<Member[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  if (!member.value || member.value.length === 0) return []
  return member.value.slice(start, start + itemsPerPage)
})

const MemberProfile = computed<Member[]>(() => {
  const start = (currentPage.value - 1) * itemsProfile
  if (!member.value || member.value.length === 0) return []
  return member.value.slice(start, start + itemsProfile)
})

function changePage(direction: 'next' | 'prev') {
  if (direction === 'next' && currentPage.value < totalPages) {
    currentPage.value++;
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  }
}

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay'
  },
  events: [
    { title: '콘서트 일정', date: '2025-05-15' },
    { title: '팬미팅', date: '2025-05-20' }
  ],
  dateClick(info) {
    alert(`날짜 클릭됨: ${info.dateStr}`)
  }
})
</script>

<style scoped>
.mainbody {
  position: relative; /* 콘텐츠 영역 위에 별을 배경으로 두기 위해 relative로 설정 */
  z-index: 10; /* 별 배경보다 위에 표시 */
  background-color: #141212; /* 검정 배경 */
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.profile-box {
  border-radius: 12px;
   box-shadow: 
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 위쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 아래쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 왼쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5);  /* 오른쪽 */
  margin: 20px auto;
  margin-top: 70px; 
  overflow: hidden;
  transition: height 0.3s ease;
  width: 1100px;

}

.profile-box-content {
  display: flex;
  justify-content: space-around;
  text-align: left;
  padding: 20px;
}

.close-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.member-text {
  font-size: 15px;
  font-weight: bold;
  color: black;
}

.mainbody h1 {
  margin: 0;
}

.header1 {
  font-size: 200px;
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
  color: black;
  width: 100%;
  max-width: 300px;
  padding: 10px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.calander {
  margin: auto;
  padding: 30px 0;
  width: 50%;
  max-width: 1200px;
  overflow-x: auto;
}

.notice {
  background-color: aqua;
  height: 100px;
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
  background-color: white;
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
         box-shadow: 
        0px 0px 15px rgba(255, 255, 255, 0.5),  /* 위쪽 */
        0px 0px 15px rgba(255, 255, 255, 0.5),  /* 아래쪽 */
        0px 0px 15px rgba(255, 255, 255, 0.5),  /* 왼쪽 */
        0px 0px 15px rgba(255, 255, 255, 0.5);  /* 오른쪽 */
      border-radius: 12px;
      margin: 20px auto;
      margin-top: 70px;
      overflow: hidden;
      transition: height 0.3s ease;
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
         box-shadow: 
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 위쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 아래쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 왼쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5);  /* 오른쪽 */
      border-radius: 12px;
      margin: 20px auto;
      margin-top: 70px;
      overflow: hidden;
      transition: height 0.3s ease;
      width: 800px;
    }
  }
  @media (max-width: 840px) {
    .header1 {
      font-size: 120px;
    }
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
         box-shadow: 
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 위쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 아래쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 왼쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5);  /* 오른쪽 */
      border-radius: 12px;
      margin: 20px auto;
      margin-top: 70px;
      overflow: hidden;
      transition: height 0.3s ease;
      width: 600px;
    }
  }

  @media (max-width: 560px) {
    .header1 {
      font-size: 80px;
    }
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
         box-shadow: 
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 위쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 아래쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5),  /* 왼쪽 */
    0px 0px 15px rgba(255, 255, 255, 0.5);  /* 오른쪽 */
     font-size: 10px;
      border-radius: 12px;
      margin: 20px auto;
      margin-top: 70px;
      overflow: hidden;
      transition: height 0.3s ease;
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
}

.social-icon {
width: 40px;
height: 40px;
border-radius: 50%;
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