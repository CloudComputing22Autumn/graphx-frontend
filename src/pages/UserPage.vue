<template>
  <header>
    <span>Github Users</span>
    <a-input-search :style="{width:'320px',height: '32px'}"
                    @search="handleSearch"
                    placeholder="请输入用户名"
                    search-button/>
  </header>
  <div style="
      font-size: large;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      margin-bottom: 5px;
">
    当前用户{{ user }}
    <a-button type="text" status="normal"
              @click="handleCommunity"
              style="font-size: large">所在社区图
    </a-button>
    <a-button type="text" status="success"
              @click="handleLatentFriends"
              style="font-size: large">可能认识的人
    </a-button>
  </div>
  <div v-show="isCommunity">
    <div id="kg-wrapper">
    </div>
  </div>
  <div v-show="!isCommunity" class="friends">
    <user-card v-for="item in friends"
               :key="item.id"
               :user-v-o="item"/>
  </div>

  <a-drawer
      :width="340"
      :height="340"
      :visible="visible"
      placement="bottom"
      @ok="visible=false"
      @cancel="visible=false"
      unmountOnClose
  >
    <template #title>
      {{ currentUser["login"] }}
    </template>
    <div style="display: flex;justify-content: space-around">
      <a-image width="100" :src="currentUser['avatarUrl']"/>
      <div>
        姓名： {{ currentUser["name"] }}
        <br/>
        <br/>
        公司： {{ currentUser["company"] }}
        <br/>
        <br/>
        地区： {{ currentUser["location"] }}
      </div>
    </div>
    <div class="bio" :title="currentUser['bio']">
      签名：{{ currentUser["bio"] }}
      <br/>
      链接：<a-button type="text" status="normal"
                    @click="handleUrlClick(currentUser['htmlUrl'])">{{currentUser["htmlUrl"]}}</a-button>
    </div>
  </a-drawer>
</template>

