import React from 'react';
import { useNavigate } from 'react-router-dom';

const PairingGuide = () => {
    const navigate = useNavigate();

    return (
        <section className="pairing-section py-5" style={{ background: '#f9f6f0' }}>
            <div className="container py-4">
                <div className="text-center mb-5">
                    <span className="text-uppercase fw-bold" style={{ color: '#d4af37', letterSpacing: '2px', fontSize: '0.9rem' }}>Nghệ Thuật Thưởng Thức</span>
                    <h2 className="fw-bold mt-2 mb-3" style={{ color: '#1a1a1a', letterSpacing: '1px' }}>KẾT HỢP HOÀN HẢO</h2>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <div style={{ height: '1px', width: '50px', background: '#722f37' }}></div>
                        <i className="fa fa-utensils" style={{ color: '#722f37' }}></i>
                        <div style={{ height: '1px', width: '50px', background: '#722f37' }}></div>
                    </div>
                    <p className="text-muted mt-3 mx-auto" style={{ maxWidth: '700px' }}>
                        Một ly vang ngon sẽ thêm phần thăng hoa khi được kết hợp đúng điệu với ẩm thực và không gian thời tiết. Khám phá bí quyết chọn vang từ các chuyên gia WineStore.
                    </p>
                </div>

                <div className="row g-5 align-items-center mb-5 pb-4 border-bottom">
                    <div className="col-lg-6">
                        <div className="position-relative overflow-hidden" style={{ borderRadius: '16px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop" alt="Steak and Wine" className="w-100 object-fit-cover" style={{ height: '400px' }} />
                            <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))' }}>
                                <h4 className="text-white fw-bold">Vang Đỏ & Thịt Đỏ</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <span className="badge bg-burgundy mb-2 px-3 py-2 text-uppercase" style={{ letterSpacing: '1px' }}>Food Pairing</span>
                        <h3 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Bản giao hưởng của vị giác</h3>
                        
                        <div className="d-flex mb-4">
                            <div className="flex-shrink-0 me-3 mt-1">
                                <div className="icon-circle bg-white shadow-sm d-flex justify-content-center align-items-center rounded-circle" style={{ width: '50px', height: '50px', color: '#722f37' }}>
                                    <i className="fa fa-drumstick-bite fs-4"></i>
                                </div>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Thịt Đỏ & Vang Đỏ Đậm</h5>
                                <p className="text-muted mb-0">Chất tannin trong vang đỏ (Cabernet Sauvignon, Syrah) hòa quyện tuyệt vời với protein của thịt cừu, thịt bò bít tết, làm mềm thịt và tôn lên hương vị đậm đà.</p>
                                <button className="btn btn-link text-decoration-none p-0 mt-2 fw-bold d-inline-flex align-items-center" onClick={() => navigate('/product?category=Red Wine&pairing=meat')} style={{color: '#722f37'}}>Khám phá Vang Đỏ <i className="fa fa-angle-right ms-1"></i></button>
                            </div>
                        </div>

                        <div className="d-flex mb-4">
                            <div className="flex-shrink-0 me-3 mt-1">
                                <div className="icon-circle bg-white shadow-sm d-flex justify-content-center align-items-center rounded-circle" style={{ width: '50px', height: '50px', color: '#722f37' }}>
                                    <i className="fa fa-fish fs-4"></i>
                                </div>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Hải Sản & Vang Trắng Chát</h5>
                                <p className="text-muted mb-0">Vị chua thanh mát của vang trắng (Sauvignon Blanc, Chardonnay) khử tanh hiệu quả, đánh thức độ tươi ngọt của hàu, tôm hùm và các loại cá biển.</p>
                                <button className="btn btn-link text-decoration-none p-0 mt-2 fw-bold d-inline-flex align-items-center" onClick={() => navigate('/product?category=White Wine&pairing=seafood')} style={{color: '#722f37'}}>Khám phá Vang Trắng <i className="fa fa-angle-right ms-1"></i></button>
                            </div>
                        </div>

                        <button className="btn btn-outline-dark fw-bold px-4 py-2 mt-2" onClick={() => navigate('/product')}>Khám phá tất cả <i className="fa fa-arrow-right ms-2"></i></button>
                    </div>
                </div>

                <div className="row g-5 align-items-center flex-lg-row-reverse">
                    <div className="col-lg-6">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="position-relative overflow-hidden" style={{ borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                    <img src="https://images.unsplash.com/photo-1542451313056-b7c8e626645f?q=80&w=400&auto=format&fit=crop" alt="Winter Wine" className="w-100 object-fit-cover" style={{ height: '300px' }} />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }}>
                                        <h5 className="text-white fw-bold mb-0">Mùa Đông Lạnh</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 mt-4">
                                <div className="position-relative overflow-hidden" style={{ borderRadius: '16px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" alt="Summer Wine" className="w-100 object-fit-cover" style={{ height: '300px' }} />
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }}>
                                        <h5 className="text-white fw-bold mb-0">Mùa Hè Oai Bức</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <span className="badge mb-2 px-3 py-2 text-uppercase" style={{ letterSpacing: '1px', background: '#d4af37' }}>Weather Pairing</span>
                        <h3 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Cảm hứng từ thời tiết</h3>
                        
                        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '12px', background: '#ffffff', borderLeft: '4px solid #722f37 !important' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold text-dark d-flex align-items-center mb-2">
                                    <i className="fa fa-snowflake-o me-2" style={{ color: '#0056b3' }}></i> Khi trời se lạnh hoặc mưa
                                </h5>
                                <p className="text-muted mb-0">
                                    Không gì tuyệt vời hơn một ly Vang Đỏ full-bodied (đậm đà). Nhiệt độ thưởng thức lý tưởng từ 15-18°C. Hơi men nồng ấm sẽ xua tan cái lạnh, mang lại cảm giác thư giãn tuyệt đối.
                                </p>
                                <button className="btn btn-link text-decoration-none p-0 mt-2 fw-bold d-inline-flex align-items-center" onClick={() => navigate('/product?category=Red Wine&pairing=winter')} style={{color: '#722f37'}}>Gợi ý Vang Đỏ <i className="fa fa-angle-right ms-1"></i></button>
                            </div>
                        </div>

                        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', background: '#ffffff', borderLeft: '4px solid #d4af37 !important' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold text-dark d-flex align-items-center mb-2">
                                    <i className="fa fa-sun-o me-2" style={{ color: '#e6a700' }}></i> Trưa hè nóng nực
                                </h5>
                                <p className="text-muted mb-0">
                                    Lựa chọn hoàn hảo là Vang Trắng hoặc Vang Hồng (Rosé) ướp lạnh từ 7-10°C. Vị chua dịu và hương trái cây tươi mát sẽ giải nhiệt ngay tức thì, đánh thức mọi giác quan.
                                </p>
                                <button className="btn btn-link text-decoration-none p-0 mt-2 fw-bold d-inline-flex align-items-center" onClick={() => navigate('/product?category=White Wine&pairing=summer')} style={{color: '#d4af37'}}>Gợi ý Vang Trắng <i className="fa fa-angle-right ms-1"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-burgundy { background-color: #722f37; }
                .border-left-burgundy { border-left: 4px solid #722f37 !important; }
            `}</style>
        </section>
    );
};

export default PairingGuide;
