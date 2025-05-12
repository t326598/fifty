<template>
    <div>
      <h1>{{ id }}</h1>
      <h1>{{  }}</h1>
      <h2>왜 아무것도 안나옴?</h2>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      members: [
        { id: 1, name: '멤버 1' },
        { id: 2, name: '멤버 2' },
        { id: 3, name: '멤버 3' },
        { id: 4, name: '멤버 4' },
        { id: 5, name: '멤버 5' }
      ],
      memberName: ''
    };
  },
  }
  </script>
  