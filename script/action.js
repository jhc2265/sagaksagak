/* ============================================================
   사각사각문구점 공통 스크립트
   - 로그인 상태 전환 (데모용 localStorage)
   - 모바일 메뉴 토글
   - 헤더 검색창 / 찜·장바구니 배지 / 토스트
   - 장바구니·찜 데이터 모듈 (localStorage)
   - 상품 카탈로그 (cart/checkout/wishlist 공용)
   ============================================================ */
(function () {
    'use strict';

    /* 폰트 미리 불러오기 (FOUT/깜빡임 최소화) */
    (function () {
        var head = document.head || document.getElementsByTagName('head')[0];
        if (!head) return;
        var pc = document.createElement('link');
        pc.rel = 'preconnect'; pc.href = 'https://cdn.jsdelivr.net'; pc.crossOrigin = 'anonymous';
        head.appendChild(pc);
        ['Paperlogy-4Regular', 'Paperlogy-7Bold', 'Paperlogy-5Medium'].forEach(function (f) {
            var l = document.createElement('link');
            l.rel = 'preload'; l.as = 'font'; l.type = 'font/woff2'; l.crossOrigin = 'anonymous';
            l.href = 'https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/' + f + '.woff2';
            head.appendChild(l);
        });
    })();

    /* ---------- 공용 상품 카탈로그 ---------- */
    var PRODUCTS = {
        "daily-set":       { name: "사각사각 데일리 필기 세트", price: 15900, img: "images/products/diary-starter-set.png",        opt: "매일 쓰는 필수 아이템 모음 세트" },
        "floral-diary":    { name: "플라워 패턴 다이어리",      price: 12500, img: "images/products/floral-diary-set.png",         opt: "잔잔한 플라워 패턴의 만년 다이어리" },
        "gel-pen-4":       { name: "사각사각 젤펜 4종 세트",    price: 6800,  img: "images/products/pastel-gel-pen-4set.png",      opt: "부드러운 필기감의 0.5mm 젤펜 세트" },
        "washi-6":         { name: "마스킹테이프 6종 세트",     price: 7900,  img: "images/products/floral-washi-tape-6set.png",   opt: "다꾸가 즐거워지는 감성 마테 세트" },
        "memo-3":          { name: "모눈 메모지 3종 세트",      price: 3900,  img: "images/products/memo-pad-3set.png",            opt: "떼었다 붙였다 활용도 높은 메모지" },
        "vintage-sticker": { name: "빈티지 플라워 스티커팩",    price: 4500,  img: "images/products/vintage-sticker-pack.png",     opt: "다이어리를 꾸미기 좋은 스티커 팩" },
        "check-pouch":     { name: "체크 패브릭 파우치",        price: 9900,  img: "images/products/check-pencil-pouch.png",       opt: "넉넉한 수납의 체크 파우치" },
        "teddy-keyring":   { name: "곰돌이 키링",               price: 6000,  img: "images/products/teddy-keyring-set.png",        opt: "가방을 채워주는 곰돌이 키링" },
        "grid-note":       { name: "그리드 노트 (B5)",          price: 5500,  img: "images/products/grid-note-b5.png",             opt: "깔끔한 그리드 내지 노트" },
        "tteok-memo":      { name: "떡메모지 2종 세트",         price: 3200,  img: "images/products/tteok-memo-2set.png",          opt: "일러스트가 귀여운 떡메모지" },
        "leather-case":    { name: "가죽 펜슬케이스",           price: 12000, img: "images/products/leather-pen-case.png",         opt: "필기구를 정리하는 가죽 케이스" },
        "gold-clip":       { name: "골드 클립 세트",            price: 3500,  img: "images/products/gold-binder-clip-set.png",     opt: "고급스러운 골드 클립 세트" },
        "weekly-diary":    { name: "위클리 다이어리 세트",      price: 16800, img: "images/bestseller/weekly-diary-set.png",       opt: "한 주가 정리되는 위클리 세트" },
        "gel-pen-5":       { name: "사각사각 젤펜 5종 세트",    price: 7900,  img: "images/bestseller/pastel-gel-pen-set.png",     opt: "파스텔 색감의 젤펜 5종" },
        "washi-4":         { name: "플라워 마스킹테이프 4종 세트", price: 6800, img: "images/bestseller/floral-washi-tape-set.png", opt: "은은한 플라워 마테 4종" },
        "floral-memo-3":   { name: "플라워 메모지 3종 세트",    price: 3900,  img: "images/bestseller/floral-memo-pad-set.png",    opt: "감성 가득한 플라워 메모지" },
        "emo-sticker":     { name: "감성 스티커 팩",            price: 4200,  img: "images/bestseller/vintage-sticker-pack.png",   opt: "어디에나 어울리는 감성 스티커" },
        "vintage-clip-6":  { name: "빈티지 클립 6종 세트",      price: 5500,  img: "images/bestseller/antique-binder-clip-set.png", opt: "분위기 있는 빈티지 클립 6종" },
        "grid-note-a5":    { name: "모눈 노트 (A5)",            price: 3800,  img: "images/bestseller/grid-notebook.png",          opt: "휴대하기 좋은 A5 모눈 노트" },
        "mini-tteok":      { name: "미니 떡메모지 세트",        price: 2900,  img: "images/bestseller/floral-memo-pad-set.png",    opt: "작고 귀여운 미니 떡메모지" }
    };

    var FREE_SHIP_MIN = 30000;   // 무료배송 기준 (전 페이지 통일)
    var SHIP_FEE = 3000;         // 기본 배송비

    function won(n) { return (Number(n) || 0).toLocaleString('ko-KR') + '원'; }
    function read(key, def) { try { var v = localStorage.getItem(key); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }
    function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

    /* ---------- 장바구니 모듈 ---------- */
    var CART_KEY = 'sagak_cart';
    var Cart = {
        get: function () {
            var c = read(CART_KEY, []);
            if (!Array.isArray(c)) c = [];
            return c.filter(function (x) { return PRODUCTS[x.id]; });
        },
        seedDemo: function () { this.save([{ id: 'floral-diary', qty: 1 }, { id: 'gel-pen-4', qty: 2 }, { id: 'vintage-sticker', qty: 1 }]); },
        save: function (c) { write(CART_KEY, c); updateBadges(); },
        add: function (id, qty) {
            if (!PRODUCTS[id]) return;
            qty = parseInt(qty, 10) || 1;
            var c = this.get(), found = false;
            c.forEach(function (x) { if (x.id === id) { x.qty += qty; found = true; } });
            if (!found) c.push({ id: id, qty: qty });
            this.save(c);
        },
        setQty: function (id, qty) {
            var c = this.get();
            c.forEach(function (x) { if (x.id === id) x.qty = Math.max(1, parseInt(qty, 10) || 1); });
            this.save(c);
        },
        remove: function (id) { this.save(this.get().filter(function (x) { return x.id !== id; })); },
        clear: function () { this.save([]); },
        count: function () { return this.get().reduce(function (s, x) { return s + x.qty; }, 0); },
        goods: function () { return this.get().reduce(function (s, x) { return s + PRODUCTS[x.id].price * x.qty; }, 0); }
    };

    /* ---------- 찜 모듈 ---------- */
    var WISH_KEY = 'sagak_wish';
    var Wish = {
        get: function () {
            var w = read(WISH_KEY, []);
            if (!Array.isArray(w)) w = [];
            return w.filter(function (id) { return PRODUCTS[id]; });
        },
        seedDemo: function () { this.save(['daily-set', 'weekly-diary', 'vintage-sticker', 'gel-pen-4', 'teddy-keyring']); },
        save: function (w) { write(WISH_KEY, w); updateBadges(); },
        has: function (id) { return this.get().indexOf(id) > -1; },
        toggle: function (id) {
            var w = this.get(), i = w.indexOf(id);
            if (i > -1) w.splice(i, 1); else w.push(id);
            this.save(w);
            return w.indexOf(id) > -1;
        },
        remove: function (id) { this.save(this.get().filter(function (x) { return x !== id; })); },
        count: function () { return this.get().length; }
    };

    /* id 기반 결정적 평점 (상세·목록 카드에서 동일 값 사용) */
    function ratingFor(id) {
        var h = 0, s = String(id || '');
        for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
        return { score: ((45 + (h % 5)) / 10), count: (24 + (h % 176)) };
    }

    /* 구매 내역 (리뷰 작성 권한 판단용) */
    var PURCHASED_KEY = 'sagak_purchased';
    var Purchased = {
        get: function () { var p = read(PURCHASED_KEY, []); return Array.isArray(p) ? p : []; },
        save: function (p) { write(PURCHASED_KEY, p); },
        has: function (pid) { return this.get().indexOf(pid) > -1; },
        add: function (ids) { var p = this.get(); (ids || []).forEach(function (x) { if (p.indexOf(x) < 0) p.push(x); }); this.save(p); }
    };

    window.SagakShop = {
        products: PRODUCTS, won: won, cart: Cart, wish: Wish, purchased: Purchased, rating: ratingFor,
        FREE_SHIP_MIN: FREE_SHIP_MIN, SHIP_FEE: SHIP_FEE
    };

    /* ---------- 토스트 ---------- */
    var toastTimer;
    function toast(msg) {
        var t = document.getElementById('sagak-toast');
        if (!t) { t = document.createElement('div'); t.id = 'sagak-toast'; document.body.appendChild(t); }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
    }
    window.sagakToast = toast;

    /* ---------- 주입 스타일 ---------- */
    function injectStyles() {
        if (document.getElementById('sagak-inject-style')) return;
        var css =
            '#sagak-toast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(20px);background:rgba(72,54,44,.95);color:#fff;padding:13px 20px;border-radius:16px;font-size:15px;line-height:1.5;text-align:center;z-index:9999;opacity:0;pointer-events:none;transition:.25s;box-shadow:0 6px 20px rgba(0,0,0,.18);max-width:88vw;box-sizing:border-box;}' +
            '#sagak-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}' +
            '.sagak-search{position:absolute;top:80px;left:0;transform:translateY(-50%);z-index:6;display:flex;align-items:center;gap:6px;}' +
            '.sagak-search input{height:34px;border:1px solid #d8ccbf;border-radius:999px;padding:0 14px;font-size:14px;font-family:inherit;outline:none;width:160px;background:#fff;color:#5a4636;transition:width .2s,border-color .2s;}' +
            '.sagak-search input::placeholder{color:#b3a594;}' +
            '.sagak-search input:focus{border-color:#b08d6a;width:200px;}' +
            '.sagak-search button{height:34px;border:1px solid #cbb6a4;background:#fff;color:#916D57;border-radius:999px;padding:0 16px;cursor:pointer;font-size:14px;font-family:inherit;white-space:nowrap;transition:background .2s,color .2s,border-color .2s;}' +
            '.sagak-search button:hover{background:#f3e7db;color:#7d5c48;border-color:#b59a85;}' +
            '.sagak-badge{display:inline-block;min-width:18px;height:18px;line-height:18px;padding:0 5px;border-radius:999px;background:#d3785e;color:#fff;font-size:11px;font-weight:700;text-align:center;margin-left:3px;}' +
            '@media (max-width:1100px){.sagak-search{position:static;transform:none;justify-content:center;margin:10px 0 0;}.sagak-search input{width:200px;}}' +
            '@media (max-width:720px){.sagak-search{display:none;}}' +
            '.sagak-reveal{opacity:0;}' +
            '.sagak-reveal.in{animation:sagakReveal .6s cubic-bezier(.2,.7,.2,1) both;}' +
            '@keyframes sagakReveal{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:none;}}' +
            '@media (prefers-reduced-motion:reduce){.sagak-reveal{opacity:1;}.sagak-reveal.in{animation:none;}}' +
            '.sagak-egg-hint{margin:14px 0 0;font-size:13px;color:#a98a73;text-align:center;line-height:1.55;}' +
            '.sagak-egg-tag{display:inline-block;background:#ead9c6;color:#7d5c48;font-size:11px;font-weight:700;letter-spacing:.03em;padding:2px 8px;border-radius:999px;margin-right:6px;}' +
            '.sagak-back{display:none;}' +
            '.sagak-crumb-back{background:none;border:0;padding:0 7px 0 0;margin:0;font-size:19px;line-height:1;color:#88553F;cursor:pointer;font-family:inherit;vertical-align:-2px;}.sagak-crumb-back:hover{color:#d3785e;}' +
            '@media (max-width:720px){.sagak-back{display:inline-flex;align-items:center;gap:2px;margin:6px 0 -4px 15px;background:none;border:0;padding:8px 6px 8px 0;color:#88553F;font-family:inherit;font-size:15px;cursor:pointer;}.sagak-back:active{opacity:.6;}}' +
            '.sagak-msearch{display:none;}' +
            '@media (max-width:720px){.sagak-msearch{display:flex;gap:6px;margin-bottom:4px;}.sagak-msearch input{flex:1;min-width:0;height:42px;border:1px solid #d8ccbf;border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;outline:none;background:#fff;color:#5a4636;}.sagak-msearch input::placeholder{color:#b3a594;}.sagak-msearch button{height:42px;border:1px solid #916D57;background:#916D57;color:#FFF6EC;border-radius:10px;padding:0 16px;font-size:14px;font-family:inherit;cursor:pointer;white-space:nowrap;}}' +
            '.sagak-rate{display:flex;align-items:center;gap:4px;margin-top:8px;font-size:13px;color:#8c6a57;}' +
            '.sagak-rate__star{color:#e0a83e;}.sagak-rate__cnt{color:#b3a594;}' +
            '.product-card__info{flex-wrap:wrap;}.product-card__info .sagak-rate{flex-basis:100%;margin-top:6px;}';
        var s = document.createElement('style');
        s.id = 'sagak-inject-style';
        s.textContent = css;
        document.head.appendChild(s);
    }

    /* ---------- 헤더 검색창 주입 (좌측 상단) ---------- */
    function injectSearch() {
        document.querySelectorAll('header').forEach(function (header) {
            if (header.querySelector('.sagak-search')) return;
            var form = document.createElement('form');
            form.className = 'sagak-search';
            form.setAttribute('role', 'search');
            form.action = 'search.html';
            form.method = 'get';
            form.innerHTML = '<input type="search" name="q" placeholder="상품 검색" aria-label="상품 검색" autocomplete="off">' +
                             '<button type="submit">검색</button>';
            header.insertBefore(form, header.firstChild);
        });
    }

    /* ---------- 스크롤 등장 효과 (IntersectionObserver) ---------- */
    function initReveal() {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) return;
        var selectors = ['#section01 .board', '#section02 .content li', '#section03 .content li',
            '#section04 .content li', '#section02 .title_box', '#section04 .title_box',
            '.shop-card', '.product-card', '.featured-card', '.category-card', '.review-card'];
        var els = [];
        selectors.forEach(function (s) {
            document.querySelectorAll(s).forEach(function (el) { if (els.indexOf(el) < 0) els.push(el); });
        });
        if (!els.length) return;
        els.forEach(function (el) {
            el.classList.add('sagak-reveal');
            var idx = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
            el.dataset.revDelay = ((idx % 6) * 0.06).toFixed(2) + 's';
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                el.style.animationDelay = el.dataset.revDelay || '0s';
                el.classList.add('in');
                el.addEventListener('animationend', function () {
                    el.classList.remove('sagak-reveal', 'in');
                    el.style.animationDelay = '';
                }, { once: true });
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------- 이스터에그: 빈 폼에서 버튼 5번 연속 클릭 → 테스트 계정 자동 입력 ---------- */
    function setupTestEgg(formSel, fill) {
        var form = document.querySelector(formSel);
        if (!form) return;
        var btn = form.querySelector('button[type="submit"], .btn-primary');
        if (!btn) return;
        if (!form.querySelector('.sagak-egg-hint')) {
            var hint = document.createElement('p');
            hint.className = 'sagak-egg-hint';
            hint.innerHTML = '<span class="sagak-egg-tag">TIP</span> 버튼을 5번 연속 누르면 테스트 계정이 자동으로 입력돼요.';
            btn.insertAdjacentElement('afterend', hint);
        }
        var count = 0, timer = null;
        function allEmpty() {
            var inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
            for (var i = 0; i < inputs.length; i++) { if (inputs[i].value.trim() !== '') return false; }
            return true;
        }
        btn.addEventListener('click', function (e) {
            if (!allEmpty()) return;          // 값이 있으면 정상 제출 (실제 시도 방해 X)
            e.preventDefault();               // 빈 폼 연타는 검증 에러 대신 가로채기
            count++;
            clearTimeout(timer);
            timer = setTimeout(function () { count = 0; }, 1500);  // 연속 클릭 윈도우
            if (count >= 5) {
                count = 0;
                fill(form);
                if (window.sagakToast) window.sagakToast('테스트 계정 정보를 채웠어요! 버튼을 한 번 더 누르면 진행돼요.');
            }
        });
    }

    function initTestAccountEgg() {
        setupTestEgg('#login-form', function (form) {
            form.querySelector('#login-email').value = 'test@sagak.com';
            form.querySelector('#login-pw').value = 'test1234';
        });
        setupTestEgg('#signup-form', function (form) {
            form.querySelector('#su-name').value = '사각테스트';
            form.querySelector('#su-email').value = 'test@sagak.com';
            form.querySelector('#su-pw').value = 'test1234';
            form.querySelector('#su-pw2').value = 'test1234';
            form.querySelector('#su-agree').checked = true;
        });
    }

    /* ---------- 모바일 뒤로가기 버튼 (홈 제외 전 페이지) ---------- */
    function initBackButton() {
        var page = (location.pathname.split('/').pop() || '').toLowerCase();
        if (page === '' || page === 'index.html') return;
        function goBack() { if (history.length > 1) history.back(); else location.href = 'index.html'; }
        /* 빵부스러기가 있는 페이지(상품 상세 등): 빵부스러기 맨 앞에 컴팩트 뒤로 화살표 */
        var crumb = document.querySelector('.pv-breadcrumb');
        if (crumb) {
            if (!crumb.querySelector('.sagak-crumb-back')) {
                var ab = document.createElement('button');
                ab.type = 'button';
                ab.className = 'sagak-crumb-back';
                ab.setAttribute('aria-label', '뒤로 가기');
                ab.textContent = '‹';
                ab.addEventListener('click', goBack);
                crumb.insertBefore(ab, crumb.firstChild);
            }
            return;
        }
        /* 제목 블록(.page-head)이 있는 일반 서브페이지: 제목 위에 뒤로가기 (히어로 페이지 제외) */
        var head = document.querySelector('.page-head');
        if (!head || document.querySelector('.sagak-back')) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sagak-back';
        btn.setAttribute('aria-label', '뒤로 가기');
        btn.innerHTML = '<span aria-hidden="true" style="font-size:18px;line-height:1;">‹</span> 뒤로가기';
        btn.addEventListener('click', function () {
            if (history.length > 1) history.back(); else location.href = 'index.html';
        });
        head.parentNode.insertBefore(btn, head);
    }

    /* ---------- 목록 카드 별점·후기수 주입 ---------- */
    function initCardRatings() {
        document.querySelectorAll('.shop-card, .product-card, .featured-card').forEach(function (card) {
            if (card.querySelector('.sagak-rate')) return;
            var a = card.querySelector('a[href*="product-view.html?id="]');
            if (!a) return;
            var m = a.getAttribute('href').match(/[?&]id=([^&]+)/);
            if (!m) return;
            var r = ratingFor(m[1]);
            var body = card.querySelector('.shop-card__body, .product-card__info, .featured-card__body');
            if (!body) return;
            var el = document.createElement('div');
            el.className = 'sagak-rate';
            el.innerHTML = '<span class="sagak-rate__star" aria-hidden="true">★</span> ' + r.score.toFixed(1) + ' <span class="sagak-rate__cnt">(' + r.count + ')</span>';
            var price = body.querySelector('strong');
            if (price) price.insertAdjacentElement('afterend', el); else body.appendChild(el);
        });
    }

    /* ---------- 마이페이지: 로그인 계정 정보 표시 ---------- */
    function initMypage() {
        var card = document.querySelector('.profile-card');
        if (!card) return;
        var user = readUser();
        var isTest = user && user.email === 'test@sagak.com';
        if (user) {
            var nameEl = card.querySelector('.pf-meta strong');
            var mailEl = card.querySelector('.pf-meta span');
            var avEl = card.querySelector('.pf-avatar');
            if (nameEl) nameEl.textContent = user.name + '님';
            if (mailEl) mailEl.textContent = user.email;
            if (avEl) avEl.textContent = (user.name || '냥').charAt(0);
        }
        var stats = card.querySelectorAll('.pf-stats li b');
        if (stats.length >= 4) {
            stats[0].textContent = isTest ? 2 : 0;
            stats[1].textContent = (isTest ? 3000 : 0).toLocaleString('ko-KR');
            stats[2].textContent = isTest ? 1 : 0;
            stats[3].textContent = Wish.count();
        }
        if (!isTest) {
            var recent = document.querySelector('.mp-recent');
            if (recent) {
                var head = recent.querySelector('.mp-recent__head');
                recent.innerHTML = '';
                if (head) recent.appendChild(head);
                var empty = document.createElement('p');
                empty.style.cssText = 'padding:26px 4px;color:#a98a73;font-size:14px;';
                empty.textContent = '아직 주문 내역이 없어요.';
                recent.appendChild(empty);
            }
        }
    }

    /* ---------- 찜 링크 / 배지 주입 ---------- */
    function decorateAccountRow(row) {
        if (!row) return;
        var cartLink = row.querySelector('a[href="cart.html"]');
        if (!row.querySelector('a[href="wishlist.html"]')) {
            var wl = document.createElement('a');
            wl.href = 'wishlist.html';
            wl.className = 'sagak-wishlink';
            wl.innerHTML = '<span aria-hidden="true" style="font-size:16px;line-height:1;">♡</span>찜<span class="sagak-badge sagak-wish-badge" hidden></span>';
            if (cartLink) row.insertBefore(wl, cartLink); else row.appendChild(wl);
        }
        if (cartLink && !cartLink.querySelector('.sagak-cart-badge')) {
            var b = document.createElement('span');
            b.className = 'sagak-badge sagak-cart-badge';
            b.hidden = true;
            cartLink.appendChild(b);
        }
    }

    function updateBadges() {
        var cc = Cart.count(), wc = Wish.count();
        document.querySelectorAll('.sagak-cart-badge').forEach(function (b) {
            b.textContent = cc; b.hidden = cc === 0;
        });
        document.querySelectorAll('.sagak-wish-badge').forEach(function (b) {
            b.textContent = wc; b.hidden = wc === 0;
        });
    }

    /* ---------- 상품 카드에서 상품 id 추출 ---------- */
    function findProductId(btn) {
        if (btn.dataset && btn.dataset.id && PRODUCTS[btn.dataset.id]) return btn.dataset.id;
        var node = btn;
        while (node && node !== document.body) {
            if (node.querySelector) {
                var a = node.querySelector('a[href*="product-view.html?id="]');
                if (a) {
                    var m = a.getAttribute('href').match(/[?&]id=([^&]+)/);
                    if (m && PRODUCTS[m[1]]) return m[1];
                }
            }
            node = node.parentElement;
        }
        return null;
    }

    /* ---------- 로그인 상태 ---------- */
    function isLoggedIn() { try { return localStorage.getItem('sagak_login') === '1'; } catch (e) { return false; } }
    function applyLoginState() {
        var loginGroup = document.querySelector('.login_box .login');
        var logoutGroup = document.querySelector('.login_box .logout');
        var logged = isLoggedIn();
        if (loginGroup) loginGroup.style.display = logged ? 'none' : 'flex';
        if (logoutGroup) logoutGroup.style.display = logged ? 'flex' : 'none';
        /* 모바일 계정 아이콘도 로그인 상태에 맞게 (로그인 → 마이페이지) */
        document.querySelectorAll('.mobile-account-link').forEach(function (a) {
            a.setAttribute('href', logged ? 'mypage.html' : 'login.html');
            a.setAttribute('aria-label', logged ? '마이페이지' : '로그인');
        });
    }
    var USER_KEY = 'sagak_user';
    function readUser() { try { var v = localStorage.getItem(USER_KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
    window.sagakReadUser = readUser;

    window.sagakSetLogin = function (v) {
        try {
            if (v) localStorage.setItem('sagak_login', '1');
            else { localStorage.removeItem('sagak_login'); localStorage.removeItem(USER_KEY); }
        } catch (e) {}
        applyLoginState();
    };

    /* 로그인 + 계정/데이터 설정: 테스트 계정은 데모 데이터, 그 외 새 계정은 빈 상태 */
    window.sagakLoginAs = function (email) {
        email = (email || '').trim().toLowerCase();
        var isTest = email === 'test@sagak.com';
        var name = isTest ? '사각테스트' : ((email.split('@')[0]) || '회원');
        try { localStorage.setItem(USER_KEY, JSON.stringify({ email: email, name: name })); } catch (e) {}
        if (isTest) { Cart.seedDemo(); Wish.seedDemo(); Purchased.save(['weekly-diary', 'washi-6', 'memo-3']); }
        else { Cart.clear(); Wish.save([]); Purchased.save([]); }
        window.sagakSetLogin(true);
        updateBadges();
    };

    /* ============================================================ */
    document.addEventListener('DOMContentLoaded', function () {
        injectStyles();
        injectSearch();

        /* 파비콘을 또렷한 정사각 아이콘으로 교체 (기존 logo.png는 가로로 길어 흐릿함) */
        (function () {
            var old = document.querySelector('link[rel="icon"]');
            var link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            link.href = 'images/favicon.png?v=2';
            if (old && old.parentNode) old.parentNode.removeChild(old);
            document.head.appendChild(link);
        })();

        initReveal();
        initTestAccountEgg();
        initMypage();
        initBackButton();
        initCardRatings();

        /* 찜·장바구니는 로그인 사용자(.logout)에게만 노출 */
        document.querySelectorAll('header .login_box .logout').forEach(decorateAccountRow);
        /* 비로그인(.login) 영역에서는 장바구니 링크 숨김 (찜도 추가하지 않음) */
        document.querySelectorAll('header .login_box .login a[href="cart.html"]').forEach(function (a) { a.remove(); });
        /* 우측 상단 '고객센터'는 메인 메뉴와 중복 → 제거 */
        document.querySelectorAll('header .login_box a[href="customer.html"]').forEach(function (a) { a.remove(); });

        applyLoginState();
        updateBadges();

        /* 로그아웃 버튼 */
        document.querySelectorAll('.logout-btn').forEach(function (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.sagakSetLogin(false);
                location.href = 'index.html';
            });
        });

        /* 모바일 메뉴 토글 */
        document.querySelectorAll('header nav').forEach(function (nav) {
            var gnb = nav.querySelector('.gnb');
            if (!gnb || nav.querySelector('.mobile-menu-toggle')) return;
            var header = nav.closest('header');
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'mobile-menu-toggle';
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', 'site-menu');
            button.innerHTML = '<span class="mobile-menu-toggle__icon" aria-hidden="true"><span></span></span><span>메뉴</span>';
            if (!gnb.id) gnb.id = 'site-menu';
            /* 모바일 메뉴 상단 검색창 (PC 검색창과 동일 기능) */
            if (!gnb.querySelector('.sagak-msearch')) {
                var msearch = document.createElement('form');
                msearch.className = 'sagak-msearch';
                msearch.setAttribute('role', 'search');
                msearch.action = 'search.html';
                msearch.method = 'get';
                msearch.innerHTML = '<input type="search" name="q" placeholder="상품 검색" aria-label="상품 검색" autocomplete="off">' +
                                    '<button type="submit">검색</button>';
                gnb.insertBefore(msearch, gnb.firstChild);
            }
            nav.insertBefore(button, gnb);
            var accountLink = header ? header.querySelector('.mobile-account-link') : null;
            if (accountLink) header.appendChild(accountLink);
            button.addEventListener('click', function () {
                var open = header.classList.toggle('menu-open');
                button.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        });

        /* 찜 버튼 초기 상태 반영 */
        document.querySelectorAll('.wish').forEach(function (wb) {
            var id = findProductId(wb);
            if (id && Wish.has(id)) {
                wb.classList.add('selected');
                wb.setAttribute('aria-label', '찜 해제하기');
            }
        });
    });

    /* ---------- 찜·장바구니 버튼 (이벤트 위임: 동적 카드 포함) ---------- */
    document.addEventListener('click', function (e) {
        var wb = e.target.closest && e.target.closest('.wish');
        if (wb) {
            var id = findProductId(wb);
            var on;
            if (id) { on = Wish.toggle(id); } else { on = wb.classList.contains('selected') ? false : true; }
            wb.classList.toggle('selected', on);
            wb.setAttribute('aria-label', on ? '찜 해제하기' : '찜하기');
            toast(on ? '찜 목록에 담았어요.' : '찜을 해제했어요.');
            return;
        }
        var cb = e.target.closest && e.target.closest('.cart');
        if (cb && !cb.closest('.login_box')) {  // 헤더의 '장바구니' 링크는 제외
            var cid = findProductId(cb);
            if (cid) Cart.add(cid, 1);
            cb.classList.add('selected');
            setTimeout(function () { cb.classList.remove('selected'); }, 600);
            toast('장바구니에 담았어요.');
        }
    });
})();
