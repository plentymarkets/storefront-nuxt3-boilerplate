<template>
  <client-only>
    <div
      v-if="!bannerIsHidden"
      class="fixed font-sf-xl z-10 w-full xl:w-3/5 text-sf-c-text font-sf-secondary font-sf-medium xl:right-sf-sm bottom-0 xl:bottom-sf-sm bg-sf-c-light-lighten shadow-2xl pt-2"
    >
      <div v-if="!furtherSettingsOn">
        <!-- cookie info -->
        <div
          class="text-left md:text-center ml-sf-xs md:ml-0 non-italic font-sf-semibold pt-sf-xs text-sf-xl text-sf-c-primary"
        >
          {{ cookieBarGetters.getBarTitle(cookieGroupsFromConfig) }}
        </div>
        <div class="non-italic font-sf-normal text-sf-xs md:text-sf-sm leading-relaxed p-2 pb-5">
          {{ cookieBarGetters.getBarDescription(cookieGroupsFromConfig) }}

          <SfButton link="/PrivacyPolicy" class="sf-button--text">
            {{ $t('CookieBar.Privacy Settings') }}
          </SfButton>
        </div>
        <!-- checkboxes -->
        <div v-if="cookieJson" class="flex flex-col md:flex-row flex-wrap md:flex-nowrap ml-sf-xs justify-between">
          <div v-for="(cookieGroup, index) in cookieJson" :key="index" class="mr-sf-sm">
            <SfCheckbox
v-model="cookieGroup.accepted" v-e2e="`checkbox-${index}`"
              :disabled="index === defaultCheckboxIndex"
              :name="cookieBarGetters.getCookieGroupName(cookieGroup)"
              :label="cookieBarGetters.getCookieGroupName(cookieGroup)"
              @change="($event) => setChildrenCheckboxes(cookieGroup, $event)"
            />
          </div>
        </div>
      </div>
      <div v-else class="overflow-y-auto h-80 bg-sf-c-light-primary-lighten px-2 pb-2">
        <div
v-for="(cookieGroup, groupIndex) in cookieJson" :key="groupIndex"
          class="bg-sf-c-light-primary mb-sf-xs p-sf-xs"
        >
          <div>
            <SfCheckbox
v-model="cookieGroup.accepted" :disabled="groupIndex === defaultCheckboxIndex"
              :name="cookieBarGetters.getCookieGroupName(cookieGroup)"
              :label="cookieBarGetters.getCookieGroupName(cookieGroup)"
              @change="($event) => setChildrenCheckboxes(cookieGroup, $event)"
            />
            <div class="non-italic text-sf-normal text-sf-sm leading-6 my-2">
              {{ cookieBarGetters.getCookieGroupDescription(cookieGroup) }}
            </div>
            <div v-if="cookieBarGetters.getShowMore(cookieGroup)" class="font-sf-light2">
              <div
v-for="(
                v-for="(cookie, cookieIndex) in cookieBarGetters.getCookiesList(cookieGroup)"
                :key="cookieIndex"
                class="mb-5"
              >
                <div class="flex w-full mb-sf-2xs p-sf-xs bg-white">
                  <SfCheckbox
