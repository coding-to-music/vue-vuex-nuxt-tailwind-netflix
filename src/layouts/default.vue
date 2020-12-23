<template>
  <div id="app" class="flex">
    <ToastContainer />
    <AlertsContainer />
    <HeaderComponent />
    <PortalTarget multiple style="z-index: 11000" class="fixed top-0 left-0" name="Popup-Outlet" />
    <PortalTarget multiple style="z-index: 10500" class="fixed top-0 left-0" name="Modal-Outlet" />

    <div id="rootView">
      <Nuxt />
    </div>
    <ProfileSelect v-if="showProfilePicker" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
import { AlertsContainer, ToastContainer, HeaderComponent, ProfileSelect } from '@components';
import { AuthModule, DarkModeModule, DisplayTheme, RouterModule } from '@store';

@Component({
  components: {
    AlertsContainer,
    ToastContainer,
    HeaderComponent,
    ProfileSelect,
  },
})
export default class App extends Vue {
  get showProfilePicker() {
    return AuthModule.state.showProfilePicker;
  }
  created() {
    if (process.browser) {
      const storedPreference = localStorage.getItem('displayMode');
      const autoTheme = localStorage.getItem('autoTheme') === 'true';
      if (autoTheme) {
        DarkModeModule.actions.enableAutoDetection();
      } else if (storedPreference) {
        DarkModeModule.actions.setTheme(storedPreference as DisplayTheme);
      } else {
        DarkModeModule.actions.setTheme('dark');
      }
    }
    if (process.browser) {
      document.addEventListener('touchstart', (e) => {}, { passive: true });
      document.addEventListener('touchmove', (e) => {}, { passive: true });
    }
  }
}
</script>

<style lang="postcss">
div#app {
  position: relative;
  width: 100%;
  flex: 1;
  max-width: 100%;

  #rootView {
    position: relative;
    width: 100%;
    max-width: 100%;
    flex: 1;
    display: flex;
    padding-top: var(--headerHeight);
  }
}
</style>