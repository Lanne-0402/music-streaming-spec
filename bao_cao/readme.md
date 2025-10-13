Tuyệt vời! Đây là toàn bộ báo cáo phân tích và thiết kế dự án **MyMusic Streaming Web Application** của bạn, được trình bày dưới định dạng **Markdown** (`.md`) hoàn chỉnh. Bạn có thể sao chép toàn bộ nội dung này vào file `index.html` hoặc `README.md` trên GitHub của mình.

---

# BÁO CÁO PHÂN TÍCH & THIẾT KẾ HỆ THỐNG - MYMUSIC STREAMING

## 1. TỔNG QUAN DỰ ÁN

Dự án **MyMusic** là một hệ thống nghe nhạc trực tuyến (Music Streaming Web Application) cho phép người dùng tìm kiếm, phát nhạc, quản lý playlist cá nhân, và theo dõi nghệ sĩ. Hệ thống mô phỏng việc phát nhạc theo chuẩn **HLS/DASH** ở mức prototype.

---

## 2. PHÂN TÍCH VÀ THIẾT KẾ CHỨC NĂNG (UML)

### 2.1. Sơ đồ Use Case (UC)

#### A. Use Case Người Dùng và Streaming

Sơ đồ mô tả các chức năng cốt lõi người dùng tương tác, bao gồm Đăng nhập, Phát nhạc, Cá nhân hóa và mối quan hệ với hệ thống bên ngoài (**Audio CDN**).

**Ảnh Sơ đồ Use Case Người dùng:** 

**Mô tả Quan hệ Cốt lõi:**

| Use Case Chính | Use Case Phụ | Quan hệ | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| **Phát/Điều khiển Nhạc** | **Ghi nhận Lượt nghe** | `include` | Bắt buộc (Sau $\ge 30$ giây, hệ thống phải ghi nhận lịch sử). |
| **Đăng nhập** | **Đăng nhập Social SSO** | `extends` | Hành vi tùy chọn, mở rộng phương thức đăng nhập cơ bản. |
| **Quản lý Playlist** | **Thêm/Xóa Bài hát** | `extends` | Hành vi tùy chọn trong quá trình quản lý playlist. |

#### B. Use Case Quản Trị (Admin - CRUD)

Sơ đồ mô tả các chức năng Quản trị viên sử dụng để quản lý nội dung của hệ thống.

**Ảnh Sơ đồ Use Case Admin:** 

| Use Case Chính | Use Case Phụ | Quan hệ | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| **Quản lý Bài hát (CRUD)** | **Upload File Mock/Stream** | `extends` | Chức năng tùy chọn để nhập dữ liệu demo và đường dẫn stream. |

### 2.2. Sơ đồ Trình tự (Sequence Diagram - SD)

#### A. SD-01: Phát nhạc một bài (Playback Flow)

Mô tả luồng tương tác khi người dùng chọn và phát một bài hát, bao gồm việc gọi dữ liệu stream và ghi nhận lượt nghe (**scrobble**).

**Ảnh Sơ đồ Trình tự Phát nhạc:** 

| Đối tượng (Lifeline) | Mô tả |
| :--- | :--- |
| **User** | Người dùng tương tác. |
| **WebApp** | Giao diện người dùng và logic trung gian. |
| **Player** | Trình phát nhạc (**HTML5/JS component**). |
| **TrackService** | Dịch vụ **Back-end** xử lý metadata và stream URL. |
| **Audio CDN (Mock)** | Hệ thống giả lập cung cấp file nhạc (**stream**). |

#### B. SD-02: Thêm bài vào Playlist

Mô tả logic Back-end khi thêm bài hát, bao gồm kiểm tra ràng buộc **duy nhất** (trùng lặp) và cập nhật thứ tự (**SortOrder**).

**Ảnh Sơ đồ Trình tự Thêm bài vào Playlist:** 

---

## 3. THIẾT KẾ CƠ SỞ DỮ LIỆU

### 3.1. Sơ đồ Thực thể–Kết hợp (ER Diagram)

Sơ đồ mô tả các thực thể chính, mối quan hệ và bản chất (Cardinality).

**Ảnh Sơ đồ ER:** 

### 3.2. Sơ đồ CSDL Quan hệ (ERD - Physical/Logical)

Bảng chi tiết các bảng, khóa, kiểu dữ liệu và ràng buộc, sử dụng PostgreSQL/MySQL.

| Bảng (Table) | Cột | Kiểu dữ liệu gợi ý (PostgreSQL) | Khóa | Ràng buộc (Constraint/Index) |
| :--- | :--- | :--- | :--- | :--- |
| **User** | UserID, **Email**, PasswordHash | SERIAL/UUID | PK | **UNIQUE** (**User.Email**) |
| **Artist** | ArtistID, **Name** | SERIAL/UUID | PK | **INDEX** (**Artist.Name**) |
| **Album** | AlbumID, Title, **ArtistID** (FK) | SERIAL/UUID | PK | UNIQUE (Title, ArtistID) |
| **Track** | TrackID, **Title**, **Duration**, AlbumID (FK), GenreID (FK), StreamURL_HLS | SERIAL/UUID | PK | **INDEX** (**Track.Title**), **CHECK** (**Duration** > 0) |
| **Playlist** | PlaylistID, **OwnerID** (FK) | SERIAL/UUID | PK | FK **ON DELETE CASCADE** (với OwnerID) |
| **PlaylistTrack**| PlaylistID, TrackID, **SortOrder** | UUID/INT | **PK Tổng hợp** | **FK ON DELETE CASCADE** |
| **Like** | UserID, TrackID | UUID/INT | **PK Tổng hợp** | **FK ON DELETE CASCADE** |
| **Follow** | UserID, ArtistID | UUID/INT | **PK Tổng hợp** | **FK ON DELETE CASCADE** |
| **ListenHistory**| HistoryID, UserID (FK), TrackID (FK) | SERIAL/UUID | PK | |

