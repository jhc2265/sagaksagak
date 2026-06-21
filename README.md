# 사각사각 문구점 (Sagak Sagak Stationery) ✏️

> 감성 문구를 파는 가상의 온라인 문구점

<br> 다이어리·스티커·펜·메모지 등 감성 문구를 둘러보고 **상품 → 장바구니 → 결제 → 주문/리뷰**로 이어지는 쇼핑 흐름을 담은 반응형 웹앱사이트입니다.
<br>

<br> 🔗 **데모**
- GitHub Pages: https://jhc2265.github.io/sagaksagak/
- 로그인 또는 회원가입 화면에서 **버튼을 5번 연속 클릭** → 테스트용 계정의 폼이 자동 입력됩니다.

---

## ✨ 주요 기능

- **메인 히어로 슬라이더** — Swiper 기반 자동 전환 + 슬라이드 문구 등장 모션
- **상품 목록** — 카테고리 필터 · 가격/상품타입 필터 · 정렬 · 표시 개수 선택
- **상품 상세** — 수량 선택, 장바구니 담기 / 바로 구매 / 찜, 별점·스펙표·후기, **구매(배송완료) 고객만 리뷰 작성**
- **장바구니 ↔ 결제 연동** — 수량·금액 실시간 계산, 무료배송 기준(3만원), 우편번호 검색(Daum)
- **찜(위시리스트)** — 저장·해제, 헤더 배지로 개수 표시
- **로그인 / 회원가입** — 데모 인증, 로그인 상태에 따른 헤더 전환(마이페이지·찜·장바구니·로그아웃)
- **🥚 이스터에그** — 로그인/회원가입 폼에서 버튼을 **5번 연속** 누르면 테스트 계정 자동 입력
- **마이페이지 · 주문내역 · 배송조회** — 주문/적립금/쿠폰/찜 요약, 주문 카드에서 리뷰 작성 진입
- **검색** — 헤더 검색창(모바일은 햄버거 메뉴 내) → 상품 검색 결과
- **스크롤 등장 애니메이션** — `IntersectionObserver` 기반 · 카드 호버 인터랙션
- **완전 반응형** — 모바일 햄버거 메뉴 · 모바일 검색 · 뒤로가기 · Grid/Flexbox 레이아웃

---

## 🧪 테스트 계정 (둘러보기용)

회원 정보를 직접 입력하지 않아도 기능을 체험할 수 있어요.

- 로그인 또는 회원가입 화면에서 **버튼을 5번 연속 클릭** → 폼이 자동 입력됩니다.
- 이메일 `test@sagak.com` / 비밀번호 `test1234`
- 테스트 계정으로 로그인하면 데모 **장바구니·찜·주문 내역(배송완료 포함)** 이 채워져, 마이페이지·리뷰 작성까지 바로 확인할 수 있습니다.

---

## 🛠 기술 스택

- **Frontend** — HTML / CSS / JavaScript (단일 페이지 묶음, 빌드 도구 없음)
- **상태/인터랙션** — Vanilla JS · `localStorage`(장바구니·찜·로그인·구매 내역) · `IntersectionObserver`
- **라이브러리 / 서비스** — Swiper(히어로 슬라이더) · Daum 우편번호 서비스
- **웹폰트** — Paperlogy(Paperozi) · 여기어때 잘난체 · 학교안심 둥근미소 *(jsDelivr / 눈누 배포)*
- **호스팅** — GitHub Pages

---

## 🚀 실행 방법

### 로컬에서 보기
```
index.html 파일을 브라우저로 열기
```

### 로컬 서버로 보기 (권장)
```bash
# 둘 중 아무거나
python -m http.server 8000        # → http://localhost:8000
# 또는 VS Code의 "Live Server" 확장 사용
```
> `file://`(더블클릭)에서도 대부분 동작하지만, 외부 폰트·우편번호 검색 등 일부 기능은 로컬 서버에서 더 안정적입니다.

---

## 🌐 배포 (GitHub Pages)

정적 사이트라 GitHub Pages로 바로 배포할 수 있습니다.

1. 저장소를 GitHub에 푸시 (이 폴더가 저장소 루트가 되도록, `index.html`이 최상단)
2. **Settings → Pages → Build and deployment**
3. Source를 **Deploy from a branch**, 브랜치를 `main` / 루트(`/`)로 지정
4. 발급된 URL로 접속

> 배포 후 각 페이지의 Open Graph 태그(`og:url`, `og:image`)를 실제 절대 URL로 바꾸면 소셜 공유 미리보기가 정상 표시됩니다.

---

## 📁 폴더 구조

```
사각사각문구점/                 # 저장소 루트
├── index.html               # 메인 페이지
├── products.html            # 상품 목록 (필터·정렬)
├── product-view.html        # 상품 상세 (별점·스펙·리뷰)
├── bestseller.html          # 베스트셀러
├── cart.html / checkout.html / order-complete.html
├── orders.html / order-detail.html / shipping-track.html
├── mypage.html / wishlist.html / search.html
├── login.html / signup.html / forgot-password.html ...
├── notice.html / customer.html / inquiry.html / guide-view.html
├── terms.html / privacy.html / sitemap.html
├── css/
│   ├── style.css            # 공통·메인·헤더/푸터·반응형
│   ├── sub.css              # 서브페이지(장바구니·마이페이지 등)
│   ├── products.css         # 상품 목록·상세
│   ├── bestseller.css / notice.css / customer.css
│   └── font.css             # 웹폰트 정의
├── script/
│   └── action.js            # 공통 로직 (장바구니·찜·검색·리뷰·애니메이션·로그인)
└── images/                  # 이미지 · 아이콘 · 파비콘
```

---

## ⚠️ 데모 한계 (참고)

- 백엔드가 없어 **로그인·결제·리뷰·장바구니·찜**은 브라우저 `localStorage`에 저장되는 데모입니다. 기기/브라우저 간 공유되지 않고, 데이터 삭제 시 초기화됩니다.
- 상품의 **별점·후기 수**는 데모용으로 생성된 값입니다.

---

## 📝 라이선스 / 권리

- 개인 **학습·포트폴리오** 목적의 가상 쇼핑몰입니다. 실재하는 브랜드가 아닙니다.
- 사용한 라이브러리·폰트는 각 제공처의 라이선스를 따릅니다 (Swiper: MIT, 웹폰트: 각 배포처 라이선스).
- 상품·배경 이미지는 데모용 예시 자산입니다. 상업적 사용을 금합니다.
