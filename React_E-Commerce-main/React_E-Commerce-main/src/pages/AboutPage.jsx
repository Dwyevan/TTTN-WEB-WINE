import React from 'react'
import { Footer, Navbar } from "../components";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center fw-bold">Về Wine Store</h1>
        <hr />
        <p className="lead text-center mx-auto" style={{ maxWidth: "900px" }}>
          Chào mừng bạn đến với <strong>Wine Store</strong> – nơi hội tụ của những dòng rượu thượng hạng từ khắp nơi trên thế giới. 
          Với niềm đam mê mãnh liệt dành cho hương vị tinh túy, chúng tôi không chỉ bán rượu, mà còn mang đến những câu chuyện 
          về di sản, vùng đất và nghệ thuật ủ rượu lâu đời. Từ những chai Vang Pháp cổ điển đến những dòng Whisky mạnh mẽ từ Scotland, 
          mỗi sản phẩm tại Wine Store đều được tuyển chọn kỹ lưỡng để đảm bảo chất lượng hoàn hảo nhất cho quý khách hàng.
        </p>

        <h2 className="text-center py-4 fw-bold">Danh Mục Sản Phẩm</h2>
        <div className="row">
          {/* Rượu Vang */}
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100 border-0 shadow-sm">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/290316/pexels-photo-290316.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Fine Wine" height={160} />
              <div className="card-body bg-dark text-white rounded-bottom">
                <h5 className="card-title text-center mb-0">Rượu Vang Đỏ</h5>
              </div>
            </div>
          </div>
          
          {/* Whisky & Spirits */}
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100 border-0 shadow-sm">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Whisky" height={160} />
              <div className="card-body bg-dark text-white rounded-bottom">
                <h5 className="card-title text-center mb-0">Whisky Mạnh Mẽ</h5>
              </div>
            </div>
          </div>

          {/* Hầm rượu / Sưu tập */}
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100 border-0 shadow-sm">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/1545529/pexels-photo-1545529.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Champagne" height={160} />
              <div className="card-body bg-dark text-white rounded-bottom">
                <h5 className="card-title text-center mb-0">Champagne & Sparkling</h5>
              </div>
            </div>
          </div>

          {/* Phụ kiện rượu */}
          <div className="col-md-3 col-sm-6 mb-3 px-3">
            <div className="card h-100 border-0 shadow-sm">
              <img className="card-img-top img-fluid" src="https://images.pexels.com/photos/391213/pexels-photo-391213.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Accessories" height={160} />
              <div className="card-body bg-dark text-white rounded-bottom">
                <h5 className="card-title text-center mb-0">Phụ Kiện Cao Cấp</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Phần cam kết nghiệp vụ */}
        <div className="row mt-5 py-5 bg-light rounded">
          <div className="col-md-4 text-center">
            <i className="fa fa-check-circle fa-3x mb-3 text-warning"></i>
            <h5>Chất Lượng Chính Hãng</h5>
            <p className="small">Cam kết 100% rượu nhập khẩu chính ngạch, có đầy đủ giấy tờ nguồn gốc.</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="fa fa-truck fa-3x mb-3 text-warning"></i>
            <h5>Giao Hàng Hỏa Tốc</h5>
            <p className="small">Đóng gói chuyên dụng, giao nhanh trong nội thành để đảm bảo nhiệt độ rượu.</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="fa fa-glass fa-3x mb-3 text-warning"></i>
            <h5>Tư Vấn Chuyên Nghiệp</h5>
            <p className="small">Đội ngũ chuyên gia am hiểu sâu sắc về văn hóa thưởng thức rượu.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage