import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    maskData: [],
    pharmacies: [],
  },
  mutations: {
    PHARMACIES(state, payload) {
      state.pharmacies = payload;
    },
  },
  actions: {
    // 更新座標
    // updateMaker(context) {
    //   context.state.pharmacies.forEach((item) => {
    //     context.dispatch(
    //       "addMaker(item.geometry.coordinates[1],item.geometry.coordinates[0],item.properties)"
    //     );
    //   });
    // },
    // addMaker(context, payload) {
    //   L.marker([y, x], { icon: context.state.icon.green })
    //     .addTo(map)
    //     .bindPopup(
    //       `
    //       <h3 class="name">黃安藥局</h3>
    //       <p class="phone"><i class="el-icon-phone"></i> 02-2222-2222</p>
    //       <p class="address"><i class="el-icon-location-outline"></i> 新北市板橋區中山路123123132</p>
    //       <p class="update-time">最後更新: 2020-02-02 19:19:19</p>
    //       <div class="count">
    //         <p
    //           class="adult"
    //           :class="{
    //             shortage: item.properties.mask_adult < 100,
    //             soldout: item.properties.mask_adult === 0,
    //           }"
    //         >
    //           <span>成人</span>
    //           <span>10</span>
    //         </p>
    //         <p
    //           class="child"
    //           :class="{
    //             shortage: item.properties.mask_child < 100,
    //             soldout: item.properties.mask_child === 0,
    //           }"
    //         >
    //           <span>兒童</span>
    //           <span>20</span>
    //         </p>
    //       </div>
    //       `
    //     )
    //     .openPopup();
    // },
  },
  modules: {},
});
