const STORAGE_KEY = 'flow_products';

let products = [];
let currentProductId = null;
let saveTimeout = null;

// DOM
const listView = document.getElementById('listView');
const editView = document.getElementById('editView');
const productList = document.getElementById('productList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const addProductBtn = document.getElementById('addProductBtn');
const backBtn = document.getElementById('backBtn');
const deleteProductBtn = document.getElementById('deleteProductBtn');
const editCompany = document.getElementById('editCompany');
const editPartNumber = document.getElementById('editPartNumber');
const editMaterial = document.getElementById('editMaterial');
const stepsList = document.getElementById('stepsList');
const addStepBtn = document.getElementById('addStepBtn');
const editNotes = document.getElementById('editNotes');
const confirmModal = document.getElementById('confirmModal');
const confirmCancel = document.getElementById('confirmCancel');
const confirmDelete = document.getElementById('confirmDelete');

function init() {
    loadData();
    renderList();
    setupEvents();
}

// ===== 資料層 =====

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            products = [];
        }
    }
    if (products.length === 0) {
        products = getDefaultData();
        saveData();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function scheduleSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveData, 300);
}

function getProduct(id) {
    return products.find(p => p.id === id);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ===== 列表畫面 =====

function renderList(filter) {
    const filtered = filter
        ? products.filter(p =>
            (p.partNumber || '').includes(filter) ||
            (p.company || '').includes(filter) ||
            (p.material || '').includes(filter)
        )
        : products;

    productList.innerHTML = '';

    if (products.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    if (filtered.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'empty-state';
        noResult.innerHTML = '<p>找不到符合的產品</p>';
        productList.appendChild(noResult);
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;

        const route = (product.steps || [])
            .map(s => s.work || '?')
            .join(' → ');

        card.innerHTML = `
            <div class="card-company">${escHtml(product.company || '（未填公司）')}</div>
            <div class="card-title">${escHtml(product.partNumber || '（未填圖號）')}</div>
            <div class="card-route">${escHtml(route || '尚無加工路線')}</div>
        `;

        card.addEventListener('click', () => openProduct(product.id));
        productList.appendChild(card);
    });
}

// ===== 編輯畫面 =====

function openProduct(id) {
    currentProductId = id;
    const product = getProduct(id);
    if (!product) return;

    editCompany.value = product.company || '';
    editPartNumber.value = product.partNumber || '';
    editMaterial.value = product.material || '';
    editNotes.value = product.notes || '';

    renderSteps(product.steps || []);

    listView.style.display = 'none';
    editView.style.display = 'block';
    window.scrollTo(0, 0);
}

function closeProduct() {
    currentProductId = null;
    editView.style.display = 'none';
    listView.style.display = 'block';
    renderList(searchInput.value.trim());
    window.scrollTo(0, 0);
}

function renderSteps(steps) {
    stepsList.innerHTML = '';

    steps.forEach((step, index) => {
        if (index > 0) {
            const connector = document.createElement('div');
            connector.className = 'step-connector';
            connector.innerHTML = '<div class="line"></div>';
            stepsList.appendChild(connector);
        }

        const item = document.createElement('div');
        item.className = 'step-item';
        item.dataset.index = index;

        item.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <input type="text" class="step-vendor" value="${escAttr(step.vendor || '')}" placeholder="廠商" data-field="vendor" data-index="${index}" autocomplete="off">
                <span class="step-separator">—</span>
                <input type="text" class="step-work" value="${escAttr(step.work || '')}" placeholder="工作內容" data-field="work" data-index="${index}" autocomplete="off">
            </div>
            <button class="step-delete" data-index="${index}">×</button>
        `;

        stepsList.appendChild(item);
    });
}

function updateProductField(field, value) {
    const product = getProduct(currentProductId);
    if (!product) return;
    product[field] = value;
    scheduleSave();
}

function updateStep(index, field, value) {
    const product = getProduct(currentProductId);
    if (!product || !product.steps[index]) return;
    product.steps[index][field] = value;
    scheduleSave();
}

function addStep() {
    const product = getProduct(currentProductId);
    if (!product) return;
    if (!product.steps) product.steps = [];
    product.steps.push({ vendor: '', work: '' });
    saveData();
    renderSteps(product.steps);

    const inputs = stepsList.querySelectorAll('.step-vendor');
    const lastInput = inputs[inputs.length - 1];
    if (lastInput) lastInput.focus();
}

function deleteStep(index) {
    const product = getProduct(currentProductId);
    if (!product || !product.steps) return;
    product.steps.splice(index, 1);
    saveData();
    renderSteps(product.steps);
}

// ===== 產品新增 / 刪除 =====

function addProduct() {
    const newProduct = {
        id: generateId(),
        company: '',
        partNumber: '',
        material: '',
        steps: [{ vendor: '', work: '' }],
        notes: ''
    };
    products.unshift(newProduct);
    saveData();
    openProduct(newProduct.id);
    editPartNumber.focus();
}

function requestDeleteProduct() {
    confirmModal.classList.add('active');
}

function doDeleteProduct() {
    confirmModal.classList.remove('active');
    products = products.filter(p => p.id !== currentProductId);
    saveData();
    closeProduct();
}

// ===== 事件 =====

function setupEvents() {
    addProductBtn.addEventListener('click', addProduct);
    backBtn.addEventListener('click', closeProduct);
    deleteProductBtn.addEventListener('click', requestDeleteProduct);
    confirmCancel.addEventListener('click', () => confirmModal.classList.remove('active'));
    confirmDelete.addEventListener('click', doDeleteProduct);

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) confirmModal.classList.remove('active');
    });

    searchInput.addEventListener('input', (e) => {
        renderList(e.target.value.trim());
    });

    editCompany.addEventListener('input', (e) => updateProductField('company', e.target.value));
    editPartNumber.addEventListener('input', (e) => updateProductField('partNumber', e.target.value));
    editMaterial.addEventListener('input', (e) => updateProductField('material', e.target.value));
    editNotes.addEventListener('input', (e) => updateProductField('notes', e.target.value));

    addStepBtn.addEventListener('click', addStep);

    stepsList.addEventListener('input', (e) => {
        const field = e.target.dataset.field;
        const index = parseInt(e.target.dataset.index);
        if (field && !isNaN(index)) {
            updateStep(index, field, e.target.value);
        }
    });

    stepsList.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.step-delete');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index);
            if (!isNaN(index)) deleteStep(index);
        }
    });
}

// ===== 工具 =====

function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== 預設資料（從 Excel 匯入） =====

function getDefaultData() {
    return [
        {
            id: 'cy001',
            company: '敬祐',
            partNumber: '309N-27B 砂盤套件',
            material: '12L14',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '興鑫', work: '熱處理' },
                { vendor: '三王', work: '染黑' },
                { vendor: '永隆', work: '研磨' },
                { vendor: '自由', work: '出貨' }
            ],
            notes: ''
        },
        {
            id: 'cy002',
            company: '敬祐',
            partNumber: '6001A-14 衝擊塊',
            material: 'SNCM21',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '加順', work: '深孔' },
                { vendor: '自由', work: '去毛邊' },
                { vendor: '興鑫', work: '熱處理' },
                { vendor: '精原', work: '內外徑研磨' },
                { vendor: '自由', work: '出貨' }
            ],
            notes: ''
        },
        {
            id: 'cy003',
            company: '敬祐',
            partNumber: '54-701-03 套環',
            material: '',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '堂文', work: '外研' },
                { vendor: '徐龍堅', work: '內孔精車' },
                { vendor: 'OP', work: '徐直送OP點貨' }
            ],
            notes: ''
        },
        {
            id: 'cy004',
            company: '敬祐',
            partNumber: '305J-025A 管接頭',
            material: '',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '自由', work: '浸油晾乾噴風' },
                { vendor: '詮瀧', work: '鍍鎳+鉻' },
                { vendor: '江輝', work: '填網' },
                { vendor: '自由', work: '出貨' }
            ],
            notes: ''
        },
        {
            id: 'op001',
            company: '宏斌',
            partNumber: '54-701-03 套環',
            material: 'SCM21',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '堂文', work: '外研' },
                { vendor: '徐龍堅', work: '內孔精車' },
                { vendor: '宏斌', work: '徐直送宏斌點貨' }
            ],
            notes: ''
        },
        {
            id: 'op002',
            company: '宏斌',
            partNumber: '306H-023 正逆轉閥',
            material: '12L14',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '興鑫', work: '熱處理' },
                { vendor: '勝富', work: '整直' },
                { vendor: '銳福', work: '噴砂' },
                { vendor: '堂文', work: '研磨' },
                { vendor: '自由', work: '出貨' }
            ],
            notes: ''
        },
        {
            id: 'op003',
            company: '宏斌',
            partNumber: '305J-025A 管接頭',
            material: '',
            steps: [
                { vendor: '自由', work: '車銑' },
                { vendor: '自由', work: '浸油晾乾噴風' },
                { vendor: '詮瀧', work: '鍍鎳+鉻' },
                { vendor: '江輝', work: '填網' },
                { vendor: '自由', work: '出貨' }
            ],
            notes: ''
        }
    ];
}

// 啟動
init();