v-model="cookie.accepted" :disabled="groupIndex === defaultCheckboxIndex"
                    :name="cookieBarGetters.getCookieName(cookie)"
                    :label="cookieBarGetters.getCookieName(cookie)"
                    @change="updateParentCheckbox(cookieGroup)"
                  />
                </div>
                <div v-for="propKey in Object.keys(cookie)" :key="propKey">
                  <div
                    v-if="propKey !== 'name' && propKey !== 'accepted'"
                    class="flex w-full mb-sf-2xs p-sf-xs bg-white"
                  >
                    <div class="w-1/4">
                      {{ propKey }}
                    </div>
                    <div class="w-3/4">
                      <template v-if="propKey === 'Privacy policy'">
                        <SfLink :link="localePath(cookie[propKey])">
                          {{ $t('CookieBar.Privacy Settings') }}
                        </SfLink>
                      </template>
                      <template v-else>
                        {{ cookie[propKey] }}
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SfButton
v-if="!cookieBarGetters.getShowMore(cookieGroup)" class="sf-button--text mb-xs"
              @click="cookieGroup.showMore = true"
            >
              {{ $t('CookieBar.More information') }}
            </SfButton>
            <SfButton v-else class="sf-button--text mb-xs" @click="cookieGroup.showMore = false">
              {{ $t('CookieBar.Show less') }}
            </SfButton>
          </div>
        </div>
      </div>
      <!-- further settings / back button -->
      <div class="my-sf-sm text-center">
        <SfButton v-if="!furtherSettingsOn" class="sf-button--text" @click="furtherSettingsOn = true">
          {{ $t('CookieBar.Further Settings') }}
        </SfButton>
        <SfButton v-else class="sf-button--text" @click="furtherSettingsOn = false">
          {{ $t('CookieBar.Back') }}
        </SfButton>
      </div>
      <!-- action buttons -->
      <div class="w-full flex flex-col xl:flex-row gap-sf-xs p-sf-xs">
        <div class="flex-1 mb-sf-xs">
          <button
v-e2e="'accept-all'" class="color-sf-c-primary w-full sf-button" :aria-disabled="false" type="button"
            aria-label="button"
            @click="convertAndSaveCookies(true, true)"
          >
            {{ $t('CookieBar.Accept All') }}
          </button>
        </div>
        <div class="flex-1 mb-sf-xs">
          <button
v-e2e="'reject-all'" class="color-sf-c-primary w-full sf-button" :aria-disabled="false" type="button"
            aria-label="button"
            @click="convertAndSaveCookies(true, false)"
          >
            {{ $t('CookieBar.Reject All') }}
          </button>
        </div>
        <div class="flex-1 mb-sf-xs">
          <button
v-e2e="'accept-selection'" class="sf-button w-full border-solid border-1 border-sf-c-primary"
            :aria-disabled="false"
            type="button"
            @click="convertAndSaveCookies(false, false)"
          >
            {{ $t('CookieBar.Accept Selection') }}
          </button>
        </div>
      </div>
    </div>
    <!-- button to open cookie tab -->
    <button
v-else v-e2e="'cookie-show-banner-button'"
      class="color-sf-c-primary sf-button z-10 fixed bottom-sf-2xl xl:bottom-sf-xs xl:left-auto xl:right-sf-xs invisible xl:visible"
      aria-label="Cookie control"
      @click="bannerIsHidden = false"
    >
      <SfIcon icon="info_shield" size="xs" color="white" viewBox="0 0 24 24" :coverage="1" />
    </button>
  </client-only>
</template>

<script>
import { ref, useContext } from '@nuxtjs/composition-api';
import { SfCheckbox, SfIcon, SfButton, SfLink } from '@storefront-ui/vue';
import { cookieBarGetters, useCookieBar } from '@vue-storefront/plentymarkets';

export default {
  components: {
    SfIcon,
    SfCheckbox,
    SfButton,
    SfLink,
  },
  setup() {
    const { $config, app } = useContext();
    const { cookieJson, bannerIsHidden, convertAndSaveCookies, defaultCheckboxIndex } = useCookieBar(
      app.$cookies,
      'consent-cookie',
      0,
      $config.cookieGroups,
    );
    const furtherSettingsOn = ref(false);

    const setChildrenCheckboxes = (group, state) => {
      group.cookies = group.cookies.map((cookie) => ({
        ...cookie,
        accepted: state,
      }));
    };

    const updateParentCheckbox = (group) => {
      group.accepted = group.cookies.some((cookie) => cookie.accepted);
    };

    return {
      defaultCheckboxIndex,
      furtherSettingsOn,
      bannerIsHidden,
      cookieBarGetters,
      cookieJson,
      convertAndSaveCookies,
      cookieGroupsFromConfig: ref($config.cookieGroups),
      setChildrenCheckboxes,
      updateParentCheckbox,
    };
  },
};
</script>
