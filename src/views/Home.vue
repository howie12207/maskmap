<template>
  <div class="home">
    <osm-map class="osm-map" :pharmacies="pharmacies" ref="osmMap" />
    <div class="side-bar">
      <div class="container">
        <div class="content">
          <h2>找口罩</h2>
        </div>
        <div class="select-section">
          <el-select
            v-model="selectCounty"
            placeholder="請選擇縣市"
            @change="changeCounty()"
            size="small"
          >
            <el-option v-for="item in county" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select
            v-model="selectDistrict"
            placeholder="請選擇區域"
            size="small"
            @change="changeDistrict()"
          >
            <el-option v-for="item in district" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <div class="update-time" v-if="maskData.length > 0">最後更新 {{ updateTime }}</div>
        </div>
        <div class="pharmacy-list" v-if="pharmacies.length > 0">
          <div
            class="pharmacy"
            @click="openPopup(item.geometry.coordinates[1],
            item.geometry.coordinates[0],
            item.properties)"
            v-for="item in pharmacies"
            :key="item.properties.id"
          >
            <h3 class="name">{{ item.properties.name }}</h3>
            <p class="phone">
              <i class="el-icon-phone"></i>
              {{ item.properties.phone }}
            </p>
            <p class="address">
              <i class="el-icon-location-outline"></i>
              {{ item.properties.address }}
            </p>
            <div class="count">
              <p
                class="adult"
                :class="{
                  shortage: item.properties.mask_adult < 100,
                  soldout: item.properties.mask_adult === 0,
                }"
              >
                <span>成人</span>
                <span>{{ item.properties.mask_adult }}</span>
              </p>
              <p
                class="child"
                :class="{
                  shortage: item.properties.mask_child < 100,
                  soldout: item.properties.mask_child === 0,
                }"
              >
                <span>兒童</span>
                <span>{{ item.properties.mask_child }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="empty" v-if="selectDistrict && pharmacies.length === 0">暫無資料</div>
      </div>
    </div>
  </div>
</template>

<script>
import city from "@/assets/city.json";
import OsmMap from "@/components/OsmMap.vue";
import { apiPharmacies } from "@/api/index.js";

export default {
  name: "Home",
  components: { OsmMap },
  data() {
    return {
      maskData: [],
      county: [],
      selectCounty: "",
      selectDistrict: ""
    };
  },
  created() {
    this.getCountyDistrict();
    this.getMaskApi();
  },
  computed: {
    // 該顯示的區域
    district() {
      const vm = this;
      // console.log(city);
      let ary = [];
      if (vm.selectCounty) {
        city.forEach(item => {
          if (item.name === vm.selectCounty) {
            item.districts.forEach(districtName => {
              ary.push(districtName.name);
            });
          }
        });
        return ary;
      }
      return "";
    },
    // 該顯示的藥局清單
    pharmacies() {
      const vm = this;
      let ary = [];
      if (vm.selectDistrict) {
        vm.maskData.forEach(item => {
          if (
            vm.selectCounty === item.properties.county &&
            vm.selectDistrict === item.properties.town
          ) {
            ary.push(item);
          }
        });
        return ary;
      } else {
        return [];
      }
    },
    // 更新時間
    updateTime() {
      return this.maskData[0].properties.updated;
    }
  },
  methods: {
    // 取得口罩數量API
    async getMaskApi() {
      const vm = this;
      await apiPharmacies()
        .then(res => {
          vm.maskData = res.features;
        })
        .catch(err => console.log(err));
    },
    // 取得縣市
    getCountyDistrict() {
      const vm = this;
      // console.log(city);
      city.forEach(item => {
        vm.county.push(item.name);
      });
    },
    // 改變選的縣市，將選取區域清空
    changeCounty() {
      this.selectDistrict = "";
    },
    // 改變所選的區域
    changeDistrict() {
      this.$refs.osmMap.updateMaker();
    },
    // 開啟地圖的Popup視窗
    openPopup(y, x, pharmacy) {
      this.$refs.osmMap.panTo(y, x, pharmacy);
    }
  }
};
</script>

<style lang="scss">
.home {
  display: flex;
}
.side-bar {
  width: 30%;
  height: 100vh;
  overflow: hidden;
  background-color: #73c0d8;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.6);
  .container {
    width: 90%;
    margin: 0 auto;
    .content {
      height: 36px;
      h2 {
        color: white;
        font-size: 24px;
        line-height: 36px;
        font-weight: 600;
      }
    }
    .select-section {
      display: flex;
      flex-direction: column;
      height: 124px;
      .el-select {
        margin: 16px 0 0;
      }
      .update-time {
        margin: 8px 0 0;
        font-size: 14px;
        line-height: 20px;
        text-align: right;
        color: white;
      }
    }
    .pharmacy-list {
      margin: 16px 0 0;
      height: calc(100vh - 160px);
      overflow-y: auto;
      .pharmacy {
        margin: 0 0 16px;
        border: 1px solid grey;
        padding: 15px 19px;
        border-radius: 4px;
        box-shadow: 0px 1px 6px #000000;
        background: #ffffff 0% 0% no-repeat padding-box;
        cursor: pointer;
        .name {
          font-weight: 700;
          line-height: 20px;
          margin: 0 0 8px;
        }
        .phone,
        .address {
          font-size: 12px;
          line-height: 16px;
          margin: 0 0 4px;
          color: #666;
        }
        .count {
          display: flex;
          justify-content: center;
          font-size: 12px;
          line-height: 30px;
          .adult,
          .child {
            margin: 0 4px;
            flex: 1;
            max-width: 120px;
            display: flex;
            padding: 0 12px;
            border-radius: 32px;
            color: white;
            background-color: #73c0d8;
            text-align: center;
            &.shortage {
              background-color: #ffa573;
            }
            &.soldout {
              background-color: #a5a5a5;
            }
            span {
              flex: 1;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
.osm-map {
  width: 70%;
}
</style>
