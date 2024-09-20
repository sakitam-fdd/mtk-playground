import { defineComponent } from 'vue';
import Logo from '@/assets/icon/logo.svg';

function LinkItem({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      title={title}
      className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:text-white dark:hover:opacity-80"
    >
      {title}
    </a>
  );
}

const Footer = defineComponent({
  setup() {
    return () => {
      const ABOUT_US_LINKS_LIST = [
        {
          title: '公司简介',
          href: '/about',
        },
        {
          title: '联系我们',
          href: '/contact',
        },
      ];

      const PRODUCT_AND_SERVICE_LIST = [
        {
          title: '产品',
          href: 'https://maptalks.com/#',
        },
        {
          title: '免费试用',
          href: 'https://maptalks.com/#',
        },
        {
          title: '订阅报价',
          href: 'https://maptalks.com/#',
        },
      ];

      const DEVELOPER_CENTER_LIST = [
        {
          title: 'MapTalks IDE文档',
          href: 'https://maptalks.com/#',
        },
        {
          title: 'MapTalks Design文档',
          href: 'https://maptalks.com/#',
        },
        {
          title: 'BaseDataServer文档',
          href: 'https://maptalks.com/#',
        },
        {
          title: 'VTS文档',
          href: 'https://maptalks.com/#',
        },
        {
          title: 'MapResty文档',
          href: 'https://maptalks.com/#',
        },
        {
          title: 'MapSnap文档',
          href: 'https://maptalks.com/#',
        },
        {
          title: 'ERS文档',
          href: 'https://maptalks.com/#',
        },
      ];

      return (
        <footer className="relative z-10 bg-white pt-16 dark:bg-gray-dark md:pt-20 lg:pt-24">
          <div className="container">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
                <div className="mb-12 max-w-[360px] lg:mb-16">
                  <a href="/" className="mb-8 inline-block">
                    <img src={Logo} alt="logo" className="w-full" />
                  </a>
                  <p className="mb-9 text-base leading-relaxed text-body-color dark:text-body-color-dark dark:text-white">
                    MAPTALKS
                  </p>
                </div>
              </div>

              <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
                <div className="mb-12 lg:mb-16">
                  <h2 className="mb-10 text-xl font-bold text-black dark:text-white">产品和服务</h2>
                  <ul>
                    {PRODUCT_AND_SERVICE_LIST.map((item) => (
                      <li key={item.href}>
                        <LinkItem title={item.title} href={item.href} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
                <div className="mb-12 lg:mb-16">
                  <h2 className="mb-10 text-xl font-bold text-black dark:text-white">开发者中心</h2>
                  <ul>
                    {DEVELOPER_CENTER_LIST.map((item) => (
                      <li key={item.href}>
                        <LinkItem title={item.title} href={item.href} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
                <div className="mb-12 lg:mb-16">
                  <h2 className="mb-10 text-xl font-bold text-black dark:text-white">关于我们</h2>
                  <ul>
                    {ABOUT_US_LINKS_LIST.map((item) => (
                      <li key={item.href}>
                        <LinkItem title={item.title} href={item.href} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]" />
            <div className="py-8">
              <p className="text-center text-base text-body-color dark:text-white">
                <span>© maptalks.com 版权所有</span>
                <span>鄂ICP备2020021619号</span>
              </p>
            </div>
          </div>
        </footer>
      );
    };
  },
});

export default Footer;
