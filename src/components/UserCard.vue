<template>
  <a-card class="card-demo" :title="userVO['login']" hoverable>
    <template #extra>
      <a-link @click="handleLink(userVO['htmlUrl'])">Github</a-link>
    </template>
    <div>
      <div style="display: flex;justify-content: space-between">
        <a-image width="80" :src="userVO['avatarUrl']"/>
        <div>
          {{ userVO["name"] }}
          <br/>
          <br/>
          {{ userVO["company"] }}
          <br/>
          <br/>
          {{ userVO["location"] }}
        </div>
      </div>
      <div class="bio">
        {{ userVO["bio"] }}
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    userVO: {
      type: Object,
      required: true,
    }
  },
  methods: {
    handleLink(link) {
      window.open(link);
    },
  },
}
</script>

<style scoped>
.card-demo {
  width: 240px;
  margin-left: 24px;
  transition-property: all;
}

.card-demo:hover {
  transform: translateY(-4px);
}

.bio{
  margin-top: 15px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>