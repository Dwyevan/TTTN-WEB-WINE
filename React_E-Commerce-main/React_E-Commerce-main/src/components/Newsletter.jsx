import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.submit?.preventDefault();
        e.preventDefault();
        if (email) {
            toast.success("Cảm ơn bạn đã gia nhập cộng đồng!");
            setEmail('');
        }
    };

    return (
        <section className="newsletter-section py-5 text-white text-center" style={{ background: '#2c0b12' }}>
            <div className="container py-5">
                <h2 className="mb-3 fw-bold" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', letterSpacing: '1px' }}>
                    Gia Nhập Cộng Đồng Sành Vang
                </h2>
                <p className="mb-5 mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem', fontWeight: '300', opacity: '0.9' }}>
                    Đăng ký để nhận tin tức về các dòng vang quý hiếm, bí mật thưởng vang từ chuyên gia và nhận đặc quyền ưu đãi dành riêng cho thành viên.
                </p>
                
                <form onSubmit={handleSubmit} className="d-flex justify-content-center mx-auto" style={{ maxWidth: '500px' }}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            className="form-control rounded-0 px-4 py-3" 
                            placeholder="Nhập địa chỉ email của bạn..." 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRight: 'none' }}
                        />
                        <button 
                            type="submit" 
                            className="btn rounded-0 px-4 fw-bold"
                            style={{ background: '#fff', color: '#2c0b12', letterSpacing: '1px' }}
                        >
                            ĐĂNG KÝ
                        </button>
                    </div>
                </form>
            </div>
            
            <style>{`
                .newsletter-section input::placeholder {
                    color: rgba(255,255,255,0.5);
                }
                .newsletter-section input:focus {
                    background: transparent;
                    color: #fff;
                    box-shadow: none;
                    border-color: #fff;
                }
            `}</style>
        </section>
    );
};

export default Newsletter;
