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
      v-for="member in displayedMembers"
      :key="member.id"
      class="member-card"
      @click="goToDetail(member.id)"
    >
      <img :src="member.image" :alt="member.name" class="member-img" />
      <p>{{ member.name }}</p>
    </div>
  </div>
</div>
    <div class="image">
      <h1>멤버 이미지 및 페이징 처리</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useRouter } from 'vue-router'

const router = useRouter()



interface Member {
  id: number
  name: string
  image: string
}

const member = ref<Member[]>([
  { id:1, name: '멤버 1', image: '@/assets/member1.jpg'},
  { id:2, name: '멤버 2', image: '@/assets/member2.jpg'},
  { id:3, name: '멤버 3', image: '@/assets/member3.jpg'},
  { id:4, name: '멤버 4', image: '@/assets/member4.jpg'},
  { id:5, name: '멤버 5', image: '@/assets/member5.jpg'},
])


const currentPage = ref(1)
const itemsPerPage = 20 // 한 페이지에 20개 보여주기

const displayedMembers = computed<Member[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  if (!member.value || member.value.length === 0) return []
  return member.value.slice(start, start + itemsPerPage)
})



function goToDetail(id: number){
  router.push({ name: 'MemberDetail', params: { id } });
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
  .mainbody h1{
    margin: 0;
  }
  .header1{
    font-size: 200px;
  }
  .rank{
    background-color: blue;
    height: 200px;
  }
  .community{
    width: 1000px;
    margin: auto;
    padding: 30px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2열 */
    gap: 20px;
    justify-items: center;
    align-items: center;
  }
  .community a{
    display: flex;
    align-items: center;  /* 세로로 중앙 정렬 */
    justify-content: center; /* 텍스트를 가운데 정렬 */
    gap: 5px;
    text-decoration: none;
    color: black;
    width: 100%;           /* a 태그 너비는 부모에 맞춤 */
    max-width: 300px;      /* 최대 너비 제한 */
    padding: 10px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  .calander{
     margin: auto;
    padding: 30px 0;
    align-items: center;
      /* ✅ 사이즈 조절 추가 */
    width: 1500px;
  }
  .notice{
    background-color: aqua;
    height: 100px;
  }
  .profile{
    background-color: brown;
    height: 300px;
  }
  .image{
    background-color: pink;
    height: 800px;
  }

  .social-icon {
    width: 64px;
    height: 64px;
    object-fit: contain;
    flex-shrink: 0;        /* 이미지 크기 고정 */
    border-radius: 8px;
    margin-right: 12px;    /* 이미지와 텍스트 간 간격 */
  }
  .community p {
    flex-grow: 1;          /* 텍스트가 공간을 차지하게 */
    text-align: center;    /* 텍스트 중앙 정렬 */
  }

  .card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5개씩 한 줄 */
  gap: 20px;
  padding: 20px;
}

.member-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.member-card:hover {
  transform: scale(1.05);
}

.member-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

</style>
