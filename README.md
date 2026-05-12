# ManaPet Shop

## 1. Tên đề tài
ManaPet Shop

## 2. Giới thiệu website/hệ thống
ManaPet Shop là ứng dụng mobile bán thú cưng và sản phẩm chăm sóc thú cưng. Hệ thống cho phép người dùng xem danh mục, tìm kiếm sản phẩm, xem chi tiết, quản lý giỏ hàng, theo dõi đơn hàng và cập nhật thông tin cá nhân.

## 3. Danh sách thành viên
| Họ và tên | MSSV |
| --- | --- |
| Nguyễn Văn Khải | 23810310059 |
| Nguyễn Đức Mạnh | 23810310053 |
| Lê Văn Sở | 23810310018 |

## 4. Phân công nhiệm vụ cụ thể
| Thành viên | Nhiệm vụ |
| --- | --- |
| Nguyễn Văn Khải | Xây dựng giao diện Home, Shop, Product Detail; tối ưu UI card sản phẩm; xử lý hiển thị số lượng tồn kho trên màn hình chính và trang chi tiết. |
| Nguyễn Đức Mạnh | Tích hợp API sản phẩm, danh mục và giỏ hàng; xử lý thêm/xóa/cập nhật số lượng; hoàn thiện luồng đặt hàng. |
| Lê Văn Sở | Phát triển các màn hình tài khoản, đăng nhập, hồ sơ và đơn hàng; hỗ trợ kiểm thử giao diện và hoàn thiện nội dung README. |

## 5. Công nghệ sử dụng
- Expo
- React Native
- JavaScript / TypeScript
- React Navigation
- Axios
- AsyncStorage
- expo-linear-gradient
- @expo/vector-icons
- REST API

## 6. Hướng dẫn cài đặt
1. Cài đặt Node.js và npm.
2. Tải hoặc clone project về máy.
3. Mở terminal tại thư mục project.
4. Chạy lệnh:

```bash
npm install
```

## 7. Hướng dẫn chạy project
Chạy project bằng lệnh:

```bash
npm start
```

Sau đó quét QR bằng Expo Go trên điện thoại hoặc chạy bằng Android/iOS simulator nếu có cấu hình phù hợp.

Kiểm tra type trước khi nộp:

```bash
npm run typecheck
```

## 8. Tài khoản demo (nếu có)
Chưa có tài khoản demo cố định trong repository. Nếu nhóm có tài khoản test từ backend, thêm tại đây.

## 9. Hình ảnh minh họa hệ thống
<!-- TODO: thêm hình ảnh minh họa hệ thống -->

## 10. Link video demo
<!-- TODO: thêm link video demo -->

## 11. Link online đã deploy (nếu có)
<!-- TODO: thêm link deploy -->

## 12. Remote API
Swagger:

```text
http://157.66.100.48:5000/swagger/index.html
```

Frontend API base URL:

```text
http://157.66.100.48:5000/api
```

Một số API đã sử dụng:

- `GET /api/Product/Search`
- `GET /api/Product/{id}`
- `GET /api/Category`
- `GET /api/Cart/MyCart`
- `POST /api/Cart/Add`
- `PUT /api/Cart/UpdateQuantity`

## 13. Ghi chú
- Dự án dùng remote API, không cần backend local.
- Nếu API không khả dụng, ứng dụng vẫn có thể hiển thị một phần dữ liệu nhờ tài nguyên cục bộ.
