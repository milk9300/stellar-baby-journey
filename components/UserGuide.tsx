import React from 'react';
import { useNavigate } from 'react-router-dom';
import CloudBackground from './CloudBackground';
import PhotoGallery from './PhotoGallery';

const UserGuide: React.FC = () => {
    const navigate = useNavigate();

    const guideSteps = [
        {
            title: '成长轨迹',
            icon: 'vertical_split',
            description: '以天空为主题的垂直时间轴，每个气球携带的拍立得都承载着一段珍贵的回忆。通过沉浸式的向上滑动体验，仿佛置身于蓝天白云之中，见证宝宝的一路成长。常按拍立得可以查看详情（需要等待3s），左侧的高度可以自由拖动，建议从地面向上翻看更有感觉。右侧的指南针图标可以筛选日期如果您的内容过多建议使用。',
            images: ['/images/user-guide/星空导航组件.png']
        },
        {
            title: '记忆画卷',
            icon: 'panorama',
            description: '打破常规的横向浏览模式，将照片以画卷形式徐徐展开。在这里，时间流淌得更加温柔，您可以左右滑动，细细品味每一个精彩瞬间，享受如画廊般的视觉盛宴。（长按和日期筛选和成长轨迹一样）。',
            images: ['/images/user-guide/记忆画卷展示.png']
        },
        {
            title: '时光绘本',
            icon: 'auto_stories',
            description: '您的专属电子绘本，将零散的照片与文字汇聚成册。模拟真实的翻页效果，让每一次阅读都充满温情与仪式感，适合与家人共同分享这份成长的喜悦。左侧的时光索引方便您快速定位到想看的记忆。',
            images: ['/images/user-guide/时光绘本展示.png']
        },
        {
            title: '成长档案',
            icon: 'monitoring',
            description: '科学记录宝宝的生长发育数据，包括身高、体重等关键指标。通过可视化图表清晰展示成长趋势，让每一次微小的变化都清晰可见，为您留存一份详实的成长报告。',
            images: [
                '/images/user-guide/成长档案-数据图表.png',
                '/images/user-guide/成长档案-信息展示.png',
                '/images/user-guide/成长档案-历史记录.png',
                '/images/user-guide/成长档案-内容发布要求.png',
            ]
        },
        {
            title: '音乐播放',
            icon: 'music_note',
            description: '全局悬浮的音乐播放器，随时随地为您播放温馨的背景音乐。支持播放/暂停控制，音符跳动的视觉效果为浏览体验增添一份灵动与惬意。',
            images: ['/images/user-guide/音乐播放器组件.png']
        },
        {
            title: '长按交互',
            icon: 'touch_app',
            description: '在时间轴的气球节点上尝试长按操作，即可触发独特的交互反馈。探索隐藏在星空之下的更多细节，发现意想不到的惊喜。',
            images: ['/images/user-guide/长按加载组件.png']
        },
        {
            title: '日期选择',
            icon: 'calendar_month',
            description: '精心定制的日期选择组件，支持按年、月快速筛选。无论是回溯往昔还是查找特定日期的记录，都能轻松自如，让时间管理变得简单高效。',
            images: ['/images/user-guide/日期组件.png']
        },
        {
            title: '内容详情',
            icon: 'article',
            description: '点击任意记录即可进入详情页面，图文并茂地展示当天的故事。',
            images: ['/images/user-guide/内容详情展示.png']
        },
        {
            title: '图片查看',
            icon: 'zoom_in',
            description: '图片查看器，支持高清大图预览与手势缩放。每一个成长的细节都值得被放大审视，让美好的瞬间纤毫毕现。',
            images: ['/images/user-guide/图片查看工具.png']
        }
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#e0f2fe] to-[#f0f9ff] font-sans">
            <CloudBackground />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center bg-white/30 backdrop-blur-md border-b border-white/20">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">help_outline</span>
                    <h1 className="text-2xl font-handwritten text-primary font-bold">使用指南</h1>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white transition-all shadow-sm border border-primary/10 text-primary"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            {/* Content */}
            <main className="relative z-10 pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <div className="space-y-12">
                    {guideSteps.map((step, index) => (
                        <section
                            key={index}
                            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">{step.title}</h2>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {step.description}
                                    </p>
                                </div>
                                <div className="w-full md:w-80 h-64 rounded-2xl overflow-hidden bg-gray-100/50 border border-primary/10 shadow-inner group-hover:border-primary/30 transition-all shadow-sm">
                                    <PhotoGallery
                                        images={step.images}
                                        title={step.title}
                                        allowZoom={true}
                                        autoPlayInterval={5000}
                                    />
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Tip */}
                <div className="mt-16 text-center">
                    <div className="inline-block px-8 py-4 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                        ✨ 小贴士：点击右上角的菜单按钮可以随时切换不同的视图。
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserGuide;
