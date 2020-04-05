<template>
  <div class="osm-map">
    <div id="map"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

let map = {};

const iconConfig = {
  iconSize: [20, 30],
  popupAnchor: [0, -20]
};

const icon = {
  blue: new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    ...iconConfig
  }),
  orange: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    ...iconConfig
  }),
  grey: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
    ...iconConfig
  })
};

export default {
  name: "OsmMap",
  props: {
    pharmacies: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: {}
    };
  },
  mounted() {
    this.drawMap();
  },
  methods: {
    // 畫底層基本的地圖
    drawMap(y = 25.01741, x = 121.476963) {
      map = L.map("map", {
        center: [y, x],
        zoom: 14
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    },
    // 更新座標
    updateMaker() {
      const vm = this;
      vm.removeMapMarker();
      console.log(vm.pharmacies, "111");
      setTimeout(() => {
        vm.pharmacies.forEach(item => {
          console.log(vm.pharmacies, "222");
          vm.addMaker(
            item.geometry.coordinates[1],
            item.geometry.coordinates[0],
            item.properties
          );
        });
      }, 16);
    },
    // 添加座標
    addMaker(y, x, pharmacy) {
      // 判別數量 給顏色
      let adultCount =
        pharmacy.mask_adult === 0
          ? "soldout"
          : pharmacy.mask_adult < 100
          ? "shortage"
          : "";
      let childCount =
        pharmacy.mask_child === 0
          ? "soldout"
          : pharmacy.mask_child < 100
          ? "shortage"
          : "";
      let currentIcon =
        pharmacy.mask_adult > 99 && pharmacy.mask_child > 99
          ? icon.blue
          : pharmacy.mask_adult === 0 && pharmacy.mask_child === 0
          ? icon.grey
          : icon.orange;
      L.marker([y, x], { icon: currentIcon })
        .addTo(map)
        .bindPopup(
          `
          <h3 class="name">${pharmacy.name}</h3>
          <p class="phone"><i class="el-icon-phone"></i> ${pharmacy.phone}</p>
          <p class="address"><i class="el-icon-location-outline"></i> ${pharmacy.address}</p>
          <div class="count">
            <p
              class="adult ${adultCount}"
            >
              <span>成人</span>
              <span>${pharmacy.mask_adult}</span>
            </p>
            <p
              class="child ${childCount}"
            >
              <span>兒童</span>
              <span>${pharmacy.mask_child}</span>
            </p>
          </div>
          <p class="update-time">最後更新: ${pharmacy.updated}</p>
          `
        );
    },
    // 移動位置
    // panTo(y,x,pharmacy){

    // },
    // 移除圖層
    removeMapMarker() {
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    }
  }
};
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 100%;
}

.leaflet-popup {
  .name {
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    margin: 0 0 8px;
  }
  .phone,
  .address,
  .update-time {
    font-size: 12px;
    line-height: 16px;
    margin: 0 0 4px;
    color: #666;
  }
  .update-time {
    text-align: right;
    margin: 8px 0 0;
  }
  .count {
    display: flex;
    justify-content: center;
    font-size: 12px;
    line-height: 30px;
    margin: 8px 0 0;
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
</style>
