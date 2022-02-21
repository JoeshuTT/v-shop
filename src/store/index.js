import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const modulesFiles = require.context('./modules', true, /\.js$/);

const modules = {};
modulesFiles.keys().forEach((filePath) => {
  modules[filePath.slice(2, -3)] = modulesFiles(filePath).default;
});

export default new Vuex.Store({
  modules,
});
