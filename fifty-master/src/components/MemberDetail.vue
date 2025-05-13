<template>
  <div class="starry-background">
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
            @click="selectMember(member)"
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

      <div class="filter-actions" v-if="selectedMember">
        <button @click="clearFilter">필터 초기화</button>
      </div>

      <div class="card-image-wrapper">
        <div class="card-image">
          <div
            v-for="member in filteredMembers"
            :key="member.id"
            class="member-card-image"
            @click="openModal(member.image)"
          >
            <img :src="member.image" :alt="member.name" class="member-img" />
          </div>
        </div>
      </div>

      <div class="member-detail" v-if="selectedMember">
        <h2>{{ selectedMember.name }}</h2>
        <img :src="selectedMember.image" alt="메인 이미지" class="member-img" style="width: 300px" />
        <p>이곳에 {{ selectedMember.name }}에 대한 소개를 적어주세요.</p>
      </div>

      <div class="pagination" v-if="!selectedMember">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const isSmallScreen = ref(window.innerWidth <= 480)
const showModal = ref(false)
const selectedImage = ref('')
const selectedMember = ref<Member | null>(null)

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
  nextTick(() => {
    const starryBackground = document.querySelector('.starry-background')
    const numberOfStars = 100
    if (!starryBackground) return
    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div')
      star.classList.add('star')
      star.style.top = `${Math.random() * window.innerHeight}px`
      star.style.left = `${Math.random() * window.innerWidth}px`
      starryBackground.appendChild(star)
    }
    window.addEventListener('resize', handleResize)
  })
})
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
const itemsPerPage = 15
const itemsProfile = 5
const totalPages = Math.ceil(member.value.length / itemsPerPage)

const displayedMembers = computed<Member[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return member.value.slice(start, start + itemsPerPage)
})

const MemberProfile = computed<Member[]>(() => {
  const start = (currentPage.value - 1) * itemsProfile
  return member.value.slice(start, start + itemsProfile)
})

const filteredMembers = computed<Member[]>(() => {
  return selectedMember.value ? [selectedMember.value] : displayedMembers.value
})

function changePage(direction: 'next' | 'prev') {
  if (direction === 'next' && currentPage.value < totalPages) currentPage.value++
  else if (direction === 'prev' && currentPage.value > 1) currentPage.value--
}

function selectMember(memberData: Member) {
  selectedMember.value = memberData
}
function clearFilter() {
  selectedMember.value = null
}

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay',
  },
  events: [
    { title: '콘서트 일정', date: '2025-05-15' },
    { title: '팬미팅', date: '2025-05-20' },
  ],
  dateClick(info: any) {
    alert(`날짜 클릭됨: ${info.dateStr}`)
  },
})
</script>