<script>
import API from "@/api";
import UserCard from "@/components/UserCard";
import * as d3 from "d3";

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

      visible: false,
      currentUser: null,
    };
  },
  mounted() {
    this.user = this.$route.params.login;
    this.init()
  },
  methods: {
    async init() {
      const _this = this;
      const res = await API.findCommunity(this.user);
      this.community = res.data.res;
      let kgWrapper = document.getElementById("kg-wrapper");
      let w = document.body.clientWidth;
      let h = document.body.clientHeight - 112;
      kgWrapper.style.height = h + "px";
      let svg = d3.select("#kg-wrapper")
          .append("svg")
          .attr("id", "kg-svg")
          .attr("viewBox", [0, 0, w, h]);
      let g = svg.append("g");
      let nodes = this.community["users"].map(d => {
        return Object.create(d);
      });
      let links = this.community["relations"].map(d => {
        return Object.create(d);
      });

      // eslint-disable-next-line no-unused-vars
      let marker1 = g.append('g')
          .append("marker")
          .attr("id", 'arrowhead1')
          .attr('viewBox', '-0 -5 10 10')
          .attr('refX', 18)
          .attr('refY', 0)
          .attr('orient', 'auto')
          .attr('markerWidth', 8)
          .attr('markerHeight', 8)
          .attr('xoverflow', 'visible')
          .append('svg:path')
          .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
          .attr("stroke-opacity", 0.8)
          .attr('fill', 'darkgrey');

      // eslint-disable-next-line no-unused-vars
      let marker2 = g.append('g')
          .append("marker")
          .attr("id", 'arrowhead2')
          .attr('viewBox', '-0 -5 10 10')
          .attr('refX', -8)
          .attr('refY', 0)
          .attr('orient', 'auto')
          .attr('markerWidth', 8)
          .attr('markerHeight', 8)
          .attr('xoverflow', 'visible')
          .append('svg:path')
          .attr('d', 'M 10,-5 L 0 ,0 L 10,5')
          .attr("stroke-opacity", 0.8)
          .attr('fill', 'darkgrey');

      let simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-750))
          .force("center", d3.forceCenter(w / 2, h / 2));

      let link = g.append("g")
          .selectAll(".link")
          .data(links)
          .join("path")
          .attr("stroke-width", 1.5)
          .attr("stroke", "darkgrey")
          .attr("stroke-opacity", 0.8)
          .attr("id", function (d) {
            return ("link-" + d.id)
          })
          .attr("class", "link")

      link.append("title")
          .text(d => d.source.login + " follows " + d.target.login);

      let node = g.append("g")
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", 10)
          .attr("fill", "#409EFF")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .attr("id", d => "node-" + d.id)
          .attr("class", "node")
          .call(drag(simulation))
          .on("click", function (event, d) {
            _this.handleNodeClick(event, d);
          })

      let defs = g.append("defs");
      let circleTextFilter1 = defs
          .append("filter")
          .attr("id", "nodeTextBg1")
          .attr("x", -0.05)
          .attr("y", -0.05)
          .attr("width", 1.1)
          .attr("height", 1.1);

      circleTextFilter1.append("feFlood")
          .attr("flood-color", "#fff")
          .attr("flood-opacity", "1");

      circleTextFilter1.append("feComposite")
          .attr("in", "SourceGraphic")
          .attr("operator", "over");

      // 节点名称显示
      let nodeText = g.append("g")
          .selectAll(".nodeText")
          .data(nodes)
          .join("text")
          .text(d => d.login)
          .attr("dx", function () {
            return this.getBoundingClientRect().width / 2 * (-1)
          })
          .attr("dy", 25)
          .attr("font-size", 12)
          .attr("id", d => "nodeText" + d.id)
          .attr("filter", "url(#nodeTextBg1)")
          .attr("class", "nodeText");

      // 力导：节点、关系、节点文字、关系标签
      simulation.on("tick", () => {
        link
            .attr("marker-end", function (d) {
              if (d.source.x < d.target.x) {
                return "url(#arrowhead1)"
              } else {
                return null
              }
            })
            .attr("marker-start", function (d) {
              if (d.source.x < d.target.x) {
                return null
              } else {
                return "url(#arrowhead2)"
              }
            })
            .attr('d', function (d) {
              if (d.source.x < d.target.x) {
                return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
              } else {
                return 'M ' + d.target.x + ' ' + d.target.y + ' L ' + d.source.x + ' ' + d.source.y;
              }
            });

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        nodeText
            .attr("x", d => d.x)
            .attr("y", d => d.y);

      });

      // 设置图谱的缩放
      let zoom = d3.zoom()
          .extent([[0, 0], [w, h]])
          .scaleExtent([0.1, 8])
          .on("zoom", zoomed);

      svg.call(zoom)
          .on("dblclick.zoom", null);

      API.findLatentFriends(this.user).then(res => {
        this.friends = res.data;
      })

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
      }

      function zoomed(event) {
        g.attr("transform", event.transform);
        if (event.transform.k >= 1) {
          g.selectAll("circle")
              .attr("r", 12 / event.transform.k)
              .attr("stroke-width", 1.5 / event.transform.k);
          g.selectAll("path")
              .attr("stroke-width", 2 / event.transform.k);
          g.selectAll(".nodeText")
              .attr("font-size", 15 / event.transform.k)
              .attr("dx", function () {
                return (this.getBoundingClientRect().width / 2 * (-1)) / event.transform.k
              })
              .attr("dy", 25 / event.transform.k);
          g.selectAll(".linkText")
              .attr("font-size", 10 / event.transform.k)
              .attr("dy", -5 / event.transform.k);
        }
      }
    },

    handleCommunity() {
      this.isCommunity = true;
    }
    ,

    handleLatentFriends() {
      this.isCommunity = false;
    }
    ,

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
    },

    // eslint-disable-next-line no-unused-vars
    handleNodeClick(event, d) {
      this.currentUser = d;
      this.visible = true;
    },

    handleUrlClick(url){
      window.open(url);
    },
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
  grid-gap: 10px;
}

.bio{
  text-align: center;
  margin-top: 15px;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>