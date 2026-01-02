
document.addEventListener('DOMContentLoaded', function() {
    const introOverlay = document.getElementById('intro-overlay');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-btn');
    
    // 1. Сразу делаем кнопку активной
    skipBtn.style.display = 'block';
    skipBtn.innerHTML = 'Пропустить';
    
    // 2. Обработчик клика по кнопке
    skipBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        hideIntro();
        return false;
    });
    
    // 3. Функция скрытия интро
    function hideIntro() {
        console.log('Скрываем интро по клику');
        
        // Останавливаем видео
        if (introVideo) {
            introVideo.pause();
            introVideo.currentTime = 0;
        }
        
        // Скрываем интро
        if (introOverlay) {
            introOverlay.style.opacity = '0';
            introOverlay.style.transition = 'opacity 0.3s';
            
            setTimeout(function() {
                introOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }
    
    // 4. Автоматическое скрытие при окончании видео (через 2 секунды)
    if (introVideo) {
        introVideo.addEventListener('ended', function() {
            console.log('Видео завершилось, скрываем интро');
            setTimeout(hideIntro, 300); // небольшая задержка
        });
        
        // На случай ошибки
        introVideo.addEventListener('error', function() {
            setTimeout(hideIntro, 2000);
        });
    }
    
    // 5. Резервный таймаут на 3 секунды (на всякий случай)
    setTimeout(function() {
        if (introOverlay && introOverlay.style.display !== 'none') {
            hideIntro();
        }
    }, 3000);
});
// Запускаем при полной загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new VideoIntro();
});
// Данные о турах
const tours = [
    { city: "CHEBOKSARI", date: "1.06" },
    { city: "URUPINSK", date: "VCHERA" },
    { city: "ROMA DOLINA", date: "2.06" },
    { city: "Vsemayki", date: "ZAVTRA" },
    { city: "TAGANROJ", date: "22.06" },
    { city: "MOS.PR", date: "16.08" },
    { city: "MASHMET", date: "58/8" },
    { city: "SOMOVO", date: "NAXIU", soldout: ["танцпол", "фан"] },
    { city: "SISKI", date: "XD" },
    { city: "SURGUT", date: "2.07" },
    { city: "PIZDA", date: "4.07" },
    { city: "OK", date: "" },
    { city: "NEKEL", date: "" },
    { city: "ISAAC", date: "5.07" }
];


// Текущий выбранный тур
let selectedTour = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Создаем обработчики для каждого тура
    const tourItems = document.querySelectorAll('.tour-item');
    
 tourItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        // Убираем выделение у всех
        tourItems.forEach(i => i.classList.remove('selected'));
        
        // Выделяем текущий
        this.classList.add('selected');
        
        // Обновляем выбранный тур
        selectedTour = tours[index];
        
        // Показываем выбранный тур справа
        document.getElementById('selectedCity').textContent = selectedTour.city;
        document.getElementById('selectedDate').textContent = selectedTour.date;
        
             // *** SOLD OUT НАДПИСИ ***
        updateTicketStatuses();
        
        // Сбрасываем выбор билета
        document.querySelectorAll('input[name="ticket"]').forEach(radio => radio.checked = false);
    });
});


    
    // Выбираем первый тур по умолчанию
    if (tourItems.length > 0) {
        tourItems[0].click();
    }
});




// Функция покупки билета
function buyTicket() {
    // Проверяем выбран ли тур
    if (!selectedTour) {
        const modal = document.getElementById('messageModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        modalTitle.textContent = "ОШИБКА";
        modalMessage.textContent = "Сначала выбери город, еблан!";
        modal.style.display = 'flex';
        return;
    }
    
    // Проверяем выбран ли тип билета
    const selectedTicket = document.querySelector('input[name="ticket"]:checked');
    
    if (!selectedTicket) {
        const modal = document.getElementById('messageModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        modalTitle.textContent = "ВНИМАНИЕ";
        modalMessage.textContent = "ЕБЛАН, ВЫБЕРИ КАТЕГОРИЮ БИЛЕТА";
        modal.style.display = 'flex';
        return;
    }

    // *** НОВОЕ: УВЕДОМЛЕНИЕ ПРИ КЛИКЕ НА SOLD OUT SOMOVO ***
    if (selectedTour.city === "SOMOVO" && ["танцпол", "фан"].includes(selectedTicket.value)) {
        const modal = document.getElementById('messageModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        modalTitle.textContent = "УЁБОК, СОЛДАУТ";
        modalMessage.textContent = "СОЛД-АУТ АЛО! ТОЛЬКО МИТ Н ГРИГ ДОСТУПЕН";
        modal.style.display = 'flex';
        return; // БЛОКИРУЕМ КУПЛЮ
    }
    
    // Если всё ок - открываем оплату
    window.open("https://www.donationalerts.com/r/tapki_tour", "_blank");
    
    // Сбрасываем выбор билета
    selectedTicket.checked = false;
}



// Закрытие модального окна
function closeModal() {
    document.getElementById('messageModal').style.display = 'none';
}

// Закрытие по клику вне окна
window.onclick = function(event) {
    const modal = document.getElementById('messageModal');
    if (event.target === modal) {
        closeModal();
    }
}
// Показываем SOLD OUT надписи для Somovo
// Показываем SOLD OUT надписи для Somovo
function updateTicketStatuses() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        const optionText = option.querySelector('.option-text');
        const ticketType = input.value;
        
        // *** СБРАСЫВАЕМ ВСЕ SOLD OUT ПЕРВЫМ ДЕЛОМ ***
        option.classList.remove('soldout');
        
        // Восстанавливаем ОРИГИНАЛЬНЫЕ названия для ВСЕХ
        if (ticketType === "танцпол") {
            optionText.innerHTML = "ТАНЦПОЛ питьсот рублёффф";  // ОРИГИНАЛ
        } else if (ticketType === "фан") {
            optionText.innerHTML = "ФАН как танцол но больше XD";  // ОРИГИНАЛ
        } else if (ticketType === "мит н григ") {
            optionText.innerHTML = "МИТ Н ГРИГ(погугли что это школьник) принимаем только СЕКСУЛЬНЫХ девочек 60+";  // ОРИГИНАЛ
        }
        
        // *** SOLD OUT СТИЛЬ ТОЛЬКО для танцпол/фан в SOMOVO ***
        if (selectedTour && selectedTour.city === "SOMOVO" && ["танцпол", "фан"].includes(ticketType)) {
            option.classList.add('soldout');
            // *** НАДПИСЬ SOLD OUT ОСТАЕТСЯ, НО НАЗВАНИЕ ОРИГИНАЛЬНОЕ ***
        }
    });
}






