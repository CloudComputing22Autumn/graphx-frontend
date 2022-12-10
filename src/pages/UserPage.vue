<template>
  <header>
    <span>Github Users</span>
    <a-input-search :style="{width:'320px',height: '32px'}"
                    @search="handleSearch"
                    placeholder="请输入用户名"
                    search-button/>
  </header>
  <div>
    当前用户{{ user }}
    <a-button type="text" status="normal" @click="handleCommunity">所在社区图</a-button>
    <a-button type="text" status="success" @click="handleLatentFriends">可能认识的人</a-button>
  </div>
  <div v-if="isCommunity && community!==null">
    {{ community }}
  </div>
  <div v-if="!isCommunity && friends!==null" class="friends">
    <user-card v-for="item in friends"
               :key="item.id"
               :user-v-o="item"/>
  </div>
</template>

<script>
import API from "@/api";
import UserCard from "@/components/UserCard";

export default {
  name: "UserPage",
  components: {
    UserCard
  },
  data() {
    return {
      user: null,
      isCommunity: true,
      community: null,
      friends: null,
    };
  },
  mounted() {
    this.user = this.$route.params.login;
    this.init()
  },
  methods: {
    init(){
      console.log(this.user);
      API.findCommunity(this.user).then(res => {
        this.community = res.data;
      })
      API.findLatentFriends(this.user).then(res => {
        this.friends = res.data;
      })
    },

    handleCommunity() {
      this.isCommunity = true;
    },

    handleLatentFriends() {
      this.isCommunity = false;
    },

    handleSearch(value) {
      if (value === "") {
        this.$message.info("请勿输入空值")
      } else {
        API.findUser(value).then(res => {
          console.log(res);
          if (res.data === "") {
            this.$message.error(`用户${value}不存在`);
          } else {
            this.$router.push(`/user/${res.data}`);
            this.user = res.data;
            this.community = null;
            this.friends = null;
            this.init()
          }
        });
      }
    }
  }
}
</script>

<style scoped>
header {
  width: 100%;
  height: 80px;
  background-color: #24292F;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

span {
  font-size: xx-large;
  font-weight: bolder;
  color: #ffffff;
}

.friends {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
}
</style>