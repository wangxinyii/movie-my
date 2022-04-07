<template>
  <div class="cinema-container">
    <h1>影院管理</h1>
  </div>
</template>

<script>

export default {
  name: 'CinemaIndex',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {},
  methods: {}
}
</script>
