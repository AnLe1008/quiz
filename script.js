const titleScreen = document.getElementById('title-screen');
const nameEntryScreen = document.getElementById('name-entry-screen');
const characterSelectScreen = document.getElementById('character-select-screen');
const gameScreen = document.getElementById('game-screen');

const startNewGameButton = document.getElementById('start-new-game-button');
const playerNameInput = document.getElementById('player-name-input');
const confirmNameButton = document.getElementById('confirm-name-button');
const characterCards = document.querySelectorAll('.character-card'); 
const charDetailsWindow = document.getElementById('char-details-window');
const confirmCharButton = document.getElementById('confirm-char-button');

const playerNameDisplay = document.getElementById('player-name-display');
const playerLevelDisplay = document.getElementById('player-level');
const playerHpBar = document.getElementById('player-hp-bar');
const playerHpValue = document.getElementById('player-hp-value');
const playerXpBar = document.getElementById('player-xp-bar');
const playerXpValue = document.getElementById('player-xp-value');
const playerGoldDisplay = document.getElementById('player-gold');
const playerFace = document.getElementById('player-face');
const skillIcon = document.getElementById('skill-icon');
const comboCounterDisplay = document.getElementById('combo-counter');

const logWindowOutput = document.getElementById('log-window');
const questionWindow = document.getElementById('question-window');
const questionTextElement = document.getElementById('question-text');
const answerOptionsElement = document.getElementById('answer-options');
const enemyInfo = document.getElementById('enemy-info');
const enemyNameDisplay = document.getElementById('enemy-name');
const enemyHpBar = document.getElementById('enemy-hp-bar');
const enemyHpValue = document.getElementById('enemy-hp-value');

const battleArena = document.getElementById('battle-arena');
const playerArenaSprite = document.getElementById('player-arena-sprite');
const enemyArenaSprite = document.getElementById('enemy-arena-sprite');

const safeRoomOptionsDiv = document.getElementById('safe-room-options');
const openShopButton = document.getElementById('open-shop-button');
const openUpgradeButton = document.getElementById('open-upgrade-button');
const leaveSafeRoomButton = document.getElementById('leave-safe-room-button');
const shopWindow = document.getElementById('shop-window');
const upgradeWindow = document.getElementById('upgrade-window');
const closeShopButton = document.getElementById('close-shop-button');
const closeUpgradeButton = document.getElementById('close-upgrade-button');

const inventoryButton = document.getElementById('inventory-button');
const inventoryWindow = document.getElementById('inventory-window');
const inventoryItemList = document.getElementById('inventory-item-list');
const inventoryItemDetails = document.getElementById('inventory-item-details');
const closeInventoryButton = document.getElementById('close-inventory-button');
const inventoryPlayerGold = document.getElementById('inventory-player-gold');

// ========== GAME STATE VARIABLES ==========
let currentScreen = 'title'; // Màn hình hiện tại
let playerName = "Dũng Sĩ"; // Tên người chơi mặc định
let playerCharacter;       // Object chứa thông tin nhân vật đã chọn
let currentCombo = 0;
let currentFloor = 1;
let currentRoomIndex = 0; // Bắt đầu từ index 0 (ứng với phòng null hoặc phòng bắt đầu thực sự)
let currentRoomData; // Thông tin phòng hiện tại
let currentEnemy; // Thông tin quái vật đang đối đầu
let questionsCorrectInRoom = 0; // Đếm số câu đúng trong phòng hiện tại
let questionsAskedInRoom = []; // Lưu id các câu đã hỏi trong phòng tránh lặp lại ngay

// ========== CORE DATA (Characters, Skills, Items, Enemies, Questions) ==========
const characterData = {
    'kiem-si': {
        name: "Nữ Kiếm Sĩ Quả Cảm",
        face: "images/chars/kiem_si_face.png", 
        skillIcon: "images/icons/skill_kiem_si.png", 
        sprite_idle: 'images/chars/kiem_si_idle.png',
        sprite_attack: 'images/chars/kiem_si_attack_sheet.png',
        sprite_hurt: 'images/chars/kiem_si_hurt_sheet.png',
        description: "Cân bằng công thủ, kỹ năng tấn công mạnh mẽ.",
        stats: { hp: 110, atk: 15, def: 12, spd: 5, lck: 8 },
        skill: { id: "double_strike", name: "Cú Đánh Chuẩn Xác", description: "Đòn tấn công đúng tiếp theo gây gấp đôi sát thương ATK. (1 lần/trận)" }
    },
    'hoc-gia': {
        name: "Nữ Học Giả Uyên Bác",
        face: "images/chars/hoc_gia_face.png",
        skillIcon: "images/icons/skill_hoc_gia.png",
        sprite_idle: 'images/chars/hoc_gia_idle.png',
        sprite_attack: 'images/chars/hoc_gia_attack_sheet.png',
        sprite_move: 'images/chars/hoc_gia_move_sheet.png',
        description: "ATK cao dựa trên trí tuệ, nhưng mỏng manh. Có thể loại bỏ đáp án sai.",
        stats: { hp: 90, atk: 18, def: 5, spd: 9, lck: 8 },
        skill: { id: "analyze", name: "Phân Tích Sâu Sắc", description: "Loại bỏ 1 đáp án sai trong câu hỏi hiện tại. (1 lần/trận, dùng trước khi chọn)" }
    },
     'trinh-sat': {
        name: "Nam Trinh Sát Lanh Lợi",
        face: "images/chars/trinh_sat_face.png",
        skillIcon: "images/icons/skill_trinh_sat.png",
        sprite_idle: 'images/chars/trinh_sat_idle.png',
        sprite_attack: 'images/chars/trinh_sat_attack_sheet.png',
        sprite_move: 'images/chars/trinh_sat_move_sheet.png',
        description: "Nhanh nhẹn và may mắn, có khả năng né đòn tấn công đầu tiên.",
        stats: { hp: 100, atk: 10, def: 7, spd: 13, lck: 10 },
        skill: { id: "first_dodge", name: "Lẩn Tránh Tức Thời", description: "Tự động né hoàn toàn sát thương từ lần trả lời sai đầu tiên trong trận." }
    },
    'ho-phap': {
        name: "Nam Hộ Pháp Vững Chãi",
        face: "images/chars/ho_phap_face.png",
        skillIcon: "images/icons/skill_ho_phap.png",
        sprite_idle: 'images/chars/ho_phap_idle.png',
        sprite_attack: 'images/chars/kiem_si_attack_sheet.png',
        description: "HP và DEF cực cao, khả năng hồi phục khi bị tấn công.",
        stats: { hp: 125, atk: 8, def: 15, spd: 4, lck: 13 },
        skill: { id: "second_wind", name: "Ý Chí Bất Khuất", description: "Hồi lại 25% HP tối đa sau khi bị tấn công (trả lời sai). (1 lần/trận, dùng sau khi bị đánh)" }
    }
};

const enemyData = {
    'silly_slime': { //Tầng 1
        id: 'silly_slime',
        name: "Quái Vật Chất Nhày",
        maxHp: 35,
        baseDamage: 18,
        sprite_idle: 'images/monsters/slime_idle.png',
        sprite_move: 'images/monsters/slime_move_sheet.png',
        sprite_hurt: 'images/monsters/slime_hurt_sheet.png'
    },
    'clumsy_bat': {
        id: 'clumsy_bat',
        name: "Dơi Đêm Lúng Túng",
        maxHp: 45,
        baseDamage: 20,
        sprite_idle: 'images/monsters/bat_idle.png',
        sprite_move: 'images/monsters/bat_move_sheet.png'
    },
    'stone_sentinel': {
        id: 'stone_sentinel',
        name: "Giám Ngục Đá Cổ Đại",
        maxHp: 200,
        baseDamage: 30,
        sprite_idle: 'images/monsters/golem_idle.png',
        sprite_attack: 'images/monsters/golem_attack_sheet.png',
        sprite_hurt: 'images/monsters/golem_hurt_sheet.png'
    },

     'paper_spirit': { //Tầng 2
         id: 'paper_spirit',
         name: "Ma Giấy Lịch Sử",
         maxHp: 60,
         baseDamage: 40,
         sprite_idle: 'images/monsters/paper_spirit_idle.png'
     },
      'lit_spider': { 
         id: 'lit_spider',
         name: "Nhện Tơ Văn Học",
         maxHp: 55,
         baseDamage: 45,
         sprite_idle: 'images/monsters/lit_spider_idle.png'
     },
      'ghost_librarian': { 
         id: 'ghost_librarian',
         name: "Người Giữ Sách Ma Quái",
         maxHp: 450,
         baseDamage: 55,
         sprite_idle: 'images/monsters/librarian_boss_idle.png'
     },

     'lab_golem': { //Tầng 3
         id: 'lab_golem',
         name: "Golem Thí Nghiệm Hỏng",
         maxHp: 100,
         baseDamage: 50,
         sprite_idle: 'images/monsters/lab_golem_idle.png'
     },
     'energy_crystal': {
        id: 'energy_crystal',
        name: "Tinh Thể Năng Lượng Bất Ổn",
        maxHp: 70,
        baseDamage: 65,
        sprite_idle: 'images/monsters/energy_crystal_idle.png' 
     },
     'failed_experiment': {
        id: 'failed_experiment',
        name: "Quái Vật Thí Nghiệm Lỗi",
        maxHp: 700,
        baseDamage: 75,
        sprite_idle: 'images/monsters/failed_experiment_boss_idle.png' 
     },

     'stardust_sprite': { //Tầng 4
        id: 'stardust_sprite',
        name: "Bụi Sao Tinh Quái", 
        maxHp: 80, 
        baseDamage: 70, 
        sprite_idle: 'images/monsters/stardust_sprite_idle.png' 
    },
    'meteor_wraith': { 
        id: 'meteor_wraith', 
        name: "Bóng Ma Thiên Thạch", 
        maxHp: 120, 
        baseDamage: 65, 
        sprite_idle: 'images/monsters/meteor_wraith_idle.png' 
    },
    'living_nebula': { 
        id: 'living_nebula', 
        name: "Tinh Vân Sống Dậy", 
        maxHp: 1000, 
        baseDamage: 90, 
        sprite_idle: 'images/monsters/nebula_boss_idle.png' 
    },

    'mummy_guardian': { //Tầng 5
        id: 'mummy_guardian', 
        name: "Xác Ướp Canh Gác", 
        maxHp: 150, 
        baseDamage: 80, 
        sprite_idle: 'images/monsters/mummy_guardian_idle.png' 
    },
    'golden_scarab': { 
        id: 'golden_scarab', 
        name: "Bọ Hung Vàng Khổng Lồ", 
        maxHp: 90, 
        baseDamage: 75, 
        sprite_idle: 'images/monsters/golden_scarab_idle.png' 
    },
    'reawakened_pharaoh': { 
        id: 'reawakened_pharaoh', 
        name: "Pharaoh Hồi Sinh", 
        maxHp: 1400, 
        baseDamage: 110, 
        sprite_idle: 'images/monsters/pharaoh_boss_idle.png'
    },

    'ignoramus_final': { //Tầng 6
        id: 'ignoramus_final',
        name: "Ignoramus, Kẻ Giam Cầm Tri Thức",
        maxHp: 10000, // HP cực kỳ cao
        baseDamage: 350, // Sát thương gốc rất lớn
        sprite_idle: 'images/monsters/ignoramus_final_idle.png'
    }
};

const itemData = {
    'potion_small': { name: "Thuốc Hồi Phục Nhỏ", description: "Hồi 30 HP.", effect: { type: 'heal', amount: 30 }, price: 50 },
    'potion_medium': { name: "Thuốc Hồi Phục Vừa", description: "Hồi 70 HP.", effect: { type: 'heal', amount: 70 }, price: 100 },
    'potion_large': { name: "Thuốc Hồi Phục Lớn", description: "Hồi 100 HP.", effect: { type: 'heal', amount: 100 }, price: 200 },
    'hint_crystal': { name: "Pha Lê Gợi Ý", description: "Loại bỏ 1 đáp án sai (1 lần/câu hỏi).", effect: { type: 'hint', uses: 1 }, price: 120 },
    'elixir_str': { name: "Thuốc Cường Lực (Tạm)", description: "Tăng ATK +5 trong 3 lượt hỏi kế.", effect: { type: 'buff', stat: 'atk', amount: 5, duration: 3 }, price: 150 }, // Ví dụ vật phẩm mới
    // Thêm các vật phẩm khác nếu cần
};

const shopInventory = { // Vật phẩm bán ở các tầng
    1: ['potion_small', 'hint_crystal'], // Tầng 1 chỉ bán 2 cái này
    2: ['potion_small', 'potion_medium', 'hint_crystal'], // Tầng 2 thêm thuốc vừa
    // ... Định nghĩa inventory cho các tầng khác ...
};

