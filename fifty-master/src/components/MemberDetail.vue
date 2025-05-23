<template>
  
  <div class="slider">
   <transition-group name="slide" tag="div" v-if="songs.length > 0">
     <div v-for="(song, index) in [songs[currentIndex]]" :key="song.no" class="slide-item">
        <p>{{ index + 1 }}위 - {{ song.songTitle }}</p>
        <h3>{{ song.songTitle }} - {{ song.artist }}</h3>
        <p>{{ song.platform }}</p>
        <p>현재 순위: {{ song.todayRank }}</p>
        <p v-if="song.rankDiff !== null">
          순위 변동: 
          <span :class="{ up: song.rankDiff > 0, down: song.rankDiff < 0 }">
            {{ song.rankDiff > 0 ? '▲' + song.rankDiff : song.rankDiff < 0 ? '▼' + Math.abs(song.rankDiff) : '-' }}
          </span>
        </p>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiospr from '@/axios/profile'

interface SongWithDiff {
  no: number
  platform: string
  songTitle: string
  artist: string
  todayRank: number
  yesterdayRank: number | null
  rankDiff: number | null
  streamCount: number
  date: string
}


const songs = ref<SongWithDiff[]>([])
const currentIndex = ref(0)

const fetchData = async () => {
  try {
    console.log("이거나옴?")
    const res = await axiospr.MusicChart()
    songs.value = res.data
  } catch (error) {
    console.error('차트 데이터 불러오기 실패:', error)
  }
}

onMounted(async () => {
  await fetchData()
  if (songs.value.length > 1) {
    setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % songs.value.length
    }, 2000)
  }
})
</script>

<style scoped>
.up {
  color: red;
}
.down {
  color: blue;
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-active, .slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.slide-item {
  text-align: center;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

</style>
