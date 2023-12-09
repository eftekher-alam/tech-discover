import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import { Link } from 'react-router-dom';

const Banner = () => {

    const { user } = useContext(AuthContext);

    return (
        <section>
            {/* Carousel for medium device to large */}
            <div className='pt-16 max-md:hidden' data-aos="fade-up">
                <Swiper
                    autoHeight={false}
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className='relative'>
                            <div className='w-full h-full bg-gradient-to-r from-white via-transparent to-transparent absolute'></div>
                            <img src="https://i02.appmifile.com/598_operator_global/17/11/2023/d5d5e9e3617061faa0452198a83db6b9.jpg" className='' />
                            <div className='absolute top-6 lg:top-24 left-16 lg:left-40 w-full flex flex-col justify-start items-start gap-3'>
                                <h1
                                    className='text-3xl gradient-text font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >SAMSUNG TV Max</h1>
                                <h3
                                    className='font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Maximize your view</h3>
                                <p
                                    className='text-start'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    86 inch screen with premium bezel-less design <br />
                                    4K ultra HD display with 120Hz refresh rate.
                                </p>
                                <Link
                                    className='button'
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >Discover More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='relative'>
                            <div className='w-full h-full bg-gradient-to-r from-white via-transparent to-transparent absolute'></div>
                            <img src="https://i02.appmifile.com/753_operator_global/17/11/2023/29e7367bc8ff7907653ccd2182bd67e2.jpg" className='' />
                            <div className='absolute top-6 lg:top-24 left-16 lg:left-40 w-full flex flex-col justify-start items-start gap-3'>
                                <h1
                                    className='text-3xl gradient-text font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >GOOGLE Watch 2 Pro</h1>
                                <h3 className='font-bold' data-aos="fade-up" data-aos-delay="200">
                                    Smarter every wear
                                </h3>
                                <p
                                    className='text-start'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Wear Os by Google. <br />
                                    Powered by the Snapdragon® W5+ Gen 1 Platform</p>
                                <Link
                                    className='button'
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >Discover More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='relative'>
                            <div className='w-full h-full bg-gradient-to-r from-white via-transparent to-transparent absolute'></div>
                            <img src="https://i02.appmifile.com/341_operator_global/17/11/2023/753c50c4ceb92c7b29094c02563ba40c.jpg" className='' />
                            <div className='absolute top-6 lg:top-24 left-16 lg:left-40 w-full flex flex-col justify-start items-start gap-3'>
                                <h1
                                    className='text-3xl gradient-text font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >XIAOMI 13 Pro</h1>
                                <h3
                                    className='font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Behid the masterpiece</h3>
                                <p
                                    className='text-start'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Leica professional optical lens<br />
                                    Powered by the Snapdragon® Gen 8</p>
                                <Link
                                    className='button'
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >Discover More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* Carousel for small device */}
            <div className={`${user ? 'pt-16' : 'pt-20'} md:hidden`} data-aos="fade-up">
                <Swiper
                    autoHeight={false}
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className='relative'>
                            <img src="https://i.ibb.co/KLRQrRC/tv.jpg" className='' />
                            <div className='absolute top-12 w-full flex flex-col justify-center items-center gap-3'>
                                <h1
                                    className='text-3xl gradient-text font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >SAMSUNG TV Max</h1>
                                <h3
                                    className='font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Maximize your view</h3>
                                <p
                                    className='px-10 text-center'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >86 inch screen with premium bezel-less design 4K ultra HD display with 120Hz refresh rate.</p>
                                <Link
                                    className='button'
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >Discover More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='relative'>
                            <img src="https://i.ibb.co/zQZ947P/watch.jpg" className='' />
                            <div className='absolute top-12 w-full flex flex-col justify-center items-center gap-3'>
                                <h1
                                    className='text-3xl gradient-text font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >GOOGLE Watch 2 Pro</h1>
                                <h3
                                    className='font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Smarter every wear</h3>
                                <p
                                    className='px-10 text-center'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Wear Os by Google.
                                    Powered by the Snapdragon® W5+ Gen 1 Platform</p>
                                <Link
                                    className='button'
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >Discover More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='relative'>
                            <img src="https://i.ibb.co/Qb8TzhZ/phone.jpg" className='' />
                            <div className='absolute top-12 w-full flex flex-col justify-center items-center gap-3'>
                                <h1
                                    className='text-3xl gradient-text font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >XIAOMI 13 Pro</h1>
                                <h3
                                    className='font-bold'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >Behid the masterpiece</h3>
                                <p
                                    className='px-10 text-center'
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    Leica professional optical lens<br />
                                    Powered by the Snapdragon® Gen 8
                                </p>
                                <Link
                                    className='button'
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                >Discover More</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </section >
    );
};

export default Banner;