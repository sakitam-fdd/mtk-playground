<template>
  <Header />
  <section
    id="home"
    class="relative z-10 overflow-hidden bg-white pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
  >
    <div class="page-container">
      <div class="-mx-4 flex flex-wrap">
        <div class="w-full px-4">
          <div class="mx-auto max-w-[800px] text-center">
            <h1
              class="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight"
            >
              maptalks
            </h1>
            <p class="mb-12 text-base !leading-relaxed text-body-color dark:text-white sm:text-lg md:text-xl">
              选择MapTalks WebGIS方案，即刻获得: 基于PBR材质的三维地图设计能力 矢量瓦片/倾斜摄影 全新渲染技术
              项目开发效率提升三倍以上
            </p>
            <div class="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <a
                href="https://github.com/maptalks/maptalks.js"
                target="_blank"
                rel="noopener noreferrer"
                title="Star on GitHub"
                class="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Star on GitHub
              </a>

              <RouterLink
                to="/playgrounds"
                class="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
              >
                Playgrounds
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
      <img src="@/assets/image/index-bg.svg" alt="bg" class="w-full h-full object-cover" />
    </div>
    <div class="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
      <img src="@/assets/image/index-bg-circle.svg" alt="bg" class="w-full h-full object-cover" />
    </div>
  </section>
  <SelectionItem
    title="2D/3D"
    paragraph="Maptalks integrates 2D/3D maps together by pitching and rotating 2D maps. Get one more dimension for mapping, visualizing and analyzing, with simplicity of 2D maps.
"
    mb="10px"
    :features="[
      {
        text: '简单',
      },
      {
        text: '功能丰富',
      },
      {
        text: '基于PBR材质的三维地图设计能力',
      },
      {
        text: '矢量瓦片/倾斜摄影',
      },
      {
        text: '全新渲染技术',
      },
    ]"
    link="https://maptalks.org/gallery/extrude-buildings/index.html"
    :image="banner1"
    alt="2D/3D"
  />
  <SelectionItem
    title="2D/3D"
    paragraph="Maptalks integrates 2D/3D maps together by pitching and rotating 2D maps. Get one more dimension for mapping, visualizing and analyzing, with simplicity of 2D maps.
"
    mb="10px"
    :features="[
      {
        text: '简单',
      },
      {
        text: '功能丰富',
      },
      {
        text: '基于PBR材质的三维地图设计能力',
      },
      {
        text: '矢量瓦片/倾斜摄影',
      },
      {
        text: '全新渲染技术',
      },
    ]"
    link="https://maptalks.org/gallery/extrude-buildings/index.html"
    :image="banner1"
    direction="left"
    alt="2D/3D"
  />
  <Footer />
</template>

<script setup lang="tsx">
  import banner1 from '@/assets/image/3d.png';
  import Footer from '@/components/Footer';
  import Header from '@/components/Header/index.vue';
  import SelectionItem from './SelectionItem';

  // 吸顶
  const scrollThreshold = 80;

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const myTop = section.offsetTop - scrollThreshold;
      window.scrollTo({
        top: myTop,
        behavior: 'smooth',
      });
    }
  };
</script>

<style lang="less" scoped></style>
