const STORAGE_KEY = 'jobcard_v2';

// DOM
const partName = document.getElementById('partName');
const machine = document.getElementById('machine');
const material = document.getElementById('material');
const programId = document.getElementById('programId');
const cycleTime = document.getElementById('cycleTime');
const dateDisplay = document.getElementById('dateDisplay');
const photoInput = document.getElementById('photoInput');
const photosContainer = document.getElementById('photosContainer');
const mainCollet = document.getElementById('mainCollet');
const guideBush = document.getElementById('guideBush');
const subCollet = document.getElementById('subCollet');
const antiVib = document.getElementById('antiVib');
const feederClamp = document.getElementById('feederClamp');
const coolant = document.getElementById('coolant');
const ejectBar = document.getElementById('ejectBar');
const toolsList = document.getElementById('toolsList');
const addToolBtn = document.getElementById('addToolBtn');
const warnings = document.getElementById('warnings');
const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const videoElement = document.getElementById('videoElement');
const deleteVideoBtn = document.getElementById('deleteVideo');
const addVideoBtn = document.getElementById('addVideoBtn');
const processNotes = document.getElementById('processNotes');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

let data = {
    partName: '',
    machine: '',
    material: '',
    programId: '',
    cycleTime: '',
    date: '',
    photos: [],
    setup: {
        mainCollet: '',
        guideBush: '',
        subCollet: '',
        antiVib: '',
        feederClamp: '',
        coolant: '',
        ejectBar: ''
    },
    tools: [],
    warnings: '',
    video: null,
    notes: '',
    lastUpdated: null
};

let saveTimeout = null;

function init() {
    loadData();
    renderUI();
    setupEvents();
    showDate();
}

// ===== 資料 =====

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            data = { ...data, ...parsed };
            if (!data.setup) data.setup = {};
            if (!data.tools) data.tools = [];
            if (!data.photos) data.photos = [];
        } catch (e) {
            console.error('載入失敗:', e);
        }
    }
}

function saveData() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 300);
}

function showDate() {
    if (!data.date) {
        data.date = new Date().toLocaleDateString('zh-TW');
    }
    dateDisplay.textContent = data.date;
}

// ===== 渲染 =====

function renderUI() {
    partName.value = data.partName || '';
    machine.value = data.machine || '';
    material.value = data.material || '';
    programId.value = data.programId || '';
    cycleTime.value = data.cycleTime || '';

    mainCollet.value = data.setup.mainCollet || '';
    guideBush.value = data.setup.guideBush || '';
    subCollet.value = data.setup.subCollet || '';
    antiVib.value = data.setup.antiVib || '';
    feederClamp.value = data.setup.feederClamp || '';
    coolant.value = data.setup.coolant || '';
    ejectBar.value = data.setup.ejectBar || '';

    warnings.value = data.warnings || '';
    processNotes.value = data.notes || '';

    renderPhotos();
    renderTools();

    if (data.video) {
        videoElement.src = data.video;
        videoPreview.style.display = 'block';
        addVideoBtn.style.display = 'none';
    }
}

function renderPhotos() {
    photosContainer.innerHTML = '';
    data.photos.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'photo-item';

        const img = document.createElement('img');
        img.src = src;
        img.addEventListener('click', () => {
            modalImage.src = src;
            photoModal.classList.add('active');
        });

        const del = document.createElement('button');
        del.className = 'media-delete';
        del.textContent = '×';
        del.addEventListener('click', (e) => {
            e.stopPropagation();
            data.photos.splice(i, 1);
            saveData();
            renderPhotos();
        });

        item.appendChild(img);
        item.appendChild(del);
        photosContainer.appendChild(item);
    });
}

function renderTools() {
    toolsList.innerHTML = '';

    if (data.tools.length > 0) {
        const header = document.createElement('div');
        header.className = 'tool-header';
        header.innerHTML = `
            <span class="th-num">刀號</span>
            <span class="th-field">刀桿</span>
            <span class="th-field">刀片規格</span>
            <span class="th-del"></span>
        `;
        toolsList.appendChild(header);
    }

    data.tools.forEach((tool, i) => {
        const row = document.createElement('div');
        row.className = 'tool-item';
        row.innerHTML = `
            <input type="text" class="tool-number" value="${esc(tool.number || '')}" placeholder="T01" data-i="${i}" data-f="number" autocomplete="off">
            <input type="text" class="tool-holder" value="${esc(tool.holder || '')}" placeholder="刀桿" data-i="${i}" data-f="holder" autocomplete="off">
            <input type="text" class="tool-insert" value="${esc(tool.insert || '')}" placeholder="刀片" data-i="${i}" data-f="insert" autocomplete="off">
            <button class="tool-delete" data-i="${i}">×</button>
        `;
        toolsList.appendChild(row);
    });
}

function addTool() {
    data.tools.push({ number: '', holder: '', insert: '' });
    saveData();
    renderTools();

    const inputs = toolsList.querySelectorAll('.tool-number');
    const last = inputs[inputs.length - 1];
    if (last) last.focus();
}

// ===== 事件 =====

function setupEvents() {
    // 基本資訊
    partName.addEventListener('input', () => { data.partName = partName.value; saveData(); });
    machine.addEventListener('input', () => { data.machine = machine.value; saveData(); });
    material.addEventListener('input', () => { data.material = material.value; saveData(); });
    programId.addEventListener('input', () => { data.programId = programId.value; saveData(); });
    cycleTime.addEventListener('input', () => { data.cycleTime = cycleTime.value; saveData(); });

    // 設定資訊
    const setupFields = [
        [mainCollet, 'mainCollet'],
        [guideBush, 'guideBush'],
        [subCollet, 'subCollet'],
        [antiVib, 'antiVib'],
        [feederClamp, 'feederClamp'],
        [coolant, 'coolant'],
        [ejectBar, 'ejectBar']
    ];
    setupFields.forEach(([el, key]) => {
        el.addEventListener('input', () => { data.setup[key] = el.value; saveData(); });
    });

    // 照片
    photoInput.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                data.photos.push(ev.target.result);
                saveData();
                renderPhotos();
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    });

    // 刀具表
    addToolBtn.addEventListener('click', addTool);

    toolsList.addEventListener('input', (e) => {
        const i = parseInt(e.target.dataset.i);
        const f = e.target.dataset.f;
        if (!isNaN(i) && f && data.tools[i]) {
            data.tools[i][f] = e.target.value;
            saveData();
        }
    });

    toolsList.addEventListener('click', (e) => {
        const btn = e.target.closest('.tool-delete');
        if (btn) {
            const i = parseInt(btn.dataset.i);
            if (!isNaN(i)) {
                data.tools.splice(i, 1);
                saveData();
                renderTools();
            }
        }
    });

    // 注意事項
    warnings.addEventListener('input', () => { data.warnings = warnings.value; saveData(); });

    // 影片
    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('video/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            data.video = ev.target.result;
            videoElement.src = data.video;
            videoPreview.style.display = 'block';
            addVideoBtn.style.display = 'none';
            saveData();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    });

    deleteVideoBtn.addEventListener('click', () => {
        data.video = null;
        videoElement.src = '';
        videoPreview.style.display = 'none';
        addVideoBtn.style.display = 'flex';
        saveData();
    });

    // 備註
    processNotes.addEventListener('input', () => { data.notes = processNotes.value; saveData(); });

    // 照片放大
    closeModal.addEventListener('click', () => photoModal.classList.remove('active'));
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) photoModal.classList.remove('active');
    });
}

function esc(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

init();