const floor1Data = [
    null,
    { roomNumber: 1, 
        type: 'encounter', 
        arenaBackground: 'images/arena_backgrounds/dungeon_entry_arena.png',
        questionsToComplete: 10, 
        monsterId: 'silly_slime',
        numMonsters: 2,
        questionsInRoom: [
            { id: "f1r1q1", questionText: "Tiền tệ là một phạm trù kinh tế khách quan, gắn liền với sự ra đời và phát triển của yếu tố nào?",
                options: ["Nhà nước phong kiến",
                          "Nền kinh tế hàng hóa",
                          "Thương mại quốc tế",
                          "Hệ thống ngân hàng"],
                correctAnswer: "Nền kinh tế hàng hóa"
            },
            { id: "f1r1q2", questionText: "Quan điểm của Karl Marx về bản chất của tiền là gì ?",
                options: ["Là vật ngang giá chung, là một hàng hóa đặc biệt",
                          "Là bánh xe vĩ đại của lưu thông",
                          "Là bất cứ cái gì được chấp nhận chung trong thanh toán",
                          "Là phương tiện tích lũy của cải"],
          correctAnswer: "Là vật ngang giá chung, là một hàng hóa đặc biệt"
            },
            { id: "f1r1q3", questionText: "Theo F.S. Mishkin, tiền tệ được định nghĩa là gì ?",
                options: ["Vật ngang giá chung",
                          "Hàng hóa đặc biệt",
                          "Bất cứ cái gì được chấp nhận chung trong việc thanh toán để nhận hàng hóa, dịch vụ, hoặc trong việc trả nợ",
                          "Công cụ đo lường giá trị"],
                correctAnswer: "Bất cứ cái gì được chấp nhận chung trong việc thanh toán để nhận hàng hóa, dịch vụ, hoặc trong việc trả nợ"
            },
            { id: "f1r1q4", questionText: "Bản chất cốt lõi của tiền tệ, theo tổng hợp từ các quan điểm là gì?",
                options: ["Giá trị nội tại",
                          "Sự khan hiếm",
                          "Vai trò 'trung gian' và 'phương tiện'",
                          "Sự bảo đảm của nhà nước"],
                correctAnswer: "Vai trò 'trung gian' và 'phương tiện'"
            },
            { id: "f1r1q5", questionText: "Trình tự phát triển hợp lý của các hình thái tiền tệ theo lịch sử là gì ?",
                options: ["Tiền kim loại -> Tiền giấy -> Tiền hàng hóa -> Tiền điện tử",
                          "Tiền hàng hóa (phi kim loại) -> Tiền hàng hóa (kim loại) -> Tiền giấy -> Tiền ghi sổ -> Tiền điện tử",
                          "Tiền giấy -> Tiền ghi sổ -> Tiền kim loại -> Tiền hàng hóa",
                          "Tiền hàng hóa -> Tiền điện tử -> Tiền giấy -> Tiền kim loại"],
                correctAnswer: "Tiền hàng hóa (phi kim loại) -> Tiền hàng hóa (kim loại) -> Tiền giấy -> Tiền ghi sổ -> Tiền điện tử"
            },
            { id: "f1r1q6", questionText: "'Hóa tệ' (Commodity Money) được định nghĩa là gì ?",
                options: ["Loại tiền tệ bằng hàng hóa, là hình thái đầu tiên của tiền tệ",
                          "Loại tiền tệ không có giá trị nội tại nhưng được chấp nhận do tín nhiệm",
                          "Loại tiền tệ tồn tại dưới dạng bút toán ngân hàng",
                          "Loại tiền tệ kỹ thuật số"],
                correctAnswer: "Loại tiền tệ bằng hàng hóa, là hình thái đầu tiên của tiền tệ"
            },
            { id: "f1r1q7", questionText: "'Tín tệ' (Fiat Money/Credit Money) bao gồm những loại nào ?",
                options: ["Chỉ có tiền giấy",
                          "Chỉ có tiền xu kim loại",
                          "Tiền giấy và tiền điện tử",
                          "Tiền ghi sổ"],
                correctAnswer: "Kim loại (tiền xu) và tiền giấy"
            },
            { id: "f1r1q8", questionText: "'Bút tệ' (Book Money) có đặc điểm cơ bản nào ?",
                options: ["Có hình thái vật chất rõ ràng",
                          "Bản thân nó có giá trị cao",
                          "Không có hình thái vật chất, chỉ là con số trên tài khoản ngân hàng",
                          "Chỉ được sử dụng trong giao dịch quốc tế"],
                correctAnswer: "Không có hình thái vật chất, chỉ là con số trên tài khoản ngân hàng"
            },
            { id: "f1r1q9", questionText: "Một trong những nhược điểm chính của tiền bằng hàng hóa không phải kim loại là gì ?",
                options: ["Quá khan hiếm",
                          "Khó bảo quản, khó chia nhỏ, không đồng nhất",
                          "Không được chấp nhận rộng rãi",
                          "Chi phí sản xuất cao"],
                correctAnswer: "Khó bảo quản, khó chia nhỏ, không đồng nhất"
            },
            { id: "f1r1q10", questionText: "Ưu điểm nổi bật của tiền bằng hàng hóa là kim loại so với các loại hàng hóa khác là ?",
                options: ["Giá trị luôn tăng",
                          "Tính đồng nhất cao, dễ bảo quản, dễ chia nhỏ, dễ vận chuyển",
                          "Không thể làm giả",
                          "Được mọi quốc gia sử dụng"],
                correctAnswer: "Tính đồng nhất cao, dễ bảo quản, dễ chia nhỏ, dễ vận chuyển"
            }
            ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 2, 
        type: 'chest', 
        questionsToComplete: 5, 
        questionsInRoom: [
            { id: "f1r2q1", questionText: "Ưu điểm chính của tiền giấy so với tiền kim loại là gì ?",
                options: ["Giá trị nội tại cao hơn",
                          "Không bị lạm phát",
                          "Đáp ứng quy mô vô hạn của kinh tế, dễ mang theo, thuận tiện dự trữ",
                          "Không thể bị làm giả"],
                correctAnswer: "Đáp ứng quy mô vô hạn của kinh tế, dễ mang theo, thuận tiện dự trữ"
            },
            { id: "f1r2q2", questionText: "Lợi ích chính của việc sử dụng tiền ghi sổ/thẻ là gì ?",
                options: ["Giảm chi phí, giảm rủi ro, nhà nước dễ quản lý, nhanh chóng, thuận tiện",
                          "Tăng tính ẩn danh cho giao dịch",
                          "Loại bỏ hoàn toàn lạm phát",
                          "Chỉ phù hợp với các giao dịch lớn"],
                correctAnswer: "Giảm chi phí, giảm rủi ro, nhà nước dễ quản lý, nhanh chóng, thuận tiện"
            },
            { id: "f1r2q3", questionText: "Ba chức năng cơ bản nhất của một đồng tiền là gì ?",
                options: ["Thước đo giá trị, Phương tiện thanh toán, Tiền thế giới",
                          "Thước đo giá trị, Phương tiện trao đổi, Phương tiện cất trữ",
                          "Đơn vị tính toán, Phương tiện lưu thông, Tài sản tài chính",
                          "Phương tiện thanh toán, Phương tiện tích lũy, Điều tiết kinh tế"],
                correctAnswer: "Thước đo giá trị, Phương tiện trao đổi, Phương tiện cất trữ"
            },
            { id: "f1r2q4", questionText: "Chức năng 'Thước đo giá trị' của tiền tệ có nghĩa là gì ?",
                options: ["Tiền được dùng để đo lường, biểu hiện giá trị của các hàng hóa, dịch vụ khác",
                          "Tiền được dùng làm trung gian trong trao đổi hàng hóa",
                          "Tiền được rút khỏi lưu thông để tích lũy",
                          "Tiền được dùng để thanh toán nợ"],
                correctAnswer: "Tiền được dùng để đo lường, biểu hiện giá trị của các hàng hóa, dịch vụ khác"
            },
            { id: "f1r2q5", questionText: "Tầm quan trọng của chức năng 'Thước đo giá trị' là gì ?",
                options: ["Giúp nhà nước kiểm soát giá cả",
                          "Giảm chi phí trao đổi do giảm số lượng giá cả cần xem xét",
                          "Đảm bảo giá trị của tiền tệ ổn định",
                          "Khuyến khích chuyên môn hóa sản xuất"],
                correctAnswer: "Giảm chi phí trao đổi do giảm số lượng giá cả cần xem xét"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 } 
    },
   
    { roomNumber: 3, 
        type: 'encounter', 
        questionsToComplete: 10, 
        monsterId: 'clumsy_bat', 
        numMonsters: 2, 
        questionsInRoom: [
            { id: "f1r3q1", questionText: "Chức năng 'Phương tiện trao đổi' của tiền tệ thể hiện như thế nào ?",
                options: ["Tiền được dùng làm môi giới trong việc mua bán hàng hóa, dịch vụ, thanh toán nợ",
                          "Tiền được dùng để so sánh giá trị các loại hàng hóa",
                          "Tiền được cất giữ để sử dụng trong tương lai",
                          "Tiền được dùng để đầu tư sinh lời"],
                correctAnswer: "Tiền được dùng làm môi giới trong việc mua bán hàng hóa, dịch vụ, thanh toán nợ"
            },
            { id: "f1r3q2", questionText: "Chức năng 'Phương tiện trao đổi' khắc phục được hạn chế nào của trao đổi trực tiếp (hàng đổi hàng) ?",
                options: ["Sự không đồng nhất của hàng hóa",
                          "Yêu cầu về sự trùng khớp kép về nhu cầu (double coincidence of wants), thời gian, không gian trao đổi",
                          "Khó khăn trong việc vận chuyển hàng hóa",
                          "Sự biến động giá trị của hàng hóa"],
                correctAnswer: "Yêu cầu về sự trùng khớp kép về nhu cầu (double coincidence of wants), thời gian, không gian trao đổi"
            },
            { id: "f1r3q3", questionText: "Theo các nhà kinh tế học hiện đại, chức năng nào của tiền được coi là quan trọng nhất và tại sao ?",
                options: ["Thước đo giá trị, vì nó làm cơ sở cho mọi giao dịch",
                          "Phương tiện trao đổi, vì nó tiết kiệm chi phí giao dịch và thúc đẩy chuyên môn hóa",
                          "Phương tiện cất trữ, vì nó giúp bảo tồn giá trị qua thời gian",
                          "Phương tiện thanh toán, vì nó giải quyết các khoản nợ"],
                correctAnswer: "Phương tiện trao đổi, vì nó tiết kiệm chi phí giao dịch và thúc đẩy chuyên môn hóa"
            },
            { id: "f1r3q4", questionText: "Tiền tệ thực hiện chức năng 'Phương tiện cất trữ' khi nào ?",
                options: ["Khi nó đang được dùng để mua hàng",
                          "Khi nó đang được dùng để niêm yết giá",
                          "Khi nó tạm thời rút ra khỏi lưu thông để chuẩn bị cho tiêu dùng tương lai",
                          "Khi nó được chuyển khoản giữa các ngân hàng"],
                correctAnswer: "Khi nó tạm thời rút ra khỏi lưu thông để chuẩn bị cho tiêu dùng tương lai"
            },
            { id: "f1r3q5", questionText: "Yếu tố nào làm cho tiền tệ (đặc biệt là tiền mặt) trở thành một phương tiện cất trữ độc đáo so với tài sản khác như nhà đất, cổ phiếu ?",
                options: ["Khả năng sinh lời cao",
                          "Giá trị ổn định tuyệt đối",
                          "Tính lỏng (thanh khoản) cao nhất",
                          "Được chính phủ bảo hiểm"],
                correctAnswer: "Tính lỏng (thanh khoản) cao nhất"
            },
            { id: "f1r3q6", questionText: "Điều kiện cần thiết để tiền tệ thực hiện tốt chức năng 'Phương tiện cất trữ' là gì ?",
                options: ["Phải là tiền kim loại quý",
                          "Phải giữ được giá trị (sức mua) tương đối ổn định qua thời gian",
                          "Phải có số lượng lớn trong lưu thông",
                          "Phải được tự do chuyển đổi ra vàng"],
                correctAnswer: "Phải giữ được giá trị (sức mua) tương đối ổn định qua thời gian"
            },
            { id: "f1r3q7", questionText: "Khi thực hiện chức năng nào, tiền KHÔNG cần phải hiện diện một cách vật lý ?",
                options: ["Thước đo giá trị",
                          "Phương tiện trao đổi (mua bán trực tiếp)",
                          "Phương tiện thanh toán (trả nợ trực tiếp)",
                          "Phương tiện cất trữ (dưới dạng tiền mặt)"],
                correctAnswer: "Thước đo giá trị"
            },
            { id: "f1r3q8", questionText: "Khi một doanh nghiệp lập Bảng cân đối kế toán, tiền tệ chủ yếu phát huy chức năng nào ?",
                options: ["Thước đo giá trị (để biểu hiện giá trị các tài sản, nguồn vốn)",
                          "Phương tiện trao đổi",
                          "Phương tiện thanh toán",
                          "Phương tiện cất trữ"],
                correctAnswer: "Thước đo giá trị (để biểu hiện giá trị các tài sản, nguồn vốn)"
            },
            { id: "f1r3q9", questionText: "'Ms' trong lý thuyết tiền tệ thường dùng để ký hiệu điều gì",
                options: ["Khối lượng tiền cần thiết cho lưu thông",
                          "Khối lượng tiền thực tế cung ứng (có trong lưu thông)",
                          "Tốc độ chu chuyển tiền tệ",
                          "Mức giá chung"],
                correctAnswer: "Khối lượng tiền thực tế cung ứng (có trong lưu thông)"
            },
            { id: "f1r3q10", questionText: "'Mn' trong lý thuyết tiền tệ thường dùng để ký hiệu điều gì",
                options: ["Khối lượng tiền cần thiết cho lưu thông (nhu cầu tiền tệ)",
                          "Khối lượng tiền cung ứng trong lưu thông",
                          "Số vòng quay của tiền",
                          "Tổng sản phẩm quốc nội"],
                correctAnswer: "Khối lượng tiền cần thiết cho lưu thông (nhu cầu tiền tệ)"
            }
        ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 4, 
        type: 'puzzle', 
        questionsToComplete: 5, 
        questionsInRoom: [
            { id: "f1r4q1", questionText: "Công thức tính Khối lượng tiền cần thiết cho lưu thông (Mn) theo lý thuyết số lượng tiền tệ là gì",
                options: ["Mn = (Tổng giá cả hàng hóa) * (Số vòng lưu thông)",
                          "Mn = (Tổng số giá cả hàng hóa) / (Số vòng lưu thông của một đồng tiền)",
                          "Mn = Ms / (Số vòng lưu thông)",
                          "Mn = (Mức giá) * (Sản lượng)"],
                correctAnswer: "Mn = (Tổng giá cả hàng hóa) / (Số vòng lưu thông)"
            },
            { id: "f1r4q2", questionText: "Tình trạng Lạm phát xảy ra khi mối quan hệ giữa Ms và Mn như thế nào",
                options: ["Ms = Mn",
                          "Ms < Mn",
                          "Ms > Mn",
                          "Mn tiến về 0"],
                correctAnswer: "Ms > Mn"
            },
            { id: "f1r4q3", questionText: "Tình trạng Thiểu phát (giảm phát) xảy ra khi mối quan hệ giữa Ms và Mn như thế nào",
                options: ["Ms = Mn",
                          "Ms < Mn",
                          "Ms > Mn",
                          "Ms tiến về 0"],
                correctAnswer: "Ms < Mn"
            },
            { id: "f1r4q4", questionText: "Khối tiền tệ M1 (theo cách đo lường phổ biến) thường bao gồm những thành phần nào",
                options: ["Tiền mặt ngoài ngân hàng và tiền gửi không kỳ hạn có thể phát séc",
                          "Tiền mặt và tiền gửi có kỳ hạn",
                          "Tiền gửi không kỳ hạn và tiền gửi tiết kiệm",
                          "Toàn bộ tiền mặt và các loại tiền gửi"],
                correctAnswer: "Tiền mặt ngoài ngân hàng và tiền gửi không kỳ hạn có thể phát séc"
            },
            { id: "f1r4q5", questionText: "Khối tiền tệ M2 khác M1 ở điểm nào",
                options: ["M2 bao gồm thêm vàng và ngoại tệ",
                          "M2 loại bỏ tiền mặt ra khỏi M1",
                          "M2 bao gồm M1 cộng thêm tiền gửi có kỳ hạn (thường là dưới một ngưỡng nhất định)",
                          "M2 bao gồm M1 cộng thêm cổ phiếu và trái phiếu"],
                correctAnswer: "M2 bao gồm M1 cộng thêm tiền gửi có kỳ hạn (thường là dưới một ngưỡng nhất định)"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 } 
    },
    
    { roomNumber: 5, 
        type: 'safe_room',
    },
    
    { roomNumber: 6, 
        type: 'boss', 
        questionsToComplete: 25, 
        monsterId: 'stone_sentinel', 
        questionsInRoom: [
            { id: "f1r6q1", questionText: "Các loại giấy tờ có giá như thương phiếu, tín phiếu, trái phiếu được tính vào khối tiền tệ nào theo cách phân loại trên slide 37?",
                options: ["M1",
                          "M2",
                          "M3 (hoặc các khối tiền rộng hơn M2)",
                          "Không thuộc khối tiền tệ nào"],
                correctAnswer: "M2"
            },
            { id: "f1r6q2", questionText: "Tính lỏng (Liquidity) của một tài sản phản ánh điều gì",
                options: ["Khả năng chuyển đổi tài sản đó thành tiền mặt nhanh chóng với chi phí thấp",
                          "Khả năng sinh lời của tài sản",
                          "Mức độ rủi ro của tài sản",
                          "Giá trị danh nghĩa của tài sản"],
                correctAnswer: "Khả năng chuyển đổi tài sản đó thành tiền mặt nhanh chóng với chi phí thấp"
            },
            { id: "f1r6q3", questionText: "Hai loại chi phí chính liên quan đến việc chuyển đổi một tài sản kém thanh khoản thành tiền mặt là gì",
                options: ["Chi phí cơ hội và chi phí quản lý",
                          "Chi phí về thời gian và chi phí về tài chính (hoa hồng, chênh lệch giá)",
                          "Chi phí bảo quản và chi phí vận chuyển",
                          "Chi phí thuế và chi phí pháp lý"],
                correctAnswer: "Chi phí về thời gian và chi phí về tài chính (hoa hồng, chênh lệch giá)"
            },
            { id: "f1r6q4", questionText: "Sắp xếp các tài sản sau theo thứ tự tính thanh khoản giảm dần: Tiền mặt, Tiền gửi tiết kiệm có kỳ hạn, Cổ phiếu niêm yết, Bất động sản (Slide 41, kiến thức chung).",
                options: ["Tiền mặt, Cổ phiếu niêm yết, Tiền gửi tiết kiệm có kỳ hạn, Bất động sản",
                          "Tiền mặt, Tiền gửi tiết kiệm có kỳ hạn, Cổ phiếu niêm yết, Bất động sản",
                          "Tiền mặt, Bất động sản, Cổ phiếu niêm yết, Tiền gửi tiết kiệm có kỳ hạn",
                          "Cổ phiếu niêm yết, Tiền mặt, Tiền gửi tiết kiệm có kỳ hạn, Bất động sản"],
                correctAnswer: "Tiền mặt, Cổ phiếu niêm yết, Tiền gửi tiết kiệm có kỳ hạn, Bất động sản"
            },
            { id: "f1r6q5", questionText: "Chế độ tiền tệ (Monetary System) được định nghĩa là gì",
                options: ["Cách thức nhà nước in và phát hành tiền",
                          "Hình thức tổ chức lưu thông tiền tệ của một quốc gia, được quy định bằng pháp luật",
                          "Tỷ giá hối đoái giữa đồng nội tệ và ngoại tệ",
                          "Hệ thống các ngân hàng thương mại trong nước"],
                correctAnswer: "Hình thức tổ chức lưu thông tiền tệ của một quốc gia, được quy định bằng pháp luật"
            },
            { id: "f1r6q6", questionText: "Ba yếu tố cấu thành một chế độ tiền tệ là gì",
                options: [
                  "Ngân hàng trung ương, Ngân hàng thương mại, Thị trường tài chính",
                  "Bản vị tiền tệ, Đơn vị tiền tệ, Công cụ trao đổi (hình thức tiền lưu hành)",
                  "Luật ngân hàng, Chính sách tiền tệ, Tỷ giá hối đoái",
                  "Vàng, Bạc, Tiền giấy"
                ],
                correctAnswer: "Bản vị tiền tệ, Đơn vị tiền tệ, Công cụ trao đổi (hình thức tiền lưu hành)"
            },
            { id: "f1r6q7", questionText: "Chế độ song bản vị (Bimetallism) có đặc điểm gì",
                options: [
                  "Đồng tiền quốc gia được định giá theo cả vàng và bạc với một tỷ lệ cố định",
                  "Chỉ có tiền vàng được lưu hành",
                  "Tiền giấy được tự do đổi ra vàng hoặc bạc",
                  "Đồng tiền được neo vào một ngoại tệ mạnh"
                ],
                correctAnswer: "Đồng tiền quốc gia được định giá theo cả vàng và bạc với một tỷ lệ cố định"
            },
            { id: "f1r6q8", questionText: "Hiện tượng 'tiền có giá trị thấp đuổi tiền có giá trị cao ra khỏi lưu thông' (Luật Gresham) thường xảy ra trong chế độ tiền tệ nào",
                options: [
                  "Chế độ bản vị vàng",
                  "Chế độ song bản vị (khi tỷ lệ pháp định khác tỷ lệ thị trường)",
                  "Chế độ bản vị ngoại tệ",
                  "Chế độ tiền pháp định"
                ],
                correctAnswer: "Chế độ song bản vị (khi tỷ lệ pháp định khác tỷ lệ thị trường)"
            },
            { id: "f1r6q9", questionText: "Chế độ bản vị tiền vàng (Gold Standard) yêu cầu điều gì",
                options: [
                  "Nhà nước cấm tư nhân sở hữu vàng",
                  "Nhà nước không hạn chế đúc tiền vàng, tiền giấy được xác định bằng vàng, tiền vàng lưu thông tự do",
                  "Chỉ có tiền giấy lưu hành, nhưng giá trị được neo vào vàng",
                  "Tỷ giá hối đoái cố định với đồng đô la Mỹ"
                ],
                correctAnswer: "Nhà nước không hạn chế đúc tiền vàng, tiền giấy được xác định bằng vàng, tiền vàng lưu thông tự do"
            },
            { id: "f1r6q10", questionText: "Một trong những ảnh hưởng tích cực của chế độ bản vị vàng là gì",
                options: [
                  "Giúp các nước nghèo phát triển nhanh chóng",
                  "Tạo sự ổn định cho lưu thông tiền tệ và thúc đẩy thương mại quốc tế",
                  "Ngăn chặn hoàn toàn các cuộc khủng hoảng kinh tế",
                  "Giúp chính phủ dễ dàng điều chỉnh cung tiền"
                ],
                correctAnswer: "Tạo sự ổn định cho lưu thông tiền tệ và thúc đẩy thương mại quốc tế"
            },
            { id: "f1r6q11", questionText: "Chế độ bản vị ngoại tệ (Foreign Exchange Standard), ví dụ hệ thống Bretton Woods sau WW2, có đặc điểm gì",
                options: [
                  "Mọi đồng tiền đều được tự do đổi ra vàng",
                  "Đồng tiền quốc gia được neo giá trị vào một ngoại tệ mạnh (ví dụ USD), và ngoại tệ đó có thể chuyển đổi ra vàng theo tỷ lệ cố định",
                  "Chỉ có ngoại tệ được lưu hành trong nước",
                  "Tỷ giá hối đoái hoàn toàn thả nổi"
                ],
                correctAnswer: "Đồng tiền quốc gia được neo giá trị vào một ngoại tệ mạnh (ví dụ USD), và ngoại tệ đó có thể chuyển đổi ra vàng theo tỷ lệ cố định"
            },
            { id: "f1r6q12", questionText: "Chế độ tiền tệ phổ biến nhất trên thế giới hiện nay là gì",
                options: [
                  "Chế độ bản vị vàng",
                  "Chế độ song bản vị",
                  "Chế độ bản vị ngoại tệ",
                  "Chế độ bản vị tiền giấy không chuyển đổi ra vàng (Tín tệ/Fiat Money)"
                ],
                correctAnswer: "Chế độ bản vị tiền giấy không chuyển đổi ra vàng (Tín tệ/Fiat Money)"
            },
            { id: "f1r6q13", questionText: "Hai tiền đề cơ bản nhất cho sự ra đời và phát triển của tài chính là gì",
                options: [
                  "Sự xuất hiện của thương mại và nhà nước",
                  "Nền kinh tế hàng hóa tiền tệ và sự ra đời, tồn tại của Nhà nước",
                  "Sự phát triển của ngân hàng và thị trường chứng khoán",
                  "Phân công lao động xã hội và toàn cầu hóa"
                ],
                correctAnswer: "Nền kinh tế hàng hóa tiền tệ và sự ra đời, tồn tại của Nhà nước"
            },
            { id: "f1r6q14", questionText: "Tài chính được định nghĩa là tổng hợp các mối quan hệ kinh tế biểu hiện dưới hình thái nào và liên quan đến việc gì",
                options: [
                  "Hình thái tiền tệ, liên quan đến quá trình tạo lập và sử dụng các quỹ tiền tệ",
                  "Hình thái hiện vật, liên quan đến sản xuất và tiêu dùng",
                  "Hình thái lao động, liên quan đến việc làm và thu nhập",
                  "Hình thái tài sản, liên quan đến sở hữu và chuyển nhượng"
                ],
                correctAnswer: "Hình thái tiền tệ, liên quan đến quá trình tạo lập và sử dụng các quỹ tiền tệ"
            },
            { id: "f1r6q15", questionText: "Hoạt động tài chính về bản chất là quá trình gì",
                options: [
                  "Sản xuất hàng hóa",
                  "Thu - chi bằng tiền (sự vận động của các quỹ tiền tệ)",
                  "Trao đổi hàng hóa trực tiếp",
                  "Tích lũy tư bản hiện vật"
                ],
                correctAnswer: "Thu - chi bằng tiền (sự vận động của các quỹ tiền tệ)"
            },
            { id: "f1r6q16", questionText: "Nguồn tài chính (Financial Resources) được hiểu là gì",
                options: [
                  "Khả năng tài chính (tiềm năng về vốn) mà các chủ thể có thể khai thác, sử dụng",
                  "Tổng số tiền mặt đang lưu hành",
                  "Các quỹ tiền tệ đã được tạo lập",
                  "Tài sản cố định của doanh nghiệp"
                ],
                correctAnswer: "Khả năng tài chính (tiềm năng về vốn) mà các chủ thể có thể khai thác, sử dụng"
            },
            { id: "f1r6q17", questionText: "Quỹ tiền tệ (Monetary Fund) khác nguồn tài chính ở điểm nào",
                options: [
                  "Quỹ tiền tệ chỉ bao gồm tiền mặt",
                  "Quỹ tiền tệ là một lượng nguồn tài chính đã được huy động và có mục đích sử dụng xác định, có chủ sở hữu cụ thể",
                  "Nguồn tài chính có tính thanh khoản cao hơn quỹ tiền tệ",
                  "Quỹ tiền tệ chỉ tồn tại ở cấp độ vĩ mô (Nhà nước)"
                ],
                correctAnswer: "Quỹ tiền tệ là một lượng nguồn tài chính đã được huy động và có mục đích sử dụng xác định, có chủ sở hữu cụ thể"
            },
            { id: "f1r6q18", questionText: "Hai chức năng cơ bản và vốn có của tài chính là gì",
                options: [
                  "Huy động vốn và Đầu tư",
                  "Thanh toán và Tín dụng",
                  "Phân phối và Giám đốc (Giám sát)",
                  "Tạo tiền và Điều tiết"
                ],
                correctAnswer: "Phân phối và Giám đốc (Giám sát)"
            },
            { id: "f1r6q19", questionText: "Phân phối lần đầu trong chức năng phân phối của tài chính diễn ra ở đâu và cho những chủ thể nào",
                options: [
                  "Trong lĩnh vực sản xuất, cho những người trực tiếp tạo ra của cải vật chất, dịch vụ (DN, người lao động, chủ sở hữu vốn...)",
                  "Trong lĩnh vực lưu thông, cho các trung gian thương mại",
                  "Thông qua ngân sách nhà nước, cho các đối tượng chính sách",
                  "Trên thị trường tài chính, cho người mua và người bán chứng khoán"
                ],
                correctAnswer: "Trong lĩnh vực sản xuất, cho những người trực tiếp tạo ra của cải vật chất, dịch vụ (DN, người lao động, chủ sở hữu vốn...)"
            },
            { id: "f1r6q20", questionText: "Phân phối lại trong chức năng phân phối của tài chính là cần thiết để làm gì",
                options: [
                  "Chỉ để tăng thu nhập cho người giàu",
                  "Đảm bảo phát triển toàn diện xã hội (đặc biệt khu vực phi sản xuất), điều tiết thu nhập, thực hiện công bằng xã hội tương đối",
                  "Loại bỏ hoàn toàn vai trò của phân phối lần đầu",
                  "Chỉ nhằm mục đích tài trợ cho chiến tranh"
                ],
                correctAnswer: "Đảm bảo phát triển toàn diện xã hội (đặc biệt khu vực phi sản xuất), điều tiết thu nhập, thực hiện công bằng xã hội tương đối"
            },
            { id: "f1r6q21", questionText: "Chức năng giám đốc (giám sát) của tài chính thực hiện việc kiểm tra bằng công cụ gì và nhằm mục đích gì",
                options: [
                  "Bằng đồng tiền, để kiểm tra quá trình tạo lập và sử dụng các quỹ tiền tệ theo mục đích đã định",
                  "Bằng pháp luật, để xử phạt các hành vi vi phạm",
                  "Bằng kế hoạch, để định hướng hoạt động kinh tế",
                  "Bằng kiểm toán độc lập, để xác nhận báo cáo tài chính"
                ],
                correctAnswer: "Bằng đồng tiền, để kiểm tra quá trình tạo lập và sử dụng các quỹ tiền tệ theo mục đích đã định"
            },
            { id: "f1r6q22", questionText: "Mối quan hệ giữa chức năng phân phối và chức năng giám đốc của tài chính là gì",
                options: [
                  "Hai chức năng hoàn toàn độc lập",
                  "Hai chức năng tồn tại song song, ràng buộc và hỗ trợ lẫn nhau (phân phối tốt tạo điều kiện cho giám đốc, giám đốc tốt đảm bảo phân phối đúng mục đích)",
                  "Chức năng phân phối quan trọng hơn chức năng giám đốc",
                  "Chức năng giám đốc là cơ sở của chức năng phân phối"
                ],
                correctAnswer: "Hai chức năng tồn tại song song, ràng buộc và hỗ trợ lẫn nhau (phân phối tốt tạo điều kiện cho giám đốc, giám đốc tốt đảm bảo phân phối đúng mục đích)"
            },
            { id: "f1r6q23", questionText: "Hệ thống tài chính (Financial System) bao gồm những bộ phận cơ bản nào theo sơ đồ ở slide 69?",
                options: [
                  "Chỉ có Ngân hàng và Thị trường chứng khoán",
                  "Chỉ có Tài chính công và Tài chính doanh nghiệp",
                  "Tài chính DN, Ngân sách NN, Tài chính các TCTC trung gian & TTTC, Tài chính hộ gia đình & tổ chức XH, Tài chính quốc tế (Đối ngoại)",
                  "Ngân hàng Trung ương, Ngân hàng Thương mại, Công ty bảo hiểm"
                ],
                correctAnswer: "Tài chính DN, Ngân sách NN, Tài chính các TCTC trung gian & TTTC, Tài chính hộ gia đình & tổ chức XH, Tài chính quốc tế (Đối ngoại)"
            },
            { id: "f1r6q24", questionText: "Chức năng cơ bản của hệ thống tài chính là gì",
                options: [
                  "In tiền và điều tiết lãi suất",
                  "Cung cấp hệ thống thanh toán, Chu chuyển vốn, Chuyển giao rủi ro, Giám sát và nâng cao hiệu quả sử dụng vốn",
                  "Thu thuế và chi tiêu ngân sách",
                  "Sản xuất hàng hóa và cung cấp dịch vụ"
                ],
                correctAnswer: "Cung cấp hệ thống thanh toán, Chu chuyển vốn, Chuyển giao rủi ro, Giám sát và nâng cao hiệu quả sử dụng vốn"
            },
            { id: "f1r6q25", questionText: "Trong dòng chu chuyển vốn của hệ thống tài chính, các doanh nghiệp thường đóng vai trò chủ yếu là gì",
                options: [
                  "Người cung ứng vốn (tiết kiệm)",
                  "Người cần vốn (vay để đầu tư, sản xuất kinh doanh)",
                  "Trung gian tài chính",
                  "Cơ quan điều tiết thị trường"
                ],
                correctAnswer: "Người cần vốn (vay để đầu tư, sản xuất kinh doanh)"
            }
        ], reward: { xp: 200, goldRange: [250, 350] } }
];

const floor2Data = [
    null,
    { roomNumber: 1, 
        type: 'encounter', 
        arenaBackground: 'images/arena_backgrounds/library_arena.png', 
        questionsToComplete: 10, 
        monsterId: 'paper_spirit', 
        questionsInRoom: [
            { id: "f2r1q1", questionText: "Thị trường tài chính (TTTC) là nơi diễn ra hoạt động gì",
                options: [
                  "Mua bán hàng hóa vật chất",
                  "Trao đổi, mua bán quyền sử dụng các nguồn tài chính thông qua công cụ và phương thức nhất định",
                  "Sản xuất và phân phối hàng hóa",
                  "Cung cấp dịch vụ lao động"
                ],
                correctAnswer: "Trao đổi, mua bán quyền sử dụng các nguồn tài chính thông qua công cụ và phương thức nhất định"
            },
            { id: "f2r1q2", questionText: "Công cụ tài chính được định nghĩa là gì",
                options: [
                  "Một loại tài sản hữu hình có giá trị cao",
                  "Một phương tiện thanh toán quốc tế",
                  "Một loại hợp đồng tạo ra tài sản tài chính cho bên này và nghĩa vụ tài chính cho bên kia",
                  "Một quỹ tiền tệ do nhà nước quản lý"
                ],
                correctAnswer: "Một loại hợp đồng tạo ra tài sản tài chính cho bên này và nghĩa vụ tài chính cho bên kia"
            },
            { id: "f2r1q3", questionText: "Ví dụ nào sau đây là công cụ tài chính",
                options: [
                  "Máy móc, thiết bị",
                  "Cổ phiếu, trái phiếu, khoản vay",
                  "Nhà xưởng, đất đai",
                  "Bằng phát minh, sáng chế"
                ],
                correctAnswer: "Cổ phiếu, trái phiếu, khoản vay"
            },
            { id: "f2r1q4", questionText: "Tài sản tài chính có đặc điểm gì",
                options: [
                  "Luôn có hình thái vật chất cụ thể",
                  "Có tính thanh khoản và giá trị đến từ quyền ghi trên hợp đồng hoặc quyền sở hữu",
                  "Chỉ do Nhà nước phát hành",
                  "Không có rủi ro"
                ],
                correctAnswer: "Có tính thanh khoản và giá trị đến từ quyền ghi trên hợp đồng hoặc quyền sở hữu"
            },
            { id: "f2r1q5", questionText: "Chứng khoán khác với tài sản tài chính nói chung ở điểm nào",
                options: [
                  "Chứng khoán luôn có lãi suất cố định",
                  "Chứng khoán chỉ bao gồm cổ phiếu",
                  "Chứng khoán là tài sản tài chính có thể giao dịch được",
                  "Chứng khoán không có tính thanh khoản"
                ],
                correctAnswer: "Chứng khoán là tài sản tài chính có thể giao dịch được"
            },
            { id: "f2r1q6", questionText: "Thị trường tài chính là nơi diễn ra việc trao đổi mua bán chủ yếu cái gì",
                options: [
                  "Các tài sản hữu hình",
                  "Các công cụ tài chính/chứng khoán",
                  "Các dịch vụ phi tài chính",
                  "Các loại ngoại tệ"
                ],
                correctAnswer: "Các công cụ tài chính/chứng khoán"
            },
            { id: "f2r1q7", questionText: "Dòng vốn đi từ người cho vay đến người đi vay thông qua việc mua bán chứng khoán trực tiếp được gọi là gì",
                options: [
                  "Tài chính công",
                  "Tài chính doanh nghiệp",
                  "Tài chính trực tiếp (Direct Finance)",
                  "Tài chính gián tiếp (Indirect Finance)"
                ],
                correctAnswer: "Tài chính trực tiếp (Direct Finance)"
            },
            { id: "f2r1q8", questionText: "Khi vốn được chuyển từ người cho vay đến người đi vay thông qua các trung gian tài chính (như ngân hàng), đó là hình thức gì",
                options: [
                  "Tài chính trực tiếp",
                  "Tài chính gián tiếp (Indirect Finance)",
                  "Thị trường sơ cấp",
                  "Thị trường OTC"
                ],
                correctAnswer: "Tài chính gián tiếp (Indirect Finance)"
            },
            { id: "f2r1q9", questionText: "Trong tài chính trực tiếp, chứng khoán đóng vai trò gì đối với người mua và người phát hành",
                options: [
                  "Tài sản nợ với người mua, tài sản có với người phát hành",
                  "Tài sản có với người mua, tài sản nợ với người phát hành",
                  "Đều là tài sản có cho cả hai bên",
                  "Đều là tài sản nợ cho cả hai bên"
                ],
                correctAnswer: "Tài sản có với người mua, tài sản nợ với người phát hành"
            },
            { id: "f2r1q10", questionText: "Chủ thể nào thường đóng vai trò là người đi vay chủ yếu trên thị trường tài chính để bù đắp thiếu hụt NSNN",
                options: [
                  "Chính phủ",
                  "Hộ gia đình",
                  "Các công ty bảo hiểm",
                  "Các quỹ đầu tư"
                ],
                correctAnswer: "Chính phủ"
            }
        ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 2, 
        type: 'puzzle', 
        questionsToComplete: 5, 
        questionsInRoom: [
            { id: "f2r2q1", questionText: "Các công ty huy động vốn trên thị trường tài chính chủ yếu thông qua hình thức nào",
                options: [
                  "Chỉ vay ngân hàng",
                  "Chỉ phát hành trái phiếu",
                  "Phát hành cổ phiếu và trái phiếu (bên cạnh các nguồn khác)",
                  "Chỉ nhận vốn góp từ chủ sở hữu"
                ],
                correctAnswer: "Phát hành cổ phiếu và trái phiếu (bên cạnh các nguồn khác)"
            },
            { id: "f2r2q2", questionText: "Hộ gia đình tham gia thị trường tài chính với vai trò nào là chủ yếu",
                options: [
                  "Người đi vay chính",
                  "Người cho vay/đầu tư (thường thông qua ngân hàng)",
                  "Trung gian tài chính",
                  "Nhà tạo lập thị trường"
                ],
                correctAnswer: "Người cho vay/đầu tư (thường thông qua ngân hàng)"
            },
            { id: "f2r2q3", questionText: "Các công ty bảo hiểm tham gia thị trường tài chính chủ yếu với vai trò gì",
                options: [
                  "Đi vay ngắn hạn",
                  "Cho vay/đầu tư (chủ yếu dài hạn từ nguồn phí bảo hiểm nhàn rỗi)",
                  "Phát hành cổ phiếu",
                  "Môi giới chứng khoán"
                ],
                correctAnswer: "Cho vay/đầu tư (chủ yếu dài hạn từ nguồn phí bảo hiểm nhàn rỗi)"
            },
            { id: "f2r2q4", questionText: "Chức năng cơ bản nhất của thị trường tài chính là gì",
                options: [
                  "In tiền và điều tiết lưu thông",
                  "Dẫn nguồn tài chính (luân chuyển vốn từ nơi thừa đến nơi thiếu, biến tiết kiệm thành đầu tư)",
                  "Ấn định giá cả hàng hóa",
                  "Thu thuế cho nhà nước"
                ],
                correctAnswer: "Dẫn nguồn tài chính (luân chuyển vốn từ nơi thừa đến nơi thiếu, biến tiết kiệm thành đầu tư)"
            },
            { id: "f2r2q5", questionText: "Việc thị trường tài chính giúp mua bán dễ dàng các công cụ tài chính thể hiện chức năng nào",
                options: [
                  "Chức năng dẫn vốn",
                  "Cung cấp khả năng thanh khoản cho các chứng khoán",
                  "Cung cấp thông tin",
                  "Ổn định giá cả"
                ],
                correctAnswer: "Cung cấp khả năng thanh khoản cho các chứng khoán"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 } 
    },
    
    { roomNumber: 3, 
        type: 'encounter', 
        questionsToComplete: 10, 
        monsterId: 'lit_spider', 
        numMonsters: 2, 
        questionsInRoom: [
            { id: "f2r3q1", questionText: "Giá cả các chứng khoán hình thành trên thị trường tài chính phản ánh điều gì",
                options: [
                  "Chi phí sản xuất của doanh nghiệp",
                  "Mức lương trung bình của người lao động",
                  "Thông tin kinh tế và giá trị (kỳ vọng) của doanh nghiệp phát hành",
                  "Tỷ lệ lạm phát dự kiến"
                ],
                correctAnswer: "Thông tin kinh tế và giá trị (kỳ vọng) của doanh nghiệp phát hành"
            },
            { id: "f2r3q2", questionText: "Điểm khác biệt cơ bản về 'hàng hóa' giữa thị trường tài chính và thị trường hàng hóa thông thường là gì",
                options: [
                  "Hàng hóa TTTC luôn hữu hình",
                  "Hàng hóa TTTC là các quyền đối với thu nhập/tài sản trong tương lai (công cụ tài chính), không phải hàng hóa tiêu dùng trực tiếp",
                  "Hàng hóa TTTC có giá cố định",
                  "Hàng hóa TTTC chỉ do nhà nước cung cấp"
                ],
                correctAnswer: "Hàng hóa TTTC là các quyền đối với thu nhập/tài sản trong tương lai (công cụ tài chính), không phải hàng hóa tiêu dùng trực tiếp"
            },
            { id: "f2r3q3", questionText: "Căn cứ vào công cụ tài chính hay phương thức huy động vốn, TTTC được chia thành",
                options: [
                  "Thị trường sơ cấp và thứ cấp",
                  "Thị trường tiền tệ và thị trường vốn",
                  "Thị trường nợ và thị trường vốn cổ phần",
                  "Thị trường tập trung và phi tập trung"
                ],
                correctAnswer: "Thị trường nợ và thị trường vốn cổ phần"
            },
            { id: "f2r3q4", questionText: "Thị trường nợ là nơi diễn ra việc mua bán cái gì",
                options: [
                  "Các công cụ nợ (trái phiếu, thương phiếu, chứng chỉ tiền gửi...)",
                  "Chỉ có cổ phiếu",
                  "Các hợp đồng tương lai",
                  "Ngoại hối"
                ],
                correctAnswer: "Các công cụ nợ (trái phiếu, thương phiếu, chứng chỉ tiền gửi...)"
            },
            { id: "f2r3q5", questionText: "Thị trường vốn cổ phần là nơi giao dịch loại công cụ nào",
                options: [
                  "Trái phiếu chính phủ",
                  "Chứng chỉ tiền gửi",
                  "Cổ phiếu",
                  "Hối phiếu"
                ],
                correctAnswer: "Cổ phiếu"
            },
            { id: "f2r3q6", questionText: "Căn cứ vào sự luân chuyển các nguồn vốn, TTTC được chia thành",
                options: [
                  "Thị trường sơ cấp và thị trường thứ cấp",
                  "Thị trường nợ và thị trường vốn cổ phần",
                  "Thị trường tiền tệ và thị trường vốn",
                  "Thị trường trong nước và quốc tế"
                ],
                correctAnswer: "Thị trường sơ cấp và thị trường thứ cấp"
            },
            { id: "f2r3q7", questionText: "Thị trường sơ cấp (cấp 1) là nơi diễn ra hoạt động gì",
                options: [
                  "Mua bán lại các chứng khoán đã phát hành",
                  "Mua bán chứng khoán lần đầu được phát hành (chứng khoán mới)",
                  "Giao dịch các công cụ phái sinh",
                  "Cho vay giữa các ngân hàng"
                ],
                correctAnswer: "Mua bán chứng khoán lần đầu được phát hành (chứng khoán mới)"
            },
            { id: "f2r3q8", questionText: "Hoạt động trên thị trường sơ cấp có vai trò gì đối với nền kinh tế",
                options: [
                  "Chỉ làm tăng tính thanh khoản",
                  "Chỉ giúp xác định giá chứng khoán",
                  "Trực tiếp tạo vốn cho tổ chức phát hành (huy động vốn cho đầu tư)",
                  "Không ảnh hưởng đến lượng vốn đầu tư"
                ],
                correctAnswer: "Trực tiếp tạo vốn cho tổ chức phát hành (huy động vốn cho đầu tư)"
            },
            { id: "f2r3q9", questionText: "Thị trường thứ cấp (cấp 2) là nơi",
                options: [
                  "Mua bán lại các chứng khoán đã được phát hành trước đó (chứng khoán cũ)",
                  "Doanh nghiệp phát hành chứng khoán mới",
                  "Ngân hàng trung ương mua bán ngoại tệ",
                  "Các công ty bảo hiểm bán hợp đồng"
                ],
                correctAnswer: "Mua bán lại các chứng khoán đã được phát hành trước đó (chứng khoán cũ)"
            },
            { id: "f2r3q10", questionText: "Chức năng chính của thị trường thứ cấp là gì",
                options: [
                  "Huy động vốn trực tiếp cho doanh nghiệp",
                  "Tạo tính thanh khoản ('lỏng') cho chứng khoán đã phát hành và giúp xác định giá chứng khoán",
                  "Phân phối lợi nhuận cho cổ đông",
                  "Bù đắp thâm hụt ngân sách nhà nước"
                ],
                correctAnswer: "Tạo tính thanh khoản ('lỏng') cho chứng khoán đã phát hành và giúp xác định giá chứng khoán"
            }
        ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 4, 
        type: 'chest', 
        questionsToComplete: 5, 
        questionsInRoom: [
            { id: "f2r4q1", questionText: "Ở Việt Nam, hoạt động phát hành chứng khoán sơ cấp chịu sự quản lý của cơ quan nào",
                options: [
                  "Bộ Tài chính",
                  "Ngân hàng Nhà nước",
                  "Ủy ban Chứng khoán Nhà nước",
                  "Sở Giao dịch Chứng khoán"
                ],
                correctAnswer: "Ủy ban Chứng khoán Nhà nước"
            },
            { id: "f2r4q2", questionText: "Căn cứ vào cấu trúc thị trường, TTTC được chia thành",
                options: [
                  "Thị trường sơ cấp và thứ cấp",
                  "Thị trường nợ và vốn cổ phần",
                  "Thị trường tiền tệ và vốn",
                  "Thị trường tập trung và phi tập trung (OTC)"
                ],
                correctAnswer: "Thị trường tập trung và phi tập trung (OTC)"
            },
            { id: "f2r4q3", questionText: "Thị trường tập trung có đặc điểm gì",
                options: [
                  "Giao dịch diễn ra mọi lúc, mọi nơi",
                  "Giao dịch qua thương lượng trực tiếp",
                  "Giao dịch diễn ra tại một địa điểm cụ thể (Sở giao dịch), theo phương thức khớp lệnh",
                  "Không có sự quản lý của nhà nước"
                ],
                correctAnswer: "Giao dịch diễn ra tại một địa điểm cụ thể (Sở giao dịch), theo phương thức khớp lệnh"
            },
            { id: "f2r4q4", questionText: "Thị trường phi tập trung (OTC - Over the counter) có đặc điểm gì",
                options: [
                  "Mua bán bên ngoài Sở giao dịch, không có địa điểm tập trung, giao dịch qua thương lượng, thỏa thuận",
                  "Chỉ giao dịch trái phiếu",
                  "Luôn thực hiện khớp lệnh tự động",
                  "Chỉ dành cho nhà đầu tư tổ chức"
                ],
                correctAnswer: "Mua bán bên ngoài Sở giao dịch, không có địa điểm tập trung, giao dịch qua thương lượng, thỏa thuận"
            },
            { id: "f2r4q5", questionText: "Căn cứ vào thời gian sử dụng các nguồn tài chính (kỳ hạn công cụ), TTTC được chia thành",
                options: [
                  "Thị trường sơ cấp và thứ cấp",
                  "Thị trường tập trung và phi tập trung",
                  "Thị trường tiền tệ và thị trường vốn",
                  "Thị trường nợ và thị trường vốn cổ phần"
                ],
                correctAnswer: "Thị trường tiền tệ và thị trường vốn"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 }
    },

    { roomNumber: 5, 
        type: 'safe_room',
    },
    
    { roomNumber: 6, 
        type: 'boss', 
        questionsToComplete: 20, 
        monsterId: 'ghost_librarian', 
        questionsInRoom: [
            { id: "f2r6q1", questionText: "Thị trường tiền tệ là nơi giao dịch các công cụ tài chính có đặc điểm gì",
                options: [
                  "Chỉ là cổ phiếu",
                  "Kỳ hạn dài (trên 1 năm)",
                  "Kỳ hạn ngắn (dưới 1 năm)",
                  "Không có tính thanh khoản"
                ],
                correctAnswer: "Kỳ hạn ngắn (dưới 1 năm)"
            },
            { id: "f2r6q2", questionText: "Công cụ trên thị trường tiền tệ thường có đặc điểm nào về tính 'lỏng' và rủi ro biến động giá",
                options: [
                  "Tính 'lỏng' cao, biến động giá (rủi ro) thấp",
                  "Tính 'lỏng' thấp, biến động giá (rủi ro) cao",
                  "Tính 'lỏng' cao, biến động giá (rủi ro) cao",
                  "Tính 'lỏng' thấp, biến động giá (rủi ro) thấp"
                ],
                correctAnswer: "Tính 'lỏng' cao, biến động giá (rủi ro) thấp"
            },
            { id: "f2r6q3", questionText: "Thị trường vốn là nơi giao dịch các công cụ tài chính nào",
                options: [
                  "Chỉ có tín phiếu kho bạc",
                  "Công cụ ngắn hạn (dưới 1 năm)",
                  "Công cụ nợ dài hạn và cổ phiếu",
                  "Chỉ có tiền mặt"
                ],
                correctAnswer: "Công cụ nợ dài hạn và cổ phiếu"
            },
            { id: "f2r6q4", questionText: "Ví dụ nào sau đây KHÔNG phải là công cụ của thị trường tiền tệ",
                options: [
                  "Tín phiếu kho bạc",
                  "Chứng chỉ tiền gửi",
                  "Thương phiếu",
                  "Cổ phiếu"
                ],
                correctAnswer: "Cổ phiếu"
            },
            { id: "f2r6q5", questionText: "Tín phiếu kho bạc (Treasury bills) là công cụ vay nợ ngắn hạn do chủ thể nào phát hành",
                options: [
                  "Doanh nghiệp lớn",
                  "Ngân hàng thương mại",
                  "Chính phủ",
                  "Hộ gia đình"
                ],
                correctAnswer: "Chính phủ"
            },
            { id: "f2r6q6", questionText: "Chứng chỉ tiền gửi (CD - Certificate of Deposit) là công cụ vay nợ do ai phát hành",
                options: [
                  "Chính phủ",
                  "Ngân hàng thương mại (bán cho người gửi tiền)",
                  "Công ty chứng khoán",
                  "Quỹ đầu tư"
                ],
                correctAnswer: "Ngân hàng thương mại (bán cho người gửi tiền)"
            },
            { id: "f2r6q7", questionText: "Thương phiếu (Commercial Paper) phát sinh trong quan hệ nào",
                options: [
                  "Mua bán trả chậm (ghi nợ) giữa các doanh nghiệp",
                  "Giữa Chính phủ và người dân",
                  "Giữa Ngân hàng và khách hàng gửi tiền",
                  "Giữa các Ngân hàng với nhau"
                ],
                correctAnswer: "Mua bán trả chậm (ghi nợ) giữa các doanh nghiệp"
            },
            { id: "f2r6q8", questionText: "Hối phiếu được ngân hàng chấp nhận (Banker's Acceptance) là gì",
                options: [
                  "Một loại cổ phiếu ưu đãi",
                  "Giấy chứng nhận tiền gửi",
                  "Một hối phiếu (lệnh trả tiền) do công ty phát hành được ngân hàng bảo đảm thanh toán",
                  "Trái phiếu do ngân hàng phát hành"
                ],
                correctAnswer: "Một hối phiếu (lệnh trả tiền) do công ty phát hành được ngân hàng bảo đảm thanh toán"
            },
            { id: "f2r6q9", questionText: "Công cụ nào sau đây thuộc thị trường vốn",
                options: [
                  "Tín phiếu kho bạc",
                  "Chứng chỉ tiền gửi",
                  "Cổ phiếu, Trái phiếu công ty, Vay thế chấp",
                  "Thương phiếu"
                ],
                correctAnswer: "Cổ phiếu, Trái phiếu công ty, Vay thế chấp"
            },
            { id: "f2r6q10", questionText: "Cổ phiếu (Stocks) chứng thực quyền gì của người nắm giữ",
                options: [
                  "Quyền sở hữu một phần công ty và quyền được chia cổ tức",
                  "Quyền đòi nợ đối với công ty",
                  "Quyền quản lý trực tiếp công ty",
                  "Quyền nhận lãi suất cố định"
                ],
                correctAnswer: "Quyền sở hữu một phần công ty và quyền được chia cổ tức"
            },
            { id: "f2r6q11", questionText: "Sự khác biệt chính giữa cổ phiếu thông thường và cổ phiếu ưu đãi cổ tức là gì",
                options: [
                  "Cổ phiếu ưu đãi luôn có quyền biểu quyết cao hơn",
                  "Cổ phiếu ưu đãi nhận cổ tức cố định, thường không có quyền biểu quyết; cổ phiếu thường nhận cổ tức không cố định, có quyền biểu quyết",
                  "Cổ phiếu thường có độ rủi ro thấp hơn",
                  "Chỉ có cổ phiếu thường được giao dịch trên thị trường"
                ],
                correctAnswer: "Cổ phiếu ưu đãi nhận cổ tức cố định, thường không có quyền biểu quyết; cổ phiếu thường nhận cổ tức không cố định, có quyền biểu quyết"
            },
            { id: "f2r6q12", questionText: "Vay thế chấp (Mortgage) thường liên quan đến việc tài trợ cho cái gì và tài sản đảm bảo là gì",
                options: [
                  "Đầu tư vào bất động sản (công trình xây dựng), tài sản đảm bảo là chính bất động sản đó",
                  "Mua sắm hàng tiêu dùng, tài sản đảm bảo là hàng hóa",
                  "Hoạt động xuất nhập khẩu, tài sản đảm bảo là hối phiếu",
                  "Đầu tư chứng khoán, tài sản đảm bảo là cổ phiếu"
                ],
                correctAnswer: "Đầu tư vào bất động sản (công trình xây dựng), tài sản đảm bảo là chính bất động sản đó"
            },
            { id: "f2r6q13", questionText: "Trái phiếu công ty (Corporate Bonds) là công cụ để doanh nghiệp làm gì",
                options: [
                  "Huy động vốn chủ sở hữu",
                  "Huy động vốn vay dài hạn",
                  "Trả cổ tức cho cổ đông",
                  "Mua lại cổ phiếu quỹ"
                ],
                correctAnswer: "Huy động vốn vay dài hạn"
            },
            { id: "f2r6q14", questionText: "Mệnh giá (Par Value) của cổ phiếu là gì",
                options: [
                  "Giá trị danh nghĩa được ghi trên cổ phiếu, do công ty phát hành ấn định",
                  "Giá trị thị trường của cổ phiếu tại một thời điểm",
                  "Giá trị sổ sách của cổ phiếu",
                  "Giá trị thanh lý của cổ phiếu"
                ],
                correctAnswer: "Giá trị danh nghĩa được ghi trên cổ phiếu, do công ty phát hành ấn định"
            },
            { id: "f2r6q15",  questionText: "Thị giá (Market Value) của cổ phiếu được xác định bởi yếu tố nào",
                options: [
                  "Chỉ bởi mệnh giá",
                  "Chỉ bởi quyết định của công ty",
                  "Quan hệ cung cầu trên thị trường chứng khoán",
                  "Lãi suất ngân hàng"
                ],
                correctAnswer: "Quan hệ cung cầu trên thị trường chứng khoán"
            },
            { id: "f2r6q16", questionText: "Điều kiện nào là cần thiết để TTTC hình thành và phát triển",
                options: [
                  "Nền kinh tế tự cung tự cấp",
                  "Kinh tế hàng hóa phát triển, tiền tệ ổn định, công cụ đa dạng, hệ thống trung gian phát triển, pháp luật hoàn thiện, hạ tầng kỹ thuật tốt, nhà đầu tư có kiến thức",
                  "Chỉ cần có Ngân hàng Trung ương",
                  "Lạm phát phi mã"
                ],
                correctAnswer: "Kinh tế hàng hóa phát triển, tiền tệ ổn định, công cụ đa dạng, hệ thống trung gian phát triển, pháp luật hoàn thiện, hạ tầng kỹ thuật tốt, nhà đầu tư có kiến thức"
            },
            { id: "f2r6q17", questionText: "Thông tin phi đối xứng (Asymmetric Information) trên TTTC có thể dẫn đến vấn đề gì (đề cập trong điều kiện hình thành TTTC - slide 34)?",
                options: [
                  "Lựa chọn đối nghịch (trước giao dịch) và Rủi ro đạo đức (sau giao dịch)",
                  "Hạn chế thông tin phi đối xứng (lựa chọn đối nghịch) và Hạn chế rủi ro đạo đức là vai trò của trung gian tài chính (Đây là hàm ý khi nói về vai trò TGTC hạn chế vấn đề này)",
                  "Luôn dẫn đến lợi nhuận cao cho nhà đầu tư",
                  "Giúp thị trường hoạt động hiệu quả hơn"
                ],
                correctAnswer: "Hạn chế thông tin phi đối xứng (lựa chọn đối nghịch) và Hạn chế rủi ro đạo đức là vai trò của trung gian tài chính (Đây là hàm ý khi nói về vai trò TGTC hạn chế vấn đề này)"
            },
            { id: "f2r6q18", questionText: "Hệ thống pháp luật và tổ chức quản lý nhà nước đóng vai trò gì đối với TTTC",
                options: [
                  "Tạo hành lang pháp lý an toàn, minh bạch, bảo vệ nhà đầu tư, đảm bảo sự ổn định cho thị trường",
                  "Trực tiếp định giá chứng khoán",
                  "Cung cấp vốn cho thị trường",
                  "Loại bỏ hoàn toàn rủi ro"
                ],
                correctAnswer: "Tạo hành lang pháp lý an toàn, minh bạch, bảo vệ nhà đầu tư, đảm bảo sự ổn định cho thị trường"
            },
            { id: "f2r6q19", questionText: "Yếu tố nào KHÔNG phải là công cụ trên thị trường VỐN",
                options: [
                  "Cổ phiếu",
                  "Trái phiếu công ty dài hạn",
                  "Vay thế chấp",
                  "Tín phiếu kho bạc (là công cụ thị trường tiền tệ)"
                ],
                correctAnswer: "Tín phiếu kho bạc (là công cụ thị trường tiền tệ)"
            },
            { id: "f2r6q20", questionText: "Thị trường nào đóng vai trò cung cấp tính thanh khoản cho các chứng khoán đã được phát hành trên thị trường sơ cấp?",
                options: [
                  "Thị trường tiền tệ",
                  "Thị trường sơ cấp",
                  "Thị trường thứ cấp",
                  "Thị trường OTC (OTC cũng là thứ cấp, nhưng câu hỏi nhấn mạnh vai trò thanh khoản chung)"
                ],
                correctAnswer: "Thị trường thứ cấp"
            }
        ], 
        reward: { xp: 200, goldRange: [250, 350] } }
];

const floor3Data = [
    null,
    { roomNumber: 1, 
        type: 'encounter',
        arenaBackground: 'images/arena_backgrounds/lab_arena.png', 
        questionsToComplete: 10, 
        monsterId: 'lab_golem', 
        questionsInRoom: [
            { id: "f3r1q1", questionText: "Theo K. Marx, bản chất của lạm phát là gì",
                options: [
                  "Sự tăng giá chung của hàng hóa",
                  "Việc tràn đầy các kênh lưu thông những tờ giấy bạc thừa, dẫn đến giá cả tăng vọt",
                  "Hiện tượng kinh tế xã hội thông thường",
                  "Sự mất giá của tiền tệ"
                ],
                correctAnswer: "Việc tràn đầy các kênh lưu thông những tờ giấy bạc thừa, dẫn đến giá cả tăng vọt"
            },
            { id: "f3r1q2", questionText: "Định nghĩa lạm phát phổ biến nhất là gì (tổng hợp từ Slide 4)?",
                options: [
                  "Hiện tượng mức giá chung của hàng hóa và dịch vụ tăng lên liên tục trong một thời gian dài",
                  "Sự tăng giá của một vài mặt hàng thiết yếu",
                  "Việc Ngân hàng Trung ương in quá nhiều tiền",
                  "Sự sụt giảm giá trị của đồng nội tệ so với ngoại tệ"
                ],
                correctAnswer: "Hiện tượng mức giá chung của hàng hóa và dịch vụ tăng lên liên tục trong một thời gian dài"
            },
            { id: "f3r1q3", questionText: "Biểu hiện nào KHÔNG phải là của lạm phát",
                options: [
                  "Sự gia tăng giá cả hàng hóa, dịch vụ đồng loạt",
                  "Tỷ giá hối đoái (ngoại tệ/nội tệ) tăng cao",
                  "Giá cả các loại chứng khoán sụt giảm (do nhà đầu tư tìm đến tài sản thực)",
                  "Tiền trở nên khan hiếm hơn mọi thứ khác (Ngược lại, tiền thừa và mất giá)"
                ],
                correctAnswer: "Tiền trở nên khan hiếm hơn mọi thứ khác (Ngược lại, tiền thừa và mất giá)"
            },
            { id: "f3r1q4", questionText: "Xét về mặt định lượng, lạm phát một con số (dưới 10%/năm) còn được gọi là gì",
                options: [
                  "Lạm phát phi mã",
                  "Siêu lạm phát",
                  "Lạm phát vừa phải (ôn hòa)",
                  "Lạm phát đình đốn"
                ],
                correctAnswer: "Lạm phát vừa phải (ôn hòa)"
            },
            { id: "f3r1q5", questionText: "Đặc điểm nào KHÔNG thuộc về lạm phát vừa phải (một con số)",
                options: [
                  "Giá cả tăng chậm, ít biến động",
                  "Đồng tiền giữ được giá trị tương đối",
                  "Kế hoạch kinh tế tương đối ổn định",
                  "Người dân tìm cách tích trữ hàng hóa, vàng, ngoại tệ thay vì giữ tiền mặt"
                ],
                correctAnswer: "Người dân tìm cách tích trữ hàng hóa, vàng, ngoại tệ thay vì giữ tiền mặt"
            },
            { id: "f3r1q6", questionText: "Lạm phát phi mã có mức tăng giá nằm trong khoảng nào",
                options: [
                  "Dưới 10%/năm",
                  "Từ 10% đến dưới 1000%/năm (hai hoặc ba con số)",
                  "Trên 1000%/năm",
                  "Luôn ở mức âm"
                ],
                correctAnswer: "Từ 10% đến dưới 1000%/năm (hai hoặc ba con số)"
            },
            { id: "f3r1q7", questionText: "Hậu quả của lạm phát phi mã là gì",
                options: [
                  "Kinh tế phát triển ổn định",
                  "Đồng tiền mất giá nhanh chóng, người dân tránh giữ tiền mặt, lãi suất danh nghĩa rất cao, kinh tế biến dạng nghiêm trọng",
                  "Lãi suất thực tế luôn dương",
                  "Các hợp đồng thường được tính bằng nội tệ"
                ],
                correctAnswer: "Đồng tiền mất giá nhanh chóng, người dân tránh giữ tiền mặt, lãi suất danh nghĩa rất cao, kinh tế biến dạng nghiêm trọng"
            },
            { id: "f3r1q8", questionText: "Siêu lạm phát có đặc điểm nổi bật nào",
                options: [
                  "Giá cả tăng chậm",
                  "Giá cả hỗn loạn, tăng nhanh chóng (thường trên 1000%/năm), mọi thứ khan hiếm trừ tiền, kinh tế suy sụp",
                  "Chỉ xảy ra ở các nước phát triển",
                  "Luôn đi kèm với tăng trưởng kinh tế cao"
                ],
                correctAnswer: "Giá cả hỗn loạn, tăng nhanh chóng (thường trên 1000%/năm), mọi thứ khan hiếm trừ tiền, kinh tế suy sụp"
            },
            { id: "f3r1q9", questionText: "Siêu lạm phát thường xảy ra trong bối cảnh nào",
                options: [
                  "Kinh tế tăng trưởng ổn định",
                  "Thời kỳ hòa bình kéo dài",
                  "Trong và sau chiến tranh hoặc khủng hoảng chính trị - kinh tế nghiêm trọng",
                  "Do chính sách tiền tệ thắt chặt"
                ],
                correctAnswer: "Trong và sau chiến tranh hoặc khủng hoảng chính trị - kinh tế nghiêm trọng"
            },
            { id: "f3r1q10", questionText: "Lạm phát cân bằng là gì",
                options: [
                  "Lạm phát ở mức 0%",
                  "Lạm phát tăng tương ứng với thu nhập thực tế, phù hợp với hoạt động sản xuất kinh doanh",
                  "Lạm phát xảy ra đột biến",
                  "Lạm phát mà chính phủ không thể dự đoán được"
                ],
                correctAnswer: "Lạm phát tăng tương ứng với thu nhập thực tế, phù hợp với hoạt động sản xuất kinh doanh"
            }
            ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 2, 
        type: 'puzzle', 
        questionsToComplete: 5, 
        questionsInRoom: [
            { id: "f3r2q1", questionText: "Lạm phát dự đoán trước được có đặc điểm gì",
                options: [
                  "Gây sốc cho nền kinh tế",
                  "Xảy ra bất ngờ với tỷ lệ cao",
                  "Xảy ra hàng năm với tỷ lệ ổn định, người dân và doanh nghiệp đã quen và có sự chuẩn bị",
                  "Luôn dẫn đến lãi suất thực âm"
                ],
                correctAnswer: "Xảy ra hàng năm với tỷ lệ ổn định, người dân và doanh nghiệp đã quen và có sự chuẩn bị"
            },
            { id: "f3r2q2", questionText: "Lạm phát bất thường có tác động như thế nào",
                options: [
                  "Ảnh hưởng đến tâm lý, đời sống do người dân chưa kịp thích nghi, gây biến động kinh tế, giảm niềm tin vào chính quyền",
                  "Giúp kinh tế tăng trưởng nhanh hơn",
                  "Không ảnh hưởng đến lãi suất",
                  "Chỉ tác động tích cực"
                ],
                correctAnswer: "Ảnh hưởng đến tâm lý, đời sống do người dân chưa kịp thích nghi, gây biến động kinh tế, giảm niềm tin vào chính quyền"
            },
            { id: "f3r2q3", questionText: "Lạm phát tác động đến lãi suất như thế nào",
                options: [
                  "Lạm phát tăng làm lãi suất thực tăng",
                  "Lạm phát tăng không ảnh hưởng lãi suất danh nghĩa",
                  "Lạm phát tăng buộc ngân hàng tăng lãi suất danh nghĩa để duy trì lãi suất thực ổn định (hoặc dương)",
                  "Lạm phát tăng luôn làm lãi suất danh nghĩa giảm"
                ],
                correctAnswer: "Lạm phát tăng buộc ngân hàng tăng lãi suất danh nghĩa để duy trì lãi suất thực ổn định (hoặc dương)"
            },
            { id: "f3r2q4", questionText: "Mối quan hệ giữa lãi suất thực, lãi suất danh nghĩa và tỷ lệ lạm phát được biểu diễn bằng công thức nào (khi lạm phát không quá cao)",
                options: [
                  "LS thực = LS danh nghĩa + Tỷ lệ lạm phát",
                  "LS thực = LS danh nghĩa – Tỷ lệ lạm phát",
                  "LS danh nghĩa = LS thực / Tỷ lệ lạm phát",
                  "LS danh nghĩa = LS thực * Tỷ lệ lạm phát"
                ],
                correctAnswer: "LS thực = LS danh nghĩa – Tỷ lệ lạm phát"
            },
            { id: "f3r2q5", questionText: "Thu nhập thực tế khác thu nhập danh nghĩa như thế nào",
                options: [
                  "Thu nhập thực tế luôn cao hơn thu nhập danh nghĩa",
                  "Thu nhập thực tế là sức mua thực sự của thu nhập danh nghĩa sau khi đã loại trừ ảnh hưởng của lạm phát (và các khoản khấu trừ khác)",
                  "Thu nhập danh nghĩa là thu nhập sau thuế",
                  "Thu nhập thực tế chỉ tính bằng hiện vật"
                ],
                correctAnswer: "Thu nhập thực tế là sức mua thực sự của thu nhập danh nghĩa sau khi đã loại trừ ảnh hưởng của lạm phát (và các khoản khấu trừ khác)"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 }
    },

    { roomNumber: 3, 
        type: 'encounter', 
        questionsToComplete: 10, 
        monsterId: 'lab_golem', 
        questionsInRoom: [
            { id: "f3r3q1", questionText: "Khi lạm phát tăng mà thu nhập danh nghĩa không đổi thì thu nhập thực tế sẽ thay đổi như thế nào",
                options: [
                  "Giảm đi",
                  "Tăng lên",
                  "Không đổi",
                  "Biến động không xác định"
                ],
                correctAnswer: "Giảm đi"
            },
            { id: "f3r3q2", questionText: "Trong thời kỳ lạm phát, ai là người thường chịu thiệt và ai được lợi trong quan hệ vay nợ (với lãi suất cố định thấp hơn lạm phát)",
                options: [
                  "Người cho vay chịu thiệt, người đi vay được lợi",
                  "Người đi vay chịu thiệt, người cho vay được lợi",
                  "Cả hai cùng chịu thiệt",
                  "Cả hai cùng có lợi"
                ],
                correctAnswer: "Người cho vay chịu thiệt, người đi vay được lợi"
            },
            { id: "f3r3q3", questionText: "Lạm phát cao có xu hướng dẫn đến hiện tượng gì trong hành vi kinh tế",
                options: [
                  "Người dân tăng cường gửi tiết kiệm",
                  "Doanh nghiệp mở rộng đầu tư dài hạn",
                  "Nạn đầu cơ hàng hóa, bất động sản, ngoại tệ gia tăng",
                  "Lãi suất cho vay giảm mạnh"
                ],
                correctAnswer: "Nạn đầu cơ hàng hóa, bất động sản, ngoại tệ gia tăng"
            },
            { id: "f3r3q4", questionText: "Lạm phát ảnh hưởng đến nợ nước ngoài như thế nào (khi nợ tính bằng ngoại tệ)",
                options: [
                  "Làm giảm gánh nặng nợ nước ngoài tính bằng nội tệ",
                  "Làm tăng gánh nặng nợ nước ngoài tính bằng nội tệ (do nội tệ mất giá)",
                  "Không ảnh hưởng đến nợ nước ngoài",
                  "Giúp chính phủ dễ dàng trả nợ hơn"
                ],
                correctAnswer: "Làm tăng gánh nặng nợ nước ngoài tính bằng nội tệ (do nội tệ mất giá)"
            },
            { id: "f3r3q5", questionText: "Lạm phát do cầu kéo (Demand-Pull Inflation) xảy ra khi nào",
                options: [
                  "Chi phí sản xuất tăng cao",
                  "Cung tiền giảm mạnh",
                  "Tổng cầu tăng nhanh hơn tổng cung (∆D >> ∆S), thường do kinh tế tăng trưởng quá nóng",
                  "Chính phủ tăng thuế"
                ],
                correctAnswer: "Tổng cầu tăng nhanh hơn tổng cung (∆D >> ∆S), thường do kinh tế tăng trưởng quá nóng"
            },
            { id: "f3r3q6", questionText: "Lạm phát do chi phí đẩy (Cost-Push Inflation) có nguyên nhân từ đâu",
                options: [
                  "Sự gia tăng liên tục của các yếu tố chi phí sản xuất (nguyên vật liệu, tiền lương,...)",
                  "Người tiêu dùng chi tiêu quá nhiều",
                  "Xuất khẩu tăng mạnh",
                  "Lãi suất giảm"
                ],
                correctAnswer: "Sự gia tăng liên tục của các yếu tố chi phí sản xuất (nguyên vật liệu, tiền lương,...)"
            },
            { id: "f3r3q7", questionText: "Việc Ngân hàng Trung ương phát hành tiền quá mức để bù đắp bội chi ngân sách có thể gây ra loại lạm phát nào",
                options: [
                  "Lạm phát do cầu kéo",
                  "Lạm phát do chi phí đẩy",
                  "Lạm phát do cung ứng tiền tệ (Lạm phát tiền tệ)",
                  "Giảm phát"
                ],
                correctAnswer: "Lạm phát do cung ứng tiền tệ (Lạm phát tiền tệ)"
            },
            { id: "f3r3q8", questionText: "Mức lạm phát lý tưởng thường được coi là ở mức nào (Thảo luận slide 23)?",
                options: [
                  "0%",
                  "Một mức lạm phát dương, thấp và ổn định (ví dụ: 2-3%), vì 0% hoặc âm có thể gây trì trệ kinh tế",
                  "Trên 10%",
                  "Càng cao càng tốt"
                ],
                correctAnswer: "0%"
            },
            { id: "f3r3q9", questionText: "Chính sách nào sau đây nhằm tác động đến cầu để kiểm soát lạm phát",
                options: [
                  "Kiểm soát chi tiêu ngân sách, điều chỉnh tiền lương",
                  "Cắt giảm chi phí sản xuất",
                  "Giảm lượng tiền cung ứng",
                  "Nâng cao hiệu quả sản xuất"
                ],
                correctAnswer: "Kiểm soát chi tiêu ngân sách, điều chỉnh tiền lương"
            },
            { id: "f3r3q10", questionText: "Chính sách nào sau đây nhằm tác động đến chi phí để kiểm soát lạm phát",
                options: [
                  "Tăng thuế thu nhập",
                  "Nâng cao hiệu quả sản xuất, giảm chi phí đầu vào (nếu có thể)",
                  "Tăng lãi suất",
                  "Bán ngoại tệ"
                ],
                correctAnswer: "Nâng cao hiệu quả sản xuất, giảm chi phí đầu vào (nếu có thể)"
            }
            ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 4, 
        type: 'chest', 
        questionsToComplete: 5, 
        questionsInRoom: [
            { id: "f3r4q1", questionText: "Chính sách nào sau đây nhằm tác động đến cung tiền để kiểm soát lạm phát",
                options: [
                  "Khuyến khích tiêu dùng",
                  "Giảm thuế doanh nghiệp",
                  "Cải cách tiền tệ, giảm lượng tiền giấy trong lưu thông (thông qua các công cụ CSTT)",
                  "Trợ giá hàng hóa"
                ],
                correctAnswer: "Cải cách tiền tệ, giảm lượng tiền giấy trong lưu thông (thông qua các công cụ CSTT)"
            },
            { id: "f3r4q2", questionText: "Biện pháp ngắn hạn nào thường được sử dụng để ổn định tiền tệ khi có lạm phát cao",
                options: [
                  "Chính sách tiền tệ thắt chặt, chính sách tài khóa thắt chặt, đông kết giá cả",
                  "Chính sách tiền tệ mở rộng, chính sách tài khóa mở rộng",
                  "Giảm thuế và tăng chi tiêu",
                  "Phá giá tiền tệ"
                ],
                correctAnswer: "Chính sách tiền tệ thắt chặt, chính sách tài khóa thắt chặt, đông kết giá cả"
            },
            { id: "f3r4q3", questionText: "Chính sách tiền tệ thắt chặt bao gồm những hành động nào",
                options: [
                  "Tăng lãi suất, tăng tỷ lệ dự trữ bắt buộc, bán tín phiếu (hút tiền về)",
                  "Giảm lãi suất, giảm tỷ lệ dự trữ bắt buộc, mua tín phiếu (bơm tiền ra)",
                  "Phát hành thêm tiền mặt",
                  "Giảm thuế cho ngân hàng"
                ],
                correctAnswer: "Tăng lãi suất, tăng tỷ lệ dự trữ bắt buộc, bán tín phiếu (hút tiền về)"
            },
            { id: "f3r4q4", questionText: "Chính sách tài khóa thắt chặt bao gồm những hành động nào",
                options: [
                  "Tăng chi tiêu công, giảm thuế",
                  "Giảm chi tiêu công, kiểm soát chặt chẽ ngân sách, chống lãng phí",
                  "Phát hành thêm trái phiếu chính phủ để chi tiêu",
                  "Trợ cấp cho doanh nghiệp"
                ],
                correctAnswer: "Giảm chi tiêu công, kiểm soát chặt chẽ ngân sách, chống lãng phí"
            },
            { id: "f3r4q5", questionText: "Biện pháp 'Đông kết giá cả' nghĩa là gì",
                options: [
                  "Để giá cả tự do biến động theo thị trường",
                  "Ban hành quy định (sắc lệnh) không cho phép tăng giá một số mặt hàng thiết yếu trong một thời gian",
                  "Trợ giá cho người tiêu dùng",
                  "Đo lường chỉ số giá tiêu dùng"
                ],
                correctAnswer: "Ban hành quy định (sắc lệnh) không cho phép tăng giá một số mặt hàng thiết yếu trong một thời gian"
            }
        ],
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 }
    },

    { roomNumber: 5, 
        type: 'safe_room', 
    },

    { roomNumber: 6, 
        type: 'boss', 
        questionsToComplete: 20, 
        monsterId: 'energy_crystal', 
        questionsInRoom: [
            { id: "f3r6q1", questionText: "Biện pháp dài hạn nào giúp ổn định tiền tệ và kiểm soát lạm phát",
                options: [
                  "Chỉ tập trung vào chính sách tiền tệ thắt chặt",
                  "Nâng cao năng lực cạnh tranh, đảm bảo an ninh lương thực, tăng cường dự báo, phòng chống thiên tai, dịch bệnh (các yếu tố nền tảng)",
                  "Liên tục phá giá đồng tiền",
                  "Đóng cửa biên giới, hạn chế thương mại"
                ],
                correctAnswer: "Nâng cao năng lực cạnh tranh, đảm bảo an ninh lương thực, tăng cường dự báo, phòng chống thiên tai, dịch bệnh (các yếu tố nền tảng)"
            },
            { id: "f3r6q2", questionText: "Tín dụng (Credit) được định nghĩa là gì",
                options: [
                  "Việc trao đổi hàng hóa lấy tiền mặt",
                  "Việc đầu tư vào thị trường chứng khoán",
                  "Sự chuyển nhượng quyền sử dụng vốn từ người sở hữu sang người sử dụng trong một thời gian nhất định với một khoản phí (lợi tức)",
                  "Hoạt động gửi tiền tiết kiệm tại ngân hàng"
                ],
                correctAnswer: "Sự chuyển nhượng quyền sử dụng vốn từ người sở hữu sang người sử dụng trong một thời gian nhất định với một khoản phí (lợi tức)"
            },
            { id: "f3r6q3", questionText: "Đặc điểm cơ bản của quan hệ tín dụng là gì",
                options: [
                  "Chuyển giao quyền sở hữu vốn",
                  "Chỉ chuyển giao quyền sử dụng vốn, có thời hạn, có hoàn trả và thường kèm theo lợi tức",
                  "Không có thời hạn xác định",
                  "Không phát sinh chi phí"
                ],
                correctAnswer: "Chỉ chuyển giao quyền sử dụng vốn, có thời hạn, có hoàn trả và thường kèm theo lợi tức"
            },
            { id: "f3r6q4", questionText: "Căn cứ vào thời hạn, tín dụng được phân thành mấy loại chính",
                options: [
                  "Ngắn hạn, trung hạn, dài hạn (3 loại)",
                  "Sản xuất và tiêu dùng (2 loại)",
                  "Thương mại và ngân hàng (2 loại)",
                  "Có đảm bảo và không đảm bảo (2 loại)"
                ],
                correctAnswer: "Ngắn hạn, trung hạn, dài hạn (3 loại)"
            },
            { id: "f3r6q5", questionText: "Tín dụng tiêu dùng là loại tín dụng nhằm mục đích gì",
                options: [
                  "Tài trợ cho hoạt động sản xuất kinh doanh",
                  "Tài trợ cho nhu cầu mua sắm, chi tiêu của cá nhân, hộ gia đình",
                  "Bù đắp thiếu hụt ngân sách nhà nước",
                  "Cho vay giữa các ngân hàng"
                ],
                correctAnswer: "Tài trợ cho nhu cầu mua sắm, chi tiêu của cá nhân, hộ gia đình"
            },
            { id: "f3r6q6", questionText: "Căn cứ vào chủ thể tham gia, có các hình thức tín dụng nào",
                options: [
                  "Ngắn hạn, trung hạn, dài hạn",
                  "Vốn lưu động, vốn cố định",
                  "Tín dụng thương mại, tín dụng ngân hàng, tín dụng nhà nước",
                  "Có đảm bảo, không đảm bảo"
                ],
                correctAnswer: "Tín dụng thương mại, tín dụng ngân hàng, tín dụng nhà nước"
            },
            { id: "f3r6q7", questionText: "Tín dụng thương mại là quan hệ tín dụng giữa ai với ai",
                options: [
                  "Giữa ngân hàng và doanh nghiệp",
                  "Giữa nhà nước và người dân",
                  "Giữa các nhà sản xuất kinh doanh với nhau (thông qua mua bán chịu hàng hóa)",
                  "Giữa người tiêu dùng và ngân hàng"
                ],
                correctAnswer: "Giữa các nhà sản xuất kinh doanh với nhau (thông qua mua bán chịu hàng hóa)"
            },
            { id: "f3r6q8", questionText: "Tín dụng ngân hàng có đặc điểm gì so với tín dụng thương mại",
                options: [
                  "Chỉ cho vay ngắn hạn",
                  "Đối tượng là hàng hóa",
                  "Đối tượng chủ yếu là tiền tệ, quy mô và phạm vi rộng hơn, linh hoạt hơn",
                  "Lãi suất luôn thấp hơn"
                ],
                correctAnswer: "Đối tượng chủ yếu là tiền tệ, quy mô và phạm vi rộng hơn, linh hoạt hơn"
            },
            { id: "f3r6q9", questionText: "Chức năng cơ bản của tín dụng là gì",
                options: [
                  "Tập trung và phân phối lại vốn tiền tệ theo nguyên tắc có hoàn trả",
                  "Tạo ra tiền từ không khí",
                  "Ổn định giá cả tuyệt đối",
                  "Thay thế hoàn toàn vai trò của tiền mặt"
                ],
                correctAnswer: "Tập trung và phân phối lại vốn tiền tệ theo nguyên tắc có hoàn trả"
            },
            { id: "f3r6q10", questionText: "Tín dụng thực hiện chức năng kiểm soát các hoạt động kinh tế thông qua hình thái nào",
                options: [
                  "Kiểm tra hiện vật",
                  "Kiểm soát bằng hình thái giá trị tiền tệ (thông qua dòng vốn)",
                  "Kiểm tra hành chính",
                  "Kiểm toán độc lập"
                ],
                correctAnswer: "Kiểm soát bằng hình thái giá trị tiền tệ (thông qua dòng vốn)"
            },
            { id: "f3r6q11", questionText: "Vai trò nào sau đây KHÔNG phải của tín dụng",
                options: [
                  "Góp phần thúc đẩy sản xuất kinh doanh phát triển",
                  "Góp phần ổn định tiền tệ, giá cả, kiềm chế lạm phát",
                  "Góp phần ổn định đời sống, xã hội",
                  "Trực tiếp tạo ra giá trị thặng dư trong sản xuất (Tín dụng chỉ tạo điều kiện, không trực tiếp sản xuất)"
                ],
                correctAnswer: "Trực tiếp tạo ra giá trị thặng dư trong sản xuất (Tín dụng chỉ tạo điều kiện, không trực tiếp sản xuất)"
            },
            { id: "f3r6q12", questionText: "Tín dụng thuê mua (Leasing) là hình thức tín dụng như thế nào",
                options: [
                  "Ngân hàng cho vay tiền để mua tài sản",
                  "Công ty cho thuê tài chính mua tài sản và cho doanh nghiệp/cá nhân thuê lại trong dài hạn, cuối kỳ có thể chuyển quyền sở hữu",
                  "Doanh nghiệp bán chịu hàng hóa cho nhau",
                  "Nhà nước cho vay ưu đãi"
                ],
                correctAnswer: "Công ty cho thuê tài chính mua tài sản và cho doanh nghiệp/cá nhân thuê lại trong dài hạn, cuối kỳ có thể chuyển quyền sở hữu"
            },
            { id: "f3r6q13", questionText: "Lãi suất được định nghĩa là gì",
                options: [
                  "Giá cả của hàng hóa",
                  "Tỷ lệ phần trăm của số tiền lãi phải trả (hoặc thu được) trên tổng số tiền vay (hoặc cho vay) trong một kỳ hạn nhất định (giá cả của quyền sử dụng vốn)",
                  "Khoản lợi nhuận của doanh nghiệp",
                  "Tỷ lệ dự trữ bắt buộc"
                ],
                correctAnswer: "Tỷ lệ phần trăm của số tiền lãi phải trả (hoặc thu được) trên tổng số tiền vay (hoặc cho vay) trong một kỳ hạn nhất định (giá cả của quyền sử dụng vốn)"
            },
            { id: "f3r6q14", questionText: "Lãi suất cơ bản do ai công bố và có vai trò gì",
                options: [
                  "Do NHTW công bố, làm cơ sở cho các NHTM ấn định lãi suất kinh doanh",
                  "Do NHTM tự ấn định, không cần căn cứ",
                  "Do Chính phủ quy định, áp dụng cho mọi khoản vay",
                  "Do thị trường tự do quyết định hoàn toàn"
                ],
                correctAnswer: "Do NHTW công bố, làm cơ sở cho các NHTM ấn định lãi suất kinh doanh"
            },
            { id: "f3r6q15", questionText: "Lãi suất tái chiết khấu là lãi suất áp dụng cho khoản vay nào",
                options: [
                  "NHTM cho khách hàng vay",
                  "NHTW cho NHTM vay dưới hình thức tái chiết khấu giấy tờ có giá",
                  "Khoản vay giữa các NHTM với nhau",
                  "Khoản vay của Chính phủ"
                ],
                correctAnswer: "NHTW cho NHTM vay dưới hình thức tái chiết khấu giấy tờ có giá"
            },
            { id: "f3r6q16", questionText: "Lãi suất thực khác lãi suất danh nghĩa ở chỗ nào",
                options: [
                  "Lãi suất thực luôn cao hơn lãi suất danh nghĩa",
                  "Lãi suất thực đã loại bỏ ảnh hưởng của yếu tố lạm phát từ lãi suất danh nghĩa",
                  "Lãi suất danh nghĩa chỉ áp dụng cho tiền gửi",
                  "Lãi suất thực do NHTW ấn định"
                ],
                correctAnswer: "Lãi suất thực đã loại bỏ ảnh hưởng của yếu tố lạm phát từ lãi suất danh nghĩa"
            },
            { id: "f3r6q17", questionText: "Phương pháp tính lãi đơn có đặc điểm gì",
                options: [
                  "Tiền lãi của kỳ trước được cộng vào gốc để tính lãi kỳ sau",
                  "Tiền lãi các kỳ chỉ được tính trên số vốn gốc ban đầu, không cộng dồn lãi vào gốc",
                  "Chỉ áp dụng cho các khoản vay dài hạn",
                  "Lãi suất luôn thay đổi hàng kỳ"
                ],
                correctAnswer: "Tiền lãi các kỳ chỉ được tính trên số vốn gốc ban đầu, không cộng dồn lãi vào gốc"
            },
            { id: "f3r6q18", questionText: "Công thức tính tổng số tiền nhận được cuối kỳ (Cn) theo phương pháp lãi đơn là gì",
                options: [
                  "Cn = Co * (1 + i)^n",
                  "Cn = Co * (1 + n*i)",
                  "Cn = Co / (1 + i)^n",
                  "Cn = Co / (1 + n*i)"
                ],
                correctAnswer: "Cn = Co * (1 + n*i)"
            },
            { id: "f3r6q19", questionText: "Phương pháp tính lãi kép có đặc điểm gì",
                options: [
                  "Tiền lãi của kỳ trước được cộng (nhập) vào vốn gốc để làm cơ sở tính lãi cho kỳ tiếp theo",
                  "Tiền lãi các kỳ không thay đổi",
                  "Chỉ áp dụng cho các khoản vay ngắn hạn",
                  "Lãi suất luôn thấp hơn lãi đơn"
                ],
                correctAnswer: "Tiền lãi của kỳ trước được cộng (nhập) vào vốn gốc để làm cơ sở tính lãi cho kỳ tiếp theo"
            },
            { id: "f3r6q20", questionText: "Công thức tính tổng số tiền nhận được cuối kỳ (Cn) theo phương pháp lãi kép là gì",
                options: [
                  "Cn = Co * (1 + i)^n",
                  "Cn = Co * (1 + ni)",
                  "Cn = Co / (1 + i)^n",
                  "Cn = Co / (1 + ni)"
                ],
                correctAnswer: "Cn = Co * (1 + i)^n"
            }
        ], 
        reward: { xp: 200, goldRange: [250, 350] } }
];

const floor4Data = [
    null,
    { roomNumber: 1, 
        type: 'encounter', 
        arenaBackground: 'images/arena_backgrounds/observatory_arena.png',
        questionsToComplete: 10, 
        monsterId: 'stardust_sprite', 
        questionsInRoom: [
            { id: "f4r1q1", questionText: "Giá trị thời gian của tiền tệ nói rằng:",
                options: [
                  "Một đồng hôm nay có giá trị thấp hơn một đồng trong tương lai",
                  "Một đồng hôm nay có giá trị lớn hơn một đồng trong tương lai (do lạm phát, rủi ro, chi phí cơ hội)",
                  "Giá trị của tiền không thay đổi theo thời gian",
                  "Chỉ tiền mặt mới có giá trị thời gian"
                ],
                correctAnswer: "Một đồng hôm nay có giá trị lớn hơn một đồng trong tương lai (do lạm phát, rủi ro, chi phí cơ hội)"
            },
            { id: "f4r1q2", questionText: "Giá trị tương lai (FV) của một khoản tiền là gì",
                options: [
                  "Giá trị của một khoản tiền hiện tại sẽ đạt được tại một thời điểm trong tương lai với một mức lãi suất nhất định (tính theo lãi kép)",
                  "Giá trị của một khoản tiền trong tương lai quy về hiện tại",
                  "Số tiền lãi nhận được hàng năm",
                  "Mệnh giá của một công cụ tài chính"
                ],
                correctAnswer: "Giá trị của một khoản tiền hiện tại sẽ đạt được tại một thời điểm trong tương lai với một mức lãi suất nhất định (tính theo lãi kép)"
            },
            { id: "f4r1q3", questionText: "Giá trị hiện tại (PV) của một khoản tiền là gì",
                options: [
                  "Giá trị của một khoản tiền hiện tại ở tương lai",
                  "Giá trị của một khoản tiền hoặc một chuỗi tiền tệ trong tương lai được quy về thời điểm hiện tại theo một tỷ lệ chiết khấu (lãi suất) nhất định",
                  "Tổng số tiền gốc đã đầu tư",
                  "Lãi suất thực của khoản đầu tư"
                ],
                correctAnswer: "Giá trị của một khoản tiền hoặc một chuỗi tiền tệ trong tương lai được quy về thời điểm hiện tại theo một tỷ lệ chiết khấu (lãi suất) nhất định"
            },
            { id: "f4r1q4", questionText: "Công thức tính giá trị hiện tại (PV) của một khoản tiền trong tương lai (FV) là gì",
                options: [
                  "PV = FV * (1 + i)^n",
                  "PV = FV * (1 + ni)",
                  "PV = FV / (1 + i)^n",
                  "PV = FV / (1 + ni)"
                ],
                correctAnswer: "PV = FV / (1 + i)^n"
            },
            { id: "f4r1q5", questionText: "NHTW ra đời dựa trên cơ sở nào",
                options: [
                  "Sự sụp đổ của hệ thống NHTM",
                  "Sự phân tách trong hệ thống NHTM, ban đầu là các NH phát hành tiền",
                  "Yêu cầu của Chính phủ",
                  "Sự phát triển của thị trường chứng khoán"
                ],
                correctAnswer: "Sự phân tách trong hệ thống NHTM, ban đầu là các NH phát hành tiền"
            },
            { id: "f4r1q6", questionText: "Giai đoạn đầu (Thế kỷ XV - XVIII), các NHTM có chức năng nào mà sau này thuộc về NHTW",
                options: [
                  "Nhận tiền gửi",
                  "Cho vay",
                  "Thanh toán",
                  "Phát hành tiền"
                ],
                correctAnswer: "Phát hành tiền"
            },
            { id: "f4r1q7", questionText: "Trong thế kỷ XVIII đến cuối XIX, hệ thống ngân hàng phân tách thành những loại hình nào",
                options: [
                  "NHTW và NHTM",
                  "NH Đầu tư và NH Phát triển",
                  "NH phát hành tiền và các NH kinh doanh dịch vụ ngân hàng (NHTM không phát hành tiền)",
                  "NH Hợp tác xã và Quỹ tín dụng"
                ],
                correctAnswer: "NH phát hành tiền và các NH kinh doanh dịch vụ ngân hàng (NHTM không phát hành tiền)"
            },
            { id: "f4r1q8", questionText: "Sự hình thành NHTW hiện đại (cuối thế kỷ XIX đến nay) chủ yếu thông qua con đường nào",
                options: [
                  "Các NHTM tự hợp nhất lại",
                  "Quốc hữu hóa các NH phát hành tiền cũ hoặc thành lập NH phát hành mới thuộc sở hữu nhà nước",
                  "Các công ty tài chính chuyển đổi thành NHTW",
                  "Sự tài trợ của các tổ chức quốc tế"
                ],
                correctAnswer: "Quốc hữu hóa các NH phát hành tiền cũ hoặc thành lập NH phát hành mới thuộc sở hữu nhà nước"
            },
            { id: "f4r1q9", questionText: "Bản chất cốt lõi của NHTW là gì",
                options: [
                  "Một NHTM lớn nhất",
                  "Một cơ quan trực thuộc Bộ Tài chính",
                  "Ngân hàng phát hành tiền, độc quyền công quản, thực hiện quản lý nhà nước về tiền tệ, tín dụng, ngân hàng nhằm ổn định giá trị đồng tiền và hệ thống NH",
                  "Một tổ chức kinh doanh vì lợi nhuận"
                ],
                correctAnswer: "Ngân hàng phát hành tiền, độc quyền công quản, thực hiện quản lý nhà nước về tiền tệ, tín dụng, ngân hàng nhằm ổn định giá trị đồng tiền và hệ thống NH"
            },
            { id: "f4r1q10", questionText: "NHTW thực hiện chức năng quản lý Nhà nước trên lĩnh vực nào",
                options: [
                  "Chỉ quản lý ngân sách",
                  "Chỉ quản lý thị trường chứng khoán",
                  "Tiền tệ, tín dụng và ngân hàng",
                  "Thương mại và công nghiệp"
                ],
                correctAnswer: "Tiền tệ, tín dụng và ngân hàng"
            }
        ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 2, 
        type: 'puzzle', 
        questionsToComplete: 5,
        questionsInRoom: [
            { id: "f4r2q1", questionText: "Mục tiêu cơ bản hàng đầu của NHTW là gì",
                options: [
                  "Tối đa hóa lợi nhuận",
                  "Ổn định giá trị đồng tiền (kiểm soát lạm phát) và duy trì sự ổn định, an toàn của hệ thống ngân hàng",
                  "Tài trợ cho các dự án của Chính phủ",
                  "Cạnh tranh với các NHTM"
                ],
                correctAnswer: "Ổn định giá trị đồng tiền (kiểm soát lạm phát) và duy trì sự ổn định, an toàn của hệ thống ngân hàng"
            },
            { id: "f4r2q2", questionText: "Hai mô hình tổ chức NHTW phổ biến trên thế giới là gì",
                options: [
                  "NHTW Nhà nước và NHTW tư nhân",
                  "NHTW đa năng và NHTW chuyên doanh",
                  "NHTW độc lập với Chính phủ và NHTW trực thuộc Chính phủ",
                  "NHTW một cấp và NHTW hai cấp"
                ],
                correctAnswer: "NHTW độc lập với Chính phủ và NHTW trực thuộc Chính phủ"
            },
            { id: "f4r2q3", questionText: "Trong mô hình NHTW độc lập với Chính phủ, NHTW thường chịu sự giám sát của cơ quan nào",
                options: [
                  "Quốc hội (hoặc cơ quan lập pháp tương đương)",
                  "Chính phủ (hành pháp)",
                  "Bộ Tài chính",
                  "Hệ thống tòa án"
                ],
                correctAnswer: "Quốc hội (hoặc cơ quan lập pháp tương đương)"
            },
            { id: "f4r2q4", questionText: "Ngân hàng Trung ương nào là ví dụ điển hình cho mô hình độc lập với Chính phủ",
                options: [
                  "Ngân hàng Nhà nước Việt Nam (SBV)",
                  "Cục Dự trữ Liên bang Mỹ (Fed)",
                  "Ngân hàng Nhân dân Trung Hoa (PBOC)",
                  "Ngân hàng Trung ương Nga (CBR)"
                ],
                correctAnswer: "Ngân hàng Nhà nước Việt Nam (SBV)"
            },
            { id: "f4r2q5", questionText: "Trong mô hình NHTW trực thuộc Chính phủ, NHTW có vị thế như thế nào",
                options: [
                  "Ngang hàng với Chính phủ",
                  "Là một cơ quan thuộc Chính phủ, chịu sự chỉ đạo trực tiếp của Chính phủ",
                  "Độc lập hoàn toàn về chính sách",
                  "Chỉ chịu sự giám sát của Quốc hội"
                ],
                correctAnswer: "Là một cơ quan thuộc Chính phủ, chịu sự chỉ đạo trực tiếp của Chính phủ"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 } 
    },

    { roomNumber: 3, 
        type: 'encounter', 
        questionsToComplete: 10,
        monsterId:  'stardust_sprite',
        questionsInRoom: [
            { id: "f4r3q1", questionText: "Ngân hàng Nhà nước Việt Nam (SBV) hoạt động theo mô hình nào (Slide 13, kiến thức thực tế)?",
                options: [
                  "Độc lập với Chính phủ",
                  "Trực thuộc Chính phủ",
                  "Thuộc Quốc hội",
                  "Là công ty cổ phần"
                ],
                correctAnswer: "Trực thuộc Chính phủ"
            },
            { id: "f4r3q2", questionText: "Ba chức năng cơ bản của NHTW thường được ví như ba vòng tròn đồng tâm là gì",
                options: [
                  "In tiền, Cho vay, Nhận tiền gửi",
                  "Phát hành tiền và quản lý lưu thông tiền tệ (lõi), Ngân hàng của các ngân hàng (vòng giữa), Ngân hàng của Nhà nước (vòng ngoài)",
                  "Ổn định giá cả, Tăng trưởng kinh tế, Tạo việc làm",
                  "Quản lý dự trữ ngoại hối, Giám sát hệ thống thanh toán, Cấp phép hoạt động ngân hàng"
                ],
                correctAnswer: "Phát hành tiền và quản lý lưu thông tiền tệ (lõi), Ngân hàng của các ngân hàng (vòng giữa), Ngân hàng của Nhà nước (vòng ngoài)"
            },
            { id: "f4r3q3", questionText: "Chức năng nào thể hiện vai trò độc quyền của NHTW",
                options: [
                  "Phát hành tiền (tiền giấy, tiền kim loại) và quản lý lưu thông tiền tệ",
                  "Nhận tiền gửi từ công chúng",
                  "Cho vay doanh nghiệp",
                  "Kinh doanh ngoại hối"
                ],
                correctAnswer: "Phát hành tiền (tiền giấy, tiền kim loại) và quản lý lưu thông tiền tệ"
            },
            { id: "f4r3q4", questionText: "Để đảm bảo ổn định giá trị đồng tiền, việc phát hành tiền của NHTW phải tuân theo nguyên tắc nào",
                options: [
                  "Phát hành càng nhiều càng tốt",
                  "Chỉ phát hành tiền kim loại",
                  "Phải dựa trên cơ sở bảo đảm bằng tài sản (vàng, ngoại tệ, tín dụng cho nền kinh tế), phù hợp với nhu cầu tiền tệ của nền kinh tế",
                  "Chỉ phát hành khi có yêu cầu của Chính phủ"
                ],
                correctAnswer: "Phải dựa trên cơ sở bảo đảm bằng tài sản (vàng, ngoại tệ, tín dụng cho nền kinh tế), phù hợp với nhu cầu tiền tệ của nền kinh tế"
            },
            { id: "f4r3q5", questionText: "NHTW được gọi là 'ngân hàng của các ngân hàng' vì nó thực hiện nghiệp vụ nào sau đây với NHTM",
                options: [
                  "Cạnh tranh huy động vốn từ dân cư",
                  "Nhận tiền gửi (tiền gửi thanh toán, tiền gửi dự trữ bắt buộc), cho vay (tái cấp vốn), làm trung tâm thanh toán bù trừ cho các NHTM",
                  "Mua bán cổ phiếu của NHTM",
                  "Kiểm toán báo cáo tài chính của NHTM"
                ],
                correctAnswer: "Nhận tiền gửi (tiền gửi thanh toán, tiền gửi dự trữ bắt buộc), cho vay (tái cấp vốn), làm trung tâm thanh toán bù trừ cho các NHTM"
            },
            { id: "f4r3q6", questionText: "Tiền gửi dự trữ bắt buộc là khoản tiền mà NHTM phải gửi tại NHTW nhằm mục đích gì",
                options: [
                  "Để hưởng lãi suất cao",
                  "Để NHTW đầu tư hộ",
                  "Để đảm bảo khả năng thanh toán và là công cụ để NHTW thực thi chính sách tiền tệ",
                  "Để cho các NHTM khác vay lại"
                ],
                correctAnswer: "Để đảm bảo khả năng thanh toán và là công cụ để NHTW thực thi chính sách tiền tệ"
            },
            { id: "f4r3q7", questionText: "NHTW thực hiện cho vay đối với NHTM (tái cấp vốn) nhằm mục đích chính là gì",
                options: [
                  "Thu lợi nhuận từ lãi suất",
                  "Cung ứng vốn khả dụng cho các NHTM khi cần thiết, điều tiết lượng tiền cung ứng, thực hiện vai trò người cho vay cuối cùng",
                  "Kiểm soát hoạt động tín dụng của NHTM",
                  "Khuyến khích NHTM cạnh tranh"
                ],
                correctAnswer: "Cung ứng vốn khả dụng cho các NHTM khi cần thiết, điều tiết lượng tiền cung ứng, thực hiện vai trò người cho vay cuối cùng"
            },
            { id: "f4r3q8", questionText: "Chức năng 'ngân hàng của Nhà nước' của NHTW thể hiện qua vai trò nào",
                options: [
                  "In tiền theo yêu cầu của Nhà nước",
                  "Quản lý tài khoản và làm đại lý Kho bạc Nhà nước, tư vấn chính sách tiền tệ cho Chính phủ, đại diện quốc gia trong quan hệ tiền tệ quốc tế",
                  "Quyết định chính sách tài khóa",
                  "Cho vay trực tiếp đối với các dự án của Nhà nước"
                ],
                correctAnswer: "Quản lý tài khoản và làm đại lý Kho bạc Nhà nước, tư vấn chính sách tiền tệ cho Chính phủ, đại diện quốc gia trong quan hệ tiền tệ quốc tế"
            },
            { id: "f4r3q9", questionText: "Chính sách tiền tệ (CSTT) quốc gia là gì",
                options: [
                  "Chính sách thu chi ngân sách của Chính phủ",
                  "Tổng hòa những phương thức mà NHTW tác động đến khối lượng tiền trong lưu thông nhằm thực hiện các mục tiêu kinh tế - xã hội",
                  "Chính sách quản lý tỷ giá hối đoái",
                  "Chính sách phát triển thị trường chứng khoán"
                ],
                correctAnswer: "Tổng hòa những phương thức mà NHTW tác động đến khối lượng tiền trong lưu thông nhằm thực hiện các mục tiêu kinh tế - xã hội"
            },
            { id: "f4r3q10", questionText: "CSTT là một bộ phận của chính sách nào",
                options: [
                  "Chính sách đối ngoại",
                  "Chính sách kinh tế vĩ mô (bên cạnh chính sách tài khóa, thu nhập,...)",
                  "Chính sách xã hội",
                  "Chính sách quốc phòng"
                ],
                correctAnswer: "Chính sách kinh tế vĩ mô (bên cạnh chính sách tài khóa, thu nhập,...)"
            }
        ], 
        reward: { xp: 50, gold: 45 } 
    },

    { roomNumber: 4, 
        type: 'chest', 
        questionsToComplete: 5,
        questionsInRoom: [
            { id: "f4r4q1", questionText: "Chính sách tiền tệ mở rộng có đặc điểm và mục tiêu gì",
                options: [
                  "Cung ứng thêm tiền cho nền kinh tế, thường nhằm khuyến khích đầu tư, tạo việc làm, thúc đẩy tăng trưởng",
                  "Giảm cung tiền, nhằm kiềm chế lạm phát",
                  "Tăng thuế suất",
                  "Giảm chi tiêu công"
                ],
                correctAnswer: "Cung ứng thêm tiền cho nền kinh tế, thường nhằm khuyến khích đầu tư, tạo việc làm, thúc đẩy tăng trưởng"
            },
            { id: "f4r4q2", questionText: "Chính sách tiền tệ thắt chặt có đặc điểm và mục tiêu gì",
                options: [
                  "Tăng cung tiền, nhằm kích thích kinh tế",
                  "Giảm cung ứng tiền cho nền kinh tế, thường nhằm kiểm soát lạm phát, kìm hãm sự phát triển quá nóng",
                  "Giảm thuế suất",
                  "Tăng chi tiêu công"
                ],
                correctAnswer: "Giảm cung ứng tiền cho nền kinh tế, thường nhằm kiểm soát lạm phát, kìm hãm sự phát triển quá nóng"
            },
            { id: "f4r4q3", questionText: "Nhiệm vụ nào KHÔNG phải là của chính sách tiền tệ",
                options: [
                  "Cung cấp phương tiện thanh toán",
                  "Giữ ổn định giá trị đồng bản tệ",
                  "Tạo việc làm, tăng trưởng kinh tế",
                  "Trực tiếp phân phối lại thu nhập giữa các tầng lớp dân cư (Đây là nhiệm vụ chính của CS tài khóa và CS thu nhập)"
                ],
                correctAnswer: "Trực tiếp phân phối lại thu nhập giữa các tầng lớp dân cư (Đây là nhiệm vụ chính của CS tài khóa và CS thu nhập)"
            },
            { id: "f4r4q4", questionText: "Mục tiêu cuối cùng của chính sách tiền tệ quốc gia thường bao gồm",
                options: [
                  "Chỉ có kiểm soát lạm phát",
                  "Chỉ có tạo việc làm",
                  "Chỉ có tăng trưởng kinh tế",
                  "Kiểm soát lạm phát (ổn định giá trị đồng tiền), tạo việc làm (toàn dụng nhân công), tăng trưởng kinh tế bền vững"
                ],
                correctAnswer: "Kiểm soát lạm phát (ổn định giá trị đồng tiền), tạo việc làm (toàn dụng nhân công), tăng trưởng kinh tế bền vững"
            },
            { id: "f4r4q5", questionText: "Tại sao kiểm soát lạm phát ở mức 'vừa phải' lại có lợi cho kinh tế",
                options: [
                  "Lạm phát càng cao càng tốt",
                  "Lạm phát 0% là tốt nhất",
                  "Lạm phát vừa phải (thấp, ổn định) tạo môi trường dự đoán tốt hơn, khuyến khích đầu tư và tiêu dùng hợp lý, tránh trì trệ do giảm phát",
                  "Lạm phát không ảnh hưởng đến kinh tế"
                ],
                correctAnswer: "Lạm phát vừa phải (thấp, ổn định) tạo môi trường dự đoán tốt hơn, khuyến khích đầu tư và tiêu dùng hợp lý, tránh trì trệ do giảm phát"
            }
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 }
    },

    { roomNumber: 5, 
        type: 'safe_room',
    },

    { roomNumber: 6, 
        type: 'boss', 
        questionsToComplete: 20, 
        monsterId: 'living_nebula', 
        questionsInRoom: [
            { id: "f4r6q1", questionText: "CSTT mở rộng có tác động như thế nào đến tỷ lệ thất nghiệp",
                options: [
                  "Làm tăng tỷ lệ thất nghiệp",
                  "Có xu hướng làm giảm tỷ lệ thất nghiệp (do kích thích đầu tư, sản xuất)",
                  "Không ảnh hưởng đến thất nghiệp",
                  "Gây ra thất nghiệp cơ cấu"
                ],
                correctAnswer: "Có xu hướng làm giảm tỷ lệ thất nghiệp (do kích thích đầu tư, sản xuất)"
            },
            { id: "f4r6q2", questionText: "Mối quan hệ giữa CSTT và tăng trưởng kinh tế là gì",
                options: [
                  "CSTT thắt chặt luôn thúc đẩy tăng trưởng",
                  "CSTT mở rộng có thể kích thích tăng trưởng (ngắn hạn), CSTT thắt chặt có thể kìm hãm tăng trưởng (nhưng cần thiết để chống lạm phát)",
                  "CSTT không ảnh hưởng đến tăng trưởng",
                  "CSTT mở rộng luôn đảm bảo tăng trưởng bền vững"
                ],
                correctAnswer: "CSTT mở rộng có thể kích thích tăng trưởng (ngắn hạn), CSTT thắt chặt có thể kìm hãm tăng trưởng (nhưng cần thiết để chống lạm phát)"
            },
            { id: "f4r6q3", questionText: "Công cụ nào sau đây KHÔNG phải là công cụ chủ yếu của chính sách tiền tệ",
                options: [
                  "Nghiệp vụ thị trường mở",
                  "Chính sách chiết khấu (lãi suất tái cấp vốn, tái chiết khấu)",
                  "Dự trữ bắt buộc",
                  "Chính sách thuế (Đây là công cụ của chính sách tài khóa)"
                ],
                correctAnswer: "Chính sách thuế (Đây là công cụ của chính sách tài khóa)"
            },
            { id: "f4r6q4", questionText: "Nghiệp vụ thị trường mở (Open Market Operations - OMO) là việc NHTW làm gì",
                options: [
                  "Cho NHTM vay trực tiếp",
                  "Thay đổi tỷ lệ dự trữ bắt buộc",
                  "Mua hoặc bán các giấy tờ có giá (thường là tín phiếu kho bạc) trên thị trường",
                  "Ấn định lãi suất tiền gửi"
                ],
                correctAnswer: "Mua hoặc bán các giấy tờ có giá (thường là tín phiếu kho bạc) trên thị trường"
            },
            { id: "f4r6q5", questionText: "Khi NHTW mua giấy tờ có giá trên thị trường mở, lượng tiền cung ứng (MS) sẽ thay đổi như thế nào",
                options: [
                  "Giảm xuống",
                  "Tăng lên (do NHTW bơm tiền ra để mua)",
                  "Không đổi",
                  "Phụ thuộc vào lãi suất"
                ],
                correctAnswer: "Tăng lên (do NHTW bơm tiền ra để mua)"
            },
            { id: "f4r6q6", questionText: "Khi NHTW bán giấy tờ có giá trên thị trường mở, lượng tiền cung ứng (MS) sẽ thay đổi như thế nào",
                options: [
                  "Giảm xuống (do NHTW hút tiền về khi bán)",
                  "Tăng lên",
                  "Không đổi",
                  "Phụ thuộc vào tỷ giá"
                ],
                correctAnswer: "Giảm xuống (do NHTW hút tiền về khi bán)"
            },
            { id: "f4r6q7", questionText: "Ưu điểm nổi bật của nghiệp vụ thị trường mở là gì",
                options: [
                  "Tác động chậm nhưng chắc chắn",
                  "Chi phí thực hiện cao",
                  "Linh hoạt, chính xác, dễ đảo ngược tình thế, tác động nhanh chóng (ở các nước có TTTC phát triển)",
                  "Không cần thị trường tài chính phát triển"
                ],
                correctAnswer: "Linh hoạt, chính xác, dễ đảo ngược tình thế, tác động nhanh chóng (ở các nước có TTTC phát triển)"
            },
            { id: "f4r6q8", questionText: "Hạn chế chính của nghiệp vụ thị trường mở là gì",
                options: [
                  "Tốn kém chi phí quản lý",
                  "Đòi hỏi phải có một thị trường tài chính (đặc biệt là thị trường giấy tờ có giá) phát triển, đủ sâu và rộng",
                  "Tác động quá mạnh, khó kiểm soát",
                  "NHTW bị động trong việc thực hiện"
                ],
                correctAnswer: "Đòi hỏi phải có một thị trường tài chính (đặc biệt là thị trường giấy tờ có giá) phát triển, đủ sâu và rộng"
            },
            { id: "f4r6q9", questionText: "Chính sách chiết khấu là việc NHTW thay đổi yếu tố nào để tác động đến cung tiền",
                options: [
                  "Tỷ lệ dự trữ bắt buộc",
                  "Lãi suất chiết khấu (lãi suất tái cấp vốn, tái chiết khấu) áp dụng cho các khoản vay của NHTM tại NHTW",
                  "Hạn mức tín dụng",
                  "Giá mua bán ngoại tệ"
                ],
                correctAnswer: "Lãi suất chiết khấu (lãi suất tái cấp vốn, tái chiết khấu) áp dụng cho các khoản vay của NHTM tại NHTW"
            },
            { id: "f4r6q10", questionText: "Khi NHTW nâng lãi suất chiết khấu, điều gì có xu hướng xảy ra",
                options: [
                  "NHTM tăng cường vay NHTW, cung tiền tăng",
                  "NHTM hạn chế vay NHTW (do chi phí vay cao), cung tiền giảm",
                  "Lãi suất thị trường giảm",
                  "Hoạt động cho vay của NHTM tăng mạnh"
                ],
                correctAnswer: "NHTM hạn chế vay NHTW (do chi phí vay cao), cung tiền giảm"
            },
            { id: "f4r6q11", questionText: "Khi NHTW giảm lãi suất chiết khấu, điều gì có xu hướng xảy ra",
                options: [
                  "NHTM tăng cường vay NHTW (do chi phí vay rẻ), cung tiền tăng",
                  "NHTM hạn chế vay NHTW, cung tiền giảm",
                  "Lãi suất thị trường tăng",
                  "Hoạt động cho vay của NHTM bị thu hẹp"
                ],
                correctAnswer: "NHTM tăng cường vay NHTW (do chi phí vay rẻ), cung tiền tăng"
            },
            { id: "f4r6q12", questionText: "Ưu điểm của chính sách chiết khấu là gì",
                options: [
                  "NHTW chủ động hoàn toàn",
                  "Thể hiện vai trò người cho vay cuối cùng, giúp NHTM tránh khủng hoảng thanh khoản",
                  "Tác động rất chính xác đến cung tiền",
                  "Không tốn chi phí thực hiện"
                ],
                correctAnswer: "Thể hiện vai trò người cho vay cuối cùng, giúp NHTM tránh khủng hoảng thanh khoản"
            },
            { id: "f4r6q13", questionText: "Nhược điểm của chính sách chiết khấu là gì",
                options: [
                  "Quá linh hoạt",
                  "NHTW bị động vì việc vay hay không phụ thuộc vào nhu cầu của NHTM, khó dự đoán chính xác tác động đến cung tiền",
                  "Không ảnh hưởng đến tâm lý thị trường",
                  "Chỉ áp dụng được ở các nước đang phát triển"
                ],
                correctAnswer: "NHTW bị động vì việc vay hay không phụ thuộc vào nhu cầu của NHTM, khó dự đoán chính xác tác động đến cung tiền"
            },
            { id: "f4r6q14", questionText: "Dự trữ bắt buộc (Required Reserves) là công cụ CSTT thực hiện bằng cách nào",
                options: [
                  "Mua bán giấy tờ có giá",
                  "Thay đổi lãi suất cho vay",
                  "Thay đổi tỷ lệ phần trăm tiền gửi mà các NHTM phải giữ lại, không được cho vay (gửi tại NHTW)",
                  "Ấn định tỷ giá hối đoái"
                ],
                correctAnswer: "Thay đổi tỷ lệ phần trăm tiền gửi mà các NHTM phải giữ lại, không được cho vay (gửi tại NHTW)"
            },
            { id: "f4r6q15", questionText: "Khi NHTW tăng tỷ lệ dự trữ bắt buộc, khả năng tạo tiền và cung tiền (MS) của NHTM sẽ thay đổi thế nào",
                options: [
                  "Tăng lên",
                  "Giảm xuống (do lượng vốn khả dụng để cho vay giảm, số nhân tiền tệ giảm)",
                  "Không đổi",
                  "Biến động khó lường"
                ],
                correctAnswer: "Giảm xuống (do lượng vốn khả dụng để cho vay giảm, số nhân tiền tệ giảm)"
            },
            { id: "f4r6q16", questionText: "Khi NHTW giảm tỷ lệ dự trữ bắt buộc, khả năng tạo tiền và cung tiền (MS) của NHTM sẽ thay đổi thế nào",
                options: [
                  "Tăng lên (do lượng vốn khả dụng để cho vay tăng, số nhân tiền tệ tăng)",
                  "Giảm xuống",
                  "Không đổi",
                  "Chỉ ảnh hưởng đến lợi nhuận NHTM"
                ],
                correctAnswer: "Tăng lên (do lượng vốn khả dụng để cho vay tăng, số nhân tiền tệ tăng)"
            },
            { id: "f4r6q17", questionText: "Ưu điểm của công cụ dự trữ bắt buộc là gì",
                options: [
                  "Tác động mạnh mẽ và nhanh chóng đến cung tiền, tăng cường quyền lực NHTW, đảm bảo khả năng thanh toán cho NHTM",
                  "Rất linh hoạt, dễ điều chỉnh",
                  "Chi phí quản lý thấp",
                  "Không gây khó khăn cho NHTM"
                ],
                correctAnswer: "Tác động mạnh mẽ và nhanh chóng đến cung tiền, tăng cường quyền lực NHTW, đảm bảo khả năng thanh toán cho NHTM"
            },
            { id: "f4r6q18", questionText: "Nhược điểm chính của công cụ dự trữ bắt buộc là gì",
                options: [
                  "Tác động yếu",
                  "Kém linh hoạt (ít khi thay đổi), tác động quá mạnh, có thể gây khó khăn đột ngột cho hoạt động kinh doanh của NHTM, tốn kém chi phí quản lý",
                  "Chỉ hiệu quả khi lạm phát thấp",
                  "Không ảnh hưởng đến lãi suất"
                ],
                correctAnswer: "Kém linh hoạt (ít khi thay đổi), tác động quá mạnh, có thể gây khó khăn đột ngột cho hoạt động kinh doanh của NHTM, tốn kém chi phí quản lý"
            },
            { id: "f4r6q19", questionText: "Kiểm soát hạn mức tín dụng là công cụ CSTT có đặc điểm gì",
                options: [
                  "Can thiệp gián tiếp qua lãi suất",
                  "Can thiệp trực tiếp, NHTW áp đặt mức tăng trưởng tín dụng tối đa cho các NHTM",
                  "Khuyến khích NHTM cho vay nhiều hơn",
                  "Chỉ áp dụng cho vay ngoại tệ"
                ],
                correctAnswer: "Can thiệp trực tiếp, NHTW áp đặt mức tăng trưởng tín dụng tối đa cho các NHTM"
            },
            { id: "f4r6q20", questionText: "Cơ chế tác động của hạn mức tín dụng lên cung tiền (MS) là gì",
                options: [
                  "Thông qua lãi suất",
                  "Thông qua dự trữ bắt buộc",
                  "Giới hạn trực tiếp khả năng cho vay của NHTM, từ đó ảnh hưởng đến lượng tiền tạo ra và cung tiền",
                  "Thông qua tỷ giá hối đoái"
                ],
                correctAnswer: "Giới hạn trực tiếp khả năng cho vay của NHTM, từ đó ảnh hưởng đến lượng tiền tạo ra và cung tiền"
            }
        ], 
        reward: { xp: 200, goldRange: [250, 350] } }
];

const floor5Data = [
    null,
    { roomNumber: 1, 
        type: 'encounter', 
        arenaBackground: 'images/arena_backgrounds/shadow_sanctum_arena.png',
        questionsToComplete: 10, 
        monsterId: 'mummy_guardian', 
        questionsInRoom: [
            { id: "f5r1q1", questionText: "Nhược điểm của việc sử dụng hạn mức tín dụng là gì",
                options: [
                  "Tác động chậm",
                  "Có thể làm méo mó thị trường, giảm cạnh tranh, gây khó khăn cho DN (đặc biệt DN nhỏ), làm tăng lãi suất ngầm",
                  "Không hiệu quả khi cung tiền tăng cao",
                  "Quá linh hoạt"
                ],
                correctAnswer: "Có thể làm méo mó thị trường, giảm cạnh tranh, gây khó khăn cho DN (đặc biệt DN nhỏ), làm tăng lãi suất ngầm"
            },
            { id: "f5r1q2", questionText: "Quản lý lãi suất của NHTM (như quy định khung lãi suất, trần lãi suất) là công cụ CSTT mang tính chất gì",
                options: [
                  "Công cụ thị trường",
                  "Công cụ can thiệp trực tiếp, mang tính hành chính",
                  "Công cụ gián tiếp",
                  "Công cụ khuyến khích"
                ],
                correctAnswer: "Công cụ can thiệp trực tiếp, mang tính hành chính"
            },
            { id: "f5r1q3", questionText: "Cơ chế điều hành lãi suất gián tiếp của NHTW thường thông qua đâu",
                options: [
                  "Thông qua các công cụ khác như OMO, lãi suất tái cấp vốn để tác động đến lãi suất thị trường liên ngân hàng, từ đó ảnh hưởng lãi suất của NHTM",
                  "Ra lệnh trực tiếp cho NHTM",
                  "Thông qua tỷ lệ dự trữ bắt buộc",
                  "Thông qua hạn mức tín dụng"
                ],
                correctAnswer: "Thông qua các công cụ khác như OMO, lãi suất tái cấp vốn để tác động đến lãi suất thị trường liên ngân hàng, từ đó ảnh hưởng lãi suất của NHTM"
            },
            { id: "f5r1q4", questionText: "Nhược điểm của việc quản lý lãi suất trực tiếp (ấn định trần, khung) là gì",
                options: [
                  "Tăng cường tính cạnh tranh",
                  "Không phản ánh đúng quan hệ cung cầu vốn trên thị trường, có thể dẫn đến phân bổ vốn không hiệu quả",
                  "Giúp NHTW linh hoạt hơn",
                  "Luôn làm giảm lạm phát"
                ],
                correctAnswer: "Không phản ánh đúng quan hệ cung cầu vốn trên thị trường, có thể dẫn đến phân bổ vốn không hiệu quả"
            },
            { id: "f5r1q5", questionText: "Hoạt động ngân hàng được định nghĩa là gì",
                options: [
                  "Chỉ là hoạt động nhận tiền gửi",
                  "Chỉ là hoạt động cho vay",
                  "Hoạt động kinh doanh tiền tệ và dịch vụ ngân hàng với nội dung chủ yếu là nhận tiền gửi, sử dụng tiền đó để cấp tín dụng và cung ứng dịch vụ thanh toán",
                  "Hoạt động đầu tư chứng khoán"
                ],
                correctAnswer: "Hoạt động kinh doanh tiền tệ và dịch vụ ngân hàng với nội dung chủ yếu là nhận tiền gửi, sử dụng tiền đó để cấp tín dụng và cung ứng dịch vụ thanh toán"
            },
            { id: "f5r1q6", questionText: "Ngân hàng thương mại (NHTM) là một loại hình tổ chức gì",
                options: [
                  "Doanh nghiệp sản xuất",
                  "Cơ quan quản lý nhà nước",
                  "Tổ chức tín dụng (một loại hình trung gian tài chính) thực hiện hoạt động ngân hàng nhằm mục đích lợi nhuận",
                  "Công ty bảo hiểm"
                ],
                correctAnswer: "Tổ chức tín dụng (một loại hình trung gian tài chính) thực hiện hoạt động ngân hàng nhằm mục đích lợi nhuận"
            },
            { id: "f5r1q7", questionText: "Trong các giai đoạn phát triển, chức năng nào ban đầu thuộc NHTM nhưng sau đó chuyển sang NHTW",
                options: [
                  "Nhận tiền gửi",
                  "Cho vay",
                  "Phát hành tiền",
                  "Trung gian thanh toán"
                ],
                correctAnswer: "Phát hành tiền"
            },
            { id: "f5r1q8", questionText: "Căn cứ vào hình thức sở hữu vốn góp, NHTM được phân loại thành",
                options: [
                  "NHTM bán buôn và NHTM bán lẻ",
                  "NHTM đa năng và NHTM chuyên doanh",
                  "NHTM Nhà nước, NHTM cổ phần, NHTM liên doanh, NHTM nước ngoài",
                  "NHTM Trung ương và NHTM địa phương"
                ],
                correctAnswer: "NHTM Nhà nước, NHTM cổ phần, NHTM liên doanh, NHTM nước ngoài"
            },
            { id: "f5r1q9", questionText: "NHTM Nhà nước là ngân hàng có đặc điểm gì về sở hữu?",
                options: [
                  "Do nhiều cổ đông cá nhân góp vốn",
                  "Do Nhà nước sở hữu 100% vốn điều lệ hoặc giữ cổ phần chi phối",
                  "Do tổ chức nước ngoài và trong nước liên kết góp vốn",
                  "Là chi nhánh của ngân hàng nước ngoài tại Việt Nam"
                ],
                correctAnswer: "Do Nhà nước sở hữu 100% vốn điều lệ hoặc giữ cổ phần chi phối"
            },
            { id: "f5r1q10", questionText: "Ba chức năng cơ bản của NHTM hiện đại là gì",
                options: [
                  "Huy động vốn, Đầu tư, Kinh doanh ngoại tệ",
                  "Trung gian tín dụng, Trung gian thanh toán, Tạo tiền",
                  "Quản lý rủi ro, Cung cấp thông tin, Tư vấn tài chính",
                  "Nhận tiền gửi, Cho vay, Bảo lãnh"
                ],
                correctAnswer: "Trung gian tín dụng, Trung gian thanh toán, Tạo tiền"
            }
        ], 
        reward: { xp:50, gold: 45 } 
    },
    
    { roomNumber: 2,  
        type: 'chest', 
        questionsToComplete: 5,
        questionsInRoom: [
            { id: "f5r2q1", questionText: "Chức năng trung gian tín dụng của NHTM thể hiện như thế nào",
                options: [
                  "Làm cầu nối giữa người thừa vốn (gửi tiền) và người thiếu vốn (cần vay)",
                  "Thực hiện thanh toán hộ khách hàng",
                  "Tạo ra bút tệ thông qua cho vay",
                  "In và phát hành tiền mặt"
                ],
                correctAnswer: "Làm cầu nối giữa người thừa vốn (gửi tiền) và người thiếu vốn (cần vay)"
            },
            { id: "f5r2q2", questionText: "Chức năng trung gian thanh toán của NHTM nghĩa là",
                options: [
                  "NHTM cho vay để khách hàng thanh toán",
                  "NHTM nhận tiền gửi của khách hàng",
                  "NHTM thực hiện các lệnh thanh toán (chi trả, thu hộ) cho khách hàng qua tài khoản tiền gửi",
                  "NHTM tự tạo ra tiền để thanh toán"
                ],
                correctAnswer: "NHTM thực hiện các lệnh thanh toán (chi trả, thu hộ) cho khách hàng qua tài khoản tiền gửi"
            },
            { id: "f5r2q3", questionText: "Chức năng tạo tiền (ghi sổ/bút tệ) của NHTM được thực hiện dựa trên sự kết hợp của hai chức năng nào",
                options: [
                  "Nhận tiền gửi và đầu tư",
                  "Trung gian tín dụng (cho vay) và Trung gian thanh toán (qua tài khoản)",
                  "Kinh doanh ngoại tệ và bảo lãnh",
                  "Huy động vốn và quản lý rủi ro"
                ],
                correctAnswer: "Trung gian tín dụng (cho vay) và Trung gian thanh toán (qua tài khoản)"
            },
            { id: "f5r2q4", questionText: "10.	Quá trình tạo tiền của hệ thống NHTM bị giới hạn bởi yếu tố nào ?",
                options: ["Lãi suất cho vay",
                    "Tỷ lệ dự trữ bắt buộc và tỷ lệ tiền mặt ngoài ngân hàng",
                    "Nhu cầu vay vốn của khách hàng",
                    "Vốn chủ sở hữu của ngân hàng"],
                correctAnswer: "Tỷ lệ dự trữ bắt buộc và tỷ lệ tiền mặt ngoài ngân hàng"
            },
            { id: "f5r2q5", questionText: "Nghiệp vụ nào thuộc về bên NGUỒN VỐN (Nợ và Vốn chủ sở hữu) trên bảng cân đối của NHTM",
                options: [
                  "Cho vay khách hàng",
                  "Đầu tư chứng khoán",
                  "Nhận tiền gửi, Phát hành giấy tờ có giá, Vay NHTW/TCTD khác, Vốn chủ sở hữu",
                  "Tiền mặt tại quỹ"
                ],
                correctAnswer: "Nhận tiền gửi, Phát hành giấy tờ có giá, Vay NHTW/TCTD khác, Vốn chủ sở hữu"
            },
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 } 
    },

    { roomNumber: 3, 
        type: 'encounter', 
        questionsToComplete: 10, 
        monsterId: 'mummy_guardian', 
        questionsInRoom: [
            { id: "f5r3q1", questionText: "Nghiệp vụ nào thuộc về bên TÀI SẢN (Có) trên bảng cân đối của NHTM",
                options: [
                  "Dự trữ (bắt buộc, thừa), Tiền mặt, Tiền gửi tại NH khác, Cho vay, Đầu tư chứng khoán, Tài sản cố định",
                  "Tiền gửi của khách hàng",
                  "Vốn chủ sở hữu",
                  "Vay liên ngân hàng"
                ],
                correctAnswer: "Dự trữ (bắt buộc, thừa), Tiền mặt, Tiền gửi tại NH khác, Cho vay, Đầu tư chứng khoán, Tài sản cố định"
            },
            { id: "f5r3q2", questionText: "Nghiệp vụ nguồn vốn của NHTM bao gồm những hoạt động chính nào",
                options: [
                  "Chỉ có cho vay và đầu tư",
                  "Huy động vốn chủ sở hữu, Nhận tiền gửi, Phát hành giấy tờ có giá, Vay vốn, Các nguồn khác (ủy thác, thanh toán...)",
                  "Chỉ có nhận tiền gửi",
                  "Thanh toán hộ và bảo lãnh"
                ],
                correctAnswer: "Huy động vốn chủ sở hữu, Nhận tiền gửi, Phát hành giấy tờ có giá, Vay vốn, Các nguồn khác (ủy thác, thanh toán...)"
            },
            { id: "f5r3q3", questionText: "Vốn chủ sở hữu của NHTM có nguồn gốc từ đâu",
                options: [
                  "Chỉ từ lợi nhuận giữ lại",
                  "Nguồn hình thành ban đầu (vốn điều lệ), bổ sung từ lợi nhuận, phát hành thêm cổ phần, các quỹ (dự phòng, thặng dư...)",
                  "Chỉ từ tiền gửi của khách hàng",
                  "Chỉ từ các khoản vay"
                ],
                correctAnswer: "Nguồn hình thành ban đầu (vốn điều lệ), bổ sung từ lợi nhuận, phát hành thêm cổ phần, các quỹ (dự phòng, thặng dư...)"
            },
            { id: "f5r3q4", questionText: "Các quỹ nào thường thuộc Vốn chủ sở hữu của NHTM",
                options: [
                  "Quỹ tiền lương, Quỹ khen thưởng",
                  "Quỹ đầu tư mạo hiểm",
                  "Quỹ dự trữ bổ sung vốn điều lệ, Quỹ dự phòng tài chính, Quỹ thặng dư vốn cổ phần",
                  "Quỹ bình ổn giá"
                ],
                correctAnswer: "Quỹ dự trữ bổ sung vốn điều lệ, Quỹ dự phòng tài chính, Quỹ thặng dư vốn cổ phần"
            },
            { id: "f5r3q5", questionText: "Nghiệp vụ nhận tiền gửi của NHTM bao gồm những loại tiền gửi nào",
                options: [
                  "Chỉ tiền gửi tiết kiệm",
                  "Tiền gửi giao dịch (thanh toán), Tiền gửi phi giao dịch (tiết kiệm, có kỳ hạn), Tiền gửi của các ngân hàng khác",
                  "Chỉ tiền gửi không kỳ hạn",
                  "Chỉ tiền gửi bằng ngoại tệ"
                ],
                correctAnswer: "Tiền gửi giao dịch (thanh toán), Tiền gửi phi giao dịch (tiết kiệm, có kỳ hạn), Tiền gửi của các ngân hàng khác"
            },
            { id: "f5r3q6", questionText: "NHTM phát hành các loại giấy tờ có giá nào để huy động vốn",
                options: [
                  "Chỉ có cổ phiếu",
                  "Chỉ có tín phiếu kho bạc",
                  "Kỳ phiếu, chứng chỉ tiền gửi, trái phiếu và các loại khác khi được NHTW chấp thuận",
                  "Hối phiếu thương mại"
                ],
                correctAnswer: "Kỳ phiếu, chứng chỉ tiền gửi, trái phiếu và các loại khác khi được NHTW chấp thuận"
            },
            { id: "f5r3q7", questionText: "NHTM có thể vay vốn từ đâu để bổ sung nguồn vốn hoạt động",
                options: [
                  "Chỉ vay từ khách hàng cá nhân",
                  "Vay từ các Tổ chức tín dụng khác (thị trường liên ngân hàng) và vay từ Ngân hàng Trung ương (tái cấp vốn)",
                  "Chỉ vay từ Chính phủ",
                  "Chỉ vay từ nước ngoài"
                ],
                correctAnswer: "Vay từ các Tổ chức tín dụng khác (thị trường liên ngân hàng) và vay từ Ngân hàng Trung ương (tái cấp vốn)"
            },
            { id: "f5r3q8", questionText: "Nguồn vốn ủy thác của NHTM là gì",
                options: [
                  "Nguồn vốn nhận từ các tổ chức, cá nhân khác để thực hiện cho vay, đầu tư,... theo yêu cầu của bên ủy thác",
                  "Nguồn vốn tự có của ngân hàng",
                  "Lợi nhuận chưa phân phối",
                  "Tiền gửi không kỳ hạn"
                ],
                correctAnswer: "Nguồn vốn nhận từ các tổ chức, cá nhân khác để thực hiện cho vay, đầu tư,... theo yêu cầu của bên ủy thác"
            },
            { id: "f5r3q9", questionText: "Nghiệp vụ sử dụng vốn quan trọng nhất và mang lại thu nhập chủ yếu cho NHTM là gì",
                options: [
                  "Nhận tiền gửi",
                  "Nghiệp vụ cho vay (cấp tín dụng)",
                  "Nghiệp vụ thanh toán hộ",
                  "Nghiệp vụ ngân quỹ"
                ],
                correctAnswer: "Nghiệp vụ cho vay (cấp tín dụng)"
            },
            { id: "f5r3q10", questionText: "Các hình thức cấp tín dụng phổ biến của NHTM bao gồm",
                options: [
                  "Chỉ cho vay tín chấp",
                  "Chỉ cho vay thế chấp",
                  "Cho vay (tín chấp, thế chấp), chiết khấu, cho thuê tài chính, bảo lãnh ngân hàng và các hình thức khác",
                  "Chỉ chiết khấu thương phiếu"
                ],
                correctAnswer: "Cho vay (tín chấp, thế chấp), chiết khấu, cho thuê tài chính, bảo lãnh ngân hàng và các hình thức khác"
            }
        ], 
        reward: { xp: 50, gold: 45 } 
    },
    
    { roomNumber: 4,  
        type: 'puzzle', 
        questionsToComplete: 5,
        questionsInRoom: [
            { id: "f5r4q1", questionText: "Quy trình cho vay của NHTM thường bao gồm các bước nào",
                options: [
                  "Chỉ có giải ngân và thu nợ",
                  "Nhận hồ sơ -> Giải ngân -> Thu nợ",
                  "Phân tích (thẩm định) -> Quyết định và ký hợp đồng -> Giải ngân và giám sát -> Thu nợ và xử lý (nếu có)",
                  "Lập hợp đồng -> Thu nợ -> Giải ngân"
                ],
                correctAnswer: "Phân tích (thẩm định) -> Quyết định và ký hợp đồng -> Giải ngân và giám sát -> Thu nợ và xử lý (nếu có)"
            },
            { id: "f5r4q2", questionText: "Rủi ro lớn nhất mà NHTM phải đối mặt trong nghiệp vụ cho vay là gì",
                options: [
                  "Rủi ro lãi suất",
                  "Rủi ro tỷ giá",
                  "Rủi ro tín dụng (khách hàng không trả được nợ)",
                  "Rủi ro hoạt động"
                ],
                correctAnswer: "Rủi ro tín dụng (khách hàng không trả được nợ)"
            },
            { id: "f5r4q3", questionText: "Nghiệp vụ đầu tư của NHTM là việc ngân hàng sử dụng vốn để làm gì",
                options: [
                  "Chỉ để cho vay khách hàng",
                  "Mua các tài sản tài chính (công cụ thị trường tiền tệ, vốn, chứng khoán hóa,...) nhằm mục đích sinh lời và/hoặc thanh khoản",
                  "Xây dựng trụ sở mới",
                  "Trả lương nhân viên"
                ],
                correctAnswer: "Mua các tài sản tài chính (công cụ thị trường tiền tệ, vốn, chứng khoán hóa,...) nhằm mục đích sinh lời và/hoặc thanh khoản"
            },
            { id: "f5r4q4", questionText: "NHTM đầu tư vào các công cụ trên thị trường tiền tệ chủ yếu nhằm mục đích gì",
                options: [
                  "Thu lợi nhuận cao dài hạn",
                  "Đảm bảo khả năng thanh khoản và sinh lời ngắn hạn",
                  "Nắm quyền kiểm soát doanh nghiệp khác",
                  "Giảm thiểu rủi ro tín dụng"
                ],
                correctAnswer: "Đảm bảo khả năng thanh khoản và sinh lời ngắn hạn"
            },
            { id: "f5r4q5", questionText: "Nghiệp vụ bảo lãnh ngân hàng là gì",
                options: [
                  "Ngân hàng đứng ra vay hộ khách hàng",
                  "Ngân hàng cam kết bằng văn bản sẽ thực hiện nghĩa vụ tài chính thay cho khách hàng nếu khách hàng không thực hiện đúng cam kết",
                  "Ngân hàng bảo hiểm cho khoản tiền gửi của khách hàng",
                  "Ngân hàng tư vấn đầu tư cho khách hàng"
                ],
                correctAnswer: "Ngân hàng cam kết bằng văn bản sẽ thực hiện nghĩa vụ tài chính thay cho khách hàng nếu khách hàng không thực hiện đúng cam kết"
            },
        ], 
        reward: { items: [{ id: 'potion_small', qty: 1 }], gold: 50 } 
    },

    { roomNumber: 5, 
        type: 'safe_room', 
    },

    { roomNumber: 6, 
        type: 'boss', 
        questionsToComplete: 15, 
        monsterId: 'reawakened_pharaoh', 
        questionsInRoom: [
            { id: "f5r6q1", questionText: "Nghiệp vụ thanh toán hộ của NHTM thể hiện chức năng nào của ngân hàng",
                options: [
                  "Trung gian tín dụng",
                  "Trung gian thanh toán",
                  "Tạo tiền",
                  "Quản lý tài sản"
                ],
                correctAnswer: "Trung gian thanh toán"
            },
            { id: "f5r6q2", questionText: "Để thực hiện thanh toán qua ngân hàng, điều kiện tiên quyết đối với khách hàng là gì",
                options: [
                  "Phải có tài sản thế chấp",
                  "Phải mở tài khoản tại ngân hàng",
                  "Phải là doanh nghiệp lớn",
                  "Phải có quốc tịch Việt Nam"
                ],
                correctAnswer: "Phải mở tài khoản tại ngân hàng"
            },
            { id: "f5r6q3", questionText: "Đặc điểm của thanh toán qua ngân hàng (thanh toán không dùng tiền mặt) là gì",
                options: [
                  "Tiền mặt là vật môi giới chính",
                  "Vật môi giới là tiền ghi sổ (tiền kế toán), tiền chuyển khoản qua tài khoản ngân hàng",
                  "Chỉ áp dụng cho các giao dịch nhỏ lẻ",
                  "Diễn ra chậm chạp và tốn kém"
                ],
                correctAnswer: "Vật môi giới là tiền ghi sổ (tiền kế toán), tiền chuyển khoản qua tài khoản ngân hàng"
            },
            { id: "f5r6q4", questionText: "Vai trò của thanh toán qua ngân hàng trong lĩnh vực lưu thông tiền tệ là gì",
                options: [
                  "Giảm tỷ trọng tiền mặt, tiết kiệm chi phí lưu thông, tạo thuận lợi cho việc điều hòa tiền tệ",
                  "Làm tăng lượng tiền mặt trong lưu thông",
                  "Gây khó khăn cho việc quản lý tiền tệ",
                  "Làm tăng chi phí lưu thông"
                ],
                correctAnswer: "Giảm tỷ trọng tiền mặt, tiết kiệm chi phí lưu thông, tạo thuận lợi cho việc điều hòa tiền tệ"
            },
            { id: "f5r6q5", questionText: "Vai trò của thanh toán qua ngân hàng trong lĩnh vực tín dụng là gì",
                options: [
                  "Hạn chế khả năng cho vay của ngân hàng",
                  "Tạo khả năng tập trung vốn tín dụng vào hệ thống ngân hàng để tái đầu tư",
                  "Làm giảm hiệu quả sử dụng vốn",
                  "Không liên quan đến hoạt động tín dụng"
                ],
                correctAnswer: "Tạo khả năng tập trung vốn tín dụng vào hệ thống ngân hàng để tái đầu tư"
            },
            { id: "f5r6q6", questionText: "Các hình thức thanh toán không dùng tiền mặt phổ biến tại Việt Nam bao gồm",
                options: [
                  "Chỉ có séc và ủy nhiệm chi",
                  "Séc, Ủy nhiệm chi (UNC), Ủy nhiệm thu (UNT), Thẻ ngân hàng,... (nội địa) và các hình thức TTQT khác",
                  "Chỉ có thẻ ngân hàng",
                  "Chỉ có chuyển tiền điện tử"
                ],
                correctAnswer: "Séc, Ủy nhiệm chi (UNC), Ủy nhiệm thu (UNT), Thẻ ngân hàng,... (nội địa) và các hình thức TTQT khác"
            },
            { id: "f5r6q7", questionText: "Séc chuyển khoản là gì?",
                options: [
                  "Lệnh của người bán đòi tiền người mua",
                  "Lệnh của chủ tài khoản yêu cầu ngân hàng trích tiền từ tài khoản của mình để trả cho người thụ hưởng có tên trên séc thông qua chuyển khoản",
                  "Giấy xác nhận nợ của ngân hàng",
                  "Thẻ dùng để rút tiền mặt"
                ],
                correctAnswer: "Lệnh của chủ tài khoản yêu cầu ngân hàng trích tiền từ tài khoản của mình để trả cho người thụ hưởng có tên trên séc thông qua chuyển khoản"
            },
            { id: "f5r6q8", questionText: "Ủy nhiệm chi (Payment Order) là gì?",
                options: [
                  "Lệnh của người thụ hưởng yêu cầu ngân hàng thu tiền",
                  "Lệnh của chủ tài khoản (người trả tiền) yêu cầu ngân hàng phục vụ mình trích tiền từ tài khoản để trả cho người thụ hưởng",
                  "Cam kết trả tiền của ngân hàng",
                  "Một loại thẻ tín dụng"
                ],
                correctAnswer: "Lệnh của chủ tài khoản (người trả tiền) yêu cầu ngân hàng phục vụ mình trích tiền từ tài khoản để trả cho người thụ hưởng"
            },
            { id: "f5r6q9", questionText: "Ủy nhiệm thu (Collection Order) là gì?",
                options: [
                  "Lệnh của người trả tiền yêu cầu ngân hàng chi tiền",
                  "Lệnh của người thụ hưởng yêu cầu ngân hàng phục vụ mình thu hộ tiền từ người trả tiền",
                  "Séc do ngân hàng phát hành",
                  "Giấy tờ có giá"
                ],
                correctAnswer: "Lệnh của người thụ hưởng yêu cầu ngân hàng phục vụ mình thu hộ tiền từ người trả tiền"
            },
            { id: "f5r6q10", questionText: "Thẻ ngân hàng được sử dụng để làm gì",
                options: [
                  "Thanh toán tiền hàng hóa, dịch vụ tại các điểm chấp nhận thẻ (POS) và rút tiền mặt tại ATM/quầy giao dịch",
                  "Chỉ để rút tiền mặt",
                  "Chỉ để thanh toán trực tuyến",
                  "Làm giấy tờ tùy thân"
                ],
                correctAnswer: "Thanh toán tiền hàng hóa, dịch vụ tại các điểm chấp nhận thẻ (POS) và rút tiền mặt tại ATM/quầy giao dịch"
            },
            { id: "f5r6q11", questionText: "Thanh toán bằng thư tín dụng (Letter of Credit - L/C) thường được sử dụng trong lĩnh vực nào",
                options: [
                  "Thanh toán nội địa giữa cá nhân",
                  "Trả lương cho nhân viên",
                  "Thanh toán quốc tế (ngoại thương)",
                  "Mua bán chứng khoán"
                ],
                correctAnswer: "Thanh toán quốc tế (ngoại thương)"
            },
            { id: "f5r6q12", questionText: "Trong phương thức thanh toán bằng L/C, ngân hàng đóng vai trò gì",
                options: [
                  "Chỉ là người chuyển tiền hộ",
                  "Đứng ra cam kết trả tiền cho người xuất khẩu (người thụ hưởng) nếu họ xuất trình bộ chứng từ phù hợp với các điều khoản của L/C",
                  "Chỉ là người thu hộ tiền",
                  "Là người mua hàng hóa"
                ],
                correctAnswer: "Đứng ra cam kết trả tiền cho người xuất khẩu (người thụ hưởng) nếu họ xuất trình bộ chứng từ phù hợp với các điều khoản của L/C"
            },
            { id: "f5r6q13", questionText: "Phương thức thanh toán nhờ thu (Collection) có đặc điểm gì so với L/C",
                options: [
                  "An toàn hơn cho người bán",
                  "Ít an toàn hơn cho người bán, ngân hàng chỉ đóng vai trò trung gian thu hộ tiền/chấp nhận thanh toán theo chỉ thị của người bán, không cam kết trả tiền",
                  "Phức tạp hơn L/C",
                  "Chỉ áp dụng khi người mua trả tiền trước"
                ],
                correctAnswer: "Ít an toàn hơn cho người bán, ngân hàng chỉ đóng vai trò trung gian thu hộ tiền/chấp nhận thanh toán theo chỉ thị của người bán, không cam kết trả tiền"
            },
            { id: "f5r6q14", questionText: "Tài sản nào chiếm tỷ trọng lớn nhất trong cơ cấu tài sản của NHTM?",
                options: [
                  "Tiền mặt và dự trữ",
                  "Các khoản cho vay (Tín dụng)",
                  "Đầu tư chứng khoán",
                  "Tài sản cố định"
                ],
                correctAnswer: "Các khoản cho vay (Tín dụng)"
            },
            { id: "f5r6q15", questionText: "Nguồn vốn nào chiếm tỷ trọng lớn nhất trong cơ cấu nguồn vốn của NHTM?",
                options: [
                  "Tiền gửi của khách hàng (tổ chức và cá nhân)",
                  "Vốn chủ sở hữu",
                  "Vốn vay liên ngân hàng và NHTW",
                  "Phát hành giấy tờ có giá"
                ],
                correctAnswer: "Tiền gửi của khách hàng (tổ chức và cá nhân)"
            }
        ], 
        reward: { xp: 200, goldRange: [250, 350] } }
];

const floor6Data = [
    null,
    { roomNumber: 1, 
        type: 'safe_room',
        arenaBackground: 'images/arena_backgrounds/throne_room_arena.png', 
    },

    {   roomNumber: 2,
        type: 'boss', 
        questionsToComplete: 50, 
        monsterId: 'ignoramus_final', 
        questionsInRoom: [
            { id: "f6r2q1", questionText: "Chênh lệch giữa lãi suất cho vay và lãi suất huy động (tiền gửi) được gọi là gì và có vai trò gì với NHTM?",
                options: [
                  "Lợi tức cổ phần, dùng để trả cổ tức",
                  "Chênh lệch lãi suất (NIM - Net Interest Margin), là nguồn thu nhập chính của NHTM",
                  "Phí dịch vụ, dùng để bù đắp chi phí hoạt động",
                  "Dự phòng rủi ro, dùng để xử lý nợ xấu"
                ],
                correctAnswer: "Chênh lệch lãi suất (NIM - Net Interest Margin), là nguồn thu nhập chính của NHTM"
            },
            { id: "f6r2q2", questionText: "Tại sao NHTM cần phải duy trì một tỷ lệ vốn chủ sở hữu nhất định?",
                options: [
                  "Để trả lương cho nhân viên",
                  "Để đảm bảo khả năng chống đỡ rủi ro (đệm an toàn vốn), duy trì lòng tin của khách hàng và đáp ứng quy định an toàn vốn của cơ quan quản lý",
                  "Để cạnh tranh với các ngân hàng khác",
                  "Để tối đa hóa lợi nhuận ngay lập tức"
                ],
                correctAnswer: "Để đảm bảo khả năng chống đỡ rủi ro (đệm an toàn vốn), duy trì lòng tin của khách hàng và đáp ứng quy định an toàn vốn của cơ quan quản lý"
            },
            { id: "f6r2q3", questionText: "Ngân hàng nào sau đây là NHTM Cổ phần tại Việt Nam? (Kiến thức thực tế)",
                options: [
                  "Agribank (NH Nông nghiệp và Phát triển Nông thôn)",
                  "Vietcombank (NH TMCP Ngoại thương VN - Nhà nước nắm cổ phần chi phối)",
                  "Techcombank (NH TMCP Kỹ thương Việt Nam)",
                  "Ngân hàng Nhà nước Việt Nam"
                ],
                correctAnswer: "Techcombank (NH TMCP Kỹ thương Việt Nam)"
            },
            { id: "f6r2q4", questionText: "NHTM Liên doanh là ngân hàng được thành lập như thế nào?",
                options: [
                  "Do 100% vốn đầu tư nước ngoài",
                  "Bằng vốn góp của bên Việt Nam và bên nước ngoài trên cơ sở hợp đồng liên doanh",
                  "Do Nhà nước Việt Nam thành lập",
                  "Do các NHTM trong nước góp vốn"
                ],
                correctAnswer: "Bằng vốn góp của bên Việt Nam và bên nước ngoài trên cơ sở hợp đồng liên doanh"
            },
            { id: "f6r2q5", questionText: "Tài chính quốc tế (TCQT) nghiên cứu các vấn đề gì?",
                options: [
                  "Chỉ thị trường tài chính trong nước",
                  "Chỉ chính sách tiền tệ của NHTW",
                  "Các luồng chu chuyển vốn, thanh toán, tỷ giá hối đoái, cán cân thanh toán giữa các quốc gia và các định chế tài chính quốc tế",
                  "Chỉ ngân sách nhà nước"
                ],
                correctAnswer: "Các luồng chu chuyển vốn, thanh toán, tỷ giá hối đoái, cán cân thanh toán giữa các quốc gia và các định chế tài chính quốc tế"
            },
            { id: "f6r2q6", questionText: "Cán cân thanh toán quốc tế (Balance of Payments - BOP) được định nghĩa là gì",
                options: [
                  "Bảng cân đối kế toán của một quốc gia",
                  "Báo cáo kết quả kinh doanh của một quốc gia",
                  "Bảng báo cáo thống kê ghi chép có hệ thống tất cả các giao dịch kinh tế giữa người cư trú của một quốc gia với người không cư trú trong một thời kỳ nhất định",
                  "Bảng kê khai tài sản của chính phủ"
                ],
                correctAnswer: "Bảng báo cáo thống kê ghi chép có hệ thống tất cả các giao dịch kinh tế giữa người cư trú của một quốc gia với người không cư trú trong một thời kỳ nhất định"
            },
            { id: "f6r2q7", questionText: "Nguyên tắc kế toán cơ bản được áp dụng khi lập BOP là gì?",
                options: [
                  "Nguyên tắc giá gốc",
                  "Nguyên tắc thận trọng",
                  "Nguyên tắc ghi sổ kép (double-entry bookkeeping)",
                  "Nguyên tắc hoạt động liên tục"
                ],
                correctAnswer: "Nguyên tắc ghi sổ kép (double-entry bookkeeping)"
            },
            { id: "f6r2q8", questionText: "Trong BOP, một giao dịch làm tăng tài sản hoặc giảm nợ phải trả của quốc gia (dẫn đến luồng tiền vào) sẽ được ghi vào bên nào?",
                options: [
                  "Bên Nợ (Debit)",
                  "Bên Có (Credit)",
                  "Không ghi vào BOP",
                  "Ghi vào mục lỗi và sai sót"
                ],
                correctAnswer: "Bên Nợ (Debit)"
            },
            { id: "f6r2q9", questionText: "Trong BOP, một giao dịch làm giảm tài sản hoặc tăng nợ phải trả của quốc gia (dẫn đến luồng tiền ra) sẽ được ghi vào bên nào?",
                options: [
                  "Bên Nợ (Debit)",
                  "Bên Có (Credit)",
                  "Ghi âm vào bên Có",
                  "Ghi vào mục dự trữ"
                ],
                correctAnswer: "Bên Nợ (Debit)"
            },
            { id: "f6r2q10", questionText: "Phân loại BOP theo thời gian, có mấy loại chính",
                options: [
                  "Chỉ có BOP thời điểm",
                  "Chỉ có BOP thời kỳ",
                  "BOP thời điểm và BOP thời kỳ",
                  "BOP năm và BOP quý"
                ],
                correctAnswer: "BOP thời điểm và BOP thời kỳ"
            },
            { id: "f6r2q11", questionText: "Đồng tiền sử dụng để ghi chép BOP đối với các nước có đồng tiền không tự do chuyển đổi thường là gì",
                options: [
                  "Luôn là đồng nội tệ",
                  "Thường là một ngoại tệ mạnh, được sử dụng phổ biến trong thanh toán quốc tế (ví dụ: USD)",
                  "Luôn là vàng",
                  "Bất kỳ đồng tiền nào theo thỏa thuận"
                ],
                correctAnswer: "Thường là một ngoại tệ mạnh, được sử dụng phổ biến trong thanh toán quốc tế (ví dụ: USD)"
            },
            { id: "f6r2q12", questionText: "Ý nghĩa của việc phân tích BOP là gì",
                options: [
                  "Chỉ để biết số dư ngân sách",
                  "Đánh giá tình hình kinh tế đối ngoại, khả năng cạnh tranh, cung cầu ngoại tệ, làm căn cứ điều chỉnh tỷ giá và chính sách kinh tế vĩ mô",
                  "Chỉ để tính GDP",
                  "Chỉ phục vụ mục đích thống kê"
                ],
                correctAnswer: "Đánh giá tình hình kinh tế đối ngoại, khả năng cạnh tranh, cung cầu ngoại tệ, làm căn cứ điều chỉnh tỷ giá và chính sách kinh tế vĩ mô"
            },
            { id: "f6r2q13", questionText: "Kết cấu chính của BOP theo tiêu chuẩn quốc tế (ví dụ IMF) bao gồm những tài khoản lớn nào",
                options: [
                  "Chỉ có tài khoản vãng lai",
                  "Chỉ có tài khoản vốn và tài khoản tài chính",
                  "Tài khoản vãng lai, Tài khoản vốn, Tài khoản tài chính, Lỗi và sai sót, Tài khoản tổng thể (và thay đổi dự trữ)",
                  "Tài khoản thương mại, Tài khoản dịch vụ, Tài khoản thu nhập"
                ],
                correctAnswer: "Tài khoản vãng lai, Tài khoản vốn, Tài khoản tài chính, Lỗi và sai sót, Tài khoản tổng thể (và thay đổi dự trữ)"
            },
            { id: "f6r2q14", questionText: "Cán cân vãng lai (Current Account - CA) phản ánh các giao dịch nào",
                options: [
                  "Trao đổi hàng hóa, dịch vụ, thu nhập (sơ cấp) và chuyển giao vãng lai một chiều (thu nhập thứ cấp)",
                  "Chỉ mua bán vốn và tài sản tài chính",
                  "Chỉ các khoản vay nợ quốc tế",
                  "Chỉ thay đổi dự trữ ngoại hối"
                ],
                correctAnswer: "Trao đổi hàng hóa, dịch vụ, thu nhập (sơ cấp) và chuyển giao vãng lai một chiều (thu nhập thứ cấp)"
            },
            { id: "f6r2q15", questionText: "Cán cân thương mại (Trade Balance) là chênh lệch giữa",
                options: [
                  "Giá trị xuất khẩu dịch vụ và nhập khẩu dịch vụ",
                  "Giá trị xuất khẩu hàng hóa và nhập khẩu hàng hóa (thường tính theo giá FOB)",
                  "Thu nhập từ yếu tố sản xuất và chi trả cho yếu tố sản xuất",
                  "Chuyển tiền vào và chuyển tiền ra"
                ],
                correctAnswer: "Giá trị xuất khẩu hàng hóa và nhập khẩu hàng hóa (thường tính theo giá FOB)"
            },
            { id: "f6r2q16", questionText: "Khi giá trị xuất khẩu hàng hóa lớn hơn giá trị nhập khẩu hàng hóa, cán cân thương mại ở trạng thái nào?",
                options: [
                  "Thâm hụt (Deficit)",
                  "Thặng dư (Surplus)",
                  "Cân bằng (Balanced)",
                  "Không xác định"
                ],
                correctAnswer: "Thâm hụt (Deficit)"
            },
            { id: "f6r2q17", questionText: "Cán cân dịch vụ (Service Balance) bao gồm các khoản thu chi từ hoạt động nào",
                options: [
                  "Chỉ vận tải và du lịch",
                  "Vận tải, du lịch, bảo hiểm, bưu chính, viễn thông, ngân hàng, xây dựng, thông tin,... giữa người cư trú và không cư trú",
                  "Chỉ kiều hối",
                  "Chỉ đầu tư trực tiếp"
                ],
                correctAnswer: "Vận tải, du lịch, bảo hiểm, bưu chính, viễn thông, ngân hàng, xây dựng, thông tin,... giữa người cư trú và không cư trú"
            },
            { id: "f6r2q18", questionText: "Cán cân thu nhập sơ cấp (Primary Income) ghi nhận luồng thu nhập nào",
                options: [
                  "Chỉ tiền lương của người lao động làm việc ở nước ngoài",
                  "Thu nhập trả cho/nhận từ yếu tố sản xuất (lao động, vốn) như lương, lợi nhuận đầu tư, lãi vay/cho vay",
                  "Chỉ viện trợ không hoàn lại",
                  "Chỉ tiền bản quyền, nhãn hiệu"
                ],
                correctAnswer: "Thu nhập trả cho/nhận từ yếu tố sản xuất (lao động, vốn) như lương, lợi nhuận đầu tư, lãi vay/cho vay"
            },
            { id: "f6r2q19", questionText: "Cán cân thu nhập thứ cấp (Secondary Income) hay Chuyển giao vãng lai một chiều (Current Transfers) bao gồm chủ yếu khoản nào",
                options: [
                  "Lãi tiền vay",
                  "Lợi nhuận đầu tư",
                  "Các khoản chuyển giao không hoàn lại như kiều hối, viện trợ nhân đạo, quà tặng, quà biếu cho mục đích tiêu dùng",
                  "Mua bán cổ phiếu"
                ],
                correctAnswer: "Các khoản chuyển giao không hoàn lại như kiều hối, viện trợ nhân đạo, quà tặng, quà biếu cho mục đích tiêu dùng"
            },
            { id: "f6r2q20", questionText: "Tài khoản vốn (Capital Account) trong BOP (theo phân loại mới) chủ yếu ghi nhận giao dịch nào",
                options: [
                  "Mua bán hàng hóa",
                  "Chuyển giao vốn một chiều (viện trợ đầu tư, xóa nợ) và mua bán tài sản phi tài chính, phi sản xuất (đất đai, bằng sáng chế, bản quyền...)",
                  "Đầu tư trực tiếp FDI",
                  "Thay đổi dự trữ ngoại hối"
                ],
                correctAnswer: "Chuyển giao vốn một chiều (viện trợ đầu tư, xóa nợ) và mua bán tài sản phi tài chính, phi sản xuất (đất đai, bằng sáng chế, bản quyền...)"
            },
            { id: "f6r2q21", questionText: "Tài khoản tài chính (Financial Account) phản ánh sự thay đổi về cái gì",
                options: [
                  "Thu nhập quốc dân",
                  "Quyền sở hữu tài sản tài chính và nợ phải trả tài chính của quốc gia đối với phần còn lại của thế giới (FDI, FPI, đầu tư khác)",
                  "Cung cầu hàng hóa trong nước",
                  "Ngân sách chính phủ"
                ],
                correctAnswer: "Quyền sở hữu tài sản tài chính và nợ phải trả tài chính của quốc gia đối với phần còn lại của thế giới (FDI, FPI, đầu tư khác)"
            },
            { id: "f6r2q22", questionText: "Đầu tư trực tiếp nước ngoài (FDI) có đặc điểm gì",
                options: [
                  "Nhà đầu tư nước ngoài tham gia kiểm soát hoặc có ảnh hưởng đáng kể đến hoạt động của doanh nghiệp nhận đầu tư, thường kèm chuyển giao công nghệ, quản lý",
                  "Chỉ mua cổ phiếu với tỷ lệ nhỏ",
                  "Chỉ cho vay ngắn hạn",
                  "Đầu tư vào trái phiếu chính phủ"
                ],
                correctAnswer: "Nhà đầu tư nước ngoài tham gia kiểm soát hoặc có ảnh hưởng đáng kể đến hoạt động của doanh nghiệp nhận đầu tư, thường kèm chuyển giao công nghệ, quản lý"
            },
            { id: "f6r2q23", questionText: "Đầu tư gián tiếp nước ngoài (FPI - Foreign Portfolio Investment) là hình thức đầu tư nào",
                options: [
                  "Đầu tư vào giấy tờ có giá (cổ phiếu, trái phiếu, công cụ thị trường tiền tệ,...) với mục đích chính là lợi nhuận tài chính, không nhằm kiểm soát doanh nghiệp",
                  "Đầu tư xây dựng nhà máy mới",
                  "Chuyển giao công nghệ",
                  "Cho vay ưu đãi của chính phủ"
                ],
                correctAnswer: "Đầu tư vào giấy tờ có giá (cổ phiếu, trái phiếu, công cụ thị trường tiền tệ,...) với mục đích chính là lợi nhuận tài chính, không nhằm kiểm soát doanh nghiệp"
            },
            { id: "f6r2q24", questionText: "Mục 'Đầu tư khác' trong Tài khoản tài chính bao gồm những giao dịch nào",
                options: [
                  "Chỉ có FDI",
                  "Chỉ có FPI",
                  "Các giao dịch không thuộc FDI, FPI như tín dụng thương mại, vay/cho vay nước ngoài (không phải dạng trái phiếu/cổ phiếu), tiền và tiền gửi ở nước ngoài",
                  "Chỉ có kiều hối"
                ],
                correctAnswer: "Các giao dịch không thuộc FDI, FPI như tín dụng thương mại, vay/cho vay nước ngoài (không phải dạng trái phiếu/cổ phiếu), tiền và tiền gửi ở nước ngoài"
            },
            { id: "f6r2q25", questionText: "Mục Lỗi và sai sót thống kê (Errors and Omissions - OM) trong BOP phản ánh điều gì",
                options: [
                  "Chênh lệch giữa xuất khẩu và nhập khẩu",
                  "Thay đổi trong dự trữ ngoại hối",
                  "Sự khác biệt giữa tổng các khoản ghi Có và tổng các khoản ghi Nợ của tất cả các hạng mục khác đã được thống kê (do số liệu không đầy đủ, không chính xác)",
                  "Thâm hụt hoặc thặng dư ngân sách"
                ],
                correctAnswer: "Sự khác biệt giữa tổng các khoản ghi Có và tổng các khoản ghi Nợ của tất cả các hạng mục khác đã được thống kê (do số liệu không đầy đủ, không chính xác)"
            },
            { id: "f6r2q26", questionText: "Về mặt lý thuyết, tổng của Tài khoản vãng lai, Tài khoản vốn, Tài khoản tài chính và Lỗi và sai sót thống kê phải bằng gì?",
                options: [
                  "Luôn dương",
                  "Luôn âm",
                  "Bằng 0 (do nguyên tắc ghi sổ kép)",
                  "Bằng dự trữ ngoại hối"
                ],
                correctAnswer: "Bằng 0 (do nguyên tắc ghi sổ kép)"
            },
            { id: "f6r2q27", questionText: "Cán cân tổng thể (Overall Balance - OB) được tính như thế nào",
                options: [
                  "OB = Tài khoản vãng lai + Tài khoản vốn + Tài khoản tài chính + Lỗi và sai sót (Hoặc đôi khi định nghĩa là tổng các giao dịch tự định, loại trừ giao dịch dự trữ)",
                  "OB = Xuất khẩu - Nhập khẩu",
                  "OB = Thay đổi dự trữ ngoại hối",
                  "OB = Thu nhập quốc dân - Tiêu dùng"
                ],
                correctAnswer: "OB = Tài khoản vãng lai + Tài khoản vốn + Tài khoản tài chính + Lỗi và sai sót (Hoặc đôi khi định nghĩa là tổng các giao dịch tự định, loại trừ giao dịch dự trữ)"
            }, 
            { id: "f6r2q28", questionText: "Mối quan hệ giữa Cán cân tổng thể (OB) và Thay đổi dự trữ chính thức (∆R) là gì",
                options: [
                  "OB = ∆R",
                  "OB = - ∆R (nghĩa là thặng dư OB dẫn đến tăng dự trữ, thâm hụt OB dẫn đến giảm dự trữ)",
                  "OB + ∆R = 0 (Cách viết khác của câu b)",
                  "Không có mối quan hệ"
                ],
                correctAnswer: "OB = - ∆R (nghĩa là thặng dư OB dẫn đến tăng dự trữ, thâm hụt OB dẫn đến giảm dự trữ)"
            },
            { id: "f6r2q29", questionText: "Khi BOP (hay Cán cân tổng thể OB) bị thâm hụt (OB < 0), quốc gia đó phải tài trợ bằng cách nào",
                options: [
                  "Tăng cường xuất khẩu vàng",
                  "Giảm dự trữ ngoại hối (bán ngoại tệ), tăng vay nợ nước ngoài, thu hút vốn đầu tư, hoặc các biện pháp bảo hộ",
                  "Tăng cường cho vay ra nước ngoài",
                  "Giảm nhập khẩu kiều hối"
                ],
                correctAnswer: "Giảm dự trữ ngoại hối (bán ngoại tệ), tăng vay nợ nước ngoài, thu hút vốn đầu tư, hoặc các biện pháp bảo hộ"
            },
            { id: "f6r2q30", questionText: "Khi BOP (hay Cán cân tổng thể OB) bị thặng dư (OB > 0), quốc gia đó có thể làm gì với số ngoại tệ dư thừa",
                options: [
                  "Bổ sung vào dự trữ ngoại hối, chuyển vốn ra nước ngoài đầu tư, trả nợ nước ngoài trước hạn",
                  "Tăng cường nhập khẩu vàng",
                  "Đi vay thêm nợ nước ngoài",
                  "Hạn chế đầu tư trong nước"
                ],
                correctAnswer: "Bổ sung vào dự trữ ngoại hối, chuyển vốn ra nước ngoài đầu tư, trả nợ nước ngoài trước hạn"
            },
            { id: "f6r2q31", questionText: "Biện pháp nào thường được sử dụng để điều chỉnh BOP khi bị thâm hụt",
                options: [
                  "Chính sách cắt giảm chi tiêu (tài khóa thắt chặt), Chính sách tiền tệ thắt chặt (tăng lãi suất), Phá giá đồng tiền, Thu hút FDI/vay nợ, kiểm soát trực tiếp",
                  "Tăng chi tiêu công, giảm lãi suất",
                  "Nâng giá đồng tiền",
                  "Khuyến khích đầu tư ra nước ngoài"
                ],
                correctAnswer: "Chính sách cắt giảm chi tiêu (tài khóa thắt chặt), Chính sách tiền tệ thắt chặt (tăng lãi suất), Phá giá đồng tiền, Thu hút FDI/vay nợ, kiểm soát trực tiếp"
            },
            { id: "f6r2q32", questionText: "Biện pháp nào thường được sử dụng để điều chỉnh BOP khi bị thặng dư",
                options: [
                  "Hạn chế nhập khẩu",
                  "Khuyến khích đầu tư trong nước/ra nước ngoài, nới lỏng chính sách tiền tệ/tài khóa (nếu cần), bổ sung dự trữ ngoại hối, nâng giá đồng tiền (ít dùng)",
                  "Tăng lãi suất",
                  "Thu hút thêm kiều hối"
                ],
                correctAnswer: "Khuyến khích đầu tư trong nước/ra nước ngoài, nới lỏng chính sách tiền tệ/tài khóa (nếu cần), bổ sung dự trữ ngoại hối, nâng giá đồng tiền (ít dùng)"
            },
            { id: "f6r2q33", questionText: "Thị trường ngoại hối (Foreign Exchange Market) là nơi diễn ra hoạt động gì?",
                options: [
                  "Mua bán cổ phiếu quốc tế",
                  "Cho vay và đi vay quốc tế",
                  "Mua bán các đồng tiền của các quốc gia khác nhau (ngoại tệ)",
                  "Giao dịch hàng hóa quốc tế"
                ],
                correctAnswer: "Mua bán các đồng tiền của các quốc gia khác nhau (ngoại tệ)"
            },
            { id: "f6r2q34", questionText: "Chế độ tỷ giá hối đoái mà trong đó NHTW không can thiệp và tỷ giá hoàn toàn do cung cầu thị trường quyết định gọi là gì?",
                options: [
                  "Chế độ tỷ giá cố định",
                  "Chế độ tỷ giá thả nổi hoàn toàn",
                  "Chế độ tỷ giá thả nổi có quản lý",
                  "Chế độ bản vị vàng"
                ],
                correctAnswer: "Chế độ tỷ giá thả nổi hoàn toàn"
            },
            { id: "f6r2q35", questionText: "Chế độ tỷ giá thả nổi có quản lý (Managed Float) là chế độ như thế nào",
                options: [
                  "Tỷ giá cố định tuyệt đối",
                  "Tỷ giá hoàn toàn do thị trường quyết định",
                  "Tỷ giá biến động hàng ngày theo cung cầu nhưng NHTW có can thiệp (mua/bán ngoại tệ) để giữ tỷ giá trong một biên độ mong muốn hoặc tránh biến động quá mức",
                  "Tỷ giá được neo vào một rổ tiền tệ"
                ],
                correctAnswer: "Tỷ giá biến động hàng ngày theo cung cầu nhưng NHTW có can thiệp (mua/bán ngoại tệ) để giữ tỷ giá trong một biên độ mong muốn hoặc tránh biến động quá mức"
            },
            { id: "f6r2q36", questionText: "Hối phiếu (Bill of Exchange) là một phương tiện thanh toán quốc tế có đặc điểm gì",
                options: [
                  "Là mệnh lệnh đòi tiền vô điều kiện của người ký phát (người bán) yêu cầu người bị ký phát (người mua) trả một số tiền nhất định",
                  "Là cam kết trả tiền của người mua",
                  "Luôn phải có ngân hàng bảo lãnh",
                  "Chỉ có giá trị khi nhìn thấy"
                ],
                correctAnswer: "Là mệnh lệnh đòi tiền vô điều kiện của người ký phát (người bán) yêu cầu người bị ký phát (người mua) trả một số tiền nhất định"
            },
            { id: "f6r2q37", questionText: "Lệnh phiếu (Promissory Note) khác hối phiếu ở điểm nào",
                options: [
                  "Lệnh phiếu là lệnh đòi tiền",
                  "Lệnh phiếu là một cam kết trả tiền vô điều kiện của người lập phiếu (người mua/vay) cho người hưởng lợi",
                  "Lệnh phiếu không có kỳ hạn",
                  "Lệnh phiếu chỉ dùng trong thanh toán nội địa"
                ],
                correctAnswer: "Lệnh phiếu là một cam kết trả tiền vô điều kiện của người lập phiếu (người mua/vay) cho người hưởng lợi"
            },
            { id: "f6r2q38", questionText: "Séc (Cheque) sử dụng trong thanh toán quốc tế là gì",
                options: [
                  "Cam kết trả tiền của ngân hàng",
                  "Mệnh lệnh của chủ tài khoản yêu cầu ngân hàng trích tiền từ tài khoản của mình để trả cho người hưởng lợi (thường dùng cho các giao dịch nhỏ, chi phí cá nhân)",
                  "Hối phiếu do ngân hàng phát hành",
                  "Giấy chứng nhận tiền gửi quốc tế"
                ],
                correctAnswer: "Mệnh lệnh của chủ tài khoản yêu cầu ngân hàng trích tiền từ tài khoản của mình để trả cho người hưởng lợi (thường dùng cho các giao dịch nhỏ, chi phí cá nhân)"
            },
            { id: "f6r2q39", questionText: "Thẻ thanh toán quốc tế (Visa, MasterCard,...) có thể sử dụng để làm gì",
                options: [
                  "Chỉ rút tiền mặt ở nước ngoài",
                  "Chỉ thanh toán tại quốc gia phát hành thẻ",
                  "Thanh toán tiền hàng hóa, dịch vụ và rút tiền mặt tại các điểm chấp nhận thẻ trên toàn cầu",
                  "Chỉ dùng để đặt vé máy bay"
                ],
                correctAnswer: "Thanh toán tiền hàng hóa, dịch vụ và rút tiền mặt tại các điểm chấp nhận thẻ trên toàn cầu"
            },
            { id: "f6r2q40", questionText: "Tỷ giá hối đoái (Exchange Rate) được định nghĩa là gì",
                options: [
                  "Giá vàng trên thị trường quốc tế",
                  "Lãi suất cho vay ngoại tệ",
                  "Giá của một đồng tiền được biểu thị bằng một đồng tiền khác (tỷ lệ trao đổi giữa hai đồng tiền)",
                  "Chỉ số giá tiêu dùng quốc tế"
                ],
                correctAnswer: "Giá của một đồng tiền được biểu thị bằng một đồng tiền khác (tỷ lệ trao đổi giữa hai đồng tiền)"
            },
            { id: "f6r2q41", questionText: "Phương pháp yết giá trực tiếp là cách biểu thị tỷ giá như thế nào",
                options: [
                  "1 đơn vị nội tệ = ? đơn vị ngoại tệ",
                  "1 đơn vị ngoại tệ = ? đơn vị nội tệ",
                  "Giá vàng tính bằng nội tệ",
                  "Giá dầu tính bằng ngoại tệ"
                ],
                correctAnswer: "1 đơn vị nội tệ = ? đơn vị ngoại tệ"
              },
            { id: "f6r2q42", questionText: "Phương pháp yết giá gián tiếp là cách biểu thị tỷ giá như thế nào",
                options: [
                  "1 đơn vị nội tệ = ? đơn vị ngoại tệ",
                  "1 đơn vị ngoại tệ = ? đơn vị nội tệ",
                  "Giá vàng tính bằng ngoại tệ",
                  "Lãi suất nội tệ"
                ],
                correctAnswer: "1 đơn vị nội tệ = ? đơn vị ngoại tệ"
            },
            { id: "f6r2q43", questionText: "Khi cầu ngoại tệ tăng (cung không đổi), tỷ giá hối đoái (yết giá trực tiếp, VD: VND/USD) sẽ thay đổi thế nào",
                options: [
                  "Tăng lên (nội tệ giảm giá)",
                  "Giảm xuống (nội tệ tăng giá)",
                  "Không đổi",
                  "Phụ thuộc vào lãi suất"
                ],
                correctAnswer: "Tăng lên (nội tệ giảm giá)"
            },
            { id: "f6r2q44", questionText: "Khi cung ngoại tệ tăng (cầu không đổi), tỷ giá hối đoái (yết giá trực tiếp, VD: VND/USD) sẽ thay đổi thế nào",
                options: [
                  "Tăng lên (nội tệ giảm giá)",
                  "Giảm xuống (nội tệ tăng giá)",
                  "Không đổi",
                  "Phụ thuộc vào cán cân thương mại"
                ],
                correctAnswer: "Giảm xuống (nội tệ tăng giá)"
            },
            { id: "f6r2q45", questionText: "Khi một quốc gia có CCTTQT thâm hụt kéo dài, tỷ giá hối đoái (nội tệ/ngoại tệ) có xu hướng thay đổi thế nào",
                options: [
                  "Tăng lên (đồng nội tệ có xu hướng giảm giá do cầu ngoại tệ tăng)",
                  "Giảm xuống (đồng nội tệ có xu hướng tăng giá)",
                  "Ổn định",
                  "Không thể dự đoán"
                ],
                correctAnswer: "Tăng lên (đồng nội tệ có xu hướng giảm giá do cầu ngoại tệ tăng)"
            },
            { id: "f6r2q46", questionText: "Lạm phát trong nước cao hơn nước ngoài có xu hướng tác động đến tỷ giá hối đoái (nội tệ/ngoại tệ) như thế nào",
                options: [
                  "Tăng lên (đồng nội tệ mất giá so với ngoại tệ)",
                  "Giảm xuống (đồng nội tệ tăng giá so với ngoại tệ)",
                  "Không ảnh hưởng",
                  "Làm tỷ giá cố định"
                ],
                correctAnswer: "Tăng lên (đồng nội tệ mất giá so với ngoại tệ)"
            },
            { id: "f6r2q47", questionText: "Lãi suất trong nước tăng (so với nước ngoài) có xu hướng tác động đến tỷ giá hối đoái (nội tệ/ngoại tệ) như thế nào trong ngắn hạn",
                options: [
                  "Tăng lên (nội tệ giảm giá)",
                  "Giảm xuống (nội tệ tăng giá do thu hút luồng vốn vào)",
                  "Không đổi",
                  "Gây ra lạm phát"
                ],
                correctAnswer: "Giảm xuống (nội tệ tăng giá do thu hút luồng vốn vào)"
            },
            { id: "f6r2q48", questionText: "Khi NHTW bán ngoại tệ ra thị trường, đó là hành động gì và nhằm mục đích gì",
                options: [
                  "Can thiệp ngoại hối, nhằm giảm tỷ giá hối đoái (làm đồng nội tệ lên giá)",
                  "Can thiệp ngoại hối, nhằm tăng tỷ giá hối đoái (làm đồng nội tệ giảm giá)",
                  "Nghiệp vụ thị trường mở",
                  "Thực hiện chính sách tài khóa"
                ],
                correctAnswer: "Can thiệp ngoại hối, nhằm giảm tỷ giá hối đoái (làm đồng nội tệ lên giá)"
            },
            { id: "f6r2q49", questionText: "Phá giá tiền tệ là hành động gì của Nhà nước",
                options: [
                  "Nâng cao sức mua của đồng nội tệ",
                  "Chính thức hạ thấp sức mua (giá trị) của đồng nội tệ so với ngoại tệ (làm tăng tỷ giá hối đoái)",
                  "Giữ tỷ giá cố định",
                  "Bán vàng dự trữ"
                ],
                correctAnswer: "Chính thức hạ thấp sức mua (giá trị) của đồng nội tệ so với ngoại tệ (làm tăng tỷ giá hối đoái)"
            },
            { id: "f6r2q50", questionText: "Mục đích chính của việc phá giá tiền tệ thường là gì",
                options: [
                  "Hạn chế xuất khẩu, khuyến khích nhập khẩu",
                  "Kích thích xuất khẩu, hạn chế nhập khẩu, thu hút vốn đầu tư/kiều hối",
                  "Kiềm chế lạm phát",
                  "Tăng cường dự trữ ngoại hối"
                ],
                correctAnswer: "Kích thích xuất khẩu, hạn chế nhập khẩu, thu hút vốn đầu tư/kiều hối"
            },
            { id: "f6r2q51", questionText: "Nâng giá tiền tệ có tác động ngược lại với phá giá tiền tệ, thường nhằm mục đích gì",
                options: [
                  "Khuyến khích xuất khẩu",
                  "Hạn chế xuất khẩu (nếu quá thặng dư), kiềm chế lạm phát (do hàng nhập khẩu rẻ hơn), làm 'nguội' nền kinh tế quá nóng, khuyến khích đầu tư ra nước ngoài",
                  "Thu hút vốn đầu tư",
                  "Tăng thâm hụt thương mại"
                ],
                correctAnswer: "Hạn chế xuất khẩu (nếu quá thặng dư), kiềm chế lạm phát (do hàng nhập khẩu rẻ hơn), làm 'nguội' nền kinh tế quá nóng, khuyến khích đầu tư ra nước ngoài"
            },
            { id: "f6r2q52", questionText: "Trong các phương thức thanh toán quốc tế, phương thức nào an toàn nhất cho cả người bán và người mua? (Suy luận từ mô tả các phương thức)",
                options: [
                    "Ghi sổ",
                    "Nhờ thu",
                    "Chuyển tiền trả trước",
                    "Tín dụng chứng từ (L/C) (khi thực hiện đúng)"
                ],
                correctAnswer: "Tín dụng chứng từ (L/C) (khi thực hiện đúng)"
            },
            { id: "f6r2q53", questionText: "Tín dụng quốc tế là gì",
                options: [
                  "Quan hệ vay mượn, sử dụng vốn lẫn nhau giữa các chủ thể thuộc các quốc gia khác nhau",
                  "Chỉ là viện trợ không hoàn lại",
                  "Chỉ là đầu tư FDI",
                  "Chỉ là hoạt động của IMF và World Bank"
                ],
                correctAnswer: "Quan hệ vay mượn, sử dụng vốn lẫn nhau giữa các chủ thể thuộc các quốc gia khác nhau"
            },
            { id: "f6r2q54", questionText: "Tín dụng thương mại quốc tế là hình thức tín dụng nào",
                options: [
                  "Khoản vay giữa các chính phủ",
                  "Khoản vay của ngân hàng quốc tế",
                  "Tín dụng giữa các nhà xuất khẩu và nhập khẩu (thông qua mua bán chịu hàng hóa)",
                  "Viện trợ phát triển chính thức (ODA)"
                ],
                correctAnswer: "Tín dụng giữa các nhà xuất khẩu và nhập khẩu (thông qua mua bán chịu hàng hóa)"
            },
        ],
        reward: { winGame: true }
    }
];   

const allFloorData = {
    1: floor1Data,
    2: floor2Data,
    3: floor3Data,
    4: floor4Data,
    5: floor5Data,
    6: floor6Data
};

// ========== HELPER FUNCTIONS ==========
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        console.log("Switched to screen:", screenId); 
    } else {
        console.error("Screen not found:", screenId);
    }
}

function updateCharacterDetails(charId) {
    console.log("--- updateCharacterDetails START with charId:", charId); 
    const charInfo = characterData[charId];
    if (!charInfo) {
        charDetailsWindow.innerHTML = `<p class="pixel-font">Lỗi: Không tìm thấy dữ liệu nhân vật.</p>`;
        console.log("--- updateCharacterDetails END (char not found)");
        return;
    }

    const skillIconPath = charInfo.skillIcon || 'images/icons/skill_placeholder.png';

    charDetailsWindow.innerHTML = `
        <img src="${charInfo.face}" alt="${charInfo.name}" class="face-graphic" style="float: left; margin-right: 10px; width: 64px; height: 64px;">
        <p class="pixel-font"><strong>${charInfo.name}</strong></p>
        <p class="pixel-font" style="font-size: 0.8em;">${charInfo.description}</p>
        <p class="pixel-font stats-line">HP:${charInfo.stats.hp} ATK:${charInfo.stats.atk} DEF:${charInfo.stats.def} SPD:${charInfo.stats.spd} LCK:${charInfo.stats.lck}</p>
        <div style="display: flex; align-items: center; margin-top: 8px; clear: left;">
        <img src="${skillIconPath}" alt="Skill Icon" style="width: 24px; height: 24px; margin-right: 8px;">
        <p class="pixel-font skill-line" style="margin: 0;"><strong>Kỹ năng: ${charInfo.skill.name}</strong></p>
        </div>
        <p class="pixel-font skill-desc" style="font-size: 0.7em; margin-left: 32px;">${charInfo.skill.description}</p> 
    `;
    confirmCharButton.disabled = false;
    characterSelectScreen.dataset.selectedCharId = charId;
    console.log("--- updateCharacterDetails END (Success)");
}

startNewGameButton.addEventListener('click', () => {
    console.log("Start New Game button clicked");
    switchScreen('name-entry-screen');
});

confirmNameButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name.length > 0 && name.length <= 12) {
        playerName = name; // Lưu tên người chơi
        console.log("Player name set to:", playerName);
        switchScreen('character-select-screen');
    } else {
        // Có thể thêm thông báo lỗi nếu tên không hợp lệ
        playerNameInput.style.border = '2px solid red'; // Đổi viền input thành đỏ
        console.log("Invalid player name.");
        // Reset viền sau một thời gian
         setTimeout(() => { playerNameInput.style.border = '2px solid #888'; }, 1500);
    }
    switchScreen('character-select-screen');
});

let previouslySelectedCard = null;
characterCards.forEach(card => {
    card.addEventListener('click', () => {
        const charId = card.dataset.charId;
        console.log("Character card clicked:", charId);

         // Bỏ chọn thẻ cũ (nếu có)
         if (previouslySelectedCard) {
             previouslySelectedCard.classList.remove('selected');
         }
         // Chọn thẻ mới
         card.classList.add('selected');
         previouslySelectedCard = card; // Lưu thẻ vừa chọn


        updateCharacterDetails(charId);
    });
});

// Gán sự kiện cho nút xác nhận nhân vật
confirmCharButton.addEventListener('click', () => {
    const selectedCharId = characterSelectScreen.dataset.selectedCharId;
    if (selectedCharId && characterData[selectedCharId]) {
        playerCharacter = JSON.parse(JSON.stringify(characterData[selectedCharId])); 
        
        playerCharacter.id = selectedCharId;
        // Tạo bản sao sâu dữ liệu nhân vật
        // Thêm các thông tin người chơi vào object
        playerCharacter.name = playerName; // Dùng tên người chơi đặt
        playerCharacter.level = 1;
        playerCharacter.xp = 0;
        playerCharacter.xpToNextLevel = 50; // Mốc XP đầu tiên từ Bước 4
        playerCharacter.gold = 0;
        // Thêm trang bị ban đầu nếu cần (Ví dụ: level 1)
        playerCharacter.equipment = { weapon: { name: "Vũ Khí Cơ Bản", level: 1, type: "..." }, };

        console.log("Character selected (with id):", playerCharacter);
        initializeGame(); // Gọi hàm bắt đầu game chính
    } else {
        console.error("No character selected or data not found.");
    }
});

inventoryButton.addEventListener('click', openInventory);
closeInventoryButton.addEventListener('click', closeInventory);

document.addEventListener('keydown', (event) => {
    if (currentScreen === 'game-screen' &&
        shopWindow.style.display === 'none' &&
        upgradeWindow.style.display === 'none') {
        if (event.key.toLowerCase() === 'i') {
            if (inventoryWindow.style.display === 'none') {
                openInventory();
            } else {
                closeInventory();
            }
        }
    }
});

function openInventory() {
    if (inventoryWindow.style.display === 'block') return;
    console.log("Opening Inventory...");

    if (questionWindow && questionWindow.style.display === 'block') {
        questionWindow.style.display = 'none';
        console.log("Question window hidden by inventory.");
        // Lưu trạng thái là cửa sổ câu hỏi đã bị ẩn bởi inventory
        inventoryWindow.dataset.hidQuestion = 'true'; // Dùng dataset để lưu trạng thái
    } else {
        inventoryWindow.dataset.hidQuestion = 'false'; // Đánh dấu là không ẩn gì cả
    }

    populateInventory();

    answerOptionsElement.querySelectorAll('button').forEach(btn => btn.disabled = true);

    inventoryWindow.style.display = 'block';
}

function closeInventory() {
    if (inventoryWindow.style.display === 'none') return; // Không đóng nếu đã đóng

    console.log("Closing Inventory...");
    inventoryWindow.style.display = 'none';

    // --- HIỂN THỊ LẠI CỬA SỔ CÂU HỎI NẾU NÓ BỊ ẨN BỞI INVENTORY ---
    let shouldRestoreQuestion = false;
    // Kiểm tra xem inventory có ẩn cửa sổ câu hỏi không
    if (inventoryWindow.dataset.hidQuestion === 'true') {
        // Kiểm tra xem có nên hiển thị lại câu hỏi không (ví dụ: không phải safe room)
        if (currentRoomData) {
             const questionRoomTypes = ['encounter', 'puzzle', 'chest', 'boss']; // Các loại phòng cần câu hỏi
             if (questionRoomTypes.includes(currentRoomData.type)) {
                 shouldRestoreQuestion = true;
             }
         }
    }

    if (shouldRestoreQuestion && questionWindow) {
        questionWindow.style.display = 'block';
        console.log("Question window restored after closing inventory.");
        // Kích hoạt lại các nút trả lời *chỉ khi* câu hỏi được hiển thị lại
        answerOptionsElement.querySelectorAll('button').forEach(btn => btn.disabled = false);
    } else {
        console.log("Question window not restored (either wasn't hidden or not applicable state).");
        // Đảm bảo các nút trả lời vẫn bị vô hiệu hóa nếu cửa sổ câu hỏi không hiện
         answerOptionsElement.querySelectorAll('button').forEach(btn => btn.disabled = true);
    }
    // Reset trạng thái đã lưu
    inventoryWindow.dataset.hidQuestion = 'false';
    // -----------------------------------------------------------------
}

    function populateInventory() {
        if (!playerCharacter || !inventoryItemList || !inventoryItemDetails) return;
    
        inventoryItemList.innerHTML = ''; 
        inventoryItemDetails.innerHTML = '<p class="pixel-font">Chọn vật phẩm để xem chi tiết.</p>';

        const inventory = playerCharacter.inventory || {};
        const itemIds = Object.keys(inventory);

        if (itemIds.length === 0 || itemIds.every(id => inventory[id] <= 0)) {
            inventoryItemList.innerHTML = '<p class="pixel-font">Túi đồ trống!</p>';
            return;
        }
    
        itemIds.forEach(itemId => {
            const quantity = inventory[itemId];
            if (quantity > 0 && itemData[itemId]) { // Chỉ hiển thị item có số lượng > 0 và có dữ liệu
                const item = itemData[itemId];
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item pixel-font'; // Sử dụng class mới
                itemDiv.dataset.itemId = itemId;
    
                const nameSpan = document.createElement('span');
                nameSpan.textContent = item.name;
                itemDiv.appendChild(nameSpan);
    
                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'item-quantity'; // Class cho số lượng
                quantitySpan.textContent = `x${quantity}`;
                itemDiv.appendChild(quantitySpan);
    
                itemDiv.onclick = () => showInventoryItemDetails(itemId);
                inventoryItemList.appendChild(itemDiv);
            }
        });
    }

    function showInventoryItemDetails(itemId) {
        if (!playerCharacter || !inventoryItemDetails || !itemData[itemId]) return;
    
        const item = itemData[itemId];
        const quantity = playerCharacter.inventory[itemId] || 0;
    
        // Đánh dấu item được chọn trong list (tùy chọn)
        inventoryItemList.querySelectorAll('.inventory-item').forEach(div => {
             div.classList.remove('selected');
             if (div.dataset.itemId === itemId) {
                 div.classList.add('selected');
             }
         });
    
        let canUse = false;
        let disableReason = "";
    
        // Kiểm tra xem item có thể sử dụng không
        if (item.effect) {
            switch (item.effect.type) {
                case 'heal':
                    if (playerCharacter.currentHp < playerCharacter.maxHp) {
                        canUse = true;
                    } else {
                        disableReason = " (HP đã đầy)";
                    }
                    break;
                case 'hint':
                    // Logic kiểm tra hint phức tạp hơn, tạm cho là dùng được
                    canUse = true;
                     // Cần thêm logic để vô hiệu hóa nếu đã dùng hint cho câu này
                    break;
                case 'buff':
                     canUse = true; // Tạm cho là luôn dùng được buff
                     // Có thể thêm kiểm tra nếu buff đã active
                    break;
                // Thêm các loại effect khác nếu cần
                default:
                    disableReason = " (Không thể sử dụng)";
                    break;
            }
        } else {
             disableReason = " (Không thể sử dụng)";
        }
    
    
        inventoryItemDetails.innerHTML = `
            <p class="pixel-font"><strong>${item.name}</strong> (Đang có: ${quantity})</p>
            <p class="pixel-font" style="font-size: 0.8em;">${item.description}</p>
             <button id="use-item-button" class="menu-button" ${!canUse ? 'disabled' : ''}>
                 Sử Dụng${disableReason}
             </button>
        `;
    
        const useButton = document.getElementById('use-item-button');
        if (useButton && canUse) {
            useButton.onclick = () => useItem(itemId);
        }
    }
    
    function useItem(itemId) {
        if (!playerCharacter || !itemData[itemId] || (playerCharacter.inventory[itemId] || 0) <= 0) {
            console.error("Cannot use item: Invalid item or quantity is zero.");
            return;
        }
    
        const item = itemData[itemId];
        const effect = item.effect;
        let itemUsed = false; // Cờ để đánh dấu item có thực sự được dùng không
    
        console.log(`Attempting to use item: ${item.name}`);
    
        if (effect) {
            switch (effect.type) {
                case 'heal':
                    if (playerCharacter.currentHp < playerCharacter.maxHp) {
                        const hpBefore = playerCharacter.currentHp;
                        playerCharacter.currentHp = Math.min(playerCharacter.maxHp, playerCharacter.currentHp + effect.amount);
                        const healedAmount = playerCharacter.currentHp - hpBefore;
                        addToLog(`Dùng ${item.name}, hồi ${healedAmount} HP! (HP: ${playerCharacter.currentHp}/${playerCharacter.maxHp})`);
                        itemUsed = true;
                    } else {
                         addToLog("Không thể dùng thuốc hồi máu khi HP đã đầy!");
                    }
                    break;
    
                case 'hint':
                    // --- Logic gợi ý (Phức tạp hơn) ---
                    // Cần lấy các nút đáp án hiện tại và loại bỏ một nút sai
                    console.warn("Hint item logic not fully implemented yet.");
                     addToLog(`Dùng ${item.name} để tìm gợi ý!`);
                     // Ví dụ cơ bản: Tìm 1 nút sai và làm mờ đi
                     const wrongAnswerButtons = Array.from(answerOptionsElement.querySelectorAll('button')).filter(btn => btn.dataset.originalOption !== currentRoomData?.questionsInRoom.find(q => questionsAskedInRoom.includes(q.id))?.correctAnswer); // Tìm nút sai
                    if(wrongAnswerButtons.length > 0) {
                         wrongAnswerButtons[0].style.opacity = '0.3';
                         wrongAnswerButtons[0].disabled = true; // Vô hiệu hóa nút đã loại
                         itemUsed = true;
                     } else {
                         addToLog("Không tìm thấy đáp án sai để loại bỏ?");
                     }
                    break;
    
                case 'buff':
                     // --- Logic buff (Cần hệ thống buff) ---
                     console.warn("Buff item logic not fully implemented yet.");
                     // Ví dụ: Thêm buff vào playerCharacter.activeBuffs
                     // playerCharacter.activeBuffs.push({ stat: effect.stat, amount: effect.amount, turnsLeft: effect.duration });
                     addToLog(`Dùng ${item.name}, nhận hiệu ứng ${effect.stat.toUpperCase()}+${effect.amount} trong ${effect.duration} lượt!`);
                     // recalculatePlayerStats(); // Gọi tính lại chỉ số nếu buff ảnh hưởng ngay
                     itemUsed = true;
                    break;
    
                default:
                    console.warn(`Unknown item effect type: ${effect.type}`);
                    addToLog(`Không thể sử dụng ${item.name}.`);
                    break;
            }
        } else {
             addToLog(`${item.name} không có hiệu ứng sử dụng.`);
        }
    
        // Chỉ trừ số lượng nếu item thực sự được dùng và có hiệu ứng
        if (itemUsed) {
            playerCharacter.inventory[itemId]--; // Giảm số lượng
            if (playerCharacter.inventory[itemId] <= 0) {
                 // Không cần xóa key, chỉ cần đảm bảo không hiển thị khi populate
                console.log(`${item.name} used up.`);
            }
    
            // Cập nhật UI
            updatePlayerStatsUI(); // Cập nhật HP/Stats nếu có thay đổi
            populateInventory(); // Cập nhật lại list inventory
            // Cập nhật lại chi tiết của item vừa dùng (hoặc xóa nếu hết)
            if (playerCharacter.inventory[itemId] > 0) {
                showInventoryItemDetails(itemId);
            } else {
                 inventoryItemDetails.innerHTML = '<p class="pixel-font">Đã dùng hết. Chọn vật phẩm khác.</p>';
            }
    
            // Tự động đóng cửa sổ inventory sau khi dùng item (tùy chọn)
             // closeInventory();
        }
    }

function displayQuestion() {
    // Lấy các element cần thiết bên trong hàm để đảm bảo chúng tồn tại
    const questionTextElement = document.getElementById('question-text');
    const answerOptionsElement = document.getElementById('answer-options');
    const questionWindow = document.getElementById('question-window');

    // Kiểm tra xem các element có tồn tại không
    if (!questionTextElement || !answerOptionsElement || !questionWindow) {
        console.error("Display Question Error: One or more required elements not found!");
        addToLog("Lỗi giao diện câu hỏi!"); // Thêm log
        return; // Thoát nếu thiếu element
    }

    console.log("Attempting to display question for room:", currentRoomData?.roomNumber);

    // Kiểm tra xem phòng hiện tại và danh sách câu hỏi có hợp lệ không
    if (!currentRoomData || !currentRoomData.questionsInRoom || !Array.isArray(currentRoomData.questionsInRoom) || currentRoomData.questionsInRoom.length === 0) {
        console.error("No valid embedded question list (questionsInRoom) found for the current room!", currentRoomData);
        addToLog("Lỗi: Không tìm thấy danh sách câu hỏi cho phòng này!");
        // Xử lý khi hết câu hỏi hoặc phòng lỗi
        if (currentEnemy) {
            console.warn("Ran out of questions during encounter! Ending encounter.");
            // Tạm coi như thắng nếu đang đánh quái mà hết câu hỏi
            // Có thể sửa đổi logic này nếu bạn muốn (ví dụ: quái bỏ chạy)
             setTimeout(() => checkEncounterEnd(true), 100); // Gọi checkEnd sau một chút
        } else {
            addToLog("Lỗi dữ liệu phòng hoặc hết câu hỏi!");
            setTimeout(nextRoom, 1500); // Tự động chuyển phòng nếu lỗi
        }
        return; // Thoát hàm
    }

    // --- Logic Chọn Câu Hỏi Từ questionsInRoom ---
    // 1. Lọc ra các ID câu hỏi CÓ THỂ hỏi (những ID trong roomData.questionsInRoom mà CHƯA có trong questionsAskedInRoom)
    let potentialQuestionObjects = currentRoomData.questionsInRoom.filter(q => {
        // Đảm bảo câu hỏi có ID và chưa được hỏi
        return q.id && !questionsAskedInRoom.includes(q.id);
    });
    console.log("Potential Questions (not asked yet):", potentialQuestionObjects.length, potentialQuestionObjects);

    // 2. Nếu hết câu hỏi chưa hỏi -> Reset danh sách đã hỏi và lấy lại TẤT CẢ câu hỏi của phòng
    if (potentialQuestionObjects.length === 0) {
        console.warn("No new questions available in this room's list, resetting asked list for this room.");
        questionsAskedInRoom = []; // Reset danh sách ĐÃ HỎI cho phòng này
        potentialQuestionObjects = currentRoomData.questionsInRoom; // Lấy lại toàn bộ

        // Kiểm tra lại sau khi reset, nếu vẫn rỗng là lỗi dữ liệu phòng
        if (!potentialQuestionObjects || potentialQuestionObjects.length === 0) {
            console.error("CRITICAL: Room questionsInRoom list is actually empty!");
            addToLog("LỖI HỆ THỐNG: Phòng này không có câu hỏi nào!");
            setTimeout(nextRoom, 1500);
            return;
        }
         console.log("Potential Questions after reset:", potentialQuestionObjects.length, potentialQuestionObjects);
    }

    // 3. Chọn ngẫu nhiên 1 câu hỏi từ danh sách CÓ THỂ hỏi
    const randomIndex = Math.floor(Math.random() * potentialQuestionObjects.length);
    const selectedQuestion = potentialQuestionObjects[randomIndex]; // Đây là đối tượng câu hỏi đầy đủ

    // 4. Kiểm tra đối tượng câu hỏi được chọn
    if (!selectedQuestion || typeof selectedQuestion !== 'object') {
        console.error("CRITICAL: selectedQuestion is invalid after random selection.", selectedQuestion);
        addToLog("Lỗi nghiêm trọng khi chọn câu hỏi!");
        setTimeout(nextRoom, 1500);
        return;
    }

    // 5. Đảm bảo câu hỏi có ID (Rất quan trọng để tránh lặp vô hạn)
     if (!selectedQuestion.id) {
        selectedQuestion.id = `temp_${currentRoomData.roomNumber}_${randomIndex}_${Date.now()}`;
        console.warn("Selected question missing ID, generated temporary ID:", selectedQuestion.id);
    }

    // 6. Đánh dấu câu hỏi này đã được hỏi trong lượt chơi phòng này
    questionsAskedInRoom.push(selectedQuestion.id);
    console.log("Selected Question ID:", selectedQuestion.id, " | Questions Asked in this room:", questionsAskedInRoom);

    // 7. Kiểm tra các thuộc tính cần thiết của câu hỏi
    if (!selectedQuestion.questionText || !Array.isArray(selectedQuestion.options) || !selectedQuestion.correctAnswer) {
         console.error(`Invalid question structure for ID ${selectedQuestion.id}:`, selectedQuestion);
         addToLog(`LỖI DỮ LIỆU: Câu hỏi ${selectedQuestion.id} bị thiếu thông tin!`);
         setTimeout(nextRoom, 1500); // Bỏ qua câu hỏi lỗi
         return;
     }

    // --- HIỂN THỊ LÊN GIAO DIỆN ---
    questionTextElement.textContent = selectedQuestion.questionText; // Cập nhật text câu hỏi
    answerOptionsElement.innerHTML = ''; // Xóa các nút đáp án cũ

    // Tạo và thêm các nút đáp án mới
    selectedQuestion.options.forEach(option => {
        const button = document.createElement('button');
        // Kiểm tra xem option có phải là chuỗi hay không (đề phòng lỗi dữ liệu)
        button.textContent = typeof option === 'string' ? option : JSON.stringify(option); // Hiển thị option
        button.disabled = false; // Đảm bảo nút có thể nhấn
        // Lưu trữ dữ liệu cần thiết
        button.dataset.correct = (option === selectedQuestion.correctAnswer).toString(); // Lưu true/false dạng string
        button.dataset.correctAnswerText = selectedQuestion.correctAnswer;

        // Gán sự kiện onclick để gọi handleAnswer
        button.onclick = () => handleAnswer(option, selectedQuestion.correctAnswer, button);

        answerOptionsElement.appendChild(button); // Thêm nút vào DOM
    });

    // Hiện cửa sổ câu hỏi
    questionWindow.style.display = 'block'; // Hiển thị cửa sổ
    questionWindow.classList.add('active'); // Thêm class active (nếu dùng cho CSS transition/hiển thị)
    console.log("Question window displayed with new question.");
}

function recalculatePlayerStats() {
    if (!playerCharacter || !playerCharacter.id) return;

    console.log("Recalculating player stats...");

    const baseStats = characterData[playerCharacter.id]?.stats;
    if (!baseStats) {
        console.error("Cannot find base stats for recalculation!");
        return;
    }
    // Bắt đầu với chỉ số gốc
    const currentTotalStats = { ...baseStats };

    // Cộng chỉ số từ trang bị (ví dụ: vũ khí)
    if (playerCharacter.equipment && playerCharacter.equipment.weapon) {
        const weapon = playerCharacter.equipment.weapon;
        const weaponLevel = weapon.level || 1;
        const weaponLevelIndex = weaponLevel - 1;
        const classId = playerCharacter.id;

        if (upgradeStats[classId] && upgradeStats[classId][weaponLevelIndex] !== undefined) {
            const statBonus = upgradeStats[classId][weaponLevelIndex];
            const statType = (classId === 'ho-phap') ? 'def' : 'atk';
            currentTotalStats[statType] = (currentTotalStats[statType] || 0) + statBonus;
            console.log(`Equipment Bonus (${weapon.name} Lv.${weaponLevel}): +${statBonus} ${statType.toUpperCase()}`);
        } else {
            console.log(`No upgrade stats found for ${classId} at weapon level ${weaponLevel}`);
        }
    }
    // Cộng thêm từ các hiệu ứng buff (nếu có) - Sẽ thêm sau

     // Lưu chỉ số tổng đã tính toán vào playerCharacter
     playerCharacter.currentTotalStats = currentTotalStats;

     // Cập nhật Max HP dựa trên chỉ số HP tổng
     playerCharacter.maxHp = playerCharacter.currentTotalStats.hp || 1; // Đảm bảo maxHp luôn là số > 0

     // --- ĐIỀU CHỈNH CURRENT HP SAU KHI TÍNH LẠI CHỈ SỐ ---
     // 1. Đảm bảo currentHp không bao giờ vượt quá maxHp mới.
     // 2. Nếu currentHp chưa được khởi tạo (undefined/null), đặt nó bằng maxHp.
     // 3. Đảm bảo currentHp không bao giờ âm.
     playerCharacter.currentHp = Math.max(0, Math.min(playerCharacter.currentHp === undefined || playerCharacter.currentHp === null ? playerCharacter.maxHp : playerCharacter.currentHp, playerCharacter.maxHp));
     // Dòng trên làm các việc sau:
     // - Lấy giá trị currentHp hiện tại. Nếu nó chưa tồn tại (undefined/null), thì dùng maxHp làm giá trị ban đầu.
     // - So sánh giá trị đó với maxHp mới, lấy giá trị nhỏ hơn (để không vượt maxHp).
     // - So sánh kết quả với 0, lấy giá trị lớn hơn (để không bị âm).

    console.log("Recalculated - Final Max HP:", playerCharacter.maxHp, "Current HP:", playerCharacter.currentHp); // Kiểm tra log này trong Console (F12)
    updatePlayerStatsUI(); // Cập nhật UI ngay sau khi tính lại
}

// Hàm khởi tạo khi vào game chính
function initializeGame() {
     console.log("Initializing game screen...");

     if (!playerCharacter || !playerCharacter.id) {
        console.error("Player character data is missing or invalid!");
        return;
    }

     playerCharacter.equipment = { weapon: { name: "Vũ Khí Cơ Bản", level: 1, type: playerCharacter.id === 'ho-phap' ? 'shield' : 'weapon' }, };
     recalculatePlayerStats();
    // Cập nhật giao diện người chơi ban đầu
    if(playerNameDisplay) playerNameDisplay.textContent = playerCharacter.name;
     if(playerLevelDisplay) playerLevelDisplay.textContent = playerCharacter.level;

     if(playerFace) playerFace.src = playerCharacter.face || 'images/placeholder_face.png'; 
     if(skillIcon) skillIcon.src = playerCharacter.skillIcon || 'images/icons/skill_placeholder.png';
     console.log("Set skillIcon.src to:", skillIcon?.src);
    // Reset combo
    currentCombo = 0;
    updateComboUI(); // Hàm cập nhật combo UI

    // (Tạm thời chỉ chuyển màn hình, logic Tầng 1 sẽ thêm sau)
    switchScreen('game-screen');

    if(playerArenaSprite) {
        playerArenaSprite.src = playerCharacter.sprite_idle || 'images/chars/default_player_sprite.png';
    
        playerArenaSprite.style.display = 'block'; 
        playerArenaSprite.style.left = '30%'; 
    } else {
        console.error("#player-arena-sprite element not found!"); // Báo lỗi nếu không tìm thấy
    }

    // Bắt đầu Tầng 1, Phòng 1
    startFloor(1); // Sẽ tạo hàm này sau
    addToLog(`Chào mừng ${playerCharacter.name} đến với Cuộc Phiêu Lưu!`);
}

// Hàm cập nhật UI trạng thái người chơi (Sẽ cần gọi thường xuyên)
function updatePlayerStatsUI() {
    // Giả sử playerCharacter đã có các thuộc tính: hp, maxHp, xp, xpToNextLevel, gold
    if (!playerCharacter) return; // Chưa chọn nhân vật thì thôi

    if (!playerHpBar || !playerHpValue || !playerXpBar || !playerXpValue || !playerGoldDisplay || !playerLevelDisplay || !playerFace || !skillIcon) {
        console.error("One or more player status UI elements not found in updatePlayerStatsUI!");
        return;
    }

     // HP Bar & Value
    const maxHp = playerCharacter.maxHp || playerCharacter.stats.hp; // Lấy max HP từ stats gốc (hoặc tính toán nếu có trang bị/buff)
    const currentHp = playerCharacter.currentHp === undefined ? maxHp : playerCharacter.currentHp; // Cần thêm currentHp khi bắt đầu trận đấu
    if (currentHp > maxHp) playerCharacter.currentHp = maxHp;
    playerCharacter.currentHp = Math.max(0, playerCharacter.currentHp);

    const hpPercent = maxHp > 0 ? (playerCharacter.currentHp / maxHp) * 100 : 0;
    playerHpBar.style.width = `${hpPercent}%`;
    playerHpValue.textContent = `${playerCharacter.currentHp}/${maxHp}`;

    // XP Bar & Value
    const xpPercent = playerCharacter.xpToNextLevel > 0 && playerCharacter.xpToNextLevel !== Infinity
         ? (playerCharacter.xp / playerCharacter.xpToNextLevel) * 100
         : (playerCharacter.level >= 10 ? 100 : 0); // Đầy thanh nếu max level
    playerXpBar.style.width = `${Math.max(0, xpPercent)}%`;
    playerXpValue.textContent = playerCharacter.level >= 10 ? "MAX" : `${playerCharacter.xp}/${playerCharacter.xpToNextLevel}`;

     // Gold
    playerGoldDisplay.textContent = playerCharacter.gold;

     // Level
    playerLevelDisplay.textContent = playerCharacter.level;

    playerFace.src = playerCharacter.face || 'images/ui/placeholder_face.png';
    skillIcon.src = playerCharacter.skillIcon || 'images/icons/skill_placeholder.png'; // Lấy icon kỹ năng
}

function updateEnemyStatsUI(enemy) { // Thêm hàm này hoặc tích hợp vào nơi xử lý địch
    if (!enemy) {
        enemyInfo.style.display = 'none'; // Ẩn nếu không có địch
        return;
    };
    enemyInfo.style.display = 'block'; // Hiện khi có địch
    enemyNameDisplay.textContent = enemy.name;
    const enemyHpPercent = Math.max(0, (enemy.currentHp / enemy.maxHp) * 100);
    enemyHpBar.style.width = `${enemyHpPercent}%`;
    enemyHpValue.textContent = `${Math.max(0, enemy.currentHp)}/${enemy.maxHp}`;
}

// Hàm cập nhật UI Combo
function updateComboUI() {
    comboCounterDisplay.textContent = currentCombo;
}

// Hàm thêm tin nhắn vào Log
function addToLog(message) {
    console.log(`--- addToLog called with: "${message}" ---`);
    const logOutputElement = document.getElementById('log-window');
    if (!logOutputElement) {
        console.error("!!! CRITICAL ERROR in addToLog: Could not find #log-window element !!!");
        return;
    }

    const newMessage = document.createElement('p');
    if (!newMessage) {
        console.error("CRITICAL ERROR in addToLog: Could not create 'p' element!");
        return;
    }
    newMessage.className = 'pixel-font';
    newMessage.textContent = `> ${message}`;

    try {
        logOutputElement.appendChild(newMessage);
        logOutputElement.scrollTop = logOutputElement.scrollHeight;
    } catch (error) {
        console.error("ERROR appending message to log:", error, "Message:", message);
    }

    const maxLogLines = 50;
    while (logOutputElement.childElementCount > maxLogLines) {
        logOutputElement.removeChild(logOutputElement.firstChild);
    }
}

function levelUpCheck() {
    if (!playerCharacter) return; // Thoát nếu chưa có nhân vật
    let leveledUp = false; 
    const milestones = [0, 50, 100, 180, 300, 450, 650, 900, 1200, 1600];// Biến cờ để biết có lên cấp hay không

    // Dùng vòng lặp while phòng trường hợp lên nhiều cấp 1 lúc
    while (playerCharacter.level < 10 && playerCharacter.xp >= playerCharacter.xpToNextLevel) {
        leveledUp = true;
        const levelBefore = playerCharacter.level; // Lưu level cũ
        const xpNeeded = playerCharacter.xpToNextLevel; // Lưu XP cần
        playerCharacter.xp -= xpNeeded;
        playerCharacter.level++;
        addToLog(`✨ LÊN CẤP! Đạt Cấp Độ ${playerCharacter.level}! (Cần ${xpNeeded} XP) ✨`);

        if (playerCharacter.level < 10) {
            playerCharacter.xpToNextLevel = milestones[playerCharacter.level];
        } else {
            playerCharacter.xpToNextLevel = Infinity; playerCharacter.xp = 0;
        }
        console.log(`Level ${playerCharacter.level}. XP needed for next:`, playerCharacter.xpToNextLevel);

        // Tăng Chỉ Số Cơ Bản (Đồng đều theo Bước 4)
        const growth = {
            kiem_si:   { hp: 20, atk: 3, def: 2, spd: 1, lck: 1 },
            hoc_gia:   { hp: 15, atk: 4, def: 1, spd: 1, lck: 1 },
            trinh_sat: { hp: 18, atk: 2, def: 1, spd: 2, lck: 2 },
            ho_phap:   { hp: 25, atk: 1, def: 3, spd: 0, lck: 1 }
        }[playerCharacter.id] || { hp: 15, atk: 2, def: 1, spd: 1, lck: 1 };

        playerCharacter.stats.hp += growth.hp;
        playerCharacter.stats.atk += growth.atk;
        playerCharacter.stats.def += growth.def;
        playerCharacter.stats.spd += growth.spd;
        playerCharacter.stats.lck += growth.lck;

        addToLog(`Chỉ số tăng: HP+${growth.hp}, ATK+${growth.atk}, DEF+${growth.def}, SPD+${growth.spd}, LCK+${growth.lck}`);

        recalculatePlayerStats(); // Tính lại chỉ số tổng
        playerCharacter.currentHp = playerCharacter.maxHp; // Hồi đầy máu
        addToLog(`HP đã được hồi đầy (${playerCharacter.currentHp}/${playerCharacter.maxHp})!`); // Thêm log hồi máu
    }

    if (leveledUp) {
        updatePlayerStatsUI(); // Cập nhật UI sau khi xử lý xong
    }
}


// --- Game Flow Functions ---
function startFloor(floorNumber) {
    console.log(`Starting Floor ${floorNumber}`);
    currentFloor = floorNumber;
    currentRoomIndex = 1; // Bắt đầu từ phòng số 1 (index 1 trong mảng floorXData)

    const battleArenaElement = document.getElementById('battle-arena');
    const floorData = allFloorData[currentFloor];
    const backgroundInfoRoom = floorData?.find(room => room?.arenaBackground);

    console.log("Found floor data for bg:", floorData ? 'Yes' : 'No');
    console.log("Found room with bg info:", backgroundInfoRoom);

    if (battleArenaElement && backgroundInfoRoom?.arenaBackground) {
        // KIỂM TRA ĐƯỜNG DẪN CUỐI CÙNG TRƯỚC KHI SET
         console.log("Setting arena background to URL:", backgroundInfoRoom.arenaBackground);
        battleArenaElement.style.backgroundImage = `url('${backgroundInfoRoom.arenaBackground}')`;
    } else if (battleArenaElement) {
          battleArenaElement.style.backgroundImage = 'none';
          console.log(`No arena background set for Floor ${currentFloor}`);
    }

    startRoom(currentRoomIndex);
}

function startRoom(roomIndex) {
    console.log(`Entering Room ${roomIndex} of Floor ${currentFloor}`);
    // Lấy dữ liệu phòng hiện tại (cần xử lý nếu floorNumber khác 1 sau này)
    const floorData = allFloorData[currentFloor]; // Sẽ mở rộng sau
    if (!floorData || roomIndex >= floorData.length || !floorData[roomIndex]) {
        if (!floorData && currentFloor > Object.keys(allFloorData).length) {
            winGame();
        } else {
            console.error(`Invalid room index ${roomIndex} or missing floor data for floor ${currentFloor}`);
             addToLog("Lỗi tải dữ liệu phòng!");
        }
        return;
    }

    currentRoomData = floorData[roomIndex];
    console.log("Current Room Data Loaded:", JSON.stringify(currentRoomData, null, 2));
    currentRoomIndex = roomIndex; // Cập nhật index phòng hiện tại
    questionsCorrectInRoom = 0; // Reset số câu đúng
    questionsAskedInRoom = []; // Reset danh sách câu đã hỏi
    currentEnemy = null; // Reset kẻ địch
    enemyInfo.style.display = 'none'; // Ẩn thông tin địch ban đầu
    questionWindow.style.display = 'none'; // Ẩn cửa sổ câu hỏi ban đầu

    if (enemyInfo) enemyInfo.style.display = 'none';
    else console.error("#enemy-info not found in startRoom!");
    if (questionWindow) questionWindow.style.display = 'none';
    else console.error("#question-window not found in startRoom!");

    addToLog(`--- Bước vào Phòng ${currentRoomData.roomNumber} ---`);

    // Xử lý theo loại phòng
    switch (currentRoomData.type) {
        case 'question':
        case 'encounter':
        case 'puzzle': 
        case 'chest':
        case 'boss':
            if (currentRoomData.type === 'chest') {
                addToLog("Bạn thấy một chiếc rương. Có lẽ cần giải đáp gì đó để mở?");
           } else if (currentRoomData.type === 'puzzle') {
                addToLog("Có một câu đố bí ẩn cần lời giải...");
           }
           startEncounter(currentRoomData); // Gọi hàm chung
           break;
        case 'safe_room':
            showSafeRoomUI(); // Sẽ tạo hàm này sau
            break;
        default:
            console.warn("Unknown room type:", currentRoomData.type);
            break;
    }
    updatePlayerStatsUI(); // Cập nhật UI khi vào phòng mới
    updateComboUI(); // Reset combo UI
}

function startEncounter(roomData) {
    console.log("Starting encounter/question for Room:", roomData.roomNumber);
    const enemyArenaSprite = document.getElementById('enemy-arena-sprite');


    // --- PHẦN HIỂN THỊ ĐỊCH TRONG ARENA ---
    if (roomData.monsterId) {
        // Lấy ID địch (xử lý trường hợp có nhiều loại quái trong phòng, tạm lấy con đầu)
        const enemyId = Array.isArray(roomData.monsterId) ? roomData.monsterId[0] : roomData.monsterId;

        if (enemyData[enemyId]) {
            // Tạo bản sao dữ liệu địch cho trận đấu
            currentEnemy = JSON.parse(JSON.stringify(enemyData[enemyId]));
            currentEnemy.currentHp = currentEnemy.maxHp; // Đặt HP đầy
            console.log("Encountering:", currentEnemy.name);

            // << THAY ĐỔI Ở ĐÂY: Cập nhật SPRITE trong ARENA >>
            if (enemyArenaSprite) { // Kiểm tra element tồn tại
                 enemyArenaSprite.src = currentEnemy.sprite_idle || 'images/monsters/default_idle.png'; // Đặt ảnh sprite từ enemyData
                 enemyArenaSprite.alt = currentEnemy.name;
                 enemyArenaSprite.style.display = 'block';     // Hiện sprite địch
                 enemyArenaSprite.style.left = '70%';           // Reset vị trí ban đầu
                 enemyArenaSprite.style.transform = 'translateX(-50%) scale(1)'; // Reset scale/transform
                 enemyArenaSprite.style.opacity = '1';         // Reset opacity
            } else {
                 console.error("#enemy-arena-sprite element not found!");
             }

            updateEnemyStatsUI(currentEnemy); // Cập nhật thanh HP và tên địch ở trên cùng

        } else {
            console.error("Enemy data not found for ID:", enemyId);
             // Ẩn sprite nếu không tìm thấy data địch
             if (enemyArenaSprite) enemyArenaSprite.style.display = 'none';
             updateEnemyStatsUI(null); // Ẩn UI HP địch
        }
    } else {
         // Nếu phòng không có monsterId
         currentEnemy = null; // Đảm bảo không có địch
         if (enemyArenaSprite) enemyArenaSprite.style.display = 'none'; // Ẩn sprite địch
         updateEnemyStatsUI(null); // Ẩn UI HP địch
    }
    // --- KẾT THÚC PHẦN HIỂN THỊ ĐỊCH ---


    // Hiển thị câu hỏi đầu tiên
    displayQuestion();
}



function nextRoom() {
    currentRoomIndex++;
    console.log(`Attempting to move to room index: ${currentRoomIndex} on floor ${currentFloor}`);
    startRoom(currentRoomIndex);
}

// Hàm hiển thị giao diện phòng an toàn (sẽ làm sau)
function showSafeRoomUI() {
    console.log("Entered Safe Room");
    addToLog("Bạn đã đến khu vực an toàn. Hãy nghỉ ngơi và chuẩn bị.");

    if(questionWindow) questionWindow.style.display = 'none';
      if(enemyInfo) enemyInfo.style.display = 'none';
      if(enemyArenaSprite) enemyArenaSprite.style.display = 'none'; // Ẩn cả sprite địch

      if(safeRoomOptionsDiv) safeRoomOptionsDiv.style.display = 'block'; // Hiện nút

      // Gán sự kiện (đảm bảo element tồn tại)
      if(openShopButton) openShopButton.onclick = () => openShop();
      if(openUpgradeButton) openUpgradeButton.onclick = () => openUpgrade();
      if(leaveSafeRoomButton) leaveSafeRoomButton.onclick = () => {
           if(safeRoomOptionsDiv) safeRoomOptionsDiv.style.display = 'none';
           nextRoom();
       };
      if(closeShopButton) closeShopButton.onclick = () => closeShop();
      if(closeUpgradeButton) closeUpgradeButton.onclick = () => closeUpgrade();
 }

function hideSafeRoomUI() {
    safeRoomOptionsDiv.style.display = 'none';
}

function openShop() {
    hideSafeRoomUI();
    populateShop(); // Gọi hàm đổ dữ liệu shop
    shopWindow.style.display = 'block';
    document.getElementById('shop-player-gold').textContent = playerCharacter.gold; // Cập nhật vàng
}

function closeShop() {
    shopWindow.style.display = 'none';
    safeRoomOptionsDiv.style.display = 'block'; // Hiện lại các nút
}

function openUpgrade() {
    hideSafeRoomUI();
     populateUpgrade(); // Gọi hàm đổ dữ liệu nâng cấp
     upgradeWindow.style.display = 'block';
     document.getElementById('upgrade-player-gold').textContent = playerCharacter.gold;
 }

function closeUpgrade() {
    upgradeWindow.style.display = 'none';
    safeRoomOptionsDiv.style.display = 'block';
}

function populateShop() {
    const itemListDiv = document.getElementById('shop-item-list');
    const itemDetailsDiv = document.getElementById('shop-item-details');
    itemListDiv.innerHTML = ''; // Xóa danh sách cũ
    itemDetailsDiv.innerHTML = '<p>Chọn một vật phẩm để xem chi tiết.</p>'; // Reset chi tiết

    const currentShopItems = shopInventory[currentFloor] || []; // Lấy danh sách đồ của tầng này

    if (currentShopItems.length === 0) {
        itemListDiv.innerHTML = '<p>Cửa hàng tạm hết hàng!</p>';
        return;
    }

    currentShopItems.forEach(itemId => {
        const item = itemData[itemId];
        if (item) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item pixel-font';
            itemDiv.textContent = item.name;
            // Thêm giá tiền
             const priceSpan = document.createElement('span');
             priceSpan.textContent = `${item.price} G`;
             itemDiv.appendChild(priceSpan);

            itemDiv.onclick = () => showShopItemDetails(itemId);
            itemListDiv.appendChild(itemDiv);
        }
    });
}

function showShopItemDetails(itemId) {
    const item = itemData[itemId];
    const itemDetailsDiv = document.getElementById('shop-item-details');

    // Đánh dấu item được chọn trong list (tùy chọn)
    document.querySelectorAll('#shop-item-list .shop-item').forEach(div => {
         div.classList.remove('selected');
         if (div.textContent.startsWith(item.name)) {
             div.classList.add('selected');
         }
     });

    if (!item) return;

    itemDetailsDiv.innerHTML = `
        <p class="pixel-font"><strong>${item.name}</strong></p>
        <p class="pixel-font" style="font-size: 0.8em;">${item.description}</p>
        <p class="pixel-font">Giá: <span style="color:#fcc603">${item.price}</span> G</p>
         <p class="pixel-font" style="font-size: 0.8em;">Đang có: ${playerCharacter.inventory?.[itemId] || 0}</p>
        <button id="buy-button" class="menu-button" ${playerCharacter.gold < item.price ? 'disabled' : ''}>Mua</button>
    `;

    // Thêm sự kiện cho nút Mua
     document.getElementById('buy-button').onclick = () => buyItem(itemId);
}

function buyItem(itemId) {
    const item = itemData[itemId];
    if (!item || !playerCharacter) return;
    const cost = item.price;

    if (playerCharacter.gold >= cost) {
        const goldBefore = playerCharacter.gold;
        playerCharacter.gold -= cost;
        playerCharacter.inventory[itemId] = (playerCharacter.inventory[itemId] || 0) + 1;

        // --- Sửa Log Mua Đồ ---
        addToLog(`Mua ${item.name} thành công! (-${cost} Vàng. Còn ${playerCharacter.gold} Vàng)`);
        // ----------------------
        console.log("Updated Inventory:", playerCharacter.inventory);
        const goldDisplayShop = document.getElementById('shop-player-gold');
        if(goldDisplayShop) goldDisplayShop.textContent = playerCharacter.gold;
        updatePlayerStatsUI();
        showShopItemDetails(itemId);
    } else {
         // --- Sửa Log Không Đủ Vàng ---
         addToLog(`Không đủ vàng mua ${item.name}! (Cần ${cost} Vàng, có ${playerCharacter.gold} Vàng)`);
         // -----------------------------
        const buyButton = document.getElementById('buy-button');
        if (buyButton) {
            buyButton.classList.add('shake-animation');
            setTimeout(() => buyButton.classList.remove('shake-animation'), 500);
        }
    }
}

// Cần lấy chi phí và chỉ số nâng cấp từ Bước 4
const upgradeCosts = { 
    kiem_si:   [100, 200, 400, 700, 1100, 1600, 2200, 3000, 4000],
    hoc_gia:   [120, 250, 500, 900, 1400, 2000, 2800, 3800, 5000],
    trinh_sat: [100, 200, 400, 700, 1100, 1600, 2200, 3000, 4000],
    ho_phap:   [100, 200, 400, 700, 1100, 1600, 2200, 3000, 4000]
};

const upgradeStats = { 
    kiem_si:   [0, 3, 6, 10, 15, 20, 25, 31, 38, 45], 
    hoc_gia:   [0, 4, 8, 13, 19, 25, 31, 38, 46, 55],
    trinh_sat: [0, 3, 6, 10, 15, 20, 25, 31, 38, 45], 
    ho_phap:   [0, 2, 5, 8, 12, 16, 20, 25, 31, 38]  
};

function populateUpgrade() {
   const upgradeInfoDiv = document.getElementById('upgrade-equipment-info');
   const confirmUpgradeBtn = document.getElementById('confirm-upgrade-button');
   upgradeInfoDiv.innerHTML = ''; // Xóa nội dung cũ

   if (!playerCharacter || !playerCharacter.equipment || !playerCharacter.equipment.weapon) {
       upgradeInfoDiv.innerHTML = '<p>Không có trang bị để nâng cấp.</p>';
        confirmUpgradeBtn.disabled = true;
       return;
   }

   const weapon = playerCharacter.equipment.weapon;
   const charClassId = playerCharacter.id || 'kiem-si'; // Cần lưu id class vào playerCharacter khi chọn NV
   const currentLevel = weapon.level || 1;
   const maxLevel = 10;

   if (currentLevel >= maxLevel) {
       upgradeInfoDiv.innerHTML = `
            <p><strong>${weapon.name} (Lv. ${currentLevel} / ${maxLevel}) - Tối đa</strong></p>
           <p>Trang bị đã đạt cấp độ cao nhất!</p>
        `;
        confirmUpgradeBtn.disabled = true;
   } else {
       const nextLevel = currentLevel + 1;
       const cost = upgradeCosts[charClassId]?.[nextLevel -1] || Infinity; // Lấy giá từ bảng cost (index là level muốn đạt - 1)
        const currentStatBonus = upgradeStats[charClassId]?.[currentLevel - 1] || 0;
        const nextStatBonus = upgradeStats[charClassId]?.[nextLevel - 1] || currentStatBonus;
       const statType = (charClassId === 'ho-phap') ? 'DEF' : 'ATK'; // Xác định loại chỉ số

       upgradeInfoDiv.innerHTML = `
            <p><strong>${weapon.name} (Lv. ${currentLevel} / ${maxLevel})</strong></p>
            <p>Chỉ số hiện tại: +${currentStatBonus} ${statType}</p>
           <p>Cấp tiếp theo (Lv. ${nextLevel}): +${nextStatBonus} ${statType}</p>
            <p>Chi phí nâng cấp: <span style="color:#fcc603">${cost}</span> G</p>
        `;
        confirmUpgradeBtn.disabled = playerCharacter.gold < cost;
        confirmUpgradeBtn.onclick = () => upgradeEquipment(cost, nextLevel, statType);
    }
    document.getElementById('upgrade-player-gold').textContent = playerCharacter.gold;
}

function upgradeEquipment(cost, nextLevel) {
    if (!playerCharacter || !playerCharacter.equipment || !playerCharacter.equipment.weapon) return;

    if (playerCharacter.gold >= cost) {
        const goldBefore = playerCharacter.gold;
        playerCharacter.gold -= cost;
        playerCharacter.equipment.weapon.level = nextLevel;

        // --- Sửa Log Nâng Cấp ---
        addToLog(`Nâng cấp ${playerCharacter.equipment.weapon.name} lên Lv. ${nextLevel}! (-${cost} Vàng. Còn ${playerCharacter.gold} Vàng)`);
        // -----------------------
        recalculatePlayerStats();
        populateUpgrade();
    } else {
         // --- Sửa Log Không Đủ Vàng Nâng Cấp ---
         addToLog(`Không đủ vàng nâng cấp! (Cần ${cost} Vàng, có ${playerCharacter.gold} Vàng)`);
         // ------------------------------------
         const confirmUpgradeBtn = document.getElementById('confirm-upgrade-button');
          if (confirmUpgradeBtn) {
            confirmUpgradeBtn.classList.add('shake-animation');
            setTimeout(() => confirmUpgradeBtn.classList.remove('shake-animation'), 500);
        }
    }
 }

function handleAnswer(selectedOption, correctAnswer, buttonElement) {
    console.log("--- handleAnswer function was called! ---"); 
    // >> LẤY ELEMENT SPRITE Ở ĐẦY HÀM <<
    const playerArenaSprite = document.getElementById('player-arena-sprite');
    const enemyArenaSprite = document.getElementById('enemy-arena-sprite');
    const answerOptionsElement = document.getElementById('answer-options'); 

    if (!playerArenaSprite || !enemyArenaSprite || !answerOptionsElement || !playerCharacter) {
        console.error("Core elements or player character missing in handleAnswer!"); return;
    }

    const allAnswerButtons = answerOptionsElement.querySelectorAll('button');
    allAnswerButtons.forEach(btn => btn.disabled = true);
    const isCorrect = selectedOption === correctAnswer;
    console.log(`>>> handleAnswer: isCorrect = ${isCorrect}`);

    buttonElement.classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
        allAnswerButtons.forEach(btn => {
            if (btn.dataset.originalOption === correctAnswer) { btn.classList.add('reveal-correct'); }
        });
    }

    let xpReward = 0;
    let goldReward = 0;
    let totalDamage = 0;
    let damageTaken = 0;

    if (isCorrect) {
        questionsCorrectInRoom++;
        currentCombo++;
        addToLog(`Trả lời đúng! (Combo x${currentCombo})`);
        // ... logic tính thưởng/damage ...
        xpReward = 5 + currentCombo;
        goldReward = 3 + Math.floor(currentCombo / 2);
        if (currentEnemy && currentEnemy.currentHp > 0) {
            const playerAtk = playerCharacter.currentTotalStats.atk || 5;
            const enemyDef = currentEnemy.def || 0; // Giả sử quái có def
            let baseDamage = Math.max(1, playerAtk - enemyDef);
            const comboBonusMultiplier = 1 + Math.floor(currentCombo / 5) * 0.1;
            totalDamage = Math.round(baseDamage * comboBonusMultiplier);

            const enemyHpBefore = currentEnemy.currentHp; // Lưu HP địch trước khi bị đánh
            currentEnemy.currentHp -= totalDamage;
            const enemyHpAfter = Math.max(0, currentEnemy.currentHp); // Đảm bảo HP không âm

            // --- Sửa Log Sát Thương Gây Ra ---
            addToLog(`${playerCharacter.name} tấn công ${currentEnemy.name}, gây ${totalDamage} sát thương! (${currentEnemy.name} còn ${enemyHpAfter}/${currentEnemy.maxHp} HP)`);
             // Đã có playerArenaSprite và enemyArenaSprite rồi
             if (playerCharacter.sprite_attack) playerArenaSprite.src = playerCharacter.sprite_attack; // Chỉ đổi nếu có sprite attack
             animateAttack(playerArenaSprite, enemyArenaSprite);

             if (currentEnemy.sprite_hurt) enemyArenaSprite.src = currentEnemy.sprite_hurt; // Chỉ đổi nếu có sprite hurt
             animateHit(enemyArenaSprite);

             setTimeout(() => {
                 // Đặt lại về idle
                 if(playerCharacter.sprite_idle) playerArenaSprite.src = playerCharacter.sprite_idle;
                 if(currentEnemy && currentEnemy.sprite_idle) enemyArenaSprite.src = currentEnemy.sprite_idle;
             }, 400);
         }
         // ... cộng xp/gold, level up check ...

         if (xpReward > 0 || goldReward > 0) {
            addToLog(`Nhận +${xpReward} XP, +${goldReward} Vàng.`);
        }
        playerCharacter.xp += xpReward;
        playerCharacter.gold += goldReward;
        levelUpCheck();
    } else {
        const comboBeforeReset = currentCombo; // Lưu combo cũ để log (nếu muốn)
        currentCombo = 0;
        // --- Sửa Log Trả Lời Sai & Reset Combo ---
        addToLog(`Trả lời sai! ${comboBeforeReset > 0 ? `Combo bị reset (trước đó: ${comboBeforeReset})` : ''}`);
        if (currentEnemy && currentEnemy.currentHp > 0) {
            const enemyAttack = currentEnemy.baseDamage || 10;
            const playerDef = playerCharacter.currentTotalStats.def || 0;
            damageTaken = Math.max(1, enemyAttack - playerDef);

            const playerHpBefore = playerCharacter.currentHp; // Lưu HP người chơi trước khi bị đánh
            playerCharacter.currentHp -= damageTaken;
             const playerHpAfter = Math.max(0, playerCharacter.currentHp);
             addToLog(`${currentEnemy.name} tấn công ${playerCharacter.name}, gây ${damageTaken} sát thương! (HP còn ${playerHpAfter}/${playerCharacter.maxHp})`);

              // Đã có playerArenaSprite và enemyArenaSprite rồi
              if (currentEnemy.sprite_attack) enemyArenaSprite.src = currentEnemy.sprite_attack;
              animateAttack(enemyArenaSprite, playerArenaSprite);

               if (playerCharacter.sprite_hurt) playerArenaSprite.src = playerCharacter.sprite_hurt;
               animateHit(playerArenaSprite);

              setTimeout(() => {
                  // Đặt lại về idle
                   if(playerCharacter.sprite_idle) playerArenaSprite.src = playerCharacter.sprite_idle;
                   if (currentEnemy && currentEnemy.sprite_idle) enemyArenaSprite.src = currentEnemy.sprite_idle;
               }, 400);

               if (playerCharacter.currentHp <= 0) {
                console.log(">>> handleAnswer: Player HP <= 0. Calling gameOver.");
                setTimeout(gameOver, 500);
                return;
            }
        } else {
             console.log(">>> handleAnswer: No enemy or enemy defeated when answered incorrectly.");
               addToLog("May mắn là không có gì nguy hiểm xảy ra.");
          }
    }

    // --- Cập Nhật UI Chung ---
    updatePlayerStatsUI();
    updateComboUI(); // Cập nhật combo UI sau khi tính toán
    if (currentEnemy) updateEnemyStatsUI(currentEnemy);
    else updateEnemyStatsUI(null);

    setTimeout(() => {
        console.log("Proceeding to check encounter end...");
        checkEncounterEnd(isCorrect);
   }, isCorrect && currentEnemy && totalDamage > 0 ? 1200 : 1000);

}

function animateAttack(attackerSprite, targetSprite) {
    const originalLeft = attackerSprite.style.left;
    const targetLeft = targetSprite.style.left; // Vị trí của mục tiêu
    const direction = parseFloat(targetLeft) > parseFloat(originalLeft) ? 1 : -1; // Hướng di chuyển

    // Di chuyển tới gần mục tiêu
    attackerSprite.style.left = `calc(${originalLeft} + ${10 * direction}%)`; // Lao tới 10%
    attackerSprite.style.transform = `translateX(-50%) scaleX(${direction})`; // Quay mặt đúng hướng

    // Quay về sau một chút
    setTimeout(() => {
         attackerSprite.style.left = originalLeft;
         attackerSprite.style.transform = 'translateX(-50%)'; // Reset hướng quay mặt
    }, 300); // Thời gian diễn ra hoạt ảnh đánh
}

function animateHit(targetSprite) {
   targetSprite.style.transform = 'translateX(-50%) scale(0.9)'; // Hơi thu nhỏ lại
    targetSprite.style.opacity = '0.7'; // Hơi mờ đi

    // Trở lại bình thường sau một chút
   setTimeout(() => {
         targetSprite.style.transform = 'translateX(-50%) scale(1)';
         targetSprite.style.opacity = '1';
     }, 150); // Thời gian bị đánh
}

// Hàm kiểm tra kết thúc Encounter/Phòng (Cần tạo hàm này)
function checkEncounterEnd(answeredCorrectly, forceWin = false) {
    console.log(`--- checkEncounterEnd called! (Correct: ${answeredCorrectly}, ForceWin: ${forceWin}) ---`);
    let encounterOver = false;
    let reason = "";
    console.log(`>>> checkEncounterEnd: Checking - Enemy HP: ${currentEnemy?.currentHp}, Correct in room: ${questionsCorrectInRoom}, Needed: ${currentRoomData?.questionsToComplete}`);
     // Kiểm tra nếu hết HP địch
     if (currentEnemy && currentEnemy.currentHp <= 0) {
        console.log(">>> checkEncounterEnd: Condition 1 met (Enemy defeated).");
        addToLog(`Bạn đã đánh bại ${currentEnemy.name}!`);
        encounterOver = true; reason = "enemy defeated";
        currentEnemy = null; updateEnemyStatsUI(null);
   }

   if (!encounterOver && currentRoomData && questionsCorrectInRoom >= (currentRoomData.questionsToComplete || 1) ) {
      console.log(">>> checkEncounterEnd: Condition 2 potentially met.");
      if (currentRoomData.type === 'boss' && currentEnemy && currentEnemy.currentHp > 0) {
           console.log(">>> checkEncounterEnd: Condition 2 ignored (Boss alive).");
           addToLog(`Bạn đã trả lời đủ số câu, nhưng ${currentEnemy.name} vẫn còn đứng vững!`);
      } else {
           console.log(">>> checkEncounterEnd: Condition 2 confirmed.");
           addToLog(`Hoàn thành thử thách phòng ${currentRoomData.roomNumber}!`);
           encounterOver = true; reason = "questions completed";
      }
   }

   if (!encounterOver && forceWin) {
       console.log(">>> checkEncounterEnd: Condition 3 met (Force Win).");
       addToLog("Không còn câu hỏi nào! Bạn đã vượt qua thử thách này!");
       encounterOver = true; reason = "out of questions";
       if (currentEnemy) {
           addToLog(`${currentEnemy.name} đã rút lui!`);
           currentEnemy = null; updateEnemyStatsUI(null);
       }
   }

  console.log(`>>> checkEncounterEnd: Is encounterOver? ${encounterOver}. Reason: ${reason}`);
  if (encounterOver) {
      console.log(">>> checkEncounterEnd: Encounter IS over. Processing rewards...");
      // --- Sửa Log Nhận Thưởng ---
      let rewardMessages = []; // Mảng chứa các thông báo thưởng
      if (currentRoomData?.reward) {
          const reward = currentRoomData.reward;
          console.log(">>> checkEncounterEnd: Checking rewards:", reward);

          if (reward.xp) {
              playerCharacter.xp += reward.xp;
              rewardMessages.push(`+${reward.xp} XP`);
          }
          if (reward.gold) {
              playerCharacter.gold += reward.gold;
               rewardMessages.push(`+${reward.gold} Vàng`);
          }
          if (reward.goldRange) {
               const goldAmount = Math.floor(Math.random() * (reward.goldRange[1] - reward.goldRange[0] + 1)) + reward.goldRange[0];
               playerCharacter.gold += goldAmount;
               rewardMessages.push(`+${goldAmount} Vàng`);
          }
          if (reward.items && Array.isArray(reward.items)) {
              reward.items.forEach(itemReward => {
                  if (itemData[itemReward.id]) {
                      const itemName = itemData[itemReward.id].name;
                      const quantity = itemReward.qty || 1;
                      playerCharacter.inventory[itemReward.id] = (playerCharacter.inventory[itemReward.id] || 0) + quantity;
                      rewardMessages.push(`${itemName} x${quantity}`);
                      console.log("Updated Inventory:", playerCharacter.inventory);
                  }
              });
          }

          // Log tất cả thưởng một lần nếu có
          if (rewardMessages.length > 0) {
               addToLog("Nhận thưởng phòng: " + rewardMessages.join(', ') + "!");
               updatePlayerStatsUI(); // Cập nhật UI sau khi nhận thưởng
               levelUpCheck(); // Kiểm tra lên cấp
          }

           if (reward.winGame) {
               console.log(">>> checkEncounterEnd: winGame flag found. Calling winGame().");
               setTimeout(winGame, 1500); return;
           }
      } else { console.log(">>> checkEncounterEnd: No rewards defined."); }
      // --------------------------

      if(questionWindow) { questionWindow.style.display = 'none'; questionWindow.classList.remove('active'); }

      const isBossRoom = currentRoomData.type === 'boss';
      const isFinalFloor = currentFloor >= Object.keys(allFloorData).length;
      console.log(`>>> checkEncounterEnd: isBossRoom=${isBossRoom}, isFinalFloor=${isFinalFloor}`);
      if (isBossRoom) {
          console.log(">>> checkEncounterEnd: This was a boss room.");
          addToLog(`Bạn đã vượt qua Boss Tầng ${currentFloor}!`);
           if (isFinalFloor && !currentRoomData?.reward?.winGame) {
               console.log(">>> checkEncounterEnd: Final boss defeated. Calling winGame.");
               setTimeout(winGame, 2000);
          } else if (!isFinalFloor) {
               console.log(">>> checkEncounterEnd: Not final floor. Setting timeout for next floor.");
              addToLog("Chuẩn bị lên tầng tiếp theo!");
              setTimeout(() => { console.log("Moving to next floor..."); startFloor(currentFloor + 1); }, 2500);
          }
      } else {
          console.log(">>> checkEncounterEnd: Normal room completed. Setting timeout for next room.");
          setTimeout(() => { console.log("Moving to next room..."); nextRoom(); }, 1500);
      }
  } else {
      console.log(">>> checkEncounterEnd: Encounter IS NOT over. Preparing next question...");
       const currentAnswerButtons = answerOptionsElement.querySelectorAll('button');
       currentAnswerButtons.forEach(btn => { btn.disabled = false; btn.classList.remove('correct', 'incorrect', 'reveal-correct'); });
       displayQuestion();
  }
}

// Hàm xử lý Game Over (Cần tạo hàm này)
function gameOver() { /* ... */
    console.error("GAME OVER!");
   addToLog("----- TRÒ CHƠI KẾT THÚC -----");
   addToLog("Bạn đã thất bại! Nhưng đừng bỏ cuộc, tri thức luôn chờ đợi.");
   gameScreen.style.filter = 'blur(5px) grayscale(1)';
   setTimeout(() => {
       alert("Bạn đã thất bại! Nhấn OK để quay về màn hình chính.");
       playerCharacter = null; currentFloor = 1; currentRoomIndex = 0; currentEnemy = null;
       if(logWindowOutput) logWindowOutput.innerHTML = '';
       gameScreen.style.filter = 'none';
       switchScreen('title-screen');
   }, 500);
}

function winGame() { /* ... */
    console.log("CONGRATULATIONS! YOU WIN!");
   addToLog("🎉🎉🎉 CHÚC MỪNG! BẠN ĐÃ CHIẾN THẮNG! 🎉🎉🎉");
   if (playerCharacter) {
       addToLog(`Dũng sĩ ${playerCharacter.name} đã đánh bại Ignoramus và giải phóng tri thức!`);
   }
   gameScreen.style.filter = 'brightness(1.5) saturate(1.5)';
   setTimeout(() => {
       alert(`Tuyệt vời! ${playerCharacter?.name || 'Dũng sĩ'} đã chiến thắng! Cảm ơn bạn đã chơi!`);
       playerCharacter = null; currentFloor = 1; currentRoomIndex = 0; currentEnemy = null;
       if(logWindowOutput) logWindowOutput.innerHTML = '';
       gameScreen.style.filter = 'none';
       switchScreen('title-screen');
   }, 1000);
}

console.log("Game script loaded. Initializing title screen...");
