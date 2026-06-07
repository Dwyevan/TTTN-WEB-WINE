package com.winestore.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BackupService {

    // Chạy tự động vào 2 giờ sáng mỗi ngày
    @Scheduled(cron = "0 0 2 * * ?") 
    public void backupDatabase() {
        String dbName = "wine_db"; // Tên database của bạn
        String dbUser = "root";
        String dbPass = ""; // Mật khẩu (để trống nếu dùng XAMPP mặc định)
        
        // Tạo tên file theo ngày giờ: backup_20231027_0200.sql
        String fileName = "backup_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmm")) + ".sql";
        
        // Đường dẫn đến thư mục lưu file backup (Hãy đảm bảo thư mục này tồn tại)
        String savePath = "D:/backups/" + fileName; 

        // Câu lệnh mysqldump (Đảm bảo bạn đã thêm MySQL vào biến môi trường Path)
        String executeCmd = "mysqldump -u " + dbUser + " " + dbName + " -r " + savePath;

        try {
            Process runtimeProcess = Runtime.getRuntime().exec(executeCmd);
            int processComplete = runtimeProcess.waitFor();

            if (processComplete == 0) {
                System.out.println("Cửa hàng rượu: Backup dữ liệu thành công tại " + savePath);
            } else {
                System.out.println("Cửa hàng rượu: Backup thất bại!");
            }
        } catch (IOException | InterruptedException e) {    
            e.printStackTrace();
        }
    }
}