---

## 4. QUY TẮC NGHIỆP VỤ & TEST CASE

### 4.1. Quy tắc Nghiệp vụ (Business Rules - BR)

| Mã BR | Tên Quy tắc | Mô tả Logic | Áp dụng (Thành phần) |
| :--- | :--- | :--- | :--- |
| **BR-01** | Tính Duy nhất Playlist | Một bài hát chỉ xuất hiện **một lần** trong một playlist. | DB (Khóa Tổng hợp `PlaylistTrack`) & Logic Back-end |
| **BR-02** | Logic Ghi nhận Nghe | Lịch sử nghe được ghi nhận (scrobble) khi play **$\ge 30$ giây** hoặc user nhấn next/previous sau **$\ge 30$ giây**. | Front-end (Player JS) & Back-end (TrackService) |

### 4.2. Bảng 10 Test Case Mẫu

| Mã TC | Chức năng (UC) | Quy tắc/Logic Kiểm tra | Kết quả Mong muốn |
| :--- | :--- | :--- | :--- |
| **TC-01** | Playlist | Thêm bài trùng lặp (BR-01) | Hệ thống phải báo lỗi "Bài hát đã có trong Playlist." |
| **TC-02** | Playback | Nghe dưới 30 giây (BR-02) | **Không** ghi nhận lượt nghe trong Lịch sử. |
| **TC-03** | Playback | Nghe trên 30 giây (BR-02) | **Ghi nhận** lượt nghe thành công. |
| **TC-04** | Playback | Next sau 40 giây (BR-02) | **Ghi nhận** lượt nghe cho bài hát vừa phát. |
| **TC-05** | Cá nhân hóa | Like trùng lặp | Duy trì một bản ghi **Like** duy nhất. |
| **TC-06** | Cá nhân hóa | Un-like | Xóa bản ghi **Like** khỏi CSDL. |
| **TC-07** | Tìm kiếm | Tìm kiếm không dấu | Trả về kết quả khớp với từ khóa có dấu (ví dụ: "yeu em" $\rightarrow$ "Yêu em"). |
| **TC-08** | Playlist | Sắp xếp Drag-drop | Cột `SortOrder` trong `PlaylistTrack` được cập nhật đúng thứ tự mới. |
| **TC-09** | Admin | Xóa Bài hát | Xóa thành công Bài hát và tự động xóa các bản ghi liên quan trong `PlaylistTrack`, `Like` (**ON DELETE CASCADE**). |
| **TC-10** | Auth | Đăng nhập hợp lệ | Chuyển hướng thành công đến trang **Home/Discover**. |

---

## 5. TỔNG HỢP & GIAO NỘP

### 5.1. Bảng API (Mock Endpoints)

Đây là các endpoint chính mà Back-end cần cung cấp cho Front-end (giả lập ở mức prototype).

| Mục đích | Method | Endpoint (URL) | Mô tả Dữ liệu |
| :--- | :--- | :--- | :--- |
| **Đăng nhập** | `POST` | `/api/auth/login` | Trả về `token` và thông tin `User`. |
| **Playlist** | `GET` | `/api/user/playlists` | Danh sách Playlist của User. |
| **Playlist** | `POST` | `/api/playlist/{id}/track` | Thêm bài hát vào Playlist (kiểm tra BR-01). |
| **Phát nhạc** | `GET` | `/api/track/{id}/meta` | Trả về `stream_url` (HLS/DASH) và `lyrics`. |
| **Ghi nhận Nghe** | `POST` | `/api/track/{id}/scrobble` | Ghi nhận lượt nghe vào `ListenHistory` (theo BR-02). |
| **Tìm kiếm** | `GET` | `/api/search?q={query}` | Trả về kết quả Bài hát, Album, Nghệ sĩ. |

### 5.2. Link & Tài liệu

| Tài liệu | Link (Cần cập nhật) | Ghi chú |
| :--- | :--- | :--- |
| **Link Prototype HTML** | `[Chèn link GitHub Pages hoặc file index.html/home.html]` | Trình bày 5 màn hình A, B, C, D, E, F. |
| **Video Demo (3-5 phút)** | `[Chèn link YouTube/Google Drive Video Demo]` | Minh họa các luồng chính và Test Case. |
| **Code Repository** | `[Chèn link github.com/<username>/music-streaming-spec]` | Kho lưu trữ mã nguồn của báo cáo và prototype. |

***

**Lưu ý quan trọng cho người dùng:** Vui lòng thay thế các placeholder `[Chèn link...]` bằng các liên kết và hình ảnh thực tế sau khi bạn đã hoàn thành việc xây dựng Prototype và upload các tài liệu lên GitHub/Drive